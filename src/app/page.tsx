'use client';

import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
import TrafficMonitoring from './components/Features';
import BleSection from './components/BleSection';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Header />
      <HeroSection />
      <AboutUs id="about" />
      <TrafficMonitoring />
    
      <Footer />
    </div>
  );
}