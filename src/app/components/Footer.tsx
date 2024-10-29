import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-lg mt-auto relative z-10">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2024 Sistem Monitoring Lalu Lintas. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    );
  }
}