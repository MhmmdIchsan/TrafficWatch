import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  data: Array<{
    deviceid: string;
    location: string;
    latitude: string;
    longitude: string;
    status?: string;
  }>;
  selectedDevice?: string; // New prop to handle selected device
}

const Map: React.FC<MapProps> = ({ data, selectedDevice }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const isInitializedRef = useRef(false);

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'lancar':
        return '#10B981'; // green-500
      case 'ramai lancar':
        return '#3B82F6'; // blue-500
      case 'padat':
        return '#EAB308'; // yellow-500
      case 'padat merayap':
        return '#F97316'; // orange-500
      case 'macet':
        return '#EF4444'; // red-500
      case 'macet total':
        return '#B91C1C'; // red-700
      case 'tidak aktif':
        return '#6B7280'; // gray-500
      default:
        return '#6B7280'; // gray-500 (default)
    }
  };

  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const createMarkers = (map: google.maps.Map) => {
    if (!data.length) return;

    // Clear existing markers only if they exist
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.map = null);
      markersRef.current = [];
    }

    // Add new markers
    data.forEach(async (item) => {
      const position = {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
      };

      const statusColor = getStatusColor(item.status || 'tidak aktif');
      const rgbColor = hexToRgb(statusColor);
      const rgbString = rgbColor ? `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}` : '107, 114, 128';

      const markerContent = document.createElement('div');
      markerContent.className = 'marker-container';
      markerContent.innerHTML = `
        <div class="marker-content" style="border-color: ${statusColor}; --status-color: ${rgbString};">
          <div class="marker-inner">
            <h3 class="marker-title">${item.location}</h3>
            <p class="marker-details">
              <strong>Device ID:</strong> ${item.deviceid}<br>
              <strong>Status:</strong> <span style="color: ${statusColor};">${item.status || 'Tidak Aktif'}</span>
            </p>
          </div>
          <div class="pulse-ring" style="--status-color: ${rgbString};"></div>
        </div>
      `;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'beta',
        libraries: ['marker'],
      });

      const { AdvancedMarkerElement } = await loader.importLibrary('marker');
      
      const marker = new AdvancedMarkerElement({
        map,
        position,
        content: markerContent,
        title: item.location,
      });

      markersRef.current.push(marker);

      // If this is the selected device, center the map and add a special highlight
      if (item.deviceid === selectedDevice) {
        map.panTo(position);
        map.setZoom(16); // Zoom in slightly for better view
        markerContent.classList.add('selected-marker');
      }
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (isInitializedRef.current) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'beta',
        libraries: ['marker'],
      });

      const { Map } = await loader.importLibrary('maps');

      const centerLocation = {
        lat: 5.54928724461252,
        lng: 95.32472272422619,
      };

      const options: google.maps.MapOptions = {
        center: centerLocation,
        zoom: 14,
        mapId: 'NEXT_MAPS_TUTS',
        draggable: true,
      };

      const newMap = new Map(mapRef.current as HTMLDivElement, options);
      setMap(newMap);
      
      // Create markers immediately after map initialization
      createMarkers(newMap);
      isInitializedRef.current = true;
    };

    initializeMap();
  }, []); 

  // Update markers when data or selectedDevice changes
  useEffect(() => {
    if (map && data.length > 0) {
      createMarkers(map);
    }
  }, [map, data, selectedDevice]);

  return (
    <div className="relative">
      <div className="h-[600px] rounded-xl" ref={mapRef}>
        Google Maps
      </div>
      <style jsx global>{`
        .marker-container {
          cursor: pointer;
          position: relative;
        }
        .marker-content {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
          padding: 12px;
          font-family: Arial, sans-serif;
          border: 2px solid;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .marker-content.selected-marker {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          z-index: 10;
        }
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 16px;
          animation: pulse 2s infinite;
          z-index: 1;
        }
        .marker-content:hover {
          transform: scale(1.05);
        }
        .marker-title {
          font-size: 16px;
          margin: 0 0 8px;
          color: #333;
        }
        .marker-details {
          font-size: 14px;
          margin: 0;
          color: #666;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--status-color), 0.7);
            opacity: 1;
          }
          70% {
            box-shadow: 0 0 0 20px rgba(var(--status-color), 0);
            opacity: 0.5;
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--status-color), 0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Map;