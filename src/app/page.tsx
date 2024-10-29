'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Features from './components/Features';
import AboutUs from './components/AboutUs';
import NewsUpdates from './components/NewsUpdates';
import { Device } from './types';
import Footer from './components/Footer';
import InfoPanel from './components/InfoPanel';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
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
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left circular gradient */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Bottom-right circular gradient */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        
        {/* Center decorative pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6IiBzdHJva2U9IiM4ODgiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-5" />
      </div>

      {/* Content with glass effect cards */}
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-6 space-y-8 relative z-10"
      >
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg p-1">
              <Map data={devices} />
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg p-1">
            <InfoPanel />
          </div>
        </section>
        
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Features />
        </motion.section>

        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg p-1">
            <AboutUs />
          </div>
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg p-1">
            <NewsUpdates />
          </div>
        </motion.section>
      </motion.main>
      <Footer />
    </div>
  );
}
