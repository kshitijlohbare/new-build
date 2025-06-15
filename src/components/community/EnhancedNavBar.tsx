import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import NewsFeedIcon from '../../assets/icons/News feed.svg';
import NewsFeedIconActive from '../../assets/icons/News feed-Black.svg';
import CommunityIcon from '../../assets/icons/Community.svg';
import CommunityIconActive from '../../assets/icons/Community -black.svg';
import ProfileIcon from '../../assets/icons/Profile.svg';
import ProfileIconActive from '../../assets/icons/Profile black.svg';

type CommunityTopNavBarProps = {
  activeView: 'newsfeed' | 'community' | 'profile';
  onViewChange: (view: 'newsfeed' | 'community' | 'profile') => void;
};

const EnhancedNavBar: React.FC<CommunityTopNavBarProps> = ({ activeView, onViewChange }) => {
  // Animation for text appearing
  const textVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Refs for each tab
  const newsfeedRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    let ref: React.RefObject<HTMLDivElement>;
    if (activeView === 'newsfeed') ref = newsfeedRef;
    else if (activeView === 'community') ref = communityRef;
    else ref = profileRef;
    if (ref.current) {
      const { offsetLeft, offsetWidth } = ref.current;
      setPillStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeView]);

  // Responsive pill update
  useLayoutEffect(() => {
    function updatePill() {
      let ref: React.RefObject<HTMLDivElement>;
      if (activeView === 'newsfeed') ref = newsfeedRef;
      else if (activeView === 'community') ref = communityRef;
      else ref = profileRef;
      if (ref.current) {
        const { offsetLeft, offsetWidth } = ref.current;
        setPillStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeView]);

  return (
    <div className="community-top-nav-wrapper w-full px-3 py-2">
      {/* Main container */}
      <div className="community-top-nav-bar w-full h-[52px] bg-[#F5F5F5] border border-white rounded-[100px] flex items-center justify-between px-1 relative overflow-hidden">
        {/* Background highlight pill that moves based on active state */}
        <motion.div
          animate={{ left: pillStyle.left, width: pillStyle.width }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 h-[44px] bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)] z-0"
        />
        
        {/* News Feed - Left section */}
        <motion.div
          ref={newsfeedRef}
          className="flex justify-center items-center h-full relative z-10 cursor-pointer"
          style={{ flexBasis: activeView === 'newsfeed' ? '100%' : '60%', flexGrow: 0, flexShrink: 1 }}
          animate={{ flexBasis: activeView === 'newsfeed' ? '100%' : '60%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={() => onViewChange('newsfeed')}
          whileHover={{ scale: activeView !== 'newsfeed' ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center w-full">
            <img
              src={activeView === 'newsfeed' ? NewsFeedIconActive : NewsFeedIcon}
              alt="News Feed"
              className="mr-2"
              width={24}
              height={24}
            />
            {activeView === 'newsfeed' && (
              <motion.span
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="font-['Happy_Monkey'] text-base text-black whitespace-nowrap"
              >
                share your feels
              </motion.span>
            )}
          </div>
        </motion.div>
        
        {/* Community - Center section */}
        <motion.div
          ref={communityRef}
          className="flex justify-center items-center h-full relative z-10 cursor-pointer"
          style={{ flexBasis: activeView === 'community' ? '100%' : '60%', flexGrow: 0, flexShrink: 1 }}
          animate={{ flexBasis: activeView === 'community' ? '100%' : '60%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={() => onViewChange('community')}
          whileHover={{ scale: activeView !== 'community' ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center w-full">
            <img
              src={activeView === 'community' ? CommunityIconActive : CommunityIcon}
              alt="Community"
              className="mr-2"
              width={24}
              height={24}
            />
            {activeView === 'community' && (
              <motion.span
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="font-['Happy_Monkey'] text-base text-black whitespace-nowrap"
              >
                find your tribe
              </motion.span>
            )}
          </div>
        </motion.div>
        
        {/* Profile - Right section */}
        <motion.div
          ref={profileRef}
          className="flex justify-center items-center h-full relative z-10 cursor-pointer"
          style={{ flexBasis: activeView === 'profile' ? '100%' : '60%', flexGrow: 0, flexShrink: 1 }}
          animate={{ flexBasis: activeView === 'profile' ? '100%' : '60%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={() => onViewChange('profile')}
          whileHover={{ scale: activeView !== 'profile' ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center w-full">
            <img
              src={activeView === 'profile' ? ProfileIconActive : ProfileIcon}
              alt="Profile"
              className="mr-2"
              width={24}
              height={24}
            />
            {activeView === 'profile' && (
              <motion.span
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="font-['Happy_Monkey'] text-base text-black whitespace-nowrap"
              >
                profile
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedNavBar;
