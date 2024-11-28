import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DateTime: React.FC = () => {
  const currentDateTime = new Date().toLocaleString();

  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Date and Time</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-4xl font-bold">
        {currentDateTime}
      </CardContent>
    </Card>
  );
};

export default DateTime;