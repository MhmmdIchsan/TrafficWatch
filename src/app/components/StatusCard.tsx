import React from 'react';

interface StatusCardProps {
  color: string;
  title: string;
  description: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ color, title, description }) => {
  return (
    <div className={`bg-[${color}] p-4 rounded-lg text-white`}>
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default StatusCard;