import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default class Benefits extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manfaat Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Pengurangan kemacetan melalui deteksi waktu nyata</li>
            <li>Peningkatan efisiensi lalu lintas dengan pengelolaan yang lebih baik</li>
            <li>Perlindungan privasi dengan penggunaan sinyal BLE, tanpa pengumpulan data pribadi</li>
            <li>Penurunan emisi kendaraan dan dampak negatif terhadap kesehatan masyarakat</li>
            <li>Solusi yang hemat biaya dan dapat diimplementasikan di daerah dengan infrastruktur terbatas</li>
            <li>Peningkatan kualitas lingkungan dan kesejahteraan penduduk kota</li>
          </ul>
        </CardContent>
      </Card>
    );
  }
}
