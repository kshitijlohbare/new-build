import { useState } from "react";
import { usePractices, Practice } from "../../context/PracticeContext"; // Import Practice type
import PracticeDetailPopup from "./PracticeDetailPopup";

// Import the SVG icons
import StreakLesserThan10 from "../../assets/icons/Streak_lesser_than_10.svg";
import StreakGreaterThan10 from "../../assets/icons/Streak_greater_than_10.svg";
import StreakGreaterThan21 from "../../assets/icons/Streak_greater_than_21.svg";
import PointsIcon from "../../assets/icons/points.svg";
import BadgeTitleIcon from "../../assets/icons/badge_title.svg"; // Added
import StreakLesserThan10Title from "../../assets/icons/Streak_lesser_than_10_title.svg"; // Added
import StreakGreaterThan10Title from "../../assets/icons/Streak_greater_than_10_title.svg"; // Added
import StreakGreaterThan21Title from "../../assets/icons/Streak_greater_than_21_title.svg"; // Added

// Helper functions (can be moved to utils if used elsewhere)
const calculatePoints = (duration?: number): number => {
  // Simple calculation: 1 point per minute, minimum 1 point
  return Math.max(1, duration || 1);
};

// Helper function to determine which practice streak icon to use
const getPracticeStreakIcon = (streakCount: number = 0) => {
  if (streakCount >= 21) {
    return StreakGreaterThan21;
  } else if (streakCount >= 10) {
    return StreakGreaterThan10;
  } else {
    return StreakLesserThan10; // Default or < 10
  }
};

// Helper function to determine which title streak icon to use
const getTitleStreakIcon = (streakCount: number = 0) => {
  if (streakCount >= 21) {
    return StreakGreaterThan21Title;
  } else if (streakCount >= 10) {
    return StreakGreaterThan10Title;
  } else {
    return StreakLesserThan10Title; // Default or < 10
  }
};

// Helper function to calculate progress percentage
const calculateProgressPercentage = (currentPoints: number, nextLevelPoints: number): number => {
  if (nextLevelPoints === Infinity || nextLevelPoints <= 0) return 100; // Max level or invalid
  // Find the starting points of the current level to calculate progress within the level
  // This logic assumes levels start at 0, 50, 150, 300, 500
  let levelStartPoints = 0;
  if (currentPoints >= 500) levelStartPoints = 500; // Level 5
  else if (currentPoints >= 300) levelStartPoints = 300; // Level 4
  else if (currentPoints >= 150) levelStartPoints = 150; // Level 3
  else if (currentPoints >= 50) levelStartPoints = 50; // Level 2
  
  const pointsInLevel = currentPoints - levelStartPoints;
  const pointsNeededForLevel = nextLevelPoints - levelStartPoints;
  
  if (pointsNeededForLevel <= 0) return 100; // Avoid division by zero if already at next level threshold

  return Math.min(100, Math.max(0, (pointsInLevel / pointsNeededForLevel) * 100));
};

// Helper function to get points for a practice (uses fixed points if available)
const getPracticePoints = (practice: Practice): number => {
  return practice.points ?? calculatePoints(practice.duration);
};

