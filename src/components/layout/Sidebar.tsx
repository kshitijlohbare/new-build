import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "wellbeing", path: "/", icon: "✨" },
    { name: "practices", path: "/practices", icon: "🌿" },
    { name: "focus timer", path: "/focus-timer", icon: "⏱" },
    { name: "meditation", path: "/meditation", icon: "🧘" },
    { name: "learn", path: "/learn", icon: "📚" },
    { name: "community", path: "/community", icon: "👥" },
    { name: "therapy sessions", path: "/therapist-listing", icon: "💬" },
  ];

  return (
    <nav className="h-full py-6 flex flex-col items-center">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `w-full py-3 px-2 flex flex-col items-center text-center font-happy-monkey lowercase ${
              isActive 
                ? 'text-[#148BAF] border-l-4 border-[#148BAF]' 
                : 'text-gray-500 hover:text-[#148BAF]'
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs mt-1 whitespace-pre-wrap">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;