import React, { useEffect, useState, useRef } from 'react';
import { Device } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Device) => void;
  device: Device;
}

export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  device 
}) => {
  // Initialize form data with all device attributes
  const [formData, setFormData] = useState({
    deviceid: device.deviceid,
    location: device.location || '',
    latitude: device.latitude || 0,
    longitude: device.longitude || 0,
    is_detection_enabled: device.is_detection_enabled ?? true,
    sampling_interval: device.sampling_interval || 1,
    status: device.status || '',
    last_update_time: device.last_update_time || ''
  });

  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Update form data when device prop changes
  useEffect(() => {
    setFormData({
      deviceid: device.deviceid,
      location: device.location || '',
      latitude: device.latitude || 0,
      longitude: device.longitude || 0,
      is_detection_enabled: device.is_detection_enabled ?? true,
      sampling_interval: device.sampling_interval || 1,
      status: device.status || '',
      last_update_time: device.last_update_time || ''
    });
  }, [device]);

  // WebSocket Connection Management
  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    }
  
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOpen]);  

  const connectWebSocket = () => {
    try {
      setWsStatus('connecting');
      wsRef.current = new WebSocket(`wss://7107606t52.execute-api.ap-southeast-3.amazonaws.com/production?deviceid=${device.deviceid}`);
  
      wsRef.current.onopen = () => {
        setWsStatus('connected');
        setError(null);
      };
  
      wsRef.current.onclose = () => {
        setWsStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };
  
      wsRef.current.onerror = () => {
        setError('WebSocket connection error');
        setWsStatus('disconnected');
      };
  
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Update form if we receive new configuration
          if (data.type === 'config_update' && data.deviceid === device.deviceid) {
            setFormData(prev => ({
              ...prev,
              ...data.updates
            }));
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
    } catch (error) {
      setError('Failed to establish WebSocket connection');
      setWsStatus('disconnected');
    }
  };

  const handleSwitchChange = () => {
    setFormData(prev => ({
      ...prev,
      is_detection_enabled: !prev.is_detection_enabled
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sampling_interval' ? parseInt(value) :
              name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        // Send configuration update via WebSocket
        const message = {
          action: "sendConfig",
          deviceid: formData.deviceid,
          updates: {
            is_detection_enabled: formData.is_detection_enabled,
            sampling_interval: formData.sampling_interval
          }
        };
        
        wsRef.current.send(JSON.stringify(message));
        
        // Call onSubmit to update parent component
        await onSubmit({
          ...device,
          is_detection_enabled: formData.is_detection_enabled,
          sampling_interval: formData.sampling_interval
        });
        
        onClose();
      } else {
        throw new Error('WebSocket connection is not open');
      }
    } catch (error) {
      setError('Failed to update device configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Device Configuration
            <Badge className={`${
              wsStatus === 'connected' ? 'bg-green-500' : 
              wsStatus === 'connecting' ? 'bg-yellow-500' : 
              'bg-red-500'
            } text-white`}>
              {wsStatus}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Device ID - Read Only */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceid" className="text-right">
                Device ID
              </Label>
              <Input
                id="deviceid"
                value={formData.deviceid}
                readOnly
                className="col-span-3 bg-gray-50"
              />
            </div>

            {/* Location */}
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
              />
            </div>

            {/* Latitude */}
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
              />
            </div>

            {/* Longitude */}
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
              />
            </div>

            {/* Detection Switch */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_detection_enabled" className="text-right">
                Detection
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is_detection_enabled"
                  checked={formData.is_detection_enabled}
                  onCheckedChange={handleSwitchChange}
                />
                <span className="text-sm text-gray-500">
                  {formData.is_detection_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Sampling Interval */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sampling_interval" className="text-right">
                Sampling (s)
              </Label>
              <Input
                id="sampling_interval"
                name="sampling_interval"
                type="number"
                min="1"
                value={formData.sampling_interval}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Status - Read Only */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                value={formData.status}
                readOnly
                className="col-span-3 bg-gray-50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving || wsStatus !== 'connected'}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};