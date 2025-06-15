import { useState, useRef, useEffect } from "react";
import MobileViewport from "@/components/ui/MobileViewport";
import { KeyboardAwareInput } from "@/components/ui/KeyboardAwareInput";
import "@/styles/mobileHome.css";
import MobileWellbeingTipsSection from "../components/wellbeing/MobileWellbeingTipsSection";
import MobileDailyPractices from "../components/wellbeing/MobileDailyPractices";
import MobileBookSessionSection from "../components/wellbeing/MobileBookSessionSection";
import emojiButtonIcon from "../assets/emoji button.svg";

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
    let lastScrollPosition = 0;
    let scrollThreshold = 30; // Increased threshold to avoid hiding on small scroll
    
    const handlePageScroll = () => {
      const currentScrollPosition = window.scrollY;
      const scrolledDown = currentScrollPosition > lastScrollPosition;
      
      // Hide input bar when scrolling down past the threshold
      if (scrolledDown && currentScrollPosition > scrollThreshold && showInputBar) {
        setShowInputBar(false);
        setHasScrolled(true);
      }
      // Show input bar when scrolled back to top (within 10px of top)
      else if (currentScrollPosition <= 10 && !showInputBar && hasScrolled) {
        setShowInputBar(true);
      }
      
      lastScrollPosition = currentScrollPosition;
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
  const inputBarSwipeThreshold = 30; // Minimum distance to trigger dismiss
  
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
    <div className="mobile-home-container" id="mobile-home-root">
      <MobileViewport />
      
      {/* Combined welcome header and delights section - flush with top nav */}
      <div className="hero-section" id="mobile-hero-section">
        {/* Welcome title */}
        <div className="welcome-header" id="mobile-welcome-header">
          <h1 className="welcome-title" id="welcome-title-text">welcome to your wellness home</h1>
        </div>
        
        {/* Today's delights section - properly positioned above the bubbles */}
        <div className="delights-wrapper" id="mobile-delights-wrapper">
          <h2 className="delights-title" id="delights-section-title">your today's delights</h2>
          <div className="delights-container" id="delights-scrollable-container" ref={delightsContainerRef}>
            {/* Simple vertical layout without column grouping */}
            {userDelights.map((delight, index) => (
              <div 
                key={index} 
                className="column-wrapper"
              >
                <div 
                  ref={el => delightRefs.current[index] = el}
                  className="delight-bubble" 
                  id={`delight-item-${index}`}
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
                    onClick={(e) => handleDelete(index, e)}
                  >
                    ×
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new delight button in its own column */}
            <div className="column-wrapper" id="add-delight-column">
              <div 
                className="delight-bubble add-delight"
                id="add-delight-bubble"
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
      </div>
      
      {/* Daily Practices Section */}
      <div id="daily-practices-container" className="wellbeing-section">
        <h2 className="text-[#06C4D5] text-xl font-happy-monkey lowercase text-center mb-2">daily practices</h2>
        <MobileDailyPractices />
      </div>
      
      {/* Wellbeing Tips Section */}
      <div id="wellbeing-tips-container" className="wellbeing-section">
        <h2 className="text-[#06C4D5] text-xl font-happy-monkey lowercase text-center mb-2">wellbeing tips</h2>
        <MobileWellbeingTipsSection />
      </div>
      
      {/* Book Session Section */}
      <div id="book-session-container" className="wellbeing-section">
        <h2 id="book-session-title" className="text-[#06C4D5] text-xl font-happy-monkey lowercase text-center mb-2">book a session</h2>
        <MobileBookSessionSection />
      </div>
      
      {/* Floating bottom input for delights */}
      {showInputBar && (
        <div 
          className="input-bar" 
          id="delights-input-container"
          onTouchStart={handleInputBarTouchStart}
          onTouchMove={handleInputBarTouchMove}
          onTouchEnd={handleInputBarTouchEnd}
        >
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 right-0 bg-white rounded-3xl p-2 mb-2 shadow-xl border" id="emoji-picker-dropdown">
              <div className="grid grid-cols-6 gap-1" id="emoji-grid">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-xl p-1.5 hover:bg-gray-100 rounded-lg transition-colors emoji-select-btn"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Swipe indicator with a subtle hint */}
          <div className="swipe-indicator" aria-hidden="true"></div>
          <p className="text-[8px] text-white text-opacity-70 text-center -mt-1 mb-1" aria-hidden="true">swipe down to dismiss</p>
          <form onSubmit={handleSubmitDelight} className="flex items-center gap-2 w-full" id="delight-submit-form">
            <KeyboardAwareInput
              type="text"
              id="delight-input-field"
              value={newDelight}
              onChange={(e) => setNewDelight(e.target.value)}
              placeholder="what delighted you today?"
              className="w-full bg-transparent outline-none text-white placeholder-white placeholder-opacity-90 pl-1"
              style={{caretColor: "white"}}
            />
            <button 
              type="button" 
              id="emoji-toggle-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
              className="emoji-button flex-shrink-0"
              aria-label="Open emoji picker"
            >
              <img src={emojiButtonIcon} alt="Emoji" width="32" height="32" />
            </button>
            <button 
              type="submit" 
              id="delight-post-button"
              disabled={!newDelight.trim()}
              className={`post-button flex-shrink-0 ${!newDelight.trim() ? 'opacity-100' : ''}`}
            >
              post
            </button>
          </form>
        </div>
      )}
      
      {/* Floating add button that appears when the input bar is hidden */}
      {!showInputBar && (
        <button
          onClick={showInputBarAgain}
          className="add-delight-floating-button"
          aria-label="Add new delight"
        >
          <span className="plus-icon">+</span>
        </button>
      )}
    </div>
  );
};

export default MobileHome;
