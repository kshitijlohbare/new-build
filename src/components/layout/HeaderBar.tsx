import React from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Star } from 'lucide-react';
import { usePractices } from '@/context/PracticeContext';

interface HeaderBarProps {
  toggleSidebar?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const { userProgress } = usePractices();
  
  // Check if we're on the homepage - if yes, we shouldn't show the header
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="flex flex-row items-center p-[10px] gap-[10px] w-full h-[52px] bg-gradient-to-b from-[#06C4D5] to-[#208EB1] backdrop-filter backdrop-blur-[2px]">
      {/* Menu Button with highest z-index */}
      <div 
        className="flex flex-col justify-center items-center p-[8px] gap-[2px] w-[36px] h-[32px] bg-white rounded-[8px] cursor-pointer z-50"
        onClick={toggleSidebar}
      >
        <div className="w-[20px] h-[4px] bg-[#148BAF] rounded-[1px] mb-2"></div>
        <div className="w-[20px] h-[4px] bg-[#148BAF] rounded-[1px] mb-2"></div>
        <div className="w-[20px] h-[4px] bg-[#148BAF] rounded-[1px]"></div>
      </div>
      
      {/* Logo */}
      <div className="flex flex-row items-center flex-grow">
        <span className="font-['Luckiest_Guy'] text-[24px] leading-[32px] flex items-end text-white">
          CAKTUS COCO
        </span>
      </div>
      
      {/* Stats Icons */}
      <div className="flex flex-row items-center gap-[10px]">
        {/* Level Badge */}
        <div className="relative flex items-center justify-center w-[22px] h-[24px]">
          <Shield className="w-[22px] h-[24px] text-white" />
          <span className="absolute w-[8px] h-[15px] left-[8px] top-[4.5px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-end text-white lowercase">
            {userProgress?.level || 3}
          </span>
        </div>
        
        {/* Streak Badge */}
        <div className="relative flex items-center justify-between isolate">
          <div className="relative w-[28.35px] h-[23.12px]">
            <div className="absolute left-0 right-0 top-[52.91%] bottom-0 bg-[#49DADD]"></div>
            <div className="absolute left-[24%] right-[16.68%] top-0 bottom-[34.13%] bg-white"></div>
          </div>
          <span className="absolute w-[8px] h-[15px] left-[12px] top-[4px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-end text-[#49DADD] lowercase z-10">
            {userProgress?.streakDays || 2}
          </span>
        </div>
        
        {/* Star Badge */}
        <div className="flex flex-row justify-center items-center">
          <div className="relative w-[22px] h-[22px]">
            <Star className="absolute w-[22px] h-[22px] fill-[#49DADD] text-[#49DADD]" />
            <span className="absolute w-[14px] h-[16px] left-[4px] top-[3px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-end lowercase text-white">
              {userProgress?.totalPoints || 88}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
