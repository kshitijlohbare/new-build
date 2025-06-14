import { NavLink } from "react-router-dom";

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navItems = [
    { name: "home", path: "/", selectedIcon: "/src/assets/icons/Home_selected.svg", nonSelectedIcon: "/src/assets/icons/Home_nonselected.svg" },
    { name: "wellbeing practices", path: "/practices", selectedIcon: "/src/assets/icons/Practice_selected.svg", nonSelectedIcon: "/src/assets/icons/Practice_nonselected.svg" },
    { name: "focus timer", path: "/focus-timer", selectedIcon: "/src/assets/icons/Focus_selected.svg", nonSelectedIcon: "/src/assets/icons/Focus_nonselected.svg" },
    { name: "meditation", path: "/meditation", selectedIcon: "/src/assets/icons/Meditation_selected.svg", nonSelectedIcon: "/src/assets/icons/Meditation_nonselected.svg" },
    { name: "fitness groups", path: "/fitness-groups", selectedIcon: "/src/assets/icons/Learn_selected.svg", nonSelectedIcon: "/src/assets/icons/Learn_nonselected.svg" },
    { name: "learn", path: "/learn", selectedIcon: "/src/assets/icons/Learn_selected.svg", nonSelectedIcon: "/src/assets/icons/Learn_nonselected.svg" },
    { name: "therapy sessions", path: "/therapist-listing", selectedIcon: "/src/assets/icons/Therapist_selected.svg", nonSelectedIcon: "/src/assets/icons/Therapist_nonselected.svg" },
  ];

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="h-full py-3 sm:py-4 md:py-6 px-2 sm:px-3 flex flex-col items-center bg-[#F7FFFF] gap-1 sm:gap-2 md:gap-3 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={handleNavigate}
          className={({ isActive }) => 
            `w-full py-3 sm:py-2 px-3 sm:px-2 flex md:flex-col items-center md:text-center font-medium lowercase min-h-[48px] sm:min-h-[44px] md:min-h-auto transition-all touch-action-manipulation active:scale-95 ${
              isActive 
                ? 'text-black border border-[#04C4D5] rounded-[10px] bg-white shadow-[1px_2px_4px_rgba(4,196,213,0.5)]' 
                : 'text-[#148BAF] hover:text-[#0A7A9A] hover:bg-white/50 rounded-[8px]'
            }`
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
      ))}
    </nav>
  );
};

export default Sidebar;