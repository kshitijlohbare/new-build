// Force styling function to be called on component mount
// Add this directly to FocusTimer.tsx

import { useEffect } from 'react';

export const useForceStyles = () => {
  useEffect(() => {
    // Force apply styling on mount
    const applyForcedStyles = () => {
      console.log("Applying forced styles for Focus Timer");
      
      // 1. Fix header
      const header = document.querySelector('[data-testid="focus-timer-header-bar"]') as HTMLElement;
      if (header) {
        header.style.background = 'none';
        header.style.backgroundColor = 'transparent';
        console.log("Applied header style");
      }
      
      // 2. Fix control buttons
      const playPauseButton = document.querySelector('[data-testid="play-pause-button"]') as HTMLElement;
      const stopButton = document.querySelector('[data-testid="stop-button"]') as HTMLElement;
      
      if (playPauseButton) {
        playPauseButton.style.padding = '0';
        console.log("Applied play/pause button style");
      }
      
      if (stopButton) {
        stopButton.style.padding = '0';
        console.log("Applied stop button style");
      }
      
      // 3. Fix music drawer
      const musicDrawer = document.querySelector('[data-testid="music-drawer"]') as HTMLElement;
      if (musicDrawer) {
        musicDrawer.style.background = '#fff';
        musicDrawer.style.display = 'flex';
        musicDrawer.style.alignItems = 'center';
        musicDrawer.style.justifyContent = 'center';
        musicDrawer.style.width = 'auto';
        musicDrawer.style.height = 'auto';
        console.log("Applied music drawer style");
        
        // Style buttons inside
        musicDrawer.querySelectorAll('button').forEach(btn => {
          (btn as HTMLElement).style.background = 'none';
          (btn as HTMLElement).style.borderRadius = '6px';
        });
      }
    };

    // Apply immediately
    applyForcedStyles();
    
    // Apply again after a short delay to ensure it catches any lazy-loaded elements
    const timeoutId = setTimeout(applyForcedStyles, 500);
    const timeoutId2 = setTimeout(applyForcedStyles, 1500);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, []);
  
  return null;
};
