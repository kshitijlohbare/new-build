import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePractices } from '@/context/PracticeContext';
import { useSidebar } from '@/context/SidebarContext';
import streakIcon from '@/assets/icons/Streak_lesser_than_10_title.svg';
import badgeIcon from '@/assets/icons/badge_title.svg';
import starIcon from '@/assets/icons/Star_title.svg';
import hamburgerIcon from '@/assets/icons/hamburger1.svg';
import logoIcon from '@/assets/icons/Vector.svg';

const HeaderBar: React.FC = () => {
  const location = useLocation();
  const { userProgress } = usePractices();
  const { toggleSidebar } = useSidebar();
  
  // Check if we're on the homepage - if yes, we shouldn't show the header
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  return (
   <div id="main-header-bar" className="flex flex-row items-center p-[10px] gap-[10px] w-full h-[52px] bg-gradient-to-b from-[#06C4D5] to-[#208EB1] sticky top-0 z-10 pointer-events-auto flex-shrink-0">
      {/* Menu Button */}
      <button 
        type="button"
        className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] cursor-pointer relative z-10 pointer-events-auto active:bg-white/30 p-1"
        onClick={toggleSidebar}
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        aria-label="Toggle navigation menu"
      >
        <img 
          src={hamburgerIcon} 
          alt="Menu"
          className="w-[24px] h-[24px]"
        />
      </button>
      
      {/* Logo */}
      <div className="flex flex-row items-center flex-grow">
        <Link to="/">
          <img 
            src={logoIcon} 
            alt="CAKTUS COCO"
            className="h-[20px]"
          />
        </Link>
      </div>
      
      {/* Stats Icons */}
      <div className="flex flex-row items-center gap-[12px]">
        {/* Level Badge */}
        <div className="relative flex items-center justify-center">
          <img 
            src={streakIcon} 
            alt="Level" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.level || 3}
          </span>
        </div>
        
        {/* Streak Badge */}
        <div className="relative flex items-center justify-center">
          <img 
            src={badgeIcon} 
            alt="Streak" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.streakDays || 2}
          </span>
        </div>
        
        {/* Star Badge */}
        <div className="relative flex items-center justify-center">
          <img 
            src={starIcon} 
            alt="Points" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.totalPoints || 88}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
