import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

const AppLayout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      case 'logout':
        handleSignOut();
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {/* Top navbar - fixed at top */}
      <header className="bg-gradient-to-b from-[#49DAEA] to-[rgba(196,254,255,0.2)] h-[70px] w-full z-10 flex items-center px-10 flex-shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="font-kavoon text-2xl text-[#148BAF]">MOODY COCO</h1>
          <span className="text-[#148BAF] font-happy-monkey">Current streak : 12</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.1666 12.5C16.0557 12.7513 16.0226 13.0302 16.0716 13.3005C16.1206 13.5708 16.2495 13.8203 16.4416 14.0167L16.4916 14.0667C16.6465 14.2215 16.7695 14.4053 16.8535 14.6076C16.9375 14.8099 16.9805 15.0268 16.9805 15.2458C16.9805 15.4649 16.9375 15.6817 16.8535 15.884C16.7695 16.0863 16.6465 16.2701 16.4916 16.425C16.3368 16.5799 16.153 16.7029 15.9507 16.7869C15.7484 16.8709 15.5315 16.9139 15.3125 16.9139C15.0934 16.9139 14.8766 16.8709 14.6743 16.7869C14.472 16.7029 14.2882 16.5799 14.1333 16.425L14.0833 16.375C13.887 16.1829 13.6375 16.054 13.3672 16.005C13.0969 15.956 12.818 15.9891 12.5666 16.1C12.3201 16.2056 12.1099 16.381 11.9618 16.6045C11.8138 16.828 11.7344 17.0902 11.7333 17.3583V17.5C11.7333 17.942 11.5577 18.366 11.2451 18.6785C10.9326 18.9911 10.5087 19.1667 10.0666 19.1667C9.62464 19.1667 9.20068 18.9911 8.88813 18.6785C8.57559 18.366 8.39998 17.942 8.39998 17.5V17.425C8.39355 17.1492 8.30431 16.8817 8.14443 16.6573C7.98455 16.433 7.76177 16.2621 7.49998 16.1667C7.24863 16.0557 6.96976 16.0226 6.69944 16.0717C6.42912 16.1207 6.17965 16.2496 5.98331 16.4417L5.93331 16.4917C5.77847 16.6466 5.59466 16.7696 5.39237 16.8536C5.19007 16.9376 4.97323 16.9806 4.75415 16.9806C4.53506 16.9806 4.31822 16.9376 4.11593 16.8536C3.91364 16.7696 3.72982 16.6466 3.57498 16.4917C3.42008 16.3369 3.29708 16.1531 3.21309 15.9508C3.1291 15.7485 3.08607 15.5316 3.08607 15.3125C3.08607 15.0934 3.1291 14.8766 3.21309 14.6743C3.29708 14.472 3.42008 14.2882 3.57498 14.1333L3.62498 14.0833C3.81707 13.887 3.94597 13.6375 3.99498 13.3672C4.04399 13.0969 4.01089 12.818 3.89998 12.5667C3.79437 12.3202 3.619 12.11 3.39547 11.9619C3.17193 11.8139 2.90974 11.7345 2.64165 11.7333H2.49998C2.05795 11.7333 1.63399 11.5577 1.32145 11.2452C1.0089 10.9326 0.833313 10.5087 0.833313 10.0667C0.833313 9.62464 1.0089 9.20068 1.32145 8.88813C1.63399 8.57559 2.05795 8.39998 2.49998 8.39998H2.57498C2.85075 8.39355 3.11825 8.30431 3.34264 8.14443C3.56703 7.98455 3.73788 7.76177 3.83331 7.49998C3.94422 7.24863 3.97732 6.96976 3.92831 6.69944C3.8793 6.42912 3.7504 6.17965 3.55831 5.98331L3.50831 5.93331C3.35341 5.77847 3.23041 5.59466 3.14642 5.39237C3.06243 5.19007 3.0194 4.97323 3.0194 4.75415C3.0194 4.53506 3.06243 4.31822 3.14642 4.11593C3.23041 3.91364 3.35341 3.72982 3.50831 3.57498C3.66315 3.42008 3.84697 3.29708 4.04926 3.21309C4.25155 3.1291 4.46839 3.08607 4.68748 3.08607C4.90657 3.08607 5.12341 3.1291 5.3257 3.21309C5.52799 3.29708 5.7118 3.42008 5.86665 3.57498L5.91665 3.62498C6.11298 3.81707 6.36245 3.94597 6.63277 3.99498C6.90309 4.04399 7.18197 4.01089 7.43331 3.89998H7.49998C7.74648 3.79437 7.95672 3.619 8.10478 3.39547C8.25285 3.17193 8.33219 2.90974 8.33331 2.64165V2.49998C8.33331 2.05795 8.50892 1.63399 8.82147 1.32145C9.13401 1.0089 9.55797 0.833313 9.99998 0.833313C10.442 0.833313 10.866 1.0089 11.1785 1.32145C11.491 1.63399 11.6666 2.05795 11.6666 2.49998V2.57498C11.6678 2.84307 11.7471 3.10526 11.8952 3.3288C12.0432 3.55233 12.2535 3.7277 12.5 3.83331C12.7513 3.94422 13.0302 3.97732 13.3005 3.92831C13.5708 3.8793 13.8203 3.7504 14.0166 3.55831L14.0666 3.50831C14.2215 3.35341 14.4053 3.23041 14.6076 3.14642C14.8099 3.06243 15.0267 3.0194 15.2458 3.0194C15.4649 3.0194 15.6817 3.06243 15.884 3.14642C16.0863 3.23041 16.2701 3.35341 16.425 3.50831C16.5799 3.66315 16.7029 3.84697 16.7869 4.04926C16.8709 4.25155 16.9139 4.46839 16.9139 4.68748C16.9139 4.90657 16.8709 5.12341 16.7869 5.3257C16.7029 5.52799 16.5799 5.7118 16.425 5.86665L16.375 5.91665C16.1829 6.11298 16.054 6.36245 16.005 6.63277C15.956 6.90309 15.9891 7.18197 16.1 7.43331V7.49998C16.2056 7.74648 16.381 7.95672 16.6045 8.10478C16.828 8.25285 17.0902 8.33219 17.3583 8.33331H17.5C17.942 8.33331 18.366 8.50892 18.6785 8.82147C18.9911 9.13401 19.1666 9.55797 19.1666 9.99998C19.1666 10.442 18.9911 10.866 18.6785 11.1785C18.366 11.491 17.942 11.6667 17.5 11.6667H17.425C17.1569 11.6678 16.8947 11.7471 16.6712 11.8952C16.4476 12.0432 16.2723 12.2535 16.1666 12.5V12.5Z" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8333 3.33331H4.16667C3.24619 3.33331 2.5 4.07951 2.5 4.99998V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99998C17.5 4.07951 16.7538 3.33331 15.8333 3.33331Z" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 1.66669V5.00002" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66669 1.66669V5.00002" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 8.33331H17.5" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-[#148BAF] text-white rounded-lg px-4 py-2.5 font-happy-monkey flex items-center gap-2"
            >
              Hi, {user?.email?.split('@')[0] || 'klohbare'} 
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
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10">
                <button onClick={() => handleProfileAction('settings')} 
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#F7FFFF] font-happy-monkey">
                  Settings
                </button>
                <button onClick={() => handleProfileAction('profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#F7FFFF] font-happy-monkey">
                  Profile
                </button>
                <button onClick={() => handleProfileAction('appointments')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#F7FFFF] font-happy-monkey">
                  My Appointments
                </button>
                <button onClick={() => handleProfileAction('logout')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#148BAF] hover:bg-[#F7FFFF] font-happy-monkey">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* content-body container - takes remaining height */}
      <div className="content-body flex flex-1 overflow-hidden">
        {/* Sidebar - fixed height, no scroll */}
        <aside className="w-[110px] flex-shrink-0 border-r border-gray-100">
          <Sidebar />
        </aside>

        {/* Main content area - scrollable independently */}
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;