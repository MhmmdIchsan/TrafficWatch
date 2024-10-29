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
}

const Map: React.FC<MapProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10B981'; // green
      case 'inactive':
        return '#EF4444'; // red
      case 'maintenance':
        return '#F59E0B'; // yellow
      case 'offline':
        return '#6B7280'; // gray
      default:
        return '#3B82F6'; // blue (default)
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'beta',
        libraries: ['marker'],
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');

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
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (map && data.length > 0) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.map = null);
      markersRef.current = [];

      // Add new markers
      data.forEach((item) => {
        const position = {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        };

        const statusColor = getStatusColor(item.status || 'unknown');

        const markerContent = document.createElement('div');
        markerContent.className = 'marker-container';
        markerContent.innerHTML = `
          <div class="marker-content animate-pulse" style="border-color: ${statusColor};">
            <div class="marker-inner">
              <h3 class="marker-title">${item.location}</h3>
              <p class="marker-details">
                <strong>Device ID:</strong> ${item.deviceid}<br>
                <strong>Status:</strong> <span style="color: ${statusColor};">${item.status || 'N/A'}</span>
              </p>
            </div>
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          content: markerContent,
          title: item.location,
        });

        marker.addListener('gmp-click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: markerContent,
          });
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [map, data]);

  return (
    <div className="relative">
      <div className="h-[600px] rounded-xl" ref={mapRef}>
        Google Maps
      </div>
      <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">
        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <style jsx global>{`
        .marker-container {
          cursor: pointer;
        }
        .marker-content {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
          padding: 12px;
          font-family: Arial, sans-serif;
          border: 2px solid;
          transition: all 0.3s ease;
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
          }
          70% {
            box-shadow: 0 0 0 10px rgba(var(--status-color), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--status-color), 0);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Map;