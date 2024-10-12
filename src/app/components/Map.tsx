'use client';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'quartely',
      });

      const { Map } = await loader.importLibrary('maps');
      const locationMap = {
        lat: 5.54928724461252,
        lng: 95.32472272422619,
      };

      // Opsi peta
      const options: google.maps.MapOptions = {
        center: locationMap,
        zoom: 14,
        mapId: 'NEXT_MAPS_TUTS',
        draggable: false,
      };

      // Inisialisasi Google Maps di dalam div mapRef
      const map = new Map(mapRef.current as HTMLDivElement, options);
    };

    initializeMap();
  }, []); // Hanya dijalankan sekali saat komponen dipasang

  return (
    <div className="relative">
      <div className="h-[600px] rounded-xl" ref={mapRef}>
        Google Maps
      </div>
      <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">
        Jum'at, 11 Oktober 2024
      </div>
    </div>
  );
};

export default Map;
