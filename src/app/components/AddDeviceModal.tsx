import React, { useState } from 'react';
import { Device } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Device) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceid: '',
    location: '',
    latitude: '',
    longitude: '',
    is_detection_enabled: true,
    sampling_interval: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'sampling_interval' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      is_detection_enabled: checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      deviceid: '',
      location: '',
      latitude: '',
      longitude: '',
      is_detection_enabled: true,
      sampling_interval: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Validate latitude and longitude
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
  
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid latitude or longitude values');
      }
  
      // Validate sampling interval
      if (formData.sampling_interval < 1) {
        throw new Error('Sampling interval must be at least 1 second');
      }
  
      // Prepare the data to be sent
      const deviceData = {
        deviceid: formData.deviceid.trim(),
        location: formData.location.trim(),
        latitude: lat.toString(),
        longitude: lng.toString(),
        is_detection_enabled: formData.is_detection_enabled,
        sampling_interval: formData.sampling_interval
      };
  
      console.log('Sending device data:', deviceData);
  
      // Make the API call
      const response = await fetch(`${API_BASE_URL}/locationinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('API Response:', result); // Log the full response for debugging
        throw new Error(result.message || 'Failed to add device');
      }
  
      // Show success message
      toast({
        title: "Success",
        description: "Device has been successfully added",
        duration: 3000,
      });
  
      // Call the onSubmit prop with the new device data
      onSubmit(result.data);
  
      // Reset form and close modal
      resetForm();
      onClose();
  
    } catch (error) {
      console.error('Error adding device:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add device",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceid" className="text-right">
                Device ID
              </Label>
              <Input
                id="deviceid"
                name="deviceid"
                value={formData.deviceid}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Enter device ID"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Enter location"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="e.g. -6.2088"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="e.g. 106.8456"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sampling_interval" className="text-right">
                Sampling Interval
              </Label>
              <Input
                id="sampling_interval"
                name="sampling_interval"
                type="number"
                min="1"
                step="1"
                value={formData.sampling_interval}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Minimum 1 second"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_detection_enabled" className="text-right">
                Detection Enabled
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="is_detection_enabled"
                  checked={formData.is_detection_enabled}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};