import React, { useState, useRef, useEffect } from 'react';
import { useAchievement } from '@/context/AchievementContext';
import { cn } from '@/lib/utils';

// Using the Achievement type directly from the context
// to avoid duplicate interface declarations

interface BadgeCarouselProps {
  className?: string;
}

export const BadgeCarousel: React.FC<BadgeCarouselProps> = ({ className }) => {
  const { getAllUserAchievements } = useAchievement();
  const achievements = getAllUserAchievements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll the carousel at intervals
  useEffect(() => {
    if (achievements.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [achievements.length, currentIndex]);
  
  if (achievements.length === 0) {
    return (
      <div className={cn("relative w-full bg-[rgba(83,252,255,0.10)] rounded-xl p-4 text-center", className)}>
        <p className="text-[#148BAF] font-happy-monkey">No badges unlocked yet! Complete practices to earn badges.</p>
      </div>
    );
  }
  
  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => 
      prev === 0 ? achievements.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => 
      prev === achievements.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const jumpToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-happy-monkey text-[#148BAF] lowercase">Your Achievements</h3>
        
        {achievements.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="bg-white hover:bg-[rgba(83,252,255,0.15)] border border-[#04C4D5] rounded-full p-1 text-[#148BAF] transition-all"
              aria-label="Previous achievement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="bg-white hover:bg-[rgba(83,252,255,0.15)] border border-[#04C4D5] rounded-full p-1 text-[#148BAF] transition-all"
              aria-label="Next achievement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={carouselRef}
        className="bg-[rgba(83,252,255,0.10)] rounded-xl p-4 transition-opacity duration-300"
        style={{ opacity: isAnimating ? 0.7 : 1 }}
      >
        <div className="flex flex-col items-center px-4 py-6">
          <div className="w-16 h-16 rounded-full bg-[rgba(83,252,255,0.20)] flex items-center justify-center mb-4">
            <span className="text-3xl">{achievements[currentIndex]?.icon || '🏆'}</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-happy-monkey text-[#04C4D5] mb-2">
              {achievements[currentIndex]?.name || 'Achievement'}
            </h3>
            <p className="text-base text-gray-600 mb-4">
              {achievements[currentIndex]?.description || 'Complete more practices to unlock achievements!'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Pagination dots */}
      {achievements.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {achievements.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToSlide(index)}
              aria-label={`Go to achievement ${index + 1}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-[#04C4D5] w-4" 
                  : "bg-[rgba(4,196,213,0.3)] hover:bg-[rgba(4,196,213,0.6)]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeCarousel;
