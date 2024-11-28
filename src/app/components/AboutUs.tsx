import React from 'react';
import { motion } from 'framer-motion';
import BleSection from './BleSection';
import { IoBluetooth, IoMap, IoTime } from 'react-icons/io5'; // Fixed icon import

interface AboutUsProps {
  id?: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ id }) => {
  return (
    <section id={id} className="relative py-16 md:py-24 bg-gray-800 text-white">
      {/* Glow Line at the top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 blur-md"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">ABOUT US</h2>
        </div>

        <BleSection />

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Keunggulan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-gray-700 p-8 md:p-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-6">
              <IoBluetooth size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Deteksi Non-Invasif</h3>
            <p className="text-gray-400">
              Sistem kami menggunakan teknologi Bluetooth Low Energy (BLE) untuk mendeteksi perangkat secara non-invasif, menjaga privasi pengguna tanpa mengambil data sensitif.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg bg-gray-700 p-8 md:p-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-6">
              <IoMap size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Peta Interaktif</h3>
            <p className="text-gray-400">
              Aplikasi ini menampilkan peta interaktif dengan titik-titik lokasi pemantauan kepadatan lalu lintas yang mudah diakses oleh pengguna.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-lg bg-gray-700 p-8 md:p-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-6">
            <IoTime size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Realtime</h3>
            <p className="text-gray-400">
              Aplikasi ini memberikan pembaruan secara realtime mengenai kondisi lalu lintas di setiap titik pemantauan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
