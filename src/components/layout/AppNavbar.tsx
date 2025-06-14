import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePractices } from "@/context/PracticeContext"; // Import usePractices hook

// Direct imports with relative paths to ensure proper loading
import BadgeTitleIcon from "../../assets/icons/badge_title.svg";
import StreakLesserThan10Title from "../../assets/icons/Streak_lesser_than_10_title.svg";
import StreakGreaterThan10Title from "../../assets/icons/Streak_greater_than_10_title.svg";
import StreakGreaterThan21Title from "../../assets/icons/Streak_greater_than_21_title.svg";

// Base64 encoded SVGs for direct embedding as fallbacks
const BADGE_TITLE_SVG_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTEiIGZpbGw9IiM0OURBRUEiLz4KPHBhdGggZD0iTTYgMTJDNiA4LjY4NjI5IDguNjg2MjkgNiAxMiA2QzE1LjMxMzcgNiAxOCA4LjY4NjI5IDE4IDEyQzE4IDE1LjMxMzcgMTUuMzEzNyAxOCAxMiAxOEM4LjY4NjI5IDE4IDYgMTUuMzEzNyA2IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";

const STREAK_TITLE_SVG_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDNDMTIgMyAxNyA2LjggMTcgMTIgMTcgMTUgMTUgMTYuOCAxMyAxOCAxMyAxOCAxMyAxNiAxMS42IDE1IDExLjYgMTggOSAxOS42IDcgMjEgNy41IDIwLjIgNy43IDE5LjQgNy43IDE4LjYgNS44IDIwLjQgNSAyMi44IDUgMjIuOCAyLjggMjEuNSAxIDEzLjggMSAxMyAxIDggNSA0LjQgMTIgM1oiIGZpbGw9IiNGRkQxMDAiIHN0cm9rZT0iI0ZGOEEwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+Cg==";

// Helper function to determine which title streak icon to use
const getTitleStreakIcon = (streakCount: number = 0) => {
  // Return the imported SVG, but also provide base64 fallback
  if (streakCount >= 21) {
    return { svg: StreakGreaterThan21Title, base64: STREAK_TITLE_SVG_BASE64 };
  } else if (streakCount >= 10) {
    return { svg: StreakGreaterThan10Title, base64: STREAK_TITLE_SVG_BASE64 };
  } else {
    return { svg: StreakLesserThan10Title, base64: STREAK_TITLE_SVG_BASE64 };
  }
};

// SVG ICONS
const icons = {
  flame: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C10 2 14 5 14 9C14 10.5 13.2 11.8 12 12.5C12 12.5 12 11.5 11 11C11 13.5 9 14 7.5 15C7.9 14.3 8 13.6 8 13C6.5 14.5 6 16.5 6 16.5C4.2 15.2 3 13 3 10.5C3 6.8 6 4 10 2Z" fill="#FF8A00" stroke="#FF8A00" strokeWidth="0.5"/>
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L12.5 6.5L18.5 7L14 11L15.5 17L10 14L4.5 17L6 11L1.5 7L7.5 6.5L10 1Z" fill="#FFC700" stroke="#FF8A00" strokeWidth="1"/>
    </svg>
  )
};

