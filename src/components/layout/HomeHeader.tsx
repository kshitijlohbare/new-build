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
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="flex flex-row items-center p-[10px] gap-[10px] w-full h-[52px] bg-[#FCDF4D]">
      {/* Menu Button */}
      <div 
        className="flex items-center justify-center w-[24px] h-[24px] rounded-[8px] cursor-pointer"
        onClick={toggleSidebar}
      >
        <img 
          src={hamburgerIcon} 
          alt="Menu"
          className="w-[24px] h-[24px]"
        />
      </div>
      
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

export default HomeHeader;
