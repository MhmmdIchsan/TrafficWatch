import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default class HowItWorks extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cara Kerja Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Pengumpulan data dari sinyal Bluetooth Low Energy </li>
            <li>Pemrosesan data menggunakan algoritma </li>
            <li>Klasifikasi Jenis Kemacetan</li>
            <li>Penyajian informasi melalui dashboard interaktif</li>
            <li>Pengiriman notifikasi secara Real-Time</li>
          </ol>
        </CardContent>
      </Card>
    );
  }
}