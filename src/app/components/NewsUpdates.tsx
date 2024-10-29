import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default class NewsUpdates extends React.Component {
  render() {
    const news = [
      {
        date: "19 Oct",
        title: "Pembaruan Sistem",
        content: "Lorem ipsum dolor sit amet."
      },
      {
        date: "18 Oct",
        title: "Integrasi BLE",
        content: "Ut enim ad minim veniam."
      },
      {
        date: "17 Oct",
        title: "Peningkatan Algoritma",
        content: "Duis aute irure dolor."
      }
    ];

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-600 dark:text-blue-400">Berita & Update</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-b last:border-b-0 pb-3 last:pb-0"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.date}</div>
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
}