import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onNavigate?: () => void;
}

// Simple practitioner icon SVG component for the sidebar
// Simple practitioner icon SVG component for the sidebar
const PractitionerIcon = ({ color = "currentColor", className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}
    strokeWidth="1.5"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { signOut } = useAuth();
  
  const navItems = [
    { name: "home", path: "/", selectedIcon: "/src/assets/icons/Home_selected.svg", nonSelectedIcon: "/src/assets/icons/Home_nonselected.svg" },
    { name: "wellbeing practices", path: "/practices", selectedIcon: "/src/assets/icons/Practice_selected.svg", nonSelectedIcon: "/src/assets/icons/Practice_nonselected.svg" },
    { name: "focus timer", path: "/focus-timer", selectedIcon: "/src/assets/icons/Focus_selected.svg", nonSelectedIcon: "/src/assets/icons/Focus_nonselected.svg" },
    { name: "fitness groups", path: "/fitness-groups", selectedIcon: "/src/assets/icons/Learn_selected.svg", nonSelectedIcon: "/src/assets/icons/Learn_nonselected.svg" },
    { name: "learn", path: "/learn", selectedIcon: "/src/assets/icons/Learn_selected.svg", nonSelectedIcon: "/src/assets/icons/Learn_nonselected.svg" },
    { name: "therapy sessions", path: "/therapist-listing", selectedIcon: "/src/assets/icons/Therapist_selected.svg", nonSelectedIcon: "/src/assets/icons/Therapist_nonselected.svg" },
    { name: "my profile", path: "/profile", selectedIcon: "/src/assets/icons/Profile black.svg", nonSelectedIcon: "/src/assets/icons/Profile.svg" },
  ];

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // Add divider before the profile item
  const renderNavItem = (item: typeof navItems[0], index: number) => {
    const isProfileItem = index === navItems.length - 1;
    
    return (
      <React.Fragment key={item.path}>
        {isProfileItem && (
          <div className="w-full my-2 border-t border-[#04C4D5]/20" aria-hidden="true"></div>
        )}
        <NavLink
          to={item.path}
          onClick={handleNavigate}
          className={({ isActive }) => 
            `w-full py-3 sm:py-2 px-3 sm:px-2 flex md:flex-col items-center md:text-center font-medium lowercase min-h-[48px] sm:min-h-[44px] md:min-h-auto transition-all touch-action-manipulation active:scale-95 ${
              isActive 
                ? 'text-black border border-[#04C4D5] rounded-[10px] bg-white shadow-[1px_2px_4px_rgba(4,196,213,0.5)]' 
                : 'text-[#148BAF] hover:text-[#0A7A9A] hover:bg-white/50 rounded-[8px]'
            } ${isProfileItem ? 'mt-auto border border-[#04C4D5]/30' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <img 
                src={isActive ? item.selectedIcon : item.nonSelectedIcon} 
                alt={item.name}
                className="w-5 h-5 sm:w-6 sm:h-6 md:mb-1 mr-3 md:mr-0 flex-shrink-0"
              />
              <span className={`text-xs sm:text-xs mt-0 md:mt-1 whitespace-pre-wrap leading-tight ${isActive ? 'text-black' : 'text-[#148BAF]'}`}>{item.name}</span>
            </>
          )}
        </NavLink>
      </React.Fragment>
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Close sidebar if needed
      if (onNavigate) {
        onNavigate();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav 
      className="h-full py-3 sm:py-4 md:py-6 px-2 sm:px-3 flex flex-col items-center gap-1 sm:gap-2 md:gap-3 overflow-y-auto relative"
      style={{ zIndex: 99999 }}
    >
      {navItems.map(renderNavItem)}
      
      {/* Become a Practitioner CTA */}
      <div className="w-full mt-2 border-t border-[#04C4D5]/20" aria-hidden="true"></div>
      <NavLink
        to="/practitioner-onboarding"
        onClick={handleNavigate}
        className={({ isActive }) =>
          `w-full py-3 sm:py-2 px-3 sm:px-2 flex md:flex-col items-center md:text-center font-medium lowercase min-h-[48px] sm:min-h-[44px] md:min-h-auto transition-all touch-action-manipulation active:scale-95 ${
            isActive
              ? 'text-black border border-[#04C4D5] rounded-[10px] bg-white shadow-[1px_2px_4px_rgba(4,196,213,0.5)]'
              : 'text-[#04C4D5] hover:text-[#0495A2] hover:bg-white/50 rounded-[8px] border border-[#04C4D5]/30'
          } mt-2`
        }
      >
        {({ isActive }) => (
          <>
            <PractitionerIcon 
              color={isActive ? "black" : "#04C4D5"} 
              className="w-5 h-5 sm:w-6 sm:h-6 md:mb-1 mr-3 md:mr-0 flex-shrink-0" 
            />
            <span className={`text-xs sm:text-xs mt-0 md:mt-1 whitespace-pre-wrap leading-tight ${isActive ? 'text-black' : 'text-[#04C4D5]'}`}>
              become a practitioner
            </span>
          </>
        )}
      </NavLink>
      
      {/* Logout button */}
      <div className="w-full mt-2 border-t border-[#04C4D5]/20" aria-hidden="true"></div>
      <button
        onClick={handleLogout}
        className="w-full py-3 sm:py-2 px-3 sm:px-2 flex md:flex-col items-center md:text-center font-medium lowercase min-h-[48px] sm:min-h-[44px] md:min-h-auto transition-all touch-action-manipulation active:scale-95 text-red-500 hover:text-red-600 hover:bg-white/50 rounded-[8px] border border-red-300/30 mt-2"
      >
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 md:mb-1 mr-3 md:mr-0 flex-shrink-0"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-xs sm:text-xs mt-0 md:mt-1 whitespace-pre-wrap leading-tight">log out</span>
      </button>
    </nav>
  );
};

export default Sidebar;