"use client";

import Logo from "../../assets/images/logo.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cek status login dari localStorage
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set isLoggedIn berdasarkan token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Hapus token login
    setIsLoggedIn(false); // Update status login
  };

  const handleLogin = () => {
    // Navigasi ke halaman /login
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 ml-16"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src={Logo}
                  alt="TW Logo"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="absolute -inset-0.5 bg-indigo-500 rounded-full blur opacity-30"></div>
            </div>
            <Link
              href="/"
              className="text-xl font-bold tracking-wider text-white hover:text-indigo-200 transition-colors"
            >
              TRAFFIC WATCH
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 mr-16">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-white/80 hover:text-white cursor-pointer transition-colors"
            >
              <Link href="/map">Map</Link>
            </motion.span>

            {/* Tampilkan link Dashboard jika login */}
            {isLoggedIn && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-white/80 hover:text-white cursor-pointer transition-colors"
              >
                <Link href="/admin">Dashboard</Link>
              </motion.span>
            )}

            {/* Login/Logout Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2 rounded-lg font-medium text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 hover:shadow-indigo-500/25"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2 rounded-lg font-medium text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 hover:shadow-indigo-500/25"
                >
                  Log In
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
