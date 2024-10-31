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
import { Activity, BarChart3, Users, AlertTriangle, Car, AlertCircle } from 'lucide-react';

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
    fetchDevices();
    const interval = setInterval(fetchDevices, 60000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

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
      'Lancar': 0,
      'Ramai Lancar': 0,
      'Padat': 0,
      'Padat Merayap': 0,
      'Macet': 0,
      'Macet Total': 0,
      'Tidak Aktif': 0,
      Total: devices.length
    };

    devices.forEach(device => {
      if (counts.hasOwnProperty(device.status)) {
        counts[device.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Lancar':
        return <Activity className="h-8 w-8 text-green-500" />;
      case 'Ramai Lancar':
        return <Car className="h-8 w-8 text-blue-500" />;
      case 'Padat':
        return <BarChart3 className="h-8 w-8 text-yellow-500" />;
      case 'Padat Merayap':
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case 'Macet':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case 'Macet Total':
        return <AlertCircle className="h-8 w-8 text-red-700" />;
      default:
        return <Activity className="h-8 w-8 text-gray-500" />;
    }
  };

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
            <StatsCard 
              title="Lancar" 
              value={statusCounts.Lancar} 
              icon={getStatusIcon('Lancar')} 
            />
            <StatsCard 
              title="Ramai Lancar" 
              value={statusCounts['Ramai Lancar']} 
              icon={getStatusIcon('Ramai Lancar')} 
            />
            <StatsCard 
              title="Padat" 
              value={statusCounts.Padat} 
              icon={getStatusIcon('Padat')} 
            />
            <StatsCard 
              title="Padat Merayap" 
              value={statusCounts['Padat Merayap']} 
              icon={getStatusIcon('Padat Merayap')} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Macet" 
              value={statusCounts.Macet} 
              icon={getStatusIcon('Macet')} 
            />
            <StatsCard 
              title="Macet Total" 
              value={statusCounts['Macet Total']} 
              icon={getStatusIcon('Macet Total')} 
            />
            <StatsCard 
              title="Tidak Aktif" 
              value={statusCounts['Tidak Aktif']} 
              icon={<Users className="h-8 w-8 text-gray-500" />} 
            />
            <StatsCard 
              title="Total Devices" 
              value={statusCounts.Total} 
              icon={<Users className="h-8 w-8 text-blue-500" />} 
            />
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