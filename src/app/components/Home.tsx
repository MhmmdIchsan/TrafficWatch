import React, { useEffect, useState } from 'react';
import { Device } from '../types';
import Map from '../components/Map';

export default function Home() {
    const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/locationinfo`);
      const result = await response.json();

      if (response.ok) {
        const deviceIds = result.data.map((device: Device) => device.deviceid);
        const detailedDevices = await Promise.all(deviceIds.map(fetchDeviceDetails));
        setDevices(detailedDevices.filter((device): device is Device => device !== null));
      } else {
        console.error(result.message || 'Failed to fetch devices');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchDeviceDetails = async (deviceId: string): Promise<Device | null> => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 60000); // 1 minute ago

    const formatTimestamp = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const milliseconds = date.getMilliseconds().toString().padEnd(3, '0');
    
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const url = `${process.env.REACT_APP_API_BASE_URL}/devices?deviceid=${deviceId}&start_time=${formatTimestamp(startTime)}&end_time=${formatTimestamp(endTime)}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        return result.data;
      } else {
        console.error(result.message || `Failed to fetch details for device ${deviceId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching details for device ${deviceId}:`, error);
      return null;
    }
  };

  const getStatusCounts = () => {
    const counts = {
      Lancar: 0,
      Sedang: 0,
      Macet: 0,
      Total: devices.length
    };

    devices.forEach(device => {
      if (device.status === 'Lancar') counts.Lancar++;
      else if (device.status === 'Sedang') counts.Sedang++;
      else if (device.status === 'Macet') counts.Macet++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

    return (
    <main className="flex-grow">
      <div className="relative h-[calc(100vh-4rem)]">
        <Map data={devices} />
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-2">Real-Time Traffic Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor traffic conditions across the city with our advanced monitoring system.
          </p>
        </div>
      </div>
    </main>
  );
}