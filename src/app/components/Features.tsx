import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Map, Bell, Radar, Shield } from 'lucide-react';

export default class Features extends React.Component {
  render() {
    const features = [
      {
        icon: <Map size={24} />,
        title: "Pemetaan Real-time",
        description: "Menampilkan kondisi lalu lintas dan keramaian secara langsung, memungkinkan pengelolaan yang lebih efisien."
      },
      {
        icon: <Bell size={24} />,
        title: "Notifikasi Cerdas",
        description: "Memberikan peringatan dini terkait kemacetan dan kepadatan di hotspot kota."
      },
      {
        icon: <Radar size={24} />,
        title: "Deteksi Dinamis",
        description: "Mengidentifikasi pola keramaian dan lalu lintas secara dinamis untuk memberikan informasi waktu nyata."
      },
      {
        icon: <Shield size={24} />,
        title: "Keamanan Terjamin",
        description: "Melindungi privasi pengguna dengan menggunakan sinyal BLE tanpa pengumpulan data pribadi."
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
          >
            <Card className="hover:shadow-lg transition-all duration-300 flex-grow">
              <CardContent className="p-4 text-center flex flex-col justify-between h-full">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-block p-4 bg-blue-50 dark:bg-blue-900 rounded-full mb-3 flex items-center justify-center mx-auto"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }
}
