import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutWithNavBarProps {
  children: React.ReactNode;
}

const LayoutWithNavBar: React.FC<LayoutWithNavBarProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FCFD]">
      {/* Navigation */}
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-happy-monkey text-[#06C4D5] lowercase">
            Caktus Coco
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-[#208EB1] transition">Log In</Link>
            <Link to="/register" className="bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white px-5 py-2 rounded-full text-sm shadow-sm hover:shadow-md transition">Sign Up</Link>
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2023 Caktus Coco. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutWithNavBar;
