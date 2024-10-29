import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default class AboutUs extends React.Component {
  render() {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-600 dark:text-blue-400">Tentang Kami</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Kami adalah inovator di bidang manajemen lalu lintas dan deteksi keramaian, dengan fokus pada solusi berbasis teknologi yang menjaga privasi. Dengan menggunakan sinyal Bluetooth Low Energy (BLE), sistem kami mendeteksi pola lalu lintas dan keramaian tanpa mengumpulkan informasi pribadi, seperti wajah atau plat nomor. Solusi kami dirancang untuk mengatasi tantangan lalu lintas di kota-kota berkembang, khususnya Banda Aceh.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { number: "10+", label: "Tahun Pengalaman" },
              { number: "50+", label: "Kota Dilayani" },
              { number: "1M+", label: "Pengguna Teknologi Kami" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg"
              >
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
}
