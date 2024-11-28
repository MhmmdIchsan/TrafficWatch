import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div 
            className="absolute -top-20 -left-20 w-96 h-96 
            bg-gradient-to-br from-indigo-900/30 to-indigo-700/30 
            rounded-full blur-3xl"
          />
          <div 
            className="absolute -bottom-20 -right-20 w-96 h-96 
            bg-gradient-to-br from-indigo-900/30 to-indigo-700/30 
            rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Company Info Column */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Monitoring Lalu Lintas</h3>
              <p className="text-gray-400 text-sm">
                Solusi inovatif untuk pemantauan lalu lintas real-time dan manajemen transportasi cerdas.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                {['Beranda', 'Fitur', 'Tentang', 'Kontak'].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={`#${link.toLowerCase()}`} 
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links Column */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Ikuti Kami</h4>
              <div className="flex space-x-4 justify-center">
                {[
                  { Icon: Github, href: 'https://github.com' },
                  { Icon: Linkedin, href: 'https://linkedin.com' },
                  { Icon: Twitter, href: 'https://twitter.com' }
                ].map(({ Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2024 Sistem Monitoring Lalu Lintas. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}