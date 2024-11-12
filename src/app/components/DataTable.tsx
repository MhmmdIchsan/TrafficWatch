import React, { useState } from 'react';
import { AddDeviceModal } from './AddDeviceModal';
import { EditDeviceModal } from './EditDeviceModal';
import { Device } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status?.toLowerCase()) {
      case 'lancar':
        return { bg: 'bg-green-100', text: 'text-green-800' }; // green-500
      case 'ramai lancar':
        return { bg: 'bg-blue-100', text: 'text-blue-800' }; // blue-500
      case 'padat':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' }; // yellow-500
      case 'padat merayap':
        return { bg: 'bg-orange-100', text: 'text-orange-800' }; // orange-500
      case 'macet':
        return { bg: 'bg-red-100', text: 'text-red-800' }; // red-500
      case 'macet total':
        return { bg: 'bg-red-200', text: 'text-red-900' }; // red-700
      case 'tidak aktif':
        return { bg: 'bg-gray-100', text: 'text-gray-800' }; // gray-500
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' }; // gray-500 (default)
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/locationinfo`, {
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
      const response = await fetch(`${API_BASE_URL}/locationinfo/${updatedDevice.deviceid}`, {
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
        const response = await fetch(`${API_BASE_URL}/locationinfo/${deviceId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
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
            {filteredData.map((item, index) => {
              const statusStyle = getStatusColor(item.status || 'tidak aktif');
              return (
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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      {item.status || 'Tidak Aktif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDevice(item.deviceid)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddDevice}
      />

      {selectedDevice && (
        <EditDeviceModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateDevice}
          device={selectedDevice}
        />
      )}
    </div>
  );
};

export default DataTable;