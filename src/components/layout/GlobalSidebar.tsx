import React from 'react';
import { createPortal } from 'react-dom';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from './Sidebar';

const GlobalSidebar: React.FC = () => {
  const { sidebarVisible, toggleSidebar } = useSidebar();

  if (!sidebarVisible) {
    return null;
  }

  return createPortal(
    <>
      {/* Sidebar overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 sidebar-overlay"
        onClick={toggleSidebar}
        style={{ 
          zIndex: 99998,
          touchAction: 'manipulation'
        }}
      />
      
      {/* Sidebar */}
      <aside 
        className="fixed inset-y-0 left-0 w-[220px] sm:w-[200px] sidebar-container sidebar-blur"
        style={{ zIndex: 99999 }}
      >
        <Sidebar onNavigate={toggleSidebar} />
      </aside>
    </>,
    document.body
  );
};

export default GlobalSidebar;
