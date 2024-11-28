import React from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Navigation, Bluetooth } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-800 text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>

      {/* Glow Line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-md"></div>

      {/* Particle Effects */}
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-500 to-transparent blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-yellow-500 to-transparent blur-3xl opacity-40 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">Fitur Utama</h2>
          <p className="text-gray-400 mt-4">Fitur canggih untuk pengalaman mobilitas Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-lg font-medium mb-2">Peta Lalu Lintas</h3>
            <p className="mb-4 text-gray-400">Visualisasikan kondisi lalu lintas secara real-time di Banda Aceh.</p>
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <Map className="w-12 h-12 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-lg font-medium mb-2">Pemantauan Kepadatan</h3>
            <p className="mb-4 text-gray-400">Deteksi dan analisis kepadatan lalu lintas menggunakan teknologi Bluetooth Low Energy.</p>
            <div className="grid grid-cols-3 gap-4">
              {/* Status and color are static and manually input */}
              <motion.div
                className="p-4 bg-green-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-green-400 mb-2" />
                <p className="font-medium">Lancar</p>
              </motion.div>

              <motion.div
                className="p-4 bg-blue-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-blue-400 mb-2" />
                <p className="font-medium">Ramai Lancar</p>
              </motion.div>

              <motion.div
                className="p-4 bg-yellow-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="font-medium">Padat</p>
              </motion.div>

              <motion.div
                className="p-4 bg-orange-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-orange-400 mb-2" />
                <p className="font-medium">Padat Merayap</p>
              </motion.div>

              <motion.div
                className="p-4 bg-red-500 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-red-400 mb-2" />
                <p className="font-medium">Macet</p>
              </motion.div>

              <motion.div
                className="p-4 bg-red-700 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bluetooth className="w-8 h-8 text-red-500 mb-2" />
                <p className="font-medium">Macet Total</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-lg font-medium mb-2">Lokasi Pemantauan</h3>
            <p className="mb-4 text-gray-400">Lihat lokasi-lokasi di mana lalu lintas dipantau.</p>
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center gap-8">
              {['Jalan Sudirman', 'Simpang Empat', 'Simpang Lampaseh'].map((location, index) => (
                <motion.div
                  key={location}
                  className="flex flex-col items-center space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <MapPin className="w-8 h-8 text-blue-400" />
                  <span>{location}</span>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Navigation className="w-5 h-5" />
                    <span>{(1.2 + index * 2.2).toFixed(1)} km</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
