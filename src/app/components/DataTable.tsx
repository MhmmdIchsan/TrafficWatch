/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { AddDeviceModal } from './AddDeviceModal';
import { EditDeviceModal } from './EditDeviceModal';
import { Device } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { motion } from 'framer-motion';

interface DataTableProps {
  data: Device[];
  onAddDevice: (newDevice: Device) => void;
  onUpdateDevice: (updatedDevice: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onAddDevice, onUpdateDevice, onDeleteDevice }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNewClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDevice(null);
  };

  const filteredData = data.filter(device =>
    Object.values(device).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddDevice = async (newDevice: Device) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/locationinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceid: newDevice.deviceid,
          location: newDevice.location,
          latitude: parseFloat(newDevice.latitude),
          longitude: parseFloat(newDevice.longitude),
          status: newDevice.status,
          avg_device_count: newDevice.avg_device_count
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onAddDevice(newDevice);
        setIsAddModalOpen(false);
      } else {
        console.error(result.message || 'Failed to add new device');
        alert(result.message || 'Failed to add new device');
      }
    } catch (error) {
      console.error('Error adding new device:', error);
      alert('Error adding new device');
    }
  };

  const handleUpdateDevice = async (updatedDevice: Device) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/locationinfo/${updatedDevice.deviceid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDevice),
      });

      const result = await response.json();

      if (response.ok) {
        onUpdateDevice(updatedDevice);
        handleCloseEditModal();
      } else {
        console.error(result.message || 'Failed to update device');
        alert(result.message || 'Failed to update device');
      }
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Error updating device');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/locationinfo/${deviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onDeleteDevice(deviceId);
        } else {
          const result = await response.json();
          console.error(result.message || 'Failed to delete device');
          alert(result.message || 'Failed to delete device');
        }
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Error deleting device');
      }
    }
  };

  return (
<div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search devices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Add New Device
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Device ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <motion.tr
                key={item.deviceid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.latitude}</TableCell>
                <TableCell>{item.longitude}</TableCell>
                <TableCell>{item.deviceid}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Lancar' ? 'bg-green-100 text-green-800' :
                    item.status === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteDevice(item.deviceid)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={onAddDevice}
      />

      {selectedDevice && (
        <EditDeviceModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={onUpdateDevice}
          device={selectedDevice}
        />
      )}
    </div>
  );
};

export default DataTable;