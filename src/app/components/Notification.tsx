import React from 'react';

interface NotificationProps {
    title: string;
    description: string;
    color: 'blue' | 'orange' | 'red' | 'green';
}
    
const Notification: React.FC<NotificationProps> = ({ title, description, color }) => {
    const bgColorClass = {
      blue: 'bg-[#0288D1]',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      green: 'bg-green-500',
    }[color] || 'bg-gray-500';
  
    return (
      <div className={`p-4 rounded-lg text-white ${bgColorClass}`}>
        <h4 className="font-bold">{title}</h4>
        <p>{description}</p>
      </div>
    );
  };
  
  export default Notification;
  