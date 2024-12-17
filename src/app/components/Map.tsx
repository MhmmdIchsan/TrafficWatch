import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MapProps {
  data: Array<{
    deviceid: string;
    location: string;
    latitude: string;
    longitude: string;
    status?: string;
    updated_at?: string;
  }>;
  selectedDevice?: string;
}

const Map: React.FC<MapProps> = ({ data, selectedDevice }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<{
    marker: google.maps.marker.AdvancedMarkerElement, 
    labelOverlay: google.maps.marker.AdvancedMarkerElement
  }[]>([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<{
    deviceid: string;
    location: string;
    status: string;
    updated_at?: string;
    originalZoom?: number;
    originalCenter?: google.maps.LatLng;
  } | null>(null);

  const getStatusColor = (status: string): { pinColor: string, textColor: string, badgeVariant: string } => {
    switch (status?.toLowerCase()) {
      case 'lengang': return { pinColor: '#10B981', textColor: '#10B981', badgeVariant: 'success' };
      case 'ramai lancar': return { pinColor: '#3B82F6', textColor: '#3B82F6', badgeVariant: 'info' };
      case 'ramai padat': return { pinColor: '#EAB308', textColor: '#EAB308', badgeVariant: 'warning' };
      case 'padat merayap': return { pinColor: '#F97316', textColor: '#F97316', badgeVariant: 'destructive' };
      case 'padat tersendat': return { pinColor: '#EF4444', textColor: '#EF4444', badgeVariant: 'destructive' };
      case 'macet total': return { pinColor: '#B91C1C', textColor: '#B91C1C', badgeVariant: 'destructive' };
      case 'tidak aktif': return { pinColor: '#6B7280', textColor: '#ffffff', badgeVariant: 'secondary' };
      default: return { pinColor: '#6B7280', textColor: '#000000', badgeVariant: 'secondary' };
    }
  };

  const createMarkers = (map: google.maps.Map) => {
    // Hapus marker lama
    markersRef.current.forEach(({ marker, labelOverlay }) => {
      if (marker) marker.map = null;
      if (labelOverlay) labelOverlay.map = null;
    });
    markersRef.current = [];

    data.forEach((item) => {
      const position = {
        lat: parseFloat(item.latitude), 
        lng: parseFloat(item.longitude),
      };

      const { pinColor, textColor } = getStatusColor(item.status || 'tidak aktif');

      // Buat marker pin
      const pinContent = document.createElement('div');
      pinContent.innerHTML = `
        <div class="map-pin" style="background-color: ${pinColor};">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" class="signal-icon">
            <path d="M12 11V5M12 5L8 9M12 5L16 9" />
            <path d="M16 17L12 13L8 17" />
          </svg>
        </div>
      `;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'beta',
        libraries: ['marker'],
      });

      loader.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
        const marker = new AdvancedMarkerElement({
          map,
          position,
          content: pinContent,
          title: item.location,
        });

        // Tambahkan event listener untuk click
        marker.addListener('click', () => {
          // Simpan zoom dan center sebelumnya
          const originalZoom = map.getZoom();
          const originalCenter = map.getCenter();

          // Zoom dan center ke marker
          map.panTo(position);
          map.setZoom(16);
          
          // Set informasi marker yang dipilih
          setSelectedMarkerInfo({
            deviceid: item.deviceid,
            location: item.location,
            status: item.status || 'Tidak Aktif',
            updated_at: item.updated_at,
            originalZoom,
            originalCenter
          });
        });

        // Buat label terpisah
        const labelContent = document.createElement('div');
        labelContent.className = 'marker-label';
        labelContent.innerHTML = `
          <div class="label-details" style="color: ${textColor};">
            <div class="location-name">${item.location}</div>
            <div class="status-text">${item.status || 'Tidak Aktif'}</div>
          </div>
        `;

        const labelOverlay = new AdvancedMarkerElement({
          map,
          position,
          content: labelContent,
          zIndex: 1000, // Pastikan label di atas marker
        });

        // Simpan marker dan label
        markersRef.current.push({ marker, labelOverlay });

        // Logika zoom untuk visibilitas label
        const updateLabelVisibility = () => {
          const currentZoom = map.getZoom();
          const labelDetails = labelContent.querySelector('.label-details') as HTMLElement;
          
          if (currentZoom !== undefined) {
            if (currentZoom > 15) {
              labelDetails.style.display = 'block';
              labelDetails.style.fontSize = '10px';
            } else if (currentZoom > 12) {
              labelDetails.style.display = 'block';
              labelDetails.style.fontSize = '8px';
            } else {
              labelDetails.style.display = 'none';
            }
          }
        };

        map.addListener('zoom_changed', updateLabelVisibility);
        updateLabelVisibility();

        // Highlight perangkat yang dipilih
        if (item.deviceid === selectedDevice) {
          map.panTo(position);
          map.setZoom(16);
          pinContent.classList.add('selected-marker');
        }
      });
    });
  };

  // Inisialisasi peta (kode sebelumnya tetap sama)
  useEffect(() => {
    const initializeMap = async () => {
      if (isMapInitialized) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'beta',
        libraries: ['marker'],
      });

      const { Map } = await loader.importLibrary('maps');

      const centerLocation = {
        lat: 5.5675686454818285, 
        lng: 95.34096618180048,
      };

      const options: google.maps.MapOptions = {
        center: centerLocation,
        zoom: 14,
        mapId: 'NEXT_MAPS_TUTS',
        draggable: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };

      const newMap = new Map(mapRef.current as HTMLDivElement, options);
      setMap(newMap);
      
      createMarkers(newMap);
      setIsMapInitialized(true);

      // Tambahkan event listener untuk menutup popup saat mengklik di luar marker
      newMap.addListener('click', () => {
        setSelectedMarkerInfo(null);
      });
    };

    initializeMap();
  }, [isMapInitialized]); 

  // Recreate markers when data or selected device changes
  useEffect(() => {
    if (map && data.length > 0) {
      createMarkers(map);
    }
  }, [map, data, selectedDevice]);

  // Fungsi untuk menutup card dan reset view
  const handleCloseMarkerInfo = () => {
    if (map && selectedMarkerInfo) {
      // Kembalikan zoom dan center ke pengaturan sebelumnya
      if (selectedMarkerInfo.originalZoom !== undefined) {
        map.setZoom(selectedMarkerInfo.originalZoom);
      }
      if (selectedMarkerInfo.originalCenter) {
        map.setCenter(selectedMarkerInfo.originalCenter);
      }
      
      // Hapus informasi marker yang dipilih
      setSelectedMarkerInfo(null);
    }
  };

  return (
    <div className="relative">
      <div className="h-[600px] rounded-xl" ref={mapRef}>
        Google Maps
      </div>
      
      {/* Popup Card untuk Detail Marker */}
      {selectedMarkerInfo && (
        <div className="absolute top-4 right-4 z-50">
          <Card className="w-72 bg-white/90 backdrop-blur-lg shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{selectedMarkerInfo.location}</CardTitle>
              <button 
                onClick={handleCloseMarkerInfo}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Device ID:</span>
                  <span className="font-semibold">{selectedMarkerInfo.deviceid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge 
                    variant={getStatusColor(selectedMarkerInfo.status).badgeVariant as any}
                  >
                    {selectedMarkerInfo.status}
                  </Badge>
                </div>
                {selectedMarkerInfo.updated_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm">
                      {new Date(selectedMarkerInfo.updated_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <style jsx global>{`
        .map-pin {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .map-pin:hover {
          transform: scale(1.1);
        }
        .signal-icon {
          width: 14px;
          height: 14px;
        }
        .marker-label {
          position: absolute;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .label-details {
          font-weight: bold;
          white-space: nowrap;
          margin-left: 10px;
        }
        .location-name {
          font-size: 12px;
          line-height: 1.2;
        }
        .status-text {
          font-size: 10px;
          line-height: 1.2;
        }
        .selected-marker {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Map;