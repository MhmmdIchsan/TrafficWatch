'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { Device } from '../types';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, Users } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locationinfo`);
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
  }, []);

  useEffect(() => {
    fetchDevices(); // Call the function on mount
    const interval = setInterval(fetchDevices, 60000); // Refresh every minute
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchDevices]); // Add fetchDevices as a dependency

  const fetchDeviceDetails = async (deviceId: string): Promise<Device | null> => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 60000); // 1 minute ago

    const formatTimestamp = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' }); // Oct
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const milliseconds = date.getMilliseconds().toString().padEnd(3, '0'); // 227 for milliseconds
    
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    

    const url = `${API_BASE_URL}/devices?deviceid=${deviceId}&start_time=${formatTimestamp(startTime)}&end_time=${formatTimestamp(endTime)}`;

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

  const handleAddDevice = (newDevice: Device) => {
    setDevices((prevDevices) => [...prevDevices, newDevice]);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.deviceid === updatedDevice.deviceid ? updatedDevice : device
      )
    );
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.deviceid !== deviceId)
    );
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
<div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Lancar" value={statusCounts.Lancar} icon={<Activity className="h-8 w-8 text-green-500" />} />
            <StatsCard title="Sedang" value={statusCounts.Sedang} icon={<BarChart3 className="h-8 w-8 text-yellow-500" />} />
            <StatsCard title="Macet" value={statusCounts.Macet} icon={<Activity className="h-8 w-8 text-red-500" />} />
            <StatsCard title="Total Devices" value={statusCounts.Total} icon={<Users className="h-8 w-8 text-blue-500" />} />
          </div>

          <Tabs defaultValue="map" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Device Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Map data={devices} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Device Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={devices}
                    onAddDevice={handleAddDevice}
                    onUpdateDevice={handleUpdateDevice}
                    onDeleteDevice={handleDeleteDevice}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}