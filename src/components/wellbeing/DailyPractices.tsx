import { useState } from 'react';
import { usePractices } from '../../context/PracticeContext'; // Remove unused Practice import
import PracticeDetailPopup from './PracticeDetailPopup';

// SVG ICONS
const icons = {
  shower: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#89EEFF" />
      <g><circle cx="15" cy="10" r="5" fill="#007A99" /><rect x="12.5" y="15" width="5" height="10" rx="2.5" fill="#007A99" /></g>
    </svg>
  ),
  sun: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="8" fill="#FFD600" />
      <g stroke="#007A99" strokeWidth="2">
        <line x1="15" y1="2" x2="15" y2="7" />
        <line x1="15" y1="23" x2="15" y2="28" />
        <line x1="3" y1="15" x2="8" y2="15" />
        <line x1="23" y1="15" x2="28" y2="15" />
      </g>
    </svg>
  ),
  moleskine: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="20" height="20" rx="3" fill="#007A99" />
      <rect x="8" y="8" width="14" height="14" rx="2" fill="white" />
    </svg>
  ),
  smelling: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="20" rx="7" ry="4" fill="#007A99" />
      <path d="M15 10 Q17 15 15 20 Q13 15 15 10" stroke="#007A99" strokeWidth="2" fill="none" />
    </svg>
  ),
  trophy: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 2H15V6C15 8.21 13.21 10 11 10H9C6.79 10 5 8.21 5 6V2Z" fill="#FFC700" stroke="#FF8A00" strokeWidth="1.5"/>
      <path d="M7 10V12C7 13.1 7.9 14 9 14H11C12.1 14 13 13.1 13 12V10" stroke="#FF8A00" strokeWidth="1.5"/>
      <rect x="9" y="14" width="2" height="4" fill="#FFC700" stroke="#FF8A00" strokeWidth="1.5"/>
      <rect x="6" y="18" width="8" height="1" rx="0.5" fill="#FFC700" stroke="#FF8A00" strokeWidth="1.5"/>
      <path d="M15 4H17C17.6 4 18 4.4 18 5C18 6.7 16.7 8 15 8" stroke="#FF8A00" strokeWidth="1.5"/>
      <path d="M5 4H3C2.4 4 2 4.4 2 5C2 6.7 3.3 8 5 8" stroke="#FF8A00" strokeWidth="1.5"/>
    </svg>
  ),
  flame: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C10 2 14 5 14 9C14 10.5 13.2 11.8 12 12.5C12 12.5 12 11.5 11 11C11 13.5 9 14 7.5 15C7.9 14.3 8 13.6 8 13C6.5 14.5 6 16.5 6 16.5C4.2 15.2 3 13 3 10.5C3 6.8 6 4 10 2Z" fill="#FF8A00" stroke="#FF8A00" strokeWidth="0.5"/>
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L12.5 6.5L18.5 7L14 11L15.5 17L10 14L4.5 17L6 11L1.5 7L7.5 6.5L10 1Z" fill="#FFC700" stroke="#FF8A00" strokeWidth="1"/>
    </svg>
  ),
  // Add default icon for any missing icons
  default: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#89EEFF" />
      <circle cx="15" cy="15" r="8" fill="#007A99" />
    </svg>
  ),
  sparkles: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L17 12L24 15L17 18L15 25L13 18L6 15L13 12L15 5Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
      <path d="M8 8L9 12L13 13L9 14L8 18L7 14L3 13L7 12L8 8Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
      <path d="M22 8L23 12L27 13L23 14L22 18L21 14L17 13L21 12L22 8Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    </svg>
  ),
};

type IconType = keyof typeof icons;

const FILTERS = [
  { label: "feeling stressed", active: false },
  { label: "i am anxious", active: false },
  { label: "finding hard to focus", active: true },
  { label: "guided practice", active: false },
  { label: "guided practice", active: false },
  { label: "guided practice", active: false },
];

