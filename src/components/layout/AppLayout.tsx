import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import HeaderBar from "./HeaderBar"; // Import our new HeaderBar component
import { useSidebar } from "@/context/SidebarContext";
import GlobalSidebar from "./GlobalSidebar";

const AppLayout = () => {
  const { toggleSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-screen w-full bg-white">
      {/* Global sidebar that renders at the top level */}
      <GlobalSidebar />

      {/* Main container with header and content stacked */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* HeaderBar - fixed at top */}
        <HeaderBar />
        
        {/* Main content area that scrolls under the header */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar - only show when not using mobile */}
          <aside 
            ref={sidebarRef}
            className="md:w-[110px] md:block flex-shrink-0 hidden"
          >
            <Sidebar onNavigate={toggleSidebar} />
          </aside>

          {/* Main content that scrolls */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;