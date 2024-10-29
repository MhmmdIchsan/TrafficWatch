import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Sen', lancar: 400, sedang: 240, macet: 100 },
  { name: 'Sel', lancar: 300, sedang: 300, macet: 150 },
  { name: 'Rab', lancar: 200, sedang: 350, macet: 200 },
  { name: 'Kam', lancar: 350, sedang: 280, macet: 120 },
  { name: 'Jum', lancar: 280, sedang: 320, macet: 180 },
  { name: 'Sab', lancar: 450, sedang: 200, macet: 80 },
  { name: 'Min', lancar: 500, sedang: 150, macet: 50 },
];

export default class Statistics extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistik Lalu Lintas Mingguan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lancar" fill="#4CAF50" name="Lancar" />
              <Bar dataKey="sedang" fill="#FFC107" name="Sedang" />
              <Bar dataKey="macet" fill="#F44336" name="Macet" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}