"use client";

import React from 'react';
import Header from './components/Header';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import DetectorStatus from './components/DetectorStatus';
import Clock from './components/Clock';
import StatusCard from './components/StatusCard';
import { SparklesPreview } from './components/ui/SparklesPreview';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sparkles background - fullpage */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SparklesPreview />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen ">
        <Header />
        <main className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-white">Sistem Monitoring Kemacetan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Map />
            </div>
            <div className="space-y-4">
              <SearchBar />
              <DetectorStatus />
              <Clock />
              <StatusCard color="#0288D1" title="(Title)" description="(Description)" />
              <StatusCard color="orange" title="(Title)" description="(Description)" />
              <StatusCard color="#0288D1" title="(Title)" description="(Description)" />
              <StatusCard color="green" title="(Title)" description="(Description)" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}