import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { usePractices } from "@/context/PracticeContext";
import BadgeTitleIcon from "../../assets/icons/badge_title.svg";
import StreakLesserThan10Title from "../../assets/icons/Streak_lesser_than_10_title.svg";
import StreakGreaterThan10Title from "../../assets/icons/Streak_greater_than_10_title.svg";
import StreakGreaterThan21Title from "../../assets/icons/Streak_greater_than_21_title.svg";
import StarTitleIcon from '../../assets/icons/Star_title.svg';
import { Menu, User } from 'lucide-react'; // Import icons for hamburger menu and user profile

const BADGE_TITLE_SVG_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTEiIGZpbGw9IiM0OURBRUEiLz4KPHBhdGggZD0iTTYgMTJDNiA4LjY4NjI5IDguNjg2MjkgNiAxMiA2QzE1LjMxMzcgNiAxOCA4LjY4NjI5IDE4IDEyQzE4IDE1LjMxMzcgMTUuMzEzNyAxOCAxMiAxOEM4LjY4NjI5IDE4IDYgMTUuMzEzNyA2IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";
const STREAK_TITLE_SVG_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDNDMTIgMyAxNyA2LjggMTcgMTIgMTcgMTUgMTUgMTYuOCAxMyAxOCAxMyAxOCAxMyAxNiAxMS42IDE1IDExLjYgMTggOSAxOS42IDcgMjEgNy41IDIwLjIgNy43IDE5LjQgNy43IDE4LjYgNS44IDIwLjQgNSAyMi44IDUgMjIuOCAyLjggMjEuNSAxIDEzLjggMSAxMyAxIDggNSA0LjQgMTIgM1oiIGZpbGw9IiNGRkQxMDAiIHN0cm9rZT0iI0ZGOEEwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+Cg==";
function resolveSvgUrl(svgImport: string, base64: string): string {
  try {
    if (typeof svgImport === 'string' && svgImport.startsWith('data:image')) return svgImport;
    if (typeof svgImport === 'string' && svgImport.endsWith('.svg')) {
      return new URL(svgImport, import.meta.url).href;
    }
    return base64;
  } catch {
    return base64;
  }
}
function getTitleStreakIcon(streakCount = 0) {
  if (streakCount >= 21) {
    return { svg: StreakGreaterThan21Title, base64: STREAK_TITLE_SVG_BASE64 };
  } else if (streakCount >= 10) {
    return { svg: StreakGreaterThan10Title, base64: STREAK_TITLE_SVG_BASE64 };
  } else {
    return { svg: StreakLesserThan10Title, base64: STREAK_TITLE_SVG_BASE64 };
  }
}

