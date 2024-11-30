'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

const ErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get error message from search params
  const errorMessage = searchParams.get('message') || 
    "An unexpected error occurred. Please try again later.";

  const handleReload = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading page:", error);
    }
  };

  const handleHomeNavigation = () => {
    try {
      router.push('/');
    } catch (error) {
      console.error("Error navigating home:", error);
      window.location.href = '/'; // Fallback navigation
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-bl from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

<div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-green-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gray-800 z-0">
        <div className="absolute w-40 h-40 bg-blue-600/20 rounded-full animate-blob top-10 left-20 mix-blend-overlay"></div>
        <div className="absolute w-52 h-52 bg-purple-600/20 rounded-full animate-blob animation-delay-2000 top-1/3 right-20 mix-blend-overlay"></div>
        <div className="absolute w-48 h-48 bg-pink-600/20 rounded-full animate-blob animation-delay-4000 bottom-20 left-1/3 mix-blend-overlay"></div>
      </div>

      {/* Error Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <AlertTriangle 
              className="text-red-500 animate-pulse" 
              size={64} 
              strokeWidth={1.5} 
            />
          </div>

          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-300">
            Oops! Something Went Wrong
          </h1>

          <p className="text-gray-300 mb-6">
            {errorMessage}
          </p>

          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReload}
              className="flex items-center space-x-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-xl hover:bg-blue-600/40 transition-all"
            >
              <RefreshCw size={18} />
              <span>Reload</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHomeNavigation}
              className="flex items-center space-x-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-xl hover:bg-green-600/40 transition-all"
            >
              <Home size={18} />
              <span>Home</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;