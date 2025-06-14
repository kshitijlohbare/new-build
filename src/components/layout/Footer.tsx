import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-8 px-4 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <span className="text-xl font-happy-monkey text-[#06C4D5] lowercase">Caktus Coco</span>
          <p className="text-sm text-gray-500 mt-1">©2023 All rights reserved</p>
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-gray-500">
          <Link to="/about" className="hover:text-[#208EB1] transition">About</Link>
          <Link to="/privacy" className="hover:text-[#208EB1] transition">Privacy</Link>
          <Link to="/terms" className="hover:text-[#208EB1] transition">Terms</Link>
          <Link to="/contact" className="hover:text-[#208EB1] transition">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
