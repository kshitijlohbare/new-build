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
  
  console.log("DailyPracticesSimple rendering:", { 
    isLoading, 
    practicesCount: practices?.length || 0,
    dailyPracticesCount: practices?.filter(p => p.isDaily)?.length || 0,
    dailyPractices: practices?.filter(p => p.isDaily) || []
  });

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
    // Add a small offset to prevent menu from appearing directly under finger/cursor
    const menuX = Math.min(x + 5, window.innerWidth - 200); // Prevent menu from going off right edge
    const menuY = Math.min(y + 5, window.innerHeight - 100); // Prevent menu from going off bottom edge
    
    setContextMenu({ practiceId, x: menuX, y: menuY });
    
    // Add a subtle haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(50); // Short vibration for tactile feedback
    }
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
        "Practice has been removed from your daily practices.",
      variant: "default"
    });
  };

  // Touch handlers for long press with improved reliability
  const handleTouchStart = (event: React.TouchEvent, practiceId: number) => {
    // Prevent context menu if duration is being edited for this item
    if (editingDuration && editingDuration.practiceId === practiceId) return;

    touchStartPosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    
    // Clear any existing timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    // Set new timer
    longPressTimerRef.current = setTimeout(() => {
      // Verify the touch hasn't moved significantly
      if (touchStartPosRef.current) {
        const touchMoveThreshold = 15; // pixels - slightly more forgiving
        const currentTouch = event.touches[0];
        
        if (Math.abs(touchStartPosRef.current.x - currentTouch.clientX) < touchMoveThreshold &&
            Math.abs(touchStartPosRef.current.y - currentTouch.clientY) < touchMoveThreshold) {
          // Show the context menu at the touch position
          openContextMenu(practiceId, currentTouch.clientX, currentTouch.clientY);
        }
      }
      longPressTimerRef.current = null;
    }, 600); // Slightly shorter for better responsiveness
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    // Only cancel if movement is significant
    if (longPressTimerRef.current && touchStartPosRef.current) {
      const moveThreshold = 10;
      const touch = event.touches[0];
      
      if (Math.abs(touchStartPosRef.current.x - touch.clientX) > moveThreshold ||
          Math.abs(touchStartPosRef.current.y - touch.clientY) > moveThreshold) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
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
  const displayedPractices = practices.filter(practice => {
    const isMarkedDaily = practice.isDaily === true;
    
    if (isMarkedDaily) {
      console.log(`Practice "${practice.name}" (ID: ${practice.id}) IS marked as daily (isDaily=${practice.isDaily})`);
    } else if (practice.name === "Cold Shower Exposure" || practice.name === "Gratitude Journal" || practice.name === "Focus Breathing (3:3:6)") {
      // Log prominently for key practices that should be daily but aren't
      console.warn(`KEY ISSUE: "${practice.name}" (ID: ${practice.id}) is NOT marked as daily (isDaily=${practice.isDaily})`);
      
      // If the practice is found but isDaily is undefined or null (instead of false),
      // that might be the source of the filtering issue
      if (practice.isDaily === undefined || practice.isDaily === null) {
        console.error(`CRITICAL ERROR: "${practice.name}" has isDaily=${practice.isDaily} (undefined/null)`);
      }
    }
    
    return isMarkedDaily;
  });
  
  // Add detailed debug info about all practices
  console.log("ALL PRACTICES:", practices.map(p => ({ 
    id: p.id, 
    name: p.name, 
    isDaily: p.isDaily,
    isSystemPractice: p.isSystemPractice
  })));
  
  console.log("DailyPracticesSimple displayedPractices:", {
    totalPracticesCount: practices.length,
    dailyPracticesCount: displayedPractices.length,
    dailyPracticeIds: displayedPractices.map(p => p.id),
    dailyPracticeNames: displayedPractices.map(p => p.name)
  });

  // Split practices into left and right columns
  const leftPractices = displayedPractices.filter((_, index) => index % 2 === 0);
  const rightPractices = displayedPractices.filter((_, index) => index % 2 === 1);

  const progressPercentage = calculateProgressPercentage(userProgress.totalPoints, userProgress.nextLevelPoints);


  if (isLoading) {
    return <div className="p-3 text-center">Loading practices...</div>; // Reduced padding
  }
  
  // Check for empty daily practices and show a message
  if (displayedPractices.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3 md:gap-4 overflow-y-auto overflow-x-auto">
        <div className="flex justify-between items-center h-auto py-1 md:py-2">
          <div className="flex-1 mb-2 md:mb-0">
            <h2 className="text-[#148BAF] text-xl md:text-2xl font-happy-monkey lowercase">Your Daily Practices</h2>
          </div>
        </div>
        <div className="bg-white rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] text-center p-8">
          <p className="text-[#148BAF] font-happy-monkey lowercase mb-4">you don't have any daily practices yet.</p>
          <p className="text-[#148BAF] font-happy-monkey lowercase mb-6">go to "browse all practices" below and add some practices to get started!</p>
          <a 
            href="/Practices"
            className="inline-block bg-white hover:bg-[#F7FFFF] rounded-lg px-4 py-2 text-[#148BAF] font-happy-monkey text-sm md:text-base lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all flex items-center justify-center mx-auto w-auto"
          >
            add daily practice
          </a>
        </div>
      </div>
    );
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
    // Main container with updated styling to match Practices page
    <div className="w-full flex flex-col gap-4 md:gap-6 relative">
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
        <div className="flex-1 mb-2 md:mb-0">
          <h2 className="text-[#148BAF] text-xl md:text-2xl font-happy-monkey lowercase">Your Daily Practices</h2>
        </div>

        {/* Right-aligned Button */}
        <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto justify-end">
          {/* Add daily practice button that redirects to Practices page */}
          <a 
            href="/Practices"
            className="bg-white rounded-lg px-2 md:px-3 h-[35px] md:h-[39px] text-[#148BAF] font-happy-monkey text-sm md:text-base lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all hover:bg-[#F7FFFF] flex items-center justify-center"
          >
            add daily practice
          </a>
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
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-4">
          {leftPractices.map((practice) => {
            const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
            const practicePoints = getPracticePoints(practice); // Use updated points logic
            return (
              <div 
                key={practice.id}
                className="flex items-center p-[8px_12px] md:p-[10px_16px] bg-white rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0_4px_10px_-2px_rgba(73,218,234,0.5)] hover:shadow-lg hover:shadow-[rgba(73,218,234,0.3)] transition-all duration-300 relative select-none"
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
                      className="font-righteous inline-flex text-[#148BAF] text-sm md:text-base lowercase cursor-pointer hover:text-primary truncate max-w-full md:max-w-[200px]"
                      onClick={() => handlePracticeNameClick(practice.id)}
                    >
                      {practice.name}
                    </span>
                  </div>

                  {/* Duration, Streak and Completion Button container - Right-aligned */}
                  <div className="flex items-center gap-1 md:gap-2 md:ml-auto">
                    {/* Practice Streak Icon - Now right-aligned with other controls */}
                    <div className="relative px-1 py-0.5 rounded-lg border border-[#04C4D5] bg-[rgba(83,252,255,0.10)] flex items-center justify-start min-w-[24px] md:min-w-[30px]">
                      <img src={PracticeStreakIcon} alt="Practice Streak" className="w-3 h-3 md:w-4 md:h-4"/>
                      <span className="text-[#148BAF] font-happy-monkey text-xs md:text-sm lowercase">
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
        <div className="flex-1 flex flex-col gap-4">
          {rightPractices.map((practice) => {
            const PracticeStreakIcon = getPracticeStreakIcon(practice.streak);
            const practicePoints = getPracticePoints(practice); // Use updated points logic
            return (
              <div 
                key={practice.id}
                className="flex items-center p-[8px_12px] md:p-[10px_16px] bg-white rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0_4px_10px_-2px_rgba(73,218,234,0.5)] hover:shadow-lg hover:shadow-[rgba(73,218,234,0.3)] transition-all duration-300 relative select-none"
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
                      className="font-righteous inline-flex text-[#148BAF] text-sm md:text-base lowercase cursor-pointer hover:text-primary truncate max-w-full md:max-w-[200px]"
                      onClick={() => handlePracticeNameClick(practice.id)}
                    >
                      {practice.name}
                    </span>
                  </div>

                  {/* Duration, Streak and Completion Button container - Right-aligned */}
                  <div className="flex items-center gap-1 md:gap-2 md:ml-auto">
                    {/* Practice Streak Icon - Now right-aligned with other controls */}
                    <div className="relative px-1 py-0.5 rounded-lg border border-[#04C4D5] bg-[rgba(83,252,255,0.10)] flex items-center justify-start min-w-[24px] md:min-w-[30px]">
                      <img src={PracticeStreakIcon} alt="Practice Streak" className="w-3 h-3 md:w-4 md:h-4"/>
                      <span className="text-[#148BAF] font-happy-monkey text-xs md:text-sm lowercase">
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
        <>
          {/* Overlay to capture clicks outside menu */}
          <div 
            className="fixed inset-0 bg-black/20 z-40" 
            onClick={() => setContextMenu(null)}
          />
          
          {/* Actual Context Menu */}
          <div
            ref={contextMenuRef}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 bg-white border-2 border-[#04C4D5] rounded-[10px] shadow-[2px_4px_8px_rgba(73,218,234,0.5)] py-2 min-w-[220px]"
          >
            <div className="px-4 py-1 text-xs text-gray-500 font-happy-monkey lowercase border-b border-gray-100">
              Practice Options
            </div>
            <button
              onClick={() => handleRemovePractice(contextMenu.practiceId)}
              className="block w-full text-left px-4 py-3 text-sm font-happy-monkey text-[#148BAF] hover:bg-[#E6F7F9] transition-colors lowercase flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#148BAF"/>
              </svg>
              Remove from daily practices
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyPracticesSimple;