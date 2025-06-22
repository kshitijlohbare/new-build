import React from 'react';
import { Link } from 'react-router-dom';
import { usePractices } from '@/context/PracticeContext';
import { useSidebar } from '@/context/SidebarContext';
import streakIcon from '@/assets/icons/Streak_lesser_than_10_title.svg';
import badgeIcon from '@/assets/icons/badge_title.svg';
import starIcon from '@/assets/icons/Star_title.svg';
import hamburgerIcon from '@/assets/icons/hamburger.svg';
import logoIcon from '@/assets/icons/CAKTUS COCO.svg';

const HomeHeader: React.FC = () => {
  const { userProgress } = usePractices();
  const { toggleSidebar, sidebarVisible } = useSidebar();
  
  // Debug log to track sidebar state
  console.log("HomeHeader rendering, sidebarVisible:", sidebarVisible);
  
  return (
    <header 
      id="home-header" 
      data-testid="home-header"
      className="flex flex-row items-center p-[10px] gap-[10px] w-full h-[52px] bg-[#FCDF4D] sticky top-0 z-10 pointer-events-auto flex-shrink-0"
      aria-label="Application header with navigation and user stats"
    >
      {/* Menu Button */}
      <button 
        type="button"
        id="header-menu-btn"
        data-testid="header-menu-button"
        className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] cursor-pointer p-1 hover:bg-black/5 active:bg-black/10 pointer-events-auto relative z-10 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Menu button clicked');
          toggleSidebar();
        }}
        aria-label="Toggle sidebar menu"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      >
        <img 
          src={hamburgerIcon} 
          alt="Menu"
          className="w-[24px] h-[24px] pointer-events-none"
        />
      </button>
      
      {/* Logo */}
      <div 
        id="header-logo-container"
        data-testid="header-logo-container" 
        className="flex flex-row items-center flex-grow p-0"
      >
        <Link to="/" aria-label="Go to homepage">
          <img 
            id="header-logo"
            data-testid="header-logo"
            src={logoIcon} 
            alt="CAKTUS COCO"
            className="h-[20px]"
          />
        </Link>
      </div>
      
      {/* Stats Icons */}
      <div 
        id="user-stats-container"
        data-testid="user-stats-container" 
        className="flex flex-row items-center gap-[12px]"
        aria-label="User statistics"
      >
        {/* Level Badge */}
        <div 
          id="user-level-badge"
          data-testid="user-level-badge"
          className="relative flex items-center justify-center"
          aria-label={`User level: ${userProgress?.level || 3}`}
        >
          <img 
            src={streakIcon} 
            alt="Level icon" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.level || 3}
          </span>
        </div>
        
        {/* Streak Badge */}
        <div 
          id="user-streak-badge"
          data-testid="user-streak-badge"
          className="relative flex items-center justify-center"
          aria-label={`Current streak: ${userProgress?.streakDays || 2} days`}
        >
          <img 
            src={badgeIcon} 
            alt="Streak icon" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.streakDays || 2}
          </span>
        </div>
        
        {/* Star Badge */}
        <div 
          id="user-points-badge"
          data-testid="user-points-badge"
          className="relative flex items-center justify-center"
          aria-label={`Total points: ${userProgress?.totalPoints || 88}`}
        >
          <img 
            src={starIcon} 
            alt="Points icon" 
            className="w-[24px] h-[24px]"
          />
          <span className="absolute font-['Happy_Monkey'] font-normal text-[16px] flex items-center justify-center text-white">
            {userProgress?.totalPoints || 88}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
