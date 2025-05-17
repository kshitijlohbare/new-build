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
    { name: "learn", path: "/learn", selectedIcon: "/src/assets/icons/Learn_selected.svg", nonSelectedIcon: "/src/assets/icons/Learn_nonselected.svg" },
    { name: "community", path: "/community", selectedIcon: "/src/assets/icons/Community_selected.svg", nonSelectedIcon: "/src/assets/icons/Community_nonselected.svg" },
    { name: "therapy sessions", path: "/therapist-listing", selectedIcon: "/src/assets/icons/Therapist_selected.svg", nonSelectedIcon: "/src/assets/icons/Therapist_nonselected.svg" },
  ];

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="h-full py-6 px-3 flex flex-col items-center bg-[#F7FFFF] gap-2 md:gap-3 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={handleNavigate}
          className={({ isActive }) => 
            `w-full py-2 px-2 flex md:flex-col items-center md:text-center font-medium lowercase ${
              isActive 
                ? 'text-black border border-[#04C4D5] rounded-[10px] bg-white shadow-[1px_2px_4px_rgba(4,196,213,0.5)]' 
                : 'text-[#148BAF] hover:text-[#0A7A9A]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img 
                src={isActive ? item.selectedIcon : item.nonSelectedIcon} 
                alt={item.name}
                className="w-6 h-6 md:mb-1 mr-3 md:mr-0"
              />
              <span className={`text-xs mt-0 md:mt-1 whitespace-pre-wrap ${isActive ? 'text-black' : 'text-[#148BAF]'}`}>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;