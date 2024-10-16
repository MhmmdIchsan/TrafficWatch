import React, { useState, useEffect } from 'react';
import { Device } from '../types';

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Device) => void;
  device: Device;
}

export const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ isOpen, onClose, onSubmit, device }) => {
  const [editedDevice, setEditedDevice] = useState<Device>(device);

  useEffect(() => {
    setEditedDevice(device);
  }, [device]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDevice({
      ...editedDevice,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(editedDevice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Device ID</label>
            <input
              type="text"
              name="deviceid"
              value={editedDevice.deviceid}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={editedDevice.location}
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
              value={editedDevice.latitude}
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
              value={editedDevice.longitude}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              value={editedDevice.status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Avg Device Count</label>
            <input
              type="number"
              name="avg_device_count"
              value={editedDevice.avg_device_count}
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
              Update Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};