// filepath: /Users/kshitijlohbare/Downloads/new build/src/pages/Community.tsx
import { useState } from 'react';
import CommunityTopNavBar from "../components/community/CommunityTopNavBar";
import GroupMessages from "./GroupMessages";

// Premium CSS animation keyframes with glassmorphism effects
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-down {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

export default function Community() {
  const [activeView, setActiveView] = useState<'newsfeed' | 'community' | 'profile'>('community');

  const renderContent = () => {
    switch (activeView) {
      case 'community':
        // Default view showing both groups and messages
        return <GroupMessages />;
      case 'newsfeed':
        // Placeholder for news feed view
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] px-5">
            <div className="text-center py-12 bg-[#F7FFFF] rounded-lg border border-[#04C4D5] w-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#04C4D5" className="mx-auto mb-4">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"></path>
                <path d="M3 8h18"></path>
                <path d="M9 21V8"></path>
              </svg>
              <h3 className="text-lg font-medium text-[#208EB1] mb-2">News Feed Coming Soon</h3>
              <p className="text-[#208EB1]">Stay tuned for updates from your community!</p>
            </div>
          </div>
        );
      case 'profile':
        // Placeholder for profile view
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] px-5">
            <div className="text-center py-12 bg-[#F7FFFF] rounded-lg border border-[#04C4D5] w-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#04C4D5" className="mx-auto mb-4">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              </svg>
              <h3 className="text-lg font-medium text-[#208EB1] mb-2">Profile View Coming Soon</h3>
              <p className="text-[#208EB1]">Your profile page is under construction!</p>
            </div>
          </div>
        );
      default:
        return <GroupMessages />;
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Top Navigation Bar - With 3 sections based on the active view */}
      <CommunityTopNavBar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Content section */}
      {renderContent()}
    </div>
  );
}
