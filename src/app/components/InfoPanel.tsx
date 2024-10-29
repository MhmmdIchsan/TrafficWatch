import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeaturesList from './FeaturesList';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import Statistics from './Statistics';

export default class InfoPanel extends React.Component {
  render() {
    return (
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Fitur</TabsTrigger>
          <TabsTrigger value="how-it-works">Cara Kerja</TabsTrigger>
          <TabsTrigger value="benefits">Manfaat</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <FeaturesList />
        </TabsContent>
        <TabsContent value="how-it-works">
          <HowItWorks />
        </TabsContent>
        <TabsContent value="benefits">
          <Benefits />
        </TabsContent>
      </Tabs>
    );
  }
}