const AppLayout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProgress } = usePractices();
  const { svg: TitleStreakIcon, base64: TitleStreakIconBase64 } = getTitleStreakIcon(userProgress?.streakDays || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      
      // Close sidebar when clicking outside on mobile
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) && 
          window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    };

    // Close mobile sidebar when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again."
      });
    }
  };

  const handleProfileAction = (action: string) => {
    setShowDropdown(false);
    switch (action) {
      case 'settings':
        navigate('/settings');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'appointments':
        navigate('/appointments');
        break;
      case 'practitioner-onboarding':
        navigate('/practitioner-onboarding');
        break;
      case 'logout':
        handleSignOut();
        break;
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {/* Top navbar - fixed at top */}
      <header className="bg-gradient-to-b from-[#49DAEA] to-[rgba(195.50,253.79,255,0.20)] h-[70px] w-full z-20 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        {/* Grid layout to prevent overlapping */}
        <div className="flex item-center gap-2 flex-1 min-w-0 justify-between">
          {/* Left section: Hamburger + Badges (spans 4 columns on mobile, 3 on larger screens) */}
          <div className="col-span-5 sm:col-span-4 md:col-span-3 flex items-center gap-1 sm:gap-2">
            {/* Hamburger menu icon for mobile */}
            <button 
              className="md:hidden mr-1 p-1.5 rounded-md bg-white border border-[#04C4D5] shadow-[1px_2px_4px_rgba(4,196,213,0.5)] hover:shadow-md transition-all hover:bg-opacity-100"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <Menu size={18} className="text-[#148BAF]" />
            </button>

            {/* Level Badge */}
            <div className="relative rounded-[10px] flex items-center justify-center w-[32px] sm:w-[36px] h-[32px] sm:h-[36px] border border-[#49DADD] p-1 sm:p-2">
              <div className="absolute inset-0 rounded-[10px]" style={{background: 'rgba(255,255,255,0.8)'}}></div>
              <div className="absolute inset-0 flex items-center justify-center p-1.5">
                <img 
                  src={resolveSvgUrl(BadgeTitleIcon, BADGE_TITLE_SVG_BASE64)} 
                  alt="Level Badge" 
                  className="w-full h-full object-contain"
                  onError={e => { e.currentTarget.src = BADGE_TITLE_SVG_BASE64; }}
                />
              </div>
              <span className="relative z-10 text-white text-xs sm:text-sm font-happy-monkey font-bold" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)', WebkitTextStroke: '0.2px #088BAF' }}>
                {userProgress?.level || 1}
              </span>
            </div>
            
            {/* Streak Badge - slightly smaller on mobile */}
            <div className="relative rounded-[10px] flex items-center justify-center w-[40px] sm:w-[48px] h-[32px] sm:h-[36px] border border-[#49DADD] p-1 sm:p-2">
              <div className="h-6 sm:h-8 w-6 sm:w-8 flex items-center justify-center mx-auto">
                <img 
                  src={resolveSvgUrl(TitleStreakIcon, TitleStreakIconBase64)} 
                  alt="Streak" 
                  className="h-full w-full object-contain"
                  onError={e => { e.currentTarget.src = TitleStreakIconBase64; }}
                />
              </div>
              <span className="ml-1 text-[#088BAF] font-happy-monkey text-xs sm:text-sm font-bold">
                {userProgress?.streakDays || 0}
              </span>
            </div>
            
            {/* Points Badge - only shown on larger than mobile */}
            <div className="hidden sm:flex relative rounded-[10px] items-center justify-center w-[36px] h-[36px] border border-[#49DADD] p-2 overflow-hidden">
              <img 
                src={StarTitleIcon} 
                alt="Points Star" 
                className="absolute left-1/2 top-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 opacity-90 pointer-events-none select-none" 
              />
              <span className="relative z-10 text-white font-happy-monkey text-sm font-bold text-center leading-none">
                {userProgress?.totalPoints || 0}
              </span>
            </div>
          </div>
          
          {/* Center: Logo (spans 4 columns) */}
          <div className="col-span-3 sm:col-span-4 md:col-span-6 flex justify-center">
            <a href="/" className="focus:outline-none whitespace-nowrap">
              <h1 className="font-luckiest-guy text-lg sm:text-xl md:text-xl font-bold text-black cursor-pointer select-none">CACTUS COCO</h1>
            </a>
          </div>
          
          {/* Right: User controls (spans 4 columns) */}
          <div className="col-span-4 flex items-center justify-end">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-[#148BAF] hover:bg-[#0A7A9C] text-white px-3 sm:px-4 py-1.5 rounded-lg flex items-center gap-1 sm:gap-2 transition-all shadow-[1px_2px_4px_rgba(4,196,213,0.5)] border border-[#04C4D5]"
              >
                {/* User icon shown on mobile, text on larger screens */}
                <User size={16} className="sm:hidden text-white" />
                <span className="hidden sm:inline mr-1 truncate max-w-[80px] md:max-w-[120px] font-happy-monkey lowercase">
                  hi, {user?.email?.split('@')[0] || 'user'}
                </span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                >
                  <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Dropdown menu with updated styling */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-[1px_2px_4px_rgba(4,196,213,0.5)] bg-white border border-[rgba(4,196,213,0.3)] py-1 z-20">
                  <button onClick={() => handleProfileAction('settings')} 
                    className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-white transition-colors font-happy-monkey lowercase">
                    settings
                  </button>
                  <button onClick={() => handleProfileAction('profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-white transition-colors font-happy-monkey lowercase">
                    profile
                  </button>
                  <button onClick={() => handleProfileAction('appointments')}
                    className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-white transition-colors font-happy-monkey lowercase">
                    my appointments
                  </button>
                  <button onClick={() => handleProfileAction('practitioner-onboarding')}
                    className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-white transition-colors font-happy-monkey lowercase">
                    become a practitioner
                  </button>
                  <button onClick={() => handleProfileAction('logout')}
                    className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-white transition-colors font-happy-monkey lowercase">
                    logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* content-body container - takes remaining height */}
      <div className="content-body flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
            onClick={() => setSidebarVisible(false)}
          />
        )}
        
        {/* Sidebar - adaptive for mobile */}
        <aside 
          ref={sidebarRef}
          className={`
            md:w-[110px] md:relative md:block flex-shrink-0
            ${sidebarVisible ? 'fixed inset-y-0 left-0 w-[200px] z-20' : 'hidden'}
          `}
        >
          <Sidebar onNavigate={() => setSidebarVisible(false)} />
        </aside>

        {/* Main content area - scrollable independently */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;