// Add animation for dropdown menu
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`;

// Helper to resolve SVG path for Vite/React
function resolveSvgUrl(svgImport: string, base64: string) {
  try {
    // Vite sometimes returns the URL as default export
    if (typeof svgImport === 'string' && svgImport.startsWith('data:image')) return svgImport;
    if (typeof svgImport === 'string' && svgImport.endsWith('.svg')) {
      return new URL(svgImport, import.meta.url).href;
    }
    // fallback
    return base64;
  } catch {
    return base64;
  }
}

const unifiedBadgeClass =
  "relative bg-white bg-opacity-80 rounded-[10px] shadow-[1px_2px_4px_rgba(21,169,214,0.5)] flex items-center justify-center transition-all transform hover:scale-105 hover:shadow-[1px_3px_6px_rgba(21,169,214,0.6)] border border-[#15A9D6] p-0 touch-action-manipulation active:scale-95";

const AppNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { userProgress } = usePractices(); // Get userProgress from context
  
  // Add the animation style to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = fadeInAnimation;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get the appropriate streak icon based on streak count
  const { svg: TitleStreakIcon, base64: TitleStreakIconBase64 } = getTitleStreakIcon(userProgress?.streakDays || 0);
  
  // Log to verify that the icon is being resolved correctly
  console.log("Badge icon path:", BadgeTitleIcon);

  return (
    <nav style={{backgroundColor: "#15A9D6"}} className="app-navbar bg-[#15A9D6] sticky top-0 z-50 py-2 sm:py-2.5 shadow-md">
      <div className="container flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        {/* Left: Mobile-optimized badges */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          {/* Level Badge - Mobile-first responsive */}
          <div className={`${unifiedBadgeClass} w-[32px] sm:w-[36px] h-[32px] sm:h-[36px] min-h-[44px] sm:min-h-auto`} title={`Level ${userProgress?.level || 1}`}>
            <div className="absolute inset-0 rounded-[10px]" style={{background: 'rgba(255,255,255,0.8)'}}></div>
            <div className="absolute inset-0 flex items-center justify-center p-1.5">
              <img 
                src={resolveSvgUrl(BadgeTitleIcon, BADGE_TITLE_SVG_BASE64)} 
                alt="Level Badge" 
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = BADGE_TITLE_SVG_BASE64; }}
              />
            </div>
            <span className="relative z-10 text-[#15A9D6] text-xs sm:text-sm font-happy-monkey font-bold" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)', WebkitTextStroke: '0.2px #15A9D6' }}>
              {userProgress?.level || 1}
            </span>
          </div>
          {/* Streak Badge - Enhanced mobile touch */}
          <div className={`${unifiedBadgeClass} w-[40px] sm:w-[44px] h-[32px] sm:h-[36px] min-h-[44px] sm:min-h-auto`} title={`${userProgress?.streakDays || 0} day streak`}>
            <div className="h-4 sm:h-6 w-4 sm:w-6 flex items-center justify-center">
              <img 
                src={resolveSvgUrl(TitleStreakIcon, TitleStreakIconBase64)} 
                alt="Streak" 
                className="h-full object-contain"
                onError={e => { e.currentTarget.src = TitleStreakIconBase64; }}
              />
            </div>
            <span className="ml-0.5 sm:ml-1 text-[#15A9D6] font-happy-monkey text-xs sm:text-sm font-bold">
              {userProgress?.streakDays || 0}
            </span>
          </div>
          {/* Points Badge - Mobile-optimized */}
          <div className={`${unifiedBadgeClass} w-[40px] sm:w-[44px] h-[32px] sm:h-[36px] min-h-[44px] sm:min-h-auto`} title={`${userProgress?.totalPoints || 0} total points`}>
            <div className="h-4 sm:h-6 w-4 sm:w-6 flex items-center justify-center">
              {icons.star}
            </div>
            <span className="ml-0.5 sm:ml-1 text-[#15A9D6] font-happy-monkey text-xs sm:text-sm font-bold">
              {userProgress?.totalPoints || 0}
            </span>
          </div>
        </div>
        {/* Center: Mobile-responsive logo */}
        <div className="flex-1 flex justify-center min-w-0 max-w-[200px] sm:max-w-none">
          <Link to="/" className="flex items-center">
            <span className="font-happy-monkey text-lg sm:text-xl md:text-2xl font-bold text-base cursor-pointer select-none">CACTUS COCO</span>
          </Link>
        </div>
        {/* Right: Enhanced mobile-responsive user controls and notifications */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end min-w-0">
          {/* Notification icons - enhanced mobile touch targets */}
          <button className="w-8 sm:w-9 h-8 sm:h-9 bg-white rounded-md flex items-center justify-center shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer hover:bg-gray-50 relative min-h-[44px] sm:min-h-auto touch-action-manipulation" aria-label="Notes">
            <span className="text-gray-600 text-base sm:text-lg" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</span>
          </button>
          <button className="w-8 sm:w-9 h-8 sm:h-9 bg-white rounded-md flex items-center justify-center shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer hover:bg-gray-50 relative min-h-[44px] sm:min-h-auto touch-action-manipulation" aria-label="Notifications">
            <span className="text-gray-600 text-base sm:text-lg" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</span>
          </button>
          {/* Enhanced mobile-responsive user dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center bg-[#15A9D6] text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-[#1298C0] active:scale-98 shadow-sm hover:shadow min-h-[44px] sm:min-h-auto touch-action-manipulation"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <span className="mr-1 text-sm sm:text-base font-medium truncate max-w-[80px] sm:max-w-[100px]">hi, {user?.user_metadata?.name || 'user'}</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${isDropdownOpen ? "transform rotate-180" : ""}`} 
              />
            </button>
            {/* Enhanced mobile-responsive dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-100 animate-fadeIn">
                <div className="py-1">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</p>
                  </div>
                  {/* Enhanced touch-friendly dropdown items */}
                  <button className="block w-full text-left px-3 sm:px-4 py-3 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] sm:min-h-auto touch-action-manipulation">
                    Profile
                  </button>
                  <button className="block w-full text-left px-3 sm:px-4 py-3 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] sm:min-h-auto touch-action-manipulation">
                    Settings
                  </button>
                  <button className="block w-full text-left px-3 sm:px-4 py-3 sm:py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px] sm:min-h-auto touch-action-manipulation">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;