const DailyPracticesSimple = () => {
  // Consume context
  const { practices, userProgress, togglePracticeCompletion, updatePracticeDuration, isLoading } = usePractices();

  // Local state for UI interactions
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null); // State for popup

  // Available durations for dropdown selection (in minutes) - Keep if duration change is needed
  const availableDurations = [1, 2, 3, 5, 10, 15, 20, 30, 45, 60, 90, 120];

  const handleDurationToggle = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDurationSelect = (id: number, duration: number) => {
    updatePracticeDuration(id, duration); // Use context function
    setOpenDropdownId(null);
  };

  const handleToggleCompletion = (id: number) => {
    togglePracticeCompletion(id); // Use context function
  };

  const handlePracticeNameClick = (id: number) => {
    setSelectedPracticeId(id); // Open the popup
  };

  const handleClosePopup = () => {
    setSelectedPracticeId(null); // Close the popup
  };

  // Get the selected practice details for the popup
  // const selectedPractice = selectedPracticeId ? getPracticeById(selectedPracticeId) : undefined; // Commented out as unused

  // Filter practices for display (e.g., show only a subset on the homepage)
  // Let's show the first 6 for this component, or adjust as needed
  const displayedPractices = practices.slice(0, 6);

  // Split practices into left and right columns
  const leftPractices = displayedPractices.filter((_, index) => index % 2 === 0);
  const rightPractices = displayedPractices.filter((_, index) => index % 2 === 1);

  const progressPercentage = calculateProgressPercentage(userProgress.totalPoints, userProgress.nextLevelPoints);
  const TitleStreakIcon = getTitleStreakIcon(userProgress.streakDays);


  if (isLoading) {
    return <div className="p-5 text-center">Loading practices...</div>; // Add a loading state
  }

  // Custom text shadow style for white text on icons - refined for border effect
  const textShadowStyle = {
    textShadow: `
      -2px -2px 0 #49DADD,
       2px -2px 0 #49DADD,
      -2px  2px 0 #49DADD,
       2px  2px 0 #49DADD,
       0px 0px 3px #49DADD
    ` // Creates a 1px border effect + slight glow
  };


  return (
    // Main container - matching the provided HTML structure's style
    <div className="w-full p-5 bg-[rgba(83,252,255,0.10)] rounded-[20px] flex flex-col gap-5 overflow-hidden">
      {/* Title Section */}
      <div className="flex justify-between items-center h-[39px]">
        {/* Centered Title */}
        <div className="flex-1 text-center">
          <h2 className="text-black text-3xl font-happy-monkey lowercase">Your Daily Practices</h2>
        </div>

        {/* Right-aligned Icons and Button */}
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          <div className="relative bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] flex items-center justify-center w-[48px] h-[39px]">
            <img src={BadgeTitleIcon} alt="Level Badge" className="absolute inset-0 w-full h-full p-1.5 object-contain items-center justify-center" />
            <span className="relative z-10 text-white text-base font-happy-monkey">
              {userProgress.level}
            </span>
          </div>

          {/* Total Streak Icon */}
          <div className="bg-white px-1.5 py-0.5 flex items-center justify-center rounded-[10px] gap-1 h-[39px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
             <img src={TitleStreakIcon} alt="Total Streak" className="inset-0 w-full h-full object-contain p-1" />
             {/* Optional: Add streak number if needed, adjust styling */}
             {<span className="text-[#088BAF] font-happy-monkey text-base lowercase">
               {userProgress.streakDays}
             </span>}
          </div>

          {/* Add new practice button */}
          <button className="bg-white rounded-[10px] px-3 h-[39px] text-primary font-righteous text-base lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
            add new practice
          </button>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="flex items-center gap-2">
         {/* Progress Bar Container */}
         <div className="flex-grow h-8 relative flex items-center">
           {/* Background Track - Keep existing colors */}
           <div className="w-full h-4 bg-gradient-to-b from-[rgba(195,253,255,0.2)] to-[rgba(195,253,255,0.2)] rounded-full absolute"></div>
           
           {/* Filled part of the bar - Keep existing colors */}
           <div 
             className="h-4 bg-gradient-to-l from-[#49DAEA] to-[rgba(195,253,255,0.2)] rounded-full absolute left-0 flex items-center justify-center"
             style={{ width: `${progressPercentage}%` }}
           >
             {/* Empty by design - percentage text moved to overlay all parts */}
           </div>
           
           {/* Percentage Text - Centered on entire bar */}
           <div className="absolute w-full text-center z-10">
             <span className="text-white text-sm font-happy-monkey lowercase" style={{
               textShadow: `
                 -1px -1px 0 #0A7C9C,
                  1px -1px 0 #0A7C9C,
                 -1px  1px 0 #0A7C9C,
                  1px  1px 0 #0A7C9C
               `, // Creates a 1px border effect around text
               fontWeight: 'bold'
             }}>
               {Math.round(progressPercentage)}%
             </span>
           </div>
           
           {/* Points Icon Knob - Same styling */}
           <div
             className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center z-20"
             style={{ 
               left: `calc(${progressPercentage}% - 20px)`, 
               filter: 'drop-shadow(1px 2px 2px rgba(73, 218, 234, 0.5))',
               transition: 'left 0.3s ease'
             }}
           >
             <div className="w-1 h-1 bg-[#49DADD] rounded-[4px] absolute"></div>
             <img src={PointsIcon} alt="Current Points" className="w-full h-full object-contain relative z-10"/>
             {/* Points text - Higher z-index */}
             <span className="absolute text-white text-xs font-happy-monkey lowercase z-30" style={textShadowStyle}>
               {userProgress.totalPoints}
             </span>
           </div>
         </div>
         
         {/* Next Level Points Text */}
         <div className="text-[#148BAF] font-happy-monkey text-base lowercase">
           {userProgress.nextLevelPoints === Infinity ? 'Max Level' : `${userProgress.nextLevelPoints} pts`}
         </div>
      </div>


      {/* Practice lists in two columns */}
      <div className="flex gap-4 flex-col md:flex-row">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-3">
          {leftPractices.map((practice) => {
            const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
            const practicePoints = getPracticePoints(practice); // Use updated points logic
            return (
              <div key={practice.id} className="flex justify-between items-center p-[10px_20px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
                {/* Left side: Points, Name, Streak */}
                <div className="flex items-center gap-3">
                  {/* Points Icon */}
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <img src={PointsIcon} alt="Practice Points" className="w-full h-full"/>
                    <span className="absolute text-white text-sm font-happy-monkey lowercase" style={textShadowStyle}>
                      {practicePoints} {/* Display correct points */}
                    </span>
                  </div>
                  {/* Practice Name (Clickable) */}
                  <span
                    className="font-righteous text-black text-base lowercase cursor-pointer hover:text-primary"
                    onClick={() => handlePracticeNameClick(practice.id)}
                  >
                    {practice.name}
                  </span>
                  {/* Practice Streak Icon */}
                  <div className="relative px-1 py-0.5 rounded border border-[#04C4D5] flex items-center justify-center gap-1 min-w-[30px]">
                    <img src={PracticeStreakIcon} alt="Practice Streak" className="w-4 h-4"/>
                    <span className="text-[#04C4D5] font-happy-monkey text-sm lowercase">
                      {practice.streak || 0}
                    </span>
                  </div>
                </div>

                {/* Right side: Duration Dropdown (Optional) & Completion Button */}
                <div className="flex items-center gap-2">
                  {/* Duration Display/Button - Keep if needed */}
                  {practice.duration && (
                     <div className="relative">
                       <button
                         onClick={() => handleDurationToggle(practice.id)}
                         className="px-2 py-0.5 border border-[#04C4D5] rounded flex items-center gap-1 text-primary text-sm font-happy-monkey lowercase"
                       >
                         {practice.duration} MIN ^
                       </button>
                       {openDropdownId === practice.id && (
                         <div className="absolute right-0 mt-1 w-20 bg-white border border-gray-200 rounded shadow-lg z-10">
                           {availableDurations.map((dur) => (
                             <div
                               key={dur}
                               onClick={() => handleDurationSelect(practice.id, dur)}
                               className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                             >
                               {dur} min
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   )}

                  {/* Completion Button */}
                  <button
                    onClick={() => handleToggleCompletion(practice.id)}
                    className={`px-3 py-0.5 rounded font-happy-monkey text-sm lowercase w-36 text-center shadow-[1px_2px_4px_rgba(73,218,234,0.5)] ${
                      practice.completed
                        ? 'bg-[#088BAF] text-white border border-[#04C4D5]'
                        : 'bg-white text-[#04C4D5] border border-[#04C4D5]'
                    }`}
                  >
                    {practice.completed ? 'COMPLETED' : 'MARK COMPLETE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3">
          {rightPractices.map((practice) => {
             const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
             const practicePoints = getPracticePoints(practice); // Use updated points logic
             return (
               <div key={practice.id} className="flex justify-between items-center p-[10px_20px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
                 {/* Left side: Points, Name, Streak */}
                 <div className="flex items-center gap-3">
                   {/* Points Icon */}
                   <div className="relative w-5 h-5 flex items-center justify-center">
                     <img src={PointsIcon} alt="Practice Points" className="w-full h-full"/>
                     <span className="absolute text-white text-sm font-happy-monkey lowercase" style={textShadowStyle}>
                       {practicePoints} {/* Display correct points */}
                     </span>
                   </div>
                   {/* Practice Name (Clickable) */}
                   <span
                     className="font-righteous text-black text-base lowercase cursor-pointer hover:text-primary"
                     onClick={() => handlePracticeNameClick(practice.id)}
                   >
                     {practice.name}
                   </span>
                   {/* Practice Streak Icon */}
                   <div className="relative px-1 py-0.5 rounded border border-[#04C4D5] flex items-center justify-center gap-1 min-w-[30px]">
                     <img src={PracticeStreakIcon} alt="Practice Streak" className="w-4 h-4"/>
                     <span className="text-[#04C4D5] font-happy-monkey text-sm lowercase">
                       {practice.streak || 0}
                     </span>
                   </div>
                 </div>

                 {/* Right side: Duration Dropdown (Optional) & Completion Button */}
                 <div className="flex items-center gap-2">
                   {/* Duration Display/Button - Keep if needed */}
                   {practice.duration && (
                     <div className="relative">
                       <button
                         onClick={() => handleDurationToggle(practice.id)}
                         className="px-2 py-0.5 border border-[#04C4D5] rounded flex items-center gap-1 text-primary text-sm font-happy-monkey lowercase"
                       >
                         {practice.duration} MIN ^
                       </button>
                       {openDropdownId === practice.id && (
                         <div className="absolute right-0 mt-1 w-20 bg-white border border-gray-200 rounded shadow-lg z-10">
                           {availableDurations.map((dur) => (
                             <div
                               key={dur}
                               onClick={() => handleDurationSelect(practice.id, dur)}
                               className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                             >
                               {dur} min
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   )}

                   {/* Completion Button */}
                   <button
                     onClick={() => handleToggleCompletion(practice.id)}
                     className={`px-3 py-0.5 rounded font-happy-monkey text-sm lowercase w-36 text-center shadow-[1px_2px_4px_rgba(73,218,234,0.5)] ${
                      practice.completed
                        ? 'bg-[#088BAF] text-white border border-[#04C4D5]'
                        : 'bg-white text-[#04C4D5] border border-[#04C4D5]'
                    }`}
                   >
                     {practice.completed ? 'COMPLETED' : 'MARK COMPLETE'}
                   </button>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Render Popup/Drawer */}
      {selectedPracticeId && (
        <PracticeDetailPopup
          practiceId={selectedPracticeId} // Pass ID instead of object
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default DailyPracticesSimple;