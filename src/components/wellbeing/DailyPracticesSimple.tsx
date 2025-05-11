import { useState, useEffect, useRef } from "react";
import { usePractices, Practice } from "../../context/PracticeContext"; // Import Practice type
import PracticeDetailPopup from "./PracticeDetailPopup";
import AddPracticeDialog from "./AddPracticeDialog";
import Lottie from "lottie-react"; // Import Lottie
import { useToast } from "@/hooks/useToast"; // Import toast hook

// Import the SVG icons
import StreakLesserThan10 from "../../assets/icons/Streak_lesser_than_10.svg";
import StreakGreaterThan10 from "../../assets/icons/Streak_greater_than_10.svg";
import StreakGreaterThan21 from "../../assets/icons/Streak_greater_than_21.svg";
import PointsIcon from "../../assets/icons/points.svg";

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
  const { practices, userProgress, togglePracticeCompletion, updatePracticeDuration, removePractice, isLoading } = usePractices();
  const { toast } = useToast();

  // Local state for UI interactions
  // Previously used for dropdown, keeping commented for reference
  // const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null); // State for popup
  const [showAnimation, setShowAnimation] = useState(true);
  const [animationData, setAnimationData] = useState<any>(null);
  const animationRef = useRef<any>(null);
  const [isAddPracticeDialogOpen, setIsAddPracticeDialogOpen] = useState(false);

  // New states and refs for inline editing and context menu
  const [editingDuration, setEditingDuration] = useState<{ practiceId: number; currentDuration: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ practiceId: number; x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Available durations for dropdown selection (in minutes) - commented out since we're using inline editing now
  // const availableDurations = [1, 2, 3, 5, 10, 15, 20, 30, 45, 60, 90, 120];

  // Fetch Lottie animation data
  useEffect(() => {
    const fetchLottieAnimation = async () => {
      try {
        const response = await fetch("https://lottie.host/embed/96222c6b-796d-4ec4-91fe-9f0bbeb643d5/5vTj9ZfQ0v.json");
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Failed to load Lottie animation:", error);
        setShowAnimation(false);
      }
    };
    
    fetchLottieAnimation();
  }, []);

  // Lottie animation state
  useEffect(() => {
    // Automatically hide animation after it plays
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000); // Adjust timing based on animation duration
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  // These functions were needed for the dropdown but are now replaced by inline editing
  // Keeping the state for potential future use but removing the unused handlers

  const handleToggleCompletion = (id: number) => {
    togglePracticeCompletion(id); // Use context function
  };

  const handlePracticeNameClick = (id: number) => {
    setSelectedPracticeId(id); // Open the popup
  };

  const handleClosePopup = () => {
    setSelectedPracticeId(null); // Close the popup
  };

  // New handlers for inline duration editing
  const handleDurationClick = (practice: Practice) => {
    if (contextMenu) return; // Don't allow editing if menu is open
    setEditingDuration({ practiceId: practice.id, currentDuration: String(practice.duration || "") });
    // Dropdown functionality has been replaced with inline editing
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingDuration) {
      setEditingDuration({ ...editingDuration, currentDuration: event.target.value });
    }
  };

  const handleDurationBlur = () => {
    if (editingDuration) {
      const newDuration = parseInt(editingDuration.currentDuration, 10);
      const originalPractice = practices.find(p => p.id === editingDuration.practiceId);

      if (!isNaN(newDuration) && newDuration > 0) {
        updatePracticeDuration(editingDuration.practiceId, newDuration);
      } else if (originalPractice) {
        // For invalid input, quietly revert
      }
      setEditingDuration(null);
    }
  };

  const handleDurationKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDurationBlur();
    } else if (event.key === 'Escape') {
      setEditingDuration(null);
    }
  };

  // Context menu handlers
  const openContextMenu = (practiceId: number, x: number, y: number) => {
    setContextMenu({ practiceId, x, y });
  };

  const handleContextMenu = (event: React.MouseEvent, practiceId: number) => {
    event.preventDefault();
    openContextMenu(practiceId, event.clientX, event.clientY);
  };

  const handleRemovePractice = (practiceId: number) => {
    // Remove from daily practices (without completely deleting)
    const practiceToRemove = practices.find(p => p.id === practiceId);
    removePractice(practiceId, true);
    setContextMenu(null);
    
    // Show toast notification
    toast({ 
      title: "Removed from Daily Practices", 
      description: practiceToRemove ? 
        `"${practiceToRemove.name}" has been removed from your daily practices.` : 
        "Practice has been removed from your daily practices."
    });
  };

  // Touch handlers for long press
  const handleTouchStart = (event: React.TouchEvent, practiceId: number) => {
    // Prevent context menu if duration is being edited for this item
    if (editingDuration && editingDuration.practiceId === practiceId) return;

    touchStartPosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      const touchMoveThreshold = 10; // pixels
      if (touchStartPosRef.current && 
          Math.abs(touchStartPosRef.current.x - event.touches[0].clientX) < touchMoveThreshold &&
          Math.abs(touchStartPosRef.current.y - event.touches[0].clientY) < touchMoveThreshold) {
        openContextMenu(practiceId, event.touches[0].clientX, event.touches[0].clientY);
      }
      longPressTimerRef.current = null;
    }, 700); // 700ms for long press
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartPosRef.current = null;
  };

  // Filter practices for display (show only daily practices)
  const displayedPractices = practices.filter(p => p.isDaily);

  // Split practices into left and right columns
  const leftPractices = displayedPractices.filter((_, index) => index % 2 === 0);
  const rightPractices = displayedPractices.filter((_, index) => index % 2 === 1);

  const progressPercentage = calculateProgressPercentage(userProgress.totalPoints, userProgress.nextLevelPoints);


  if (isLoading) {
    return <div className="p-3 text-center">Loading practices...</div>; // Reduced padding
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

  // Define a consistent style for input boxes to match the container styling
  const inputStyle = "w-16 px-1 md:px-2 py-0.5 border border-[#04C4D5] rounded text-center bg-white text-primary text-xs md:text-sm font-happy-monkey";

  return (
    // Main container - matching the provided HTML structure's style with improved responsive design
    <div className="w-full p-3 md:p-4 bg-[rgba(83,252,255,0.10)] rounded-[20px] flex flex-col gap-3 md:gap-4 overflow-hidden relative">
      {/* Lottie animation container */}
      {showAnimation && animationData && (
        <div 
          className="absolute top-[-100px] left-0 z-10 w-full md:w-1/2 lg:w-1/3 pointer-events-none"
          style={{
            transform: 'translate(-20%, -20%)',
            opacity: showAnimation ? 1 : 0,
            transition: 'opacity 0.5s ease-out'
          }}
        >
          <Lottie
            lottieRef={animationRef}
            animationData={animationData}
            loop={false}
            autoplay={true}
            style={{ maxWidth: '250px' }}
            onComplete={() => setShowAnimation(false)}
          />
        </div>
      )}
      
      {/* Title Section */}
      <div className="flex flex-wrap justify-between items-center h-auto py-1 md:py-2">
        {/* Centered Title */}
        <div className="flex-1 text-center mb-2 md:mb-0">
          <h2 className="text-black text-2xl md:text-3xl font-happy-monkey lowercase">Your Daily Practices</h2>
        </div>

        {/* Right-aligned Button */}
        <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto justify-center md:justify-end">
          {/* Add new practice button */}
          <button 
            className="bg-white rounded-[10px] px-2 md:px-3 h-[35px] md:h-[39px] text-primary font-righteous text-sm md:text-base lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-transform hover:scale-105 active:scale-95"
            onClick={() => setIsAddPracticeDialogOpen(true)}
          >
            add new practice
          </button>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="flex items-center gap-1 md:gap-2 mt-1 mb-2">
         {/* Progress Bar Container */}
         <div className="flex-grow h-6 md:h-8 relative flex items-center">
           {/* Background Track - Keep existing colors */}
           <div className="w-full h-3 md:h-4 bg-gradient-to-b from-[rgba(195,253,255,0.2)] to-[rgba(195,253,255,0.2)] rounded-full absolute"></div>
           
           {/* Filled part of the bar - Keep existing colors */}
           <div 
             className="h-3 md:h-4 bg-gradient-to-l from-[#49DAEA] to-[rgba(195,253,255,0.2)] rounded-full absolute left-0 flex items-center justify-center"
             style={{ width: `${progressPercentage}%` }}
           >
             {/* Empty by design - percentage text moved to overlay all parts */}
           </div>
           
           {/* Percentage Text - Centered on entire bar */}
           <div className="absolute w-full text-center z-10">
             <span className="text-white text-xs md:text-sm font-happy-monkey lowercase" style={{
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
             className="absolute top-1/2 transform -translate-y-1/2 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center z-20"
             style={{ 
               left: `calc(${progressPercentage}% - 16px)`, 
               filter: 'drop-shadow(1px 2px 2px rgba(73, 218, 234, 0.5))',
               transition: 'left 0.3s ease'
             }}
           >
             <div className="w-1 h-1 bg-[#49DADD] rounded-[4px] absolute"></div>
             <img src={PointsIcon} alt="Current Points" className="w-full h-full object-contain relative z-10"/>
             {/* Points text - Higher z-index */}
             <span className="absolute text-white text-[10px] md:text-xs font-happy-monkey lowercase z-30" style={textShadowStyle}>
               {userProgress.totalPoints}
             </span>
           </div>
         </div>
         
         {/* Next Level Points Text */}
         <div className="text-[#148BAF] font-happy-monkey text-sm md:text-base lowercase">
           {userProgress.nextLevelPoints === Infinity ? 'Max Level' : `${userProgress.nextLevelPoints} pts`}
         </div>
      </div>


      {/* Practice lists in two columns */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-2">
          {leftPractices.map((practice) => {
            const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
            const practicePoints = getPracticePoints(practice); // Use updated points logic
            return (
              <div 
                key={practice.id}
                className="flex items-center p-[6px_10px] md:p-[8px_15px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] overflow-visible relative select-none"
                onContextMenu={(e) => handleContextMenu(e, practice.id)}
                onTouchStart={(e) => handleTouchStart(e, practice.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Points Icon in separate container */}
                <div className="relative w-5 md:w-6 h-5 md:h-6 flex-shrink-0 flex items-center justify-center mr-2 md:mr-3">
                  <img src={PointsIcon} alt="Practice Points" className="w-full h-full"/>
                  <span className="absolute text-white text-[10px] md:text-sm font-happy-monkey lowercase" style={textShadowStyle}>
                    {practicePoints}
                  </span>
                </div>
                
                {/* Container grouping practice name, streak, duration and completion button */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center">
                  {/* Practice Name container */}
                  <div className="flex items-center gap-2 mb-2 md:mb-0 flex-1">
                    {/* Practice Name (Clickable) */}
                    <span
                      className="font-righteous inline-flex text-black text-sm md:text-base lowercase cursor-pointer hover:text-primary truncate max-w-full md:max-w-[200px]"
                      onClick={() => handlePracticeNameClick(practice.id)}
                    >
                      {practice.name}
                    </span>
                  </div>

                  {/* Duration, Streak and Completion Button container - Right-aligned */}
                  <div className="flex items-center gap-1 md:gap-2 md:ml-auto">
                    {/* Practice Streak Icon - Now right-aligned with other controls */}
                    <div className="relative px-1 py-0.5 rounded border border-[#04C4D5] flex items-center justify-start min-w-[24px] md:min-w-[30px]">
                      <img src={PracticeStreakIcon} alt="Practice Streak" className="w-3 h-3 md:w-4 md:h-4"/>
                      <span className="text-[#04C4D5] font-happy-monkey text-xs md:text-sm lowercase">
                        {practice.streak || 0}
                      </span>
                    </div>
                    
                    {/* Duration Display - Now can be either inline editing or dropdown */}
                    {practice.duration && (
                      <div className="relative">
                        {editingDuration && editingDuration.practiceId === practice.id ? (
                          <input
                            type="text"
                            id={`duration-input-${practice.id}`}
                            value={editingDuration.currentDuration}
                            onChange={handleDurationChange}
                            onBlur={handleDurationBlur}
                            onKeyDown={handleDurationKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className={inputStyle}
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDurationClick(practice);
                            }}
                            className="min-w-[56px] md:min-w-[64px] px-1 md:px-2 py-0.5 border border-[#04C4D5] rounded flex items-center justify-content gap-1 text-primary text-xs md:text-sm font-happy-monkey lowercase whitespace-nowrap"
                          >
                            <span>{practice.duration} MIN</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Completion Button */}
                    <button
                      onClick={() => handleToggleCompletion(practice.id)}
                      className={`px-2 md:px-3 py-0.5 rounded font-happy-monkey text-xs md:text-sm lowercase w-28 md:w-36 text-left shadow-[1px_2px_4px_rgba(73,218,234,0.5)] ${
                        practice.completed
                          ? 'bg-[#088BAF] text-white border border-[#04C4D5]'
                          : 'bg-white text-[#04C4D5] border border-[#04C4D5]'
                      }`}
                    >
                      {practice.completed ? 'COMPLETED' : 'MARK COMPLETE'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-2">
          {rightPractices.map((practice) => {
            const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
            const practicePoints = getPracticePoints(practice); // Use updated points logic
            return (
              <div 
                key={practice.id}
                className="flex items-center p-[6px_10px] md:p-[8px_15px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] overflow-visible relative select-none"
                onContextMenu={(e) => handleContextMenu(e, practice.id)}
                onTouchStart={(e) => handleTouchStart(e, practice.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Points Icon in separate container */}
                <div className="relative w-5 md:w-6 h-5 md:h-6 flex-shrink-0 flex items-center justify-center mr-2 md:mr-3">
                  <img src={PointsIcon} alt="Practice Points" className="w-full h-full"/>
                  <span className="absolute text-white text-[10px] md:text-sm font-happy-monkey lowercase" style={textShadowStyle}>
                    {practicePoints}
                  </span>
                </div>
                
                {/* Container grouping practice name, streak, duration and completion button */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center">
                  {/* Practice Name container */}
                  <div className="flex items-center gap-2 mb-2 md:mb-0 flex-1">
                    {/* Practice Name (Clickable) */}
                    <span
                      className="font-righteous text-black text-sm md:text-base lowercase cursor-pointer hover:text-primary truncate max-w-[120px] md:max-w-[200px]"
                      onClick={() => handlePracticeNameClick(practice.id)}
                    >
                      {practice.name}
                    </span>
                  </div>

                  {/* Duration, Streak and Completion Button container - Right-aligned */}
                  <div className="flex items-center gap-1 md:gap-2 md:ml-auto">
                    {/* Practice Streak Icon - Now right-aligned with other controls */}
                    <div className="relative px-1 py-0.5 rounded border border-[#04C4D5] flex items-center justify-start gap-1 min-w-[24px] md:min-w-[30px]">
                      <img src={PracticeStreakIcon} alt="Practice Streak" className="w-3 h-3 md:w-4 md:h-4"/>
                      <span className="text-[#04C4D5] font-happy-monkey text-xs md:text-sm lowercase">
                        {practice.streak || 0}
                      </span>
                    </div>
                    
                    {/* Duration Display - Now can be either inline editing or dropdown */}
                    {practice.duration && (
                      <div className="relative">
                        {editingDuration && editingDuration.practiceId === practice.id ? (
                          <input
                            type="text"
                            id={`duration-input-${practice.id}`}
                            value={editingDuration.currentDuration}
                            onChange={handleDurationChange}
                            onBlur={handleDurationBlur}
                            onKeyDown={handleDurationKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className={inputStyle}
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDurationClick(practice);
                            }}
                            className="min-w-[56px] md:min-w-[64px] px-1 md:px-2 py-0.5 border border-[#04C4D5] rounded flex items-center justify-content gap-1 text-primary text-xs md:text-sm font-happy-monkey lowercase whitespace-nowrap"
                          >
                            <span>{practice.duration} MIN</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Completion Button */}
                    <button
                      onClick={() => handleToggleCompletion(practice.id)}
                      className={`px-2 md:px-3 py-0.5 rounded font-happy-monkey text-xs md:text-sm lowercase w-28 md:w-36 text-left shadow-[1px_2px_4px_rgba(73,218,234,0.5)] ${
                        practice.completed
                          ? 'bg-[#088BAF] text-white border border-[#04C4D5]'
                          : 'bg-white text-[#04C4D5] border border-[#04C4D5]'
                      }`}
                    >
                      {practice.completed ? 'COMPLETED' : 'MARK COMPLETE'}
                    </button>
                  </div>
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
      
      {/* Add New Practice Dialog */}
      <AddPracticeDialog 
        isOpen={isAddPracticeDialogOpen} 
        onClose={() => setIsAddPracticeDialogOpen(false)} 
      />

      {/* Context Menu for Remove */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-50 bg-white border border-[#04C4D5] rounded-[8px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] py-1"
        >
          <button
            onClick={() => handleRemovePractice(contextMenu.practiceId)}
            className="block w-full text-left px-4 py-2 text-sm font-happy-monkey text-[#148BAF] hover:bg-[#E6F7F9] transition-colors lowercase"
          >
            Remove from daily practices
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyPracticesSimple;