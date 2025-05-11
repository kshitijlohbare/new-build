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

  // Keeping this method for future use but marking it to prevent TypeScript warnings
  // Removed unused toggleSidebar function

  return (
    <div className="flex flex-col h-screen w-full bg-[#ffffff] overflow-hidden">
      {/* Top navbar - fixed at top */}
      <header className="bg-gradient-to-b from-[#49DAEA] to-[rgba(195.50,253.79,255,0.20)] h-[70px] w-full z-20 flex items-center justify-between px-4 sm:px-10 flex-shrink-0">
        {/* Left: Badges */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Level Badge */}
          <div className="relative rounded-[10px] flex items-center justify-center w-[36px] h-[36px] border border-[#49DADD] p-2">
            <div className="absolute inset-0 rounded-[10px]" style={{background: 'rgba(255,255,255,0.8)'}}></div>
            <div className="absolute inset-0 flex items-center justify-center p-1.5">
              <img 
                src={resolveSvgUrl(BadgeTitleIcon, BADGE_TITLE_SVG_BASE64)} 
                alt="Level Badge" 
                className="w-full h-full object-contain"
                onError={e => { e.currentTarget.src = BADGE_TITLE_SVG_BASE64; }}
              />
            </div>
            <span className="relative z-10 text-white text-sm font-happy-monkey font-bold" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)', WebkitTextStroke: '0.2px #088BAF' }}>
              {userProgress?.level || 1}
            </span>
          </div>
          {/* Streak Badge */}
          <div className="relative rounded-[10px] flex items-center justify-center w-[48px] h-[36px] border border-[#49DADD] p-2"> {/* Increased width to 48px */}
            <div className="h-8 w-8 flex items-center justify-center mx-auto"> {/* Center and enlarge icon */}
              <img 
                src={resolveSvgUrl(TitleStreakIcon, TitleStreakIconBase64)} 
                alt="Streak" 
                className="h-8 w-8 object-contain"
                onError={e => { e.currentTarget.src = TitleStreakIconBase64; }}
              />
            </div>
            <span className="ml-1 text-[#088BAF] font-happy-monkey text-sm font-bold">
              {userProgress?.streakDays || 0}
            </span>
          </div>
          {/* Points Badge - icon and points overlap, fit icon in frame */}
          <div className="relative rounded-[10px] flex items-center justify-center w-[36px] h-[36px] border border-[#49DADD] p-2 overflow-hidden"> {/* Add overflow-hidden */}
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
        {/* Center: Logo */}
        <div className="flex-1 flex justify-center min-w-0">
          <a href="/" className="focus:outline-none">
            <h1 className="font-luckiest-guy text-xl sm:text-2xl font-bold text-black cursor-pointer select-none">CACTUS COCO</h1>
          </a>
        </div>
        {/* Right: User controls and notifications (unchanged) */}
        <div className="flex items-center space-x-3 flex-1 justify-end min-w-0">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-[#088BAF] text-white px-2 sm:px-4 py-1 rounded-full flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <span className="mr-1 truncate max-w-[100px] sm:max-w-none">hi, {user?.email?.split('@')[0] || 'kshitij lohbare'}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-20">
                <button onClick={() => handleProfileAction('settings')} 
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#FFFFFF] font-happy-monkey">
                  Settings
                </button>
                <button onClick={() => handleProfileAction('profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#FFFFFF] font-happy-monkey">
                  Profile
                </button>
                <button onClick={() => handleProfileAction('appointments')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#FFFFFF] font-happy-monkey">
                  My Appointments
                </button>
                <button onClick={() => handleProfileAction('practitioner-onboarding')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#FFFFFF] font-happy-monkey">
                  Become a Practitioner
                </button>
                <button onClick={() => handleProfileAction('logout')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#FFFFFF] font-happy-monkey">
                  Logout
                </button>
              </div>
            )}
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