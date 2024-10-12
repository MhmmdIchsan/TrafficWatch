import React from 'react';

const Clock: React.FC = () => {
  return (
    <div className="bg-white p-2 rounded-lg shadow-md text-center">
      <p className="text-lg font-bold">00:00 WIB</p>
    </div>
  );
};

export default Clock;