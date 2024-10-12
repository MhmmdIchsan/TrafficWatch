import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-[#000000] bg-opacity-50 text-white">
      <div className="flex items-center ">
        <div className="ms-16 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-indigo-900 font-bold mr-2">TW</div>
        <h1 className="text-lg font-bold">TRAFFIC WATCH</h1>
      </div>
      <div className="flex items-center me-16">
        <span className="mr-4">Sign Up</span>
        <button className="bg-indigo-600 px-4 py-2 rounded-md">SIGN UP</button>
        <div className="ml-4 w-10 h-6 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;