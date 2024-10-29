import React from 'react';

interface StatusCardProps {
  color: string;
  title: string;
  description: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ color, title, description }) => {
  const bgColorClass = {
    "blue": "bg-[#0288D1]",
    "orange": "bg-orange-500",
    "green": "bg-green-500",
    "red": "bg-[#D32F2F]"
    // Tambahkan mapping warna lainnya sesuai kebutuhan
  }[color] || 'bg-gray-500'; // Default jika warna tidak sesuai

  return (
    <div className={`${bgColorClass} p-4 rounded-lg text-white shadow-2xl`}>
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default StatusCard;