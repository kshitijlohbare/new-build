import { useState, useEffect, useRef } from 'react'; // Added useRef
import { usePractices, Practice } from '../../context/PracticeContext'; // Ensure Practice type is imported
import PracticeDetailPopup from './PracticeDetailPopup';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

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

// Updated filters with proper id property
const practiceFilters = [
  { id: "stress", label: "feeling stressed" },
  { id: "anxiety", label: "i am anxious" },
  { id: "focus", label: "finding hard to focus" },
  { id: "guided", label: "guided practice" },
  { id: "meditation", label: "meditation" }, 
  { id: "breathing", label: "breathing exercise" }
];

const DailyPractices = () => {
  const { practices, isLoading, addPractice, removePractice, updatePracticeDuration } = usePractices(); // Removed unused userProgress
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<Practice[]>(practices); // Ensure type

  // State for context menu
  const [contextMenu, setContextMenu] = useState<{ practiceId: number; x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // State for inline duration editing
  const [editingDuration, setEditingDuration] = useState<{ practiceId: number; currentDuration: string } | null>(null);

  // Ref for long press timer
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track touch position for distinguishing tap from scroll/drag
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setFilteredPractices(practices); // Update filteredPractices when practices from context change
  }, [practices]);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredPractices(practices);
    } else {
      const filtered = practices.filter(practice => {
        return Array.isArray(practice.tags) && practice.tags.some((tag: string) => selectedFilters.includes(tag));
      });
      setFilteredPractices(filtered);
    }
  }, [selectedFilters, practices]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
      // Also close duration editing if clicking outside the input
      if (editingDuration && event.target && !(event.target as HTMLElement).closest(`#duration-input-${editingDuration.practiceId}`)) {
        // Check if the click was on the span that triggers editing, to prevent immediate closing
        const practiceCard = (event.target as HTMLElement).closest(".practice-card-class"); // Add a class to your practice card div
        if (practiceCard) {
            const spanClicked = (event.target as HTMLElement).tagName === 'SPAN' && (event.target as HTMLElement).dataset.practiceId === String(editingDuration.practiceId);
            if (!spanClicked) {
                 // handleDurationBlur(); // Call blur to save or discard
            }
        } else {
            // handleDurationBlur(); // Clicked outside any card, save/discard
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu, editingDuration]); // Added editingDuration dependency


  const handleToggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleGuidedPracticeClick = (id: number) => {
    setSelectedPracticeId(id); // Open the popup
  };

  const handleClosePopup = () => {
    setSelectedPracticeId(null); // Close the popup
  };

  const handleAddToDailyPractices = (practice: Practice) => {
    if (practice.isDaily) { // Prevent action if already daily
      toast({
        title: 'Already Added!',
        description: 'This practice is already in your daily practices.',
      });
      return;
    }
    addPractice({ ...practice, isDaily: true });
    toast({
      title: 'Added to Daily Practices!',
      description: 'This practice has been added to your daily practices.',
      action: (
        <button
          className="ml-2 px-3 py-1 bg-[#148BAF] text-white rounded font-happy-monkey text-sm hover:bg-[#0a7c9c] transition-colors"
          onClick={() => {
            navigate('/#daily-practices');
            // Optionally, scroll into view after navigation
            setTimeout(() => {
              const el = document.getElementById('daily-practices');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
        >
          view
        </button>
      ),
    });
  };

  const openContextMenu = (practiceId: number, x: number, y: number) => {
    setContextMenu({ practiceId, x, y });
  };

  const handleContextMenu = (event: React.MouseEvent, practiceId: number) => {
    event.preventDefault();
    openContextMenu(practiceId, event.clientX, event.clientY);
  };

  const handleTouchStart = (event: React.TouchEvent, practiceId: number) => {
    // Prevent context menu if duration is being edited for this item
    if (editingDuration && editingDuration.practiceId === practiceId) return;

    touchStartPosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      // Check if touch has moved significantly, if so, don't open context menu (it might be a scroll)
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
    // If touch moves significantly, cancel the long press timer
    if (longPressTimerRef.current && touchStartPosRef.current) {
        // This check would ideally use the current touch position from the event if available
        // For simplicity, we clear if any move is detected after timer starts.
        // A more robust solution would compare current event.touches[0] with touchStartPosRef.current
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

  const handleRemovePractice = (practiceId: number) => {
    // In the main practice list, we should completely remove the practice (false = don't just remove from daily)
    removePractice(practiceId, false);
    setContextMenu(null); // Close context menu
    toast({ title: "Practice Removed", description: "The practice has been removed from your list." });
  };

  const handleDurationClick = (practice: Practice) => {
    // Prevent opening duration edit if context menu is already open for this item or any other
    if (contextMenu) return;
    setEditingDuration({ practiceId: practice.id, currentDuration: String(practice.duration || "") });
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
        // Revert to original duration if input is invalid
        setEditingDuration({ practiceId: originalPractice.id, currentDuration: String(originalPractice.duration || "")});
        toast({title: "Invalid Duration", description: "Duration reverted. Please enter a valid number."}); // Variant removed for now
      } else {
        // Fallback if original practice not found (should not happen)
         toast({title: "Error", description: "Could not update duration."});
      }
      setEditingDuration(null);
    }
  };
  
  const handleDurationKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDurationBlur();
    } else if (event.key === 'Escape') {
      const originalPractice = practices.find(p => p.id === editingDuration?.practiceId);
      if (originalPractice && editingDuration) {
         // Revert to original value on Escape and stop editing
         setEditingDuration(null); 
      } else {
        setEditingDuration(null);
      }
    }
  };


  if (isLoading) {
    return <div>Loading practices...</div>; // Add a loading state
  }

  return (
    <div className="w-full flex flex-col gap-6 p-3 bg-transparent">
      {/* Filter Chips - Updated to be clickable filters */}
      <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
        <div className="inline-flex gap-[10px] whitespace-nowrap">
          {practiceFilters.map((filter) => (
            <div
              key={filter.id}
              onClick={() => handleToggleFilter(filter.id)}
              className={`min-w-[120px] py-[10px] px-[15px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] overflow-hidden rounded-[8px] border border-[#04C4D5] flex justify-center items-center cursor-pointer flex-shrink-0 ${
                selectedFilters.includes(filter.id) 
                  ? 'bg-[#148BAF] text-white' 
                  : 'bg-white text-[#04C4D5]'
              }`}
            >
              <span className="text-center font-happy-monkey text-[16px] lowercase whitespace-nowrap">{filter.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {filteredPractices.map((practice) => {
          const iconKey = (practice.icon as IconType) || 'default';
          const icon = icons[iconKey] || icons.default;
          const isAlreadyDaily = practice.isDaily === true;

          return (
            <div
              key={practice.id}
              onContextMenu={(e) => handleContextMenu(e, practice.id)}
              onTouchStart={(e) => handleTouchStart(e, practice.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col gap-[20px] h-auto practice-card-class select-none" // Added select-none to prevent text selection issues during long press
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
                
                {/* Duration Display/Input - MODIFIED */}
                <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">
                  Duration: {" "}
                  {editingDuration && editingDuration.practiceId === practice.id ? (
                    <input
                      type="text"
                      id={`duration-input-${practice.id}`} // Unique ID for targeting
                      value={editingDuration.currentDuration}
                      onChange={handleDurationChange}
                      onBlur={handleDurationBlur}
                      onKeyDown={handleDurationKeyDown}
                      className="w-16 px-1 md:px-2 py-0.5 border border-[#04C4D5] rounded text-center bg-white text-[#148BAF] text-xs md:text-sm font-happy-monkey"
                      autoFocus
                      onClick={(e) => e.stopPropagation()} // Prevent card click/touch events when interacting with input
                      onTouchStart={(e) => e.stopPropagation()} // Prevent card touch events when interacting with input
                    />
                  ) : (
                    <span 
                      onClick={(e) => { 
                        e.stopPropagation(); // Prevent card click if we are just clicking span
                        handleDurationClick(practice); 
                      }}
                      className="cursor-pointer hover:underline" 
                      data-practice-id={practice.id}
                    >
                      {practice.duration} min
                    </span>
                  )}
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
                  {/* Removed gamification indicators here */}
                </div>
              </div>
              
              {/* Button Section */}
              <div className="w-full flex flex-col gap-[10px]">
                <button
                  onClick={() => handleAddToDailyPractices(practice)}
                  disabled={isAlreadyDaily}
                  className={`w-full p-[8px] bg-white border border-[#49DADD] rounded-[8px] flex justify-center items-center cursor-pointer text-[#148BAF] hover:bg-[#E6F7F9] transition-colors font-happy-monkey text-base lowercase ${isAlreadyDaily ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-center">
                    {isAlreadyDaily ? "Added" : "add to daily practices"}
                  </span>
                </button>
                <button 
                  onClick={() => handleGuidedPracticeClick(practice.id)}
                  className="w-full p-[8px] bg-white border border-[#49DADD] rounded-[8px] flex justify-center items-center cursor-pointer text-[#148BAF] hover:bg-[#E6F7F9] transition-colors font-happy-monkey text-base lowercase"
                >
                  <span className="text-center">
                    guided practice
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Empty cards for consistent grid spacing */}
        {filteredPractices.length > 0 && (
          <>
            <div className="hidden md:flex flex-col bg-transparent rounded-[10px] p-3"></div>
            <div className="hidden lg:flex flex-col bg-transparent rounded-[10px] p-3"></div>
            <div className="hidden xl:flex flex-col bg-transparent rounded-[10px] p-3"></div>
          </>
        )}
      </div>

      {/* Render the popup when a practice is selected */}
      {selectedPracticeId && (
        <PracticeDetailPopup
          practiceId={selectedPracticeId}
          onClose={handleClosePopup}
        />
      )}

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
            Delete practice
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyPractices;