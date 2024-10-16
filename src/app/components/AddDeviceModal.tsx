import React, { useState } from 'react';
import { Device } from '../types';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Device) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newDevice, setNewDevice] = useState<Device>({
    deviceid: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'offline',
    avg_device_count: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice({
      ...newDevice,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newDevice);
    setNewDevice({
      deviceid: '',
      location: '',
      latitude: '',
      longitude: '',
      status: 'offline',
      avg_device_count: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Device ID</label>
            <input
              type="text"
              name="deviceid"
              value={newDevice.deviceid}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={newDevice.location}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={newDevice.latitude}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={newDevice.longitude}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};