const DailyPractices = () => {
  // Consume context - remove unused getPracticeById
  const { practices, userProgress, togglePracticeCompletion, isLoading } = usePractices();

  // Local state for UI interactions
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null); // State for popup

  const handleToggleCompletion = (id: number) => {
    togglePracticeCompletion(id); // Use context function
  };

  const handleGuidedPracticeClick = (id: number) => {
    setSelectedPracticeId(id); // Open the popup
  };

  const handleClosePopup = () => {
    setSelectedPracticeId(null); // Close the popup
  };

  if (isLoading) {
    return <div>Loading practices...</div>; // Add a loading state
  }

  return (
    <div className="w-full flex flex-col gap-6 p-3 bg-transparent">
      {/* Progress and Gamification Summary */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 p-4 bg-white rounded-[10px] border border-[#49DADD] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[rgba(83,252,255,0.10)] rounded-full">
            {icons.trophy}
          </div>
          <div className="flex flex-col">
            <span className="font-happy-monkey text-[#148BAF] text-lg lowercase">Level {userProgress.level}</span>
            <div className="w-full max-w-[200px] bg-[#E6F7F9] rounded-full h-2 overflow-hidden relative">
              {/* Progress bar */}
              <div 
                className="bg-[#148BAF] h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(userProgress.totalPoints / userProgress.nextLevelPoints) * 100}%` }}
              ></div>
              
              {/* Percentage text in the center of the bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#148BAF] text-[10px] font-happy-monkey lowercase" style={{
                  textShadow: `
                    -0.5px -0.5px 0 #E6F7F9,
                    0.5px -0.5px 0 #E6F7F9,
                    -0.5px 0.5px 0 #E6F7F9,
                    0.5px 0.5px 0 #E6F7F9
                  `,
                  fontWeight: 'bold'
                }}>
                  {Math.round((userProgress.totalPoints / userProgress.nextLevelPoints) * 100)}%
                </span>
              </div>
            </div>
            <span className="font-happy-monkey text-[#148BAF] text-xs lowercase">{userProgress.totalPoints}/{userProgress.nextLevelPoints} pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-2 bg-[rgba(255,195,0,0.10)] rounded-[8px] border border-[#FFC700]">
            {icons.flame}
            <span className="font-happy-monkey text-[#FF8A00] text-base lowercase">{userProgress.streakDays} day streak</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-[rgba(83,252,255,0.10)] rounded-[8px] border border-[#49DADD]">
            {icons.star}
            <span className="font-happy-monkey text-[#148BAF] text-base lowercase">{userProgress.totalPoints} points</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 w-full">
        {FILTERS.map((filter, idx) => (
          <div
            key={idx}
            className={`flex-1 min-w-[120px] px-4 py-2 rounded-[10px] font-happy-monkey text-base lowercase text-center border-[1px] border-[#49DADD] ${
              filter.active
                ? 'bg-[#148BAF] text-white'
                : 'bg-white text-[#04C4D5]'
            }`}
          >
            {filter.label}
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {practices.map((practice) => {
          // Handle case where icon might not exist
          const iconKey = (practice.icon as IconType) || 'default';
          const icon = icons[iconKey] || icons.default;

          return (
            <div
              key={practice.id}
              className="w-full p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col gap-[20px] h-auto"
            >
              {/* Card Content */}
              <div className="flex flex-col gap-[10px] flex-grow">
                {/* Header Section */}
                <div className="w-full p-[4px] rounded-[8px] flex flex-col items-center">
                  <div className="w-full flex items-center gap-[10px]">
                    <div>{icon}</div>
                    <div className="flex-1 text-center text-[#148BAF] font-happy-monkey text-sm lowercase">
                      {practice.name}
                    </div>
                  </div>
                  <div className="w-full text-black font-happy-monkey text-base text-center lowercase">
                    {practice.description.split('.')[0]} {/* Use first sentence as subtitle */}
                  </div>
                </div>
                
                {/* Description Section */}
                <div className="flex flex-col gap-[10px]">
                  <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase line-clamp-2">
                    {practice.description}
                  </div>
                  <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">
                    <span>Key benefits<br/></span>
                    <span className={selectedPracticeId === practice.id ? "" : "line-clamp-2"}>
                      {practice.benefits.map((benefit, idx) => (
                        <span key={idx}>{benefit}<br/></span>
                      ))}
                    </span>
                    <button 
                      className="text-xs text-black hover:underline lowercase mt-1"
                      onClick={() => setSelectedPracticeId(selectedPracticeId === practice.id ? null : practice.id)}
                    >
                      {selectedPracticeId === practice.id ? "see less" : "see more"}
                    </button>
                  </div>
                  
                  {/* Gamification indicators */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {practice.streak && practice.streak > 0 && (
                      <div className="px-[8px] py-[2px] bg-[#FFEDCC] border border-[#FFC700] rounded-[4px] flex items-center gap-1">
                        <span className="text-[#FF8A00] font-happy-monkey text-xs lowercase">{practice.streak}🔥 streak</span>
                      </div>
                    )}
                    
                    {practice.points && (
                      <div className="px-[8px] py-[2px] bg-[#E6F7F9] border border-[#04C4D5] rounded-[4px] flex items-center gap-1">
                        <span className="text-[#148BAF] font-happy-monkey text-xs lowercase">+{practice.points}pts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Button Section */}
              <div className="w-full flex flex-col gap-[10px]">
                {/* New "add to your practices" button */}
                <button
                  onClick={() => handleToggleCompletion(practice.id)} 
                  className="w-full p-[8px] bg-white border border-[#49DADD] rounded-[8px] flex justify-center items-center cursor-pointer text-[#148BAF] hover:bg-[#E6F7F9] transition-colors"
                >
                  <span className="text-center font-happy-monkey text-base lowercase">
                    add to your practices
                  </span>
                </button>

                <button 
                  onClick={() => handleGuidedPracticeClick(practice.id)}
                  className="px-3 py-1 bg-white border border-[#04C4D5] rounded-[4px] text-[#148BAF] font-happy-monkey text-sm lowercase hover:bg-[#E6F7F9] transition-colors whitespace-nowrap"
                >
                  Guided Practice
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Empty cards for consistent grid spacing - fixed syntax */}
        <div className="hidden md:flex flex-col bg-transparent rounded-[10px] p-3"></div>
        <div className="hidden lg:flex flex-col bg-transparent rounded-[10px] p-3"></div>
        <div className="hidden xl:flex flex-col bg-transparent rounded-[10px] p-3"></div>
      </div>

      {/* Render the popup when a practice is selected */}
      {selectedPracticeId && (
        <PracticeDetailPopup
          practiceId={selectedPracticeId}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default DailyPractices;