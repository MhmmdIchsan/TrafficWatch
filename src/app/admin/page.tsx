"use client";

import DataTable from "../components/DataTable";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Map from "../components/Map";
import { Device, Notification } from "../types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Search,
  Activity,
  BarChart3,
  Users,
  AlertTriangle,
  Car,
  AlertCircle,
  Clock,
  Bell,
  CircleSlash,
  Info,
  ShieldAlert,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useSession, getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

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
    return () => clearInterval(interval);
  }, [fetchDevices]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const filtered = devices.filter(
      (device) =>
        device.deviceid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchTerm, devices]);

  const getStatusCounts = () => {
    const counts = {
      Lancar: 0,
      "Ramai Lancar": 0,
      Padat: 0,
      "Padat Merayap": 0,
      Macet: 0,
      "Macet Total": 0,
      "Tidak Aktif": 0,
      Total: devices.length,
    };

    devices.forEach((device) => {
      if (counts.hasOwnProperty(device.status)) {
        counts[device.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Lancar":
        return <Activity className="text-green-500" size={24} />;
      case "Ramai Lancar":
        return <Car className="text-blue-500" size={24} />;
      case "Padat":
        return <BarChart3 className="text-yellow-500" size={24} />;
      case "Padat Merayap":
        return <AlertTriangle className="text-orange-500" size={24} />;
      case "Macet":
        return <AlertCircle className="text-red-500" size={24} />;
      case "Macet Total":
        return <AlertCircle className="text-red-700" size={24} />;
      case "Tidak Aktif":
        return <CircleSlash className="text-gray-500" size={24} />;
      default:
        return <Activity className="text-gray-500" size={24} />;
    }
  };

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

  const handleAddDevice = (newDevice: Device) => {
    setDevices((prevDevices) => [...prevDevices, newDevice]);
    setFilteredDevices((prevDevices) => [...prevDevices, newDevice]);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.deviceid === updatedDevice.deviceid ? updatedDevice : device
      )
    );
    setFilteredDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.deviceid === updatedDevice.deviceid ? updatedDevice : device
      )
    );
  };

  const handleDeleteDevice = (deviceId: string) => {
    fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDevices((prevDevices) =>
            prevDevices.filter((device) => device.deviceid !== deviceId)
          );
          setFilteredDevices((prevDevices) =>
            prevDevices.filter((device) => device.deviceid !== deviceId)
          );
        } else {
          console.error("Failed to delete device");
        }
      })
      .catch((error) => {
        console.error("Error deleting device:", error);
      });
  };

  if (status === 'unauthenticated') {
    return <div>Access denied. Please login to continue.</div>;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-bl from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-green-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-full overflow-x-hidden">
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-center text-white mb-8 mt-16 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-300">
            Traffic Monitoring Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Overview Column */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-gray-200 transform transition-all hover:scale-105">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Status Overview
                  </h2>
                  <Users className="text-blue-400" size={28} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(statusCounts)
                    .filter(([key]) => key !== "Total" && key !== "Tidak Aktif")
                    .map(([status, count]) => (
                      <div
                        key={status}
                        className="p-4 bg-white/10 rounded-xl flex items-center space-x-3 hover:bg-white/20 transition-all"
                      >
                        {getStatusIcon(status)}
                        <div>
                          <p className="text-sm text-gray-300">{status}</p>
                          <p className="text-xl font-bold text-white">
                            {count}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {/* Inactive Devices Card */}
                  <div className="p-4 bg-white/10 rounded-xl flex items-center space-x-3 hover:bg-white/20 transition-all">
                    {getStatusIcon("Tidak Aktif")}
                    <div>
                      <p className="text-sm text-gray-300">Tidak Aktif</p>
                      <p className="text-xl font-bold text-white">
                        {statusCounts["Tidak Aktif"]}
                      </p>
                    </div>
                  </div>

                  {/* Total Devices Card */}
                  <div className="p-4 bg-white/10 rounded-xl flex items-center space-x-3 hover:bg-white/20 transition-all">
                    <Users className="text-blue-500" size={24} />
                    <div>
                      <p className="text-sm text-gray-300">Total Devices</p>
                      <p className="text-xl font-bold text-white">
                        {statusCounts.Total}
                      </p>
                    </div>
                  </div>
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

            {/* Map and Table Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map Card */}
              <Card className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.02]">
                <Map data={filteredDevices} />
              </Card>

              {/* Timestamp Card */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="text-white" size={28} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Current Timestamp
                    </h3>
                    <p className="text-2xl font-mono text-blue-200">
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
                <div className="hidden md:block opacity-20">
                  <svg
                    className="w-24 h-24"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="10 5"
                    />
                  </svg>
                </div>
              </Card>

              {/* DataTable Card - Maximized */}
              <div className="w-full">
                <DataTable
                  data={filteredDevices}
                  onAddDevice={handleAddDevice}
                  onUpdateDevice={handleUpdateDevice}
                  onDeleteDevice={handleDeleteDevice}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}