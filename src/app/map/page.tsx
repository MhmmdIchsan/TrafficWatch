"use client";

import BleSection from "../components/BleSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Map from "../components/Map";
import { Device, Notification } from "../types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MapPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  const generateNotification = (device: Device): Notification | null => {
    const criticalStatuses = ["Macet", "Macet Total", "Padat Merayap"];
    const warningStatuses = ["Padat", "Ramai Lancar"];

    if (criticalStatuses.includes(device.status)) {
      return {
        id: `critical-${device.deviceid}`,
        type: "alert",
        message: `Critical traffic condition: ${device.status} at ${device.location}`,
        timestamp: new Date().toLocaleString(),
      };
    }

    if (warningStatuses.includes(device.status)) {
      return {
        id: `warning-${device.deviceid}`,
        type: "warning",
        message: `Traffic condition: ${device.status} at ${device.location}`,
        timestamp: new Date().toLocaleString(),
      };
    }

    return null;
  };

  const fetchDeviceDetails = async (
    deviceId: string
  ): Promise<Device | null> => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 60000);

    const formatTimestamp = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const url = `${API_BASE_URL}/devices?deviceid=${deviceId}&start_time=${formatTimestamp(
      startTime
    )}&end_time=${formatTimestamp(endTime)}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        return result.data;
      } else {
        console.error(
          result.message || `Failed to fetch details for device ${deviceId}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error fetching details for device ${deviceId}:`, error);
      return null;
    }
  };

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/locationinfo`);
      const result = await response.json();

      if (response.ok) {
        const deviceIds = result.data.map((device: Device) => device.deviceid);
        const detailedDevices = await Promise.all(
          deviceIds.map(fetchDeviceDetails)
        );
        const validDevices = detailedDevices.filter(
          (device): device is Device => device !== null
        );

        // Generate notifications based on device statuses
        const newNotifications = validDevices
          .map(generateNotification)
          .filter(
            (notification): notification is Notification =>
              notification !== null
          );

        setDevices(validDevices);
        setFilteredDevices(validDevices);

        // Update notifications, keeping only unique notifications
        setNotifications((prevNotifications) => {
          const uniqueNotifications = [
            ...newNotifications,
            ...prevNotifications,
          ]
            .filter(
              (notification, index, self) =>
                index === self.findIndex((t) => t.id === notification.id)
            )
            .slice(0, 5); // Limit to 5 most recent notifications

          return uniqueNotifications;
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError("Failed to load device information");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDevices]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case "alert":
        return <ShieldAlert className="text-red-500" size={20} />;
      case "info":
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  useEffect(() => {
    const filtered = devices.filter(
      (device) =>
        device.deviceid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchTerm, devices]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gray-800 z-0">
        <div className="absolute w-40 h-40 bg-blue-600/20 rounded-full animate-blob top-10 left-20 mix-blend-overlay"></div>
        <div className="absolute w-52 h-52 bg-purple-600/20 rounded-full animate-blob animation-delay-2000 top-1/3 right-20 mix-blend-overlay"></div>
        <div className="absolute w-48 h-48 bg-pink-600/20 rounded-full animate-blob animation-delay-4000 bottom-20 left-1/3 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 pt-20 pb-6 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-white mb-8 mt-8 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-300">
            Peta Pemantauan Kepadatan Lalu Lintas Kota Banda Aceh
          </h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              {/* All Devices Card */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-gray-200 transform transition-all hover:scale-105">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    All Devices
                  </h2>
                  <Search className="text-blue-400" size={28} />
                </div>

                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Search devices..."
                    className="pl-10 w-full bg-white/10 text-white border-white/20 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredDevices.slice(0, 4).map((device) => (
                  <div
                    key={device.deviceid}
                    className={`p-4 rounded-xl flex items-center space-x-3 hover:bg-white/20 transition-all cursor-pointer ${
                      selectedDeviceId === device.deviceid 
                        ? 'bg-white/20' 
                        : 'bg-white/10'
                    }`}
                    onClick={() => setSelectedDeviceId(device.deviceid)}
                  >
                    <div className="flex-grow">
                      <p className="text-sm text-gray-300">
                        {device.location || "Unknown Location"}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {device.deviceid}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {device.status || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
              </Card>

              {/* Notifications Card */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-gray-200 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Bell className="text-white" size={24} />
                    <h2 className="text-2xl font-semibold text-white">
                      Notifications
                    </h2>
                  </div>
                  <span className="text-sm text-blue-300">Real-time</span>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-white/10 rounded-xl flex items-center space-x-4 hover:bg-white/20 transition-all"
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-grow">
                        <p className="text-sm text-gray-100">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="col-span-2 space-y-6">
              {/* Map Card */}
              <Card className="p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.02]">
              <Map 
                data={filteredDevices} 
                selectedDevice={selectedDeviceId} 
              />
              </Card>

              <Card className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-gray-200 hover:scale-105 transform transition-all">
                <div className="flex items-center space-x-4">
                  <Clock className="text-white" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold">Current Timestamp</h3>
                    <p className="text-2xl font-mono">
                      {currentTime.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <BleSection />

        <Footer />
      </div>
    </div>
  );
}
