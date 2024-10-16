import React from 'react';
import Notification from './Notification';

const NotificationCard: React.FC = () => {
  return (
    // make blank white card
    <div className="bg-white rounded-lg my-5 w-1/3 shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-black font-semibold">Notification Card</h2>
      </div>
      <div className='space-y-2'>
      <Notification title="Notification Title" description="Notification Description" color="red" />
        <Notification title="Notification Title" description="Notification Description" color="green" />
        <Notification title="Notification Title" description="Notification Description" color="blue" />
        <Notification title="Notification Title" description="Notification Description" color="orange" />
      </div>
    </div>
  );
}

export default NotificationCard;