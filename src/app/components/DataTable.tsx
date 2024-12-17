import React, { useState } from 'react';
import { AddDeviceModal } from './AddDeviceModal';
import { EditDeviceModal } from './EditDeviceModal';
import { Device } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Filter, SearchIcon } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface DataTableProps {
  data: Device[];
  onAddDevice: (newDevice: Device) => void;
  onUpdateDevice: (updatedDevice: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  onAddDevice, 
  onUpdateDevice, 
  onDeleteDevice 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleAddNewClick = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDevice(null);
  };

  const filteredData = data.filter(device => {
    const matchesSearch = Object.values(device).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilter = filterStatus ? device.status === filterStatus : true;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Lengang': 'bg-green-800/30 text-green-400 border-green-600/50',
      'Ramai Lancar': 'bg-blue-800/30 text-blue-400 border-blue-600/50',
      'Ramai Padat': 'bg-yellow-800/30 text-yellow-400 border-yellow-600/50',
      'Padat Merayap': 'bg-orange-800/30 text-orange-400 border-orange-600/50',
      'Padat Tersendat': 'bg-red-800/30 text-red-400 border-red-600/50',
      'Macet Total': 'bg-red-900/30 text-red-500 border-red-700/50',
      'Tidak Aktif': 'bg-gray-800/30 text-gray-400 border-gray-600/50'
    };

    return (
      <Badge 
        variant="outline" 
        className={`
          ${statusColors[status as keyof typeof statusColors]} 
          uppercase tracking-wider font-medium px-2 py-1 rounded-md
        `}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Device Management</span>
          <Button 
            onClick={handleAddNewClick} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Device
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-600"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem 
                      onClick={() => setFilterStatus(null)}
                      className="text-white hover:bg-gray-700"
                    >
                      Clear Filter
                    </DropdownMenuItem>
                    {['Lancar', 'Ramai Lancar', 'Padat', 'Padat Merayap', 'Macet', 'Macet Total', 'Tidak Aktif'].map(status => (
                      <DropdownMenuItem 
                        key={status} 
                        onClick={() => setFilterStatus(status)}
                        className="text-white hover:bg-gray-700"
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-700 text-white">
                <p>Filter by Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="hover:bg-gray-800/70">
                <TableHead className="text-gray-400 w-[50px]">No.</TableHead>
                <TableHead className="text-gray-400">Location</TableHead>
                <TableHead className="text-gray-400">Device ID</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Detection</TableHead>
                <TableHead className="text-gray-400">Last Update</TableHead>
                <TableHead className="text-right text-gray-400 w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.deviceid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="
                    hover:bg-gray-800/50 
                    border-b border-gray-800 
                    last:border-b-0 
                    transition-colors
                  "
                >
                  <TableCell className="text-white/70">{index + 1}</TableCell>
                  <TableCell className="text-white/80 font-medium">{item.location}</TableCell>
                  <TableCell className="text-white/80">{item.deviceid}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.is_detection_enabled ? 'default' : 'secondary'}
                      className={`
                        uppercase tracking-wider font-medium 
                        ${item.is_detection_enabled 
                          ? 'bg-green-800/30 text-green-400 border-green-600/50' 
                          : 'bg-gray-800/30 text-gray-400 border-gray-600/50'
                        }
                      `}
                    >
                      {item.is_detection_enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {new Date(item.last_update_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditClick(item)}
                            className="
                              bg-gray-800/50 border-gray-700 
                              text-white hover:bg-gray-700
                            "
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-700 text-white">
                          Edit Device
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => onDeleteDevice(item.deviceid)}
                            className="
                              bg-red-800/50 border-red-700 
                              text-red-400 hover:bg-red-700/70
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-red-700 text-white">
                          Delete Device
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-900/50">
              No devices found
            </div>
          )}
        </div>
      </CardContent>

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
          apiBaseUrl={`${API_BASE_URL}`}
        />
      )}
    </Card>
  );
};

export default DataTable;