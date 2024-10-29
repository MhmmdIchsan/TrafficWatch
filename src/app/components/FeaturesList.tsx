// components/FeaturesList.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default class FeaturesList extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fitur Utama Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Pemantauan lalu lintas real-time</li>
            <li>Pemetaan kepadatan lalu lintas</li>
            <li>Analisis tren lalu lintas</li>
            <li>Notifikasi kemacetan dan insiden</li>
            <li>Integrasi dengan sistem manajemen lalu lintas kota</li>
          </ul>
        </CardContent>
      </Card>
    );
  }
}