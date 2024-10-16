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

        const markerContent = document.createElement('div');
        markerContent.innerHTML = `
          <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,.3); padding: 12px; font-family: Arial, sans-serif;">
            <h3 style="font-size: 16px; margin: 0 0 8px; color: #333;">${item.location}</h3>
            <p style="font-size: 14px; margin: 0; color: #666;">
              <strong>Device ID:</strong> ${item.deviceid}<br>
              <strong>Status:</strong> ${item.status || 'N/A'}
            </p>
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
    </div>
  );
};

export default Map;