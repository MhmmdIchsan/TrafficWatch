import Laptop from "../../assets/images/image-2.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const BleSection: React.FC = () => {
  // State to store particle positions
  const [particlePositions, setParticlePositions] = useState<
    { x: number; y: number; scale: number }[]
  >([]);

  // Generate particle positions after component mounts (client-side)
  useEffect(() => {
    const generateParticlePositions = () => {
      return Array.from({ length: 8 }, () => ({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
        scale: Math.random() * 0.5 + 0.5,
      }));
    };

    setParticlePositions(generateParticlePositions());
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-800 text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-96 h-96 
          bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 
          dark:from-indigo-800/30 dark:to-indigo-900/30 
          rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 
          bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 
          dark:from-indigo-800/30 dark:to-indigo-900/30 
          rounded-full blur-3xl"
        />
      </div>

      {/* Particles */}
      {particlePositions.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute bg-indigo-500/40 w-4 h-4 rounded-full blur-lg"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            x: [
              particle.x,
              particle.x + (Math.random() * 200 - 100),
            ],
            y: [
              particle.y,
              particle.y + (Math.random() * 200 - 100),
            ],
          }}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TrafficWatch
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mb-6">
            TrafficWatch adalah aplikasi berbasis web yang menampilkan peta
            interaktif dengan titik-titik lokasi pemantauan untuk mendeteksi
            kepadatan lalu lintas di Kota Banda Aceh. Aplikasi ini menggunakan
            perangkat Android di beberapa titik untuk menangkap data perangkat
            Bluetooth aktif di sekitarnya. Dengan teknologi BLE, sistem ini
            melakukan deteksi kemacetan secara non-invasif, menjaga privasi
            pengguna tanpa mengumpulkan data sensitif.
          </p>
          <div className="flex space-x-4">
            {/* Tombol View Map */}
            <Link href="#map">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 
                transition-colors duration-300 text-white px-8 py-3 text-lg rounded-lg shadow-lg hover:scale-105"
              >
                View Map &gt;
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-w-16 aspect-h-9">
            <div className="h-64">
              <Image
                src={Laptop}
                alt="Traffic Monitoring Dashboard"
                fill
                className="object-cover transform transition-transform duration-300 hover:scale-105 hover:rotate-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 mix-blend-overlay"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BleSection;