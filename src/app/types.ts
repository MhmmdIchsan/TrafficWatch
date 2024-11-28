// types.ts
export interface Device {
    last_update_time: string;
    deviceid: string;
    longitude: string;
    status: string;
    location: string;
    latitude: string;
    avg_device_count: number;
    is_detection_enabled: boolean; // Menambahkan tipe is_detection_enabled
    sampling_interval: number; // Menambahkan tipe sampling_interval
  }

  export interface Notification {
    id: string;
    type: 'warning' | 'alert' | 'info';
    message: string;
    timestamp: string;
  }