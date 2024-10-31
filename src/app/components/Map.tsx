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
  const isInitializedRef = useRef(false);

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

      const statusColor = getStatusColor(item.status || 'unknown');
      const rgbColor = hexToRgb(statusColor);
      const rgbString = rgbColor ? `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}` : '59, 130, 246';

      const markerContent = document.createElement('div');
      markerContent.className = 'marker-container';
      markerContent.innerHTML = `
        <div class="marker-content" style="border-color: ${statusColor}; --status-color: ${rgbString};">
          <div class="marker-inner">
            <h3 class="marker-title">${item.location}</h3>
            <p class="marker-details">
              <strong>Device ID:</strong> ${item.deviceid}<br>
              <strong>Status:</strong> <span style="color: ${statusColor};">${item.status || 'N/A'}</span>
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

  // Update markers when data changes
  useEffect(() => {
    if (map && data.length > 0) {
      createMarkers(map);
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