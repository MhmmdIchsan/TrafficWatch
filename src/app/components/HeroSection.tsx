import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import HeroImage from '../../assets/images/image-1.jpg';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Darker Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={HeroImage}
          alt="Peta Lalu Lintas Banda Aceh"
          fill
          className="object-cover -z-10 brightness-[0.4]" // Darkened from 0.7 to 0.4
        />
        {/* Added a semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Monitoring Lalu Lintas di Kota Banda Aceh
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Sistem pemantauan lalu lintas kami memberikan informasi real-time mengenai kondisi kepadatan di Banda Aceh. 
            Dengan teknologi Bluetooth Low Energy, kami memantau titik-titik pemantauan di kota untuk memberi Anda 
            data terkini, membantu Anda membuat keputusan perjalanan yang lebih cerdas.
          </p>
          <div className="flex justify-center space-x-4">
            {/* Button with Original Style */}
            <Link href="/map">
              <Button 
                variant="default" 
                size="lg" 
                className="px-8 py-3 text-lg shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-500 
                hover:from-indigo-500 hover:to-indigo-400 transition-transform duration-300 hover:shadow-indigo-500/25 
                text-white rounded-lg hover:scale-105"
              >
                Lihat Peta Lalu Lintas
              </Button>
            </Link>
            {/* Button with Inverted Style */}
            <Link href="#about">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg shadow-lg bg-white text-indigo-600 border border-indigo-600 
                hover:bg-indigo-600 hover:text-white transition-transform duration-300 hover:shadow-indigo-600/25 
                rounded-lg hover:scale-105"
              >
                Tentang Sistem Kami
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
