import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import HeaderBar from "./HeaderBar"; // Import our new HeaderBar component
import { useSidebar } from "@/context/SidebarContext";

const AppLayout = () => {
  const { sidebarVisible, toggleSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {/* Add the new HeaderBar component - it will hide itself on the homepage */}
      <HeaderBar />

      {/* content-body container - takes remaining height */}
      <div className="content-body flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Enhanced mobile-responsive sidebar */}
        <aside 
          ref={sidebarRef}
          className={`
            md:w-[110px] md:relative md:block flex-shrink-0 z-30
            ${sidebarVisible ? 'fixed inset-y-0 left-0 w-[220px] sm:w-[200px] z-30' : 'hidden'}
          `}
        >
          <Sidebar onNavigate={toggleSidebar} />
        </aside>

        {/* Enhanced main content area with improved mobile padding */}
        <main className="flex-1 overflow-y-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;