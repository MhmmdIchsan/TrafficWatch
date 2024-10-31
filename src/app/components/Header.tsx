import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set isClient hanya saat di klien
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-black/80 to-indigo-950/80 border-b border-gray-700/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4">
          <motion.div 
            className="flex items-center space-x-3 ml-16"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                TW
              </div>
              <div className="absolute -inset-0.5 bg-indigo-500 rounded-full blur opacity-30"></div>
            </div>
            <Link href="/" className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 hover:to-indigo-200 transition-colors">
              TRAFFIC WATCH
            </Link>
          </motion.div>

          <div className="flex items-center space-x-6 mr-16">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-gray-300 hover:text-white cursor-pointer transition-colors"
            >
              <Link href="/login">Sign Up</Link>
            </motion.span>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2 rounded-lg font-medium text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 hover:shadow-indigo-500/25"
              >
                SIGN UP
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;