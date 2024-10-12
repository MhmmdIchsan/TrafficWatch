import React from 'react';

const DetectorStatus: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-indigo-900 font-bold mr-2">DP</div>
        <div>
          <p className="text-sm text-gray-600">Detector Active</p>
          <p className="text-4xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
};

export default DetectorStatus;