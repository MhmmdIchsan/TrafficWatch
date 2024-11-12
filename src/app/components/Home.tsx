import React, { useEffect, useState, useRef } from 'react';
import { Device } from '../types';
import Map from '../components/Map';
import AlertNotification from '../components/AlertNotification';
import dotenv from 'dotenv';

interface StatusAlert {
  deviceId: string;
  location: string;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
}

dotenv.config();

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<StatusAlert[]>([]);
  const previousDevices = useRef<{ [key: string]: Device }>({});

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000); // Update setiap 30 detik untuk testing
    return () => clearInterval(interval);
  }, []);

  // Memantau perubahan devices dan membuat alert
  useEffect(() => {
    console.log('Devices updated:', devices); // Debug log

    const newAlerts: StatusAlert[] = [];
    devices.forEach(currentDevice => {
      const prevDevice = previousDevices.current[currentDevice.deviceid];
      
      console.log('Checking device:', currentDevice.deviceid); // Debug log
      console.log('Previous status:', prevDevice?.status); // Debug log
      console.log('Current status:', currentDevice.status); // Debug log

      if (prevDevice && prevDevice.status !== currentDevice.status) {
        console.log('Status change detected!'); // Debug log
        newAlerts.push({
          deviceId: currentDevice.deviceid,
          location: currentDevice.location,
          oldStatus: prevDevice.status,
          newStatus: currentDevice.status,
          timestamp: new Date()
        });
      }

      // Update previous devices
      previousDevices.current[currentDevice.deviceid] = {...currentDevice};
    });

    if (newAlerts.length > 0) {
      console.log('New alerts:', newAlerts); // Debug log
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 5)); // Batasi maksimal 5 alert
    }

    console.log('Current alerts:', alerts); // Debug log
  }, [devices]);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/locationinfo`);
      const result = await response.json();

      if (response.ok) {
        const deviceIds = result.data.map((device: Device) => device.deviceid);
        const detailedDevices = await Promise.all(deviceIds.map(fetchDeviceDetails));
        const validDevices = detailedDevices.filter((device): device is Device => device !== null);
        console.log('Fetched devices:', validDevices); // Debug log
        setDevices(validDevices);
      } else {
        console.error(result.message || 'Failed to fetch devices');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchDeviceDetails = async (deviceId: string): Promise<Device | null> => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 60000);

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

  const handleDismissAlert = (deviceId: string) => {
    setAlerts(prev => prev.filter(alert => alert.deviceId !== deviceId));
  };

  // Test function untuk memicu alert (untuk debugging)
  const triggerTestAlert = () => {
    const testAlert: StatusAlert = {
      deviceId: 'test-device',
      location: 'Test Location',
      oldStatus: 'Lancar',
      newStatus: 'Macet',
      timestamp: new Date()
    };
    setAlerts(prev => [...prev, testAlert]);
  };

  return (
    <main className="flex-grow">
      <div className="relative h-[calc(100vh-4rem)]">
        <Map data={devices} />
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-2">Real-Time Traffic Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor traffic conditions across the city with our advanced monitoring system.
          </p>
          {/* Tombol test untuk debugging */}
          <button 
            onClick={triggerTestAlert}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Alert
          </button>
        </div>
        {/* Tambahkan debug info */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow text-sm">
          Devices: {devices.length} | Alerts: {alerts.length}
        </div>
        <AlertNotification alerts={alerts} onDismiss={handleDismissAlert} />
      </div>
    </main>
  );
}