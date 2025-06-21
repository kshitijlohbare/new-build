import { useState, useRef, useEffect } from "react";
import MobileViewport from "@/components/ui/MobileViewport";
import { KeyboardAwareInput } from "@/components/ui/KeyboardAwareInput";
import "@/styles/mobileHome.css";
import "@/styles/mobileHomeBackgroundFix.css"; // Import the background fix CSS
import MobileWellbeingTipsSection from "../components/wellbeing/MobileWellbeingTipsSection";
import MobileDailyPractices from "../components/wellbeing/MobileDailyPractices";
import MobileBookSessionSection from "../components/wellbeing/MobileBookSessionSection";
import HomeHeader from "@/components/layout/HomeHeader";
import emojiButtonIcon from "../assets/emoji button.svg";
import GlobalSidebar from "@/components/layout/GlobalSidebar";

const MobileHome = () => {
  const [newDelight, setNewDelight] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInputBar, setShowInputBar] = useState(true); // New state to track input bar visibility
  const [hasScrolled, setHasScrolled] = useState(false); // Track if user has scrolled
  const [userDelights, setUserDelights] = useState([
    "had a fun conversation with a colleague, shared oefefmwf",
    "watched birds chorping",
    "saw a beautiful sunset today and felt grateful",
    "completed my morning meditation"
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const delightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delightsContainerRef = useRef<HTMLDivElement>(null);
  
  const emojis = ['😊', '😍', '🥰', '😂', '🤩', '😎', '🔥', '💪', '🌟', '❤️', '👏', '🙌'];
  
  const handleEmojiSelect = (emoji: string) => {
    setNewDelight(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // Show input bar again
  const showInputBarAgain = () => {
    setShowInputBar(true);
    // Optional: Focus on the input field when showing the input bar
    setTimeout(() => {
      const input = document.querySelector('input[placeholder*="delighted"]') as HTMLInputElement;
      if (input) input.focus();
    }, 300);
  };
  
  // Handle long press to show delete button
  const handleLongPressStart = (index: number) => {
    longPressTimerRef.current = setTimeout(() => {
      setActiveIndex(index);
      if (delightRefs.current[index]) {
        delightRefs.current[index]?.classList.add('show-delete', 'active-hold');
      }
    }, 500);
  };
  
  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Keep the delete button visible after long press
    // It will only be hidden when clicking elsewhere or deleting
  };
  
  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Animate deletion
    const element = delightRefs.current[index];
    if (element) {
      element.classList.add('deleting');
      
      setTimeout(() => {
        setUserDelights(prev => prev.filter((_, i) => i !== index));
        setActiveIndex(null);
        
        // Recalculate layout after deletion
        setTimeout(() => {
          if (delightsContainerRef.current) {
            // Calculate total columns for single column layout
            const columnWidth = delightsContainerRef.current.clientWidth;
            const totalColumns = Math.ceil(delightsContainerRef.current.scrollWidth / columnWidth);
            
            // Make sure we're not showing an invalid scroll position
            if (activeScrollIndex >= totalColumns) {
              const newIndex = Math.max(0, totalColumns - 1);
              setActiveScrollIndex(newIndex);
              
              // Adjust scroll position if needed
              const targetScroll = newIndex * columnWidth;
              delightsContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
          }
        }, 10);
      }, 300);
    } else {
      setUserDelights(prev => prev.filter((_, i) => i !== index));
      setActiveIndex(null);
    }
  };
  
  // Swipe to delete functionality
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const currentBubbleIndexRef = useRef<number | null>(null);
  const swipeThreshold = 80; // minimum distance to trigger delete
  
  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    handleLongPressStart(index);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    currentBubbleIndexRef.current = index;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null || currentBubbleIndexRef.current === null) {
      return;
    }
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartXRef.current;
    const deltaY = touchY - touchStartYRef.current;
    
    // Check if vertical swipe (since we're using horizontal layout)
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
      e.preventDefault(); // Prevent scrolling when swiping vertically
      
      const element = delightRefs.current[currentBubbleIndexRef.current];
      if (element) {
        const swipeAmount = Math.min(Math.abs(deltaY), swipeThreshold);
        const opacity = 1 - (swipeAmount / swipeThreshold) * 0.5;
        
        if (deltaY < 0) { // Swipe up
          element.style.transform = `translateY(${deltaY}px)`;
          element.style.opacity = `${opacity}`;
        }
      }
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    handleLongPressEnd();
    
    if (touchStartXRef.current === null || touchStartYRef.current === null || currentBubbleIndexRef.current === null) {
      return;
    }
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartYRef.current;
    
    const element = delightRefs.current[currentBubbleIndexRef.current];
    
    // For our horizontal layout, we'll use vertical swipes for deletion (up swipe)
    if (element && deltaY < -swipeThreshold) { // Swipe up past threshold
      element.classList.add('deleting');
      
      setTimeout(() => {
        setUserDelights(prev => prev.filter((_, i) => i !== currentBubbleIndexRef.current!));
        setActiveIndex(null);
        
        // Update active index if needed
        if (activeScrollIndex >= userDelights.length - 1) {
          setActiveScrollIndex(Math.max(0, userDelights.length - 2));
        }
      }, 300);
    } else if (element) {
      // Reset position with animation
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      element.style.transform = '';
      element.style.opacity = '1';
      
      setTimeout(() => {
        element.style.transition = '';
      }, 300);
    }
    
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    currentBubbleIndexRef.current = null;
  };
  
  // Track scroll position for indicators (single column layout)
  useEffect(() => {
    const handleScroll = () => {
      if (delightsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = delightsContainerRef.current;
        const scrollPosition = scrollLeft / (scrollWidth - clientWidth);
        
        // Calculate total columns - now each column is a full view
        const columnWidth = clientWidth; // Full width column
        const totalColumns = Math.ceil(scrollWidth / columnWidth);
        
        const newActiveIndex = Math.min(
          Math.max(0, totalColumns - 1),
          Math.floor(scrollPosition * totalColumns)
        );
        setActiveScrollIndex(newActiveIndex);
      }
    };

    const container = delightsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Call once initially to set the indicators correctly
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [userDelights.length]);
  
  // Hide input bar after first scroll
  useEffect(() => {
    let scrollThreshold = 1000; // Threshold to hide input bar only after significant scroll (1000px)
    
    const handlePageScroll = () => {
      const currentScrollPosition = window.scrollY;
      
      // Hide input bar when scrolling down past the threshold (1000px)
      if (currentScrollPosition > scrollThreshold && showInputBar) {
        setShowInputBar(false);
        setHasScrolled(true);
      }
      // Show input bar when scrolled back to top (within 10px of top)
      else if (currentScrollPosition <= 10 && !showInputBar && hasScrolled) {
        setShowInputBar(true);
      }
    };
    
    window.addEventListener('scroll', handlePageScroll);
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, [showInputBar, hasScrolled]);
  
  // Clear any active state when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeIndex !== null && 
          delightRefs.current[activeIndex] && 
          !delightRefs.current[activeIndex]?.contains(e.target as Node)) {
        delightRefs.current[activeIndex]?.classList.remove('show-delete', 'active-hold');
        setActiveIndex(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeIndex]);
  
  const handleSubmitDelight = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDelight.trim()) {
      setUserDelights(prev => [newDelight.trim(), ...prev]); // Add new delight to the beginning of the array
      setNewDelight("");
      setShowEmojiPicker(false);
      
      // Scroll to the newly added delight (no need to scroll as it's now the first item)
      setTimeout(() => {
        if (delightsContainerRef.current) {
          // Scroll to the first column to show the newest delight
          delightsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          
          // Update the active scroll index to the first column
          setActiveScrollIndex(0);
        }
      }, 100);
    }
  };
  
  // Variables for swipe-to-dismiss input bar
  const inputBarTouchStartY = useRef<number | null>(null);
  const inputBarSwipeThreshold = 15; // Reduced threshold to make swipe more sensitive
  
  // Handle touch events for input bar swipe dismissal
  const handleInputBarTouchStart = (e: React.TouchEvent) => {
    inputBarTouchStartY.current = e.touches[0].clientY;
  };
  
  const handleInputBarTouchMove = (e: React.TouchEvent) => {
    if (inputBarTouchStartY.current === null) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - inputBarTouchStartY.current;
    
    if (deltaY > 0) { // Only allow swiping down
      const inputBar = e.currentTarget as HTMLDivElement;
      inputBar.style.transform = `translateY(${deltaY}px)`;
      inputBar.style.opacity = `${1 - Math.min(deltaY / 100, 0.5)}`;
    }
  };
  
  const handleInputBarTouchEnd = (e: React.TouchEvent) => {
    if (inputBarTouchStartY.current === null) return;
    
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - inputBarTouchStartY.current;
    
    const inputBar = e.currentTarget as HTMLDivElement;
    
    if (deltaY > inputBarSwipeThreshold) {
      // Complete the dismiss animation
      inputBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      inputBar.style.transform = 'translateY(100%)';
      inputBar.style.opacity = '0';
      
      // Hide the input bar after animation completes
      setTimeout(() => {
        setShowInputBar(false);
        setHasScrolled(true);
        inputBar.style.transition = '';
        inputBar.style.transform = '';
        inputBar.style.opacity = '1';
      }, 300);
    } else {
      // Reset position with animation
      inputBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      inputBar.style.transform = '';
      inputBar.style.opacity = '1';
      
      setTimeout(() => {
        inputBar.style.transition = '';
      }, 300);
    }
    
    inputBarTouchStartY.current = null;
  };

  return (
    <div className="relative h-screen w-full bg-white">
      <MobileViewport />
      
      {/* Global sidebar handles the sidebar display */}
      <GlobalSidebar />
      
      {/* Main container with header and content stacked */}
      <div 
        className="flex flex-col h-full overflow-hidden mobile-home-container" 
        id="mobile-home-root" 
        data-testid="mobile-home-container"
        aria-label="Mobile home page"
      >
        {/* HomeHeader - sticky at top */}
        <HomeHeader />
        
        {/* Main content that scrolls under the header */}
        <div className="flex-1 overflow-y-auto w-full max-w-full">
          {/* Combined welcome header and delights section */}
      <section 
        className="hero-section" 
        id="mobile-hero-section" 
        data-testid="mobile-hero-section"
        aria-labelledby="welcome-title-text"
      >
        {/* Welcome title */}
        <div 
          className="welcome-header bg-none" 
          id="mobile-welcome-header"
          data-testid="mobile-welcome-header"
        >
          <div 
            className="welcome-title" 
            id="welcome-title-text"
            data-testid="welcome-title"
          >
            welcome to your wellness home
          </div>
        </div>
        
        {/* Today's delights section - properly positioned above the bubbles */}
        <div 
          className="delights-wrapper" 
          id="mobile-delights-wrapper"
          data-testid="mobile-delights-wrapper"
          aria-labelledby="delights-section-title"
        >
          <h2 
            className="delights-title" 
            id="delights-section-title"
            data-testid="delights-section-title"
          >
            your today's delights
          </h2>
          <div 
            className="delights-container" 
            id="delights-scrollable-container" 
            data-testid="delights-scrollable-container"
            aria-label="Scrollable list of delights"
            ref={delightsContainerRef}
          >
            {/* Simple vertical layout without column grouping */}
            {userDelights.map((delight, index) => (
              <div 
                key={index} 
                className="column-wrapper"
                data-testid={`delight-column-${index}`}
              >
                <div 
                  ref={el => delightRefs.current[index] = el}
                  className="delight-bubble bg-white rounded-full p-3 shadow-md flex items-center justify-center whitespace-normal break-words" 
                  id={`delight-item-${index}`}
                  data-testid={`delight-item-${index}`}
                  aria-label={`Delight entry: ${delight}`}
                  onTouchStart={(e) => handleTouchStart(index, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={() => handleLongPressStart(index)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                >
                  {delight}
                  <div 
                    className="delight-delete"
                    id={`delight-delete-btn-${index}`}
                    data-testid={`delight-delete-btn-${index}`}
                    aria-label="Delete this delight"
                    onClick={(e) => handleDelete(index, e)}
                  >
                    ×
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new delight button in its own column */}
            <div 
              className="column-wrapper" 
              id="add-delight-column"
              data-testid="add-delight-column"
            >
              <div 
                className="delight-bubble add-delight"
                id="add-delight-bubble"
                data-testid="add-delight-bubble"
                aria-label="Add a new delight"
                role="button"
                tabIndex={0}
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="delighted"]') as HTMLInputElement;
                  if (input) input.focus();
                }}
              >
                what delighted you today?
              </div>
            </div>
          </div>
          
          {/* Navigation buttons and scroll indicators removed */}
        </div>
      </section>
      
      {/* Daily Practices Section */}
      <section 
        id="daily-practices-section" 
        data-testid="daily-practices-section"
        className="wellbeing-section"
      >
        <MobileDailyPractices />
      </section>
      
      {/* Wellbeing Tips Section - Responsive design */}
      <section 
        id="wellbeing-tips-section" 
        data-testid="wellbeing-tips-section"
        className="wellbeing-section"
        aria-labelledby="wellbeing-tips-heading"
      >
        <MobileWellbeingTipsSection />
      </section>
      
      {/* Book Session Section */}
      <section 
        id="book-session-section" 
        data-testid="book-session-section"
        className="wellbeing-section"
        aria-labelledby="book-session-heading"
      >
        <MobileBookSessionSection />
      </section>
      
      {/* Floating bottom input for delights */}
      {showInputBar && (
        <div 
          className="input-bar" 
          id="delights-input-container"
          data-testid="delights-input-container"
          aria-label="Enter a new delight"
          style={{ 
            padding: '16px', 
            margin: '12px 0',
            gap: '8px',
            backgroundColor: '#FFD400', 
            border: '2px solid white', 
            boxSizing: 'border-box',
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: '500px',
            borderRadius: '50px',
            zIndex: 1000
          }}
          data-fixed-spacing="true"
          onTouchStart={handleInputBarTouchStart}
          onTouchMove={handleInputBarTouchMove}
          onTouchEnd={handleInputBarTouchEnd}
        >
          {showEmojiPicker && (
            <div 
              className="absolute bottom-full left-0 right-0 bg-white rounded-3xl p-2 mb-2 shadow-xl border" 
              id="emoji-picker-dropdown"
              data-testid="emoji-picker-dropdown"
              aria-label="Emoji picker"
            >
              <div 
                className="grid grid-cols-6 gap-1" 
                id="emoji-grid"
                data-testid="emoji-grid"
              >
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    id={`emoji-btn-${index}`}
                    data-testid={`emoji-btn-${index}`}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-xl p-1.5 hover:bg-gray-100 rounded-lg transition-colors emoji-select-btn"
                    aria-label={`Insert emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Swipe indicator with a more noticeable hint */}
          <div 
            className="swipe-indicator" 
            id="swipe-indicator"
            data-testid="swipe-indicator"
            aria-hidden="true"
          ></div>
          <p 
            className="text-[9px] text-white text-opacity-80 text-center mb-1 font-medium leading-none" 
            id="swipe-hint-text"
            data-testid="swipe-hint-text"
            aria-hidden="true"
          >
            swipe down to dismiss
          </p>
          <form 
            onSubmit={handleSubmitDelight} 
            className="flex items-center justify-between w-full" 
            id="delight-submit-form"
            data-testid="delight-submit-form"
          >
            <div className="flex-grow mr-3">
              <KeyboardAwareInput
                type="text"
                id="delight-input-field"
                data-testid="delight-input-field"
                value={newDelight}
                onChange={(e) => setNewDelight(e.target.value)}
                placeholder="what delighted you today?"
                className="w-full bg-transparent outline-none text-white placeholder-white placeholder-opacity-90 pl-1 caret-white text-sm"
              />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                type="button" 
                id="emoji-toggle-button"
                data-testid="emoji-toggle-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className="emoji-button flex-shrink-0"
                aria-label="Open emoji picker"
              >
                <img 
                  src={emojiButtonIcon} 
                  alt="Emoji" 
                  width="24" 
                  height="24" 
                  id="emoji-button-icon"
                  data-testid="emoji-button-icon"
                />
              </button>
              <button 
                type="submit" 
                id="delight-post-button"
                data-testid="delight-post-button"
                disabled={!newDelight.trim()}
                className="post-button"
                aria-label="Post your delight"
              >
                post
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating add button that appears when the input bar is hidden */}
      {!showInputBar && (
        <button
          id="add-delight-floating-button"
          data-testid="add-delight-floating-button"
          onClick={showInputBarAgain}
          className="add-delight-floating-button"
          aria-label="Add new delight"
        >
          <span 
            className="plus-icon"
            id="plus-icon"
            data-testid="plus-icon"
          >+</span>
        </button>
      )}
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
