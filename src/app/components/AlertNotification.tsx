import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Device } from '../types';
import { AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';

interface StatusAlert {
  deviceId: string;
  location: string;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
}

interface AlertNotificationProps {
  alerts: StatusAlert[];
  onDismiss: (alertId: string) => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ alerts, onDismiss }) => {
  // Debug log ketika alerts berubah
  useEffect(() => {
    console.log('AlertNotification rendered with alerts:', alerts);
  }, [alerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-96">
      {alerts.map((alert) => (
        <Alert 
          key={`${alert.deviceId}-${alert.timestamp.getTime()}`}
          className="bg-white border-red-500 animate-slideIn"
          variant="destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Status Change Detected
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">
              Device at <span className="font-semibold">{alert.location}</span> changed status:
            </p>
            <p className="text-sm mt-1">
              From <span className="font-semibold">{alert.oldStatus}</span> to{' '}
              <span className="font-semibold">{alert.newStatus}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {alert.timestamp.toLocaleTimeString()}
            </p>
          </AlertDescription>
          <button
            onClick={() => onDismiss(alert.deviceId)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </Alert>
      ))}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AlertNotification;