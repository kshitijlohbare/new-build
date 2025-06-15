import { useState, useEffect } from "react";
import PlayIconPath from '../assets/icons/play.svg';
import PauseIconPath from '../assets/icons/Pause.svg';
import StopIconPath from '../assets/icons/stop.svg';

// Music options array with SVG icons that match the reference image
const musicOptions = [
  { 
    id: 'ocean', 
    name: "Ocean waves", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h3v3H3V3zm4.5 0h3v3h-3V3zm4.5 0h3v3h-3V3zm4.5 0h3v3h-3V3zM3 7.5h3v3H3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3zM3 12h3v3H3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3zM3 16.5h3v3H3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3zm4.5 0h3v3h-3v-3z"/>
      </svg>
    )
  },
  { 
    id: 'wind', 
    name: "Wind chimes", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
      </svg>
    )
  },
  { 
    id: 'cafe', 
    name: "Cafe ambience", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 20h16v-4H4v4zm5-2h6v-2H9v2zM4 4v10h16V4H4zm5 8h6v-2H9v2zm0-4h6V6H9v2z"/>
      </svg>
    )
  },
  { 
    id: 'white', 
    name: "White noise", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm5 12.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    )
  },
  { 
    id: 'rain', 
    name: "Rainfall", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.66 8L12 2.35 6.34 8A8.02 8.02 0 004 13.64c0 2 .78 4.11 2.34 5.67a7.99 7.99 0 0011.32 0c1.56-1.56 2.34-3.67 2.34-5.67A8.02 8.02 0 0017.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>
      </svg>
    )
  },
  { 
    id: 'silence', 
    name: "Silence", 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    )
  }
];

const focusPresets = [
  { label: "quick focus", work: 15, break: 5 },
  { label: "quick focus", work: 15, break: 5 },
  { label: "quick focus", work: 15, break: 5 },
  { label: "quick focus", work: 15, break: 5 },
  { label: "create", work: 15, break: 5 }, // Index 4
];

const FocusTimer = () => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null); // Allow null initially
  const [workTime, setWorkTime] = useState(3); // Default to 3 minutes as shown in the design
  const [breakTime, setBreakTime] = useState(3); // Default to 3 minutes as shown in the design
  const [cycles, setCycles] = useState(3);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timer, setTimer] = useState(15 * 60); // Initialize with default workTime
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true); // Track work/break phase
  const [musicDrawerOpen, setMusicDrawerOpen] = useState(false); // State to control music drawer
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null); // Track selected music
  

  const createPresetIndex = focusPresets.findIndex(p => p.label === "create");

  // Function to toggle music drawer
  const toggleMusicDrawer = () => {
    setMusicDrawerOpen(prev => !prev);
  };

  // Function to handle music selection
  const handleMusicSelect = (musicId: string) => {
    setSelectedMusic(musicId === selectedMusic ? null : musicId);
    // Here you would add code to play the actual audio
    // For example: playAudio(musicId);
  };

  // Close the music drawer when clicking outside
  useEffect(() => {
    if (!musicDrawerOpen) return;
    
    // Use setTimeout to avoid the click event that opens the drawer from also closing it
    const timeoutId = setTimeout(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check if the click is outside the music drawer and music button
        if (target.closest('[data-testid="music-drawer"]') || target.closest('[data-testid="music-button"]')) {
          return;
        }
        
        setMusicDrawerOpen(false);
      };
  
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [musicDrawerOpen]);

  // Timer logic
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;

    if (isRunning && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isRunning && timer === 0) {
      // Timer finished, handle cycle/phase change
      if (isWorkPhase) {
        if (currentCycle < cycles) {
          setIsWorkPhase(false);
          setTimer(breakTime * 60);
        } else {
          // All cycles complete
          setIsRunning(false);
          // Reset or indicate completion
          setCurrentCycle(1);
          setIsWorkPhase(true);
          setTimer(workTime * 60); // Reset to initial work time
        }
      } else {
        // Break phase finished
        setIsWorkPhase(true);
        setCurrentCycle((prevCycle) => prevCycle + 1);
        setTimer(workTime * 60);
      }
    }

    // Cleanup function
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timer, workTime, breakTime, cycles, currentCycle, isWorkPhase]);

  // Update timer ONLY when workTime, breakTime, or selectedPreset changes and timer is not running
  useEffect(() => {
    if (!isRunning) {
      if (selectedPreset !== null && selectedPreset !== createPresetIndex) {
        const preset = focusPresets[selectedPreset];
        setWorkTime(preset.work);
        setBreakTime(preset.break);
        setTimer(preset.work * 60); // Reset timer to new work time
        setIsWorkPhase(true); // Ensure it starts with work phase
        setCurrentCycle(1); // Reset cycle count
      } else if (selectedPreset === createPresetIndex) {
        // When switching to 'create', keep custom times but reset timer display
        setTimer(workTime * 60);
        setIsWorkPhase(true);
        setCurrentCycle(1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset, createPresetIndex, isRunning]); // workTime and breakTime removed to prevent custom values from being overwritten by preset after selection

  // Effect to update timer when workTime or breakTime are changed in 'create' mode and timer is not running
  useEffect(() => {
    if (!isRunning && selectedPreset === createPresetIndex) {
      setTimer(workTime * 60);
      setIsWorkPhase(true);
      setCurrentCycle(1);
    }
  }, [workTime, breakTime, selectedPreset, createPresetIndex, isRunning]);


  // Time is directly formatted in the render

  // --- COMPONENT RENDER START ---
  return (
    <div data-testid="focus-timer-page" className="min-h-screen pb-28">
      {/* Main Container */}
      <div data-testid="focus-timer-container" className="container mx-auto">
        {/* Header Bar */}
        <header data-testid="focus-timer-header-bar" className="flex flex-col items-center justify-center">
          <p className="font-size-[#16px] font-['Happy_Monkey'] text-[#04C4D5] mt-2">get things done!</p>
        </header>

        {/* Timer Section */}
        <section data-testid="circular-timer-section" className="timer-container relative w-full">
          {/* Timer Circle */}
          <div data-testid="timer-circle" className="timer-display timer-display-responsive mx-auto">
            {/* Progress Bar */}
            <div 
              data-testid="timer-progress-bar"
              className="timer-progress"
              style={{ 
                '--progress-percentage': `${isWorkPhase 
                  ? ((workTime * 60 - timer) / (workTime * 60)) * 100 
                  : ((breakTime * 60 - timer) / (breakTime * 60)) * 100}%`
              } as React.CSSProperties}
            ></div>
            
            {/* Circular Embed Frame - sits between timer-progress-bar and timer-inner-display */}
            <div 
              data-testid="timer-circular-embed" 
              className="absolute w-[95%] h-[95%] rounded-full overflow-hidden"
              style={{
                left: "2.5%",
                top: "2.5%",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(4, 196, 213, 0.2)",
                boxShadow: "inset 0 0 10px rgba(4, 196, 213, 0.15)",
                zIndex: 0.5,
                // Mask to hide the Spline watermark at 95% of the container
                maskImage: "radial-gradient(circle, black 0%, black 95%, transparent 95%)",
                WebkitMaskImage: "radial-gradient(circle, black 0%, black 95%, transparent 95%)"
              }}
            >
              <div
                style={{
                  width: "125%", // 125% of parent size
                  height: "125%", // 125% of parent size
                  position: "relative",
                  left: "-12.5%", // Center the enlarged frame
                  top: "-12.5%", // Center the enlarged frame
                }}
              >
                <iframe 
                  src='https://my.spline.design/celestialflowabstractdigitalform-NJJy5Cn4bQDH6EQPVG5HSfBe/' 
                  frameBorder='0' 
                  width='100%' 
                  height='100%'
                  title="Celestial Flow Abstract Digital Form"
                  loading="eager"
                ></iframe>
              </div>
            </div>
            
            {/* Timer Inner Content */}
            <div 
              data-testid="timer-inner-display" 
              className="flex flex-col justify-center items-center p-0 gap-[10px] w-[157px] h-[149px] absolute"
              style={{
                left: "calc(50% - 157px/2 + 1px)",
                top: "calc(50% - 149px/2 + 0.5px)",
                zIndex: 1
              }}
            >
              {/* Work/Break Controls */}
              <div data-testid="work-break-controls" className="flex flex-row justify-center items-start p-0 gap-[10px] w-[149px] h-[26px]">
                {/* Work Control */}
                <div className="flex flex-row justify-center items-center p-0 gap-[4px] w-[67px] h-[26px]">
                  <span className="w-[37px] h-[16px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#148BAF]">work :</span>
                  <div 
                    data-testid="work-time-display" 
                    className="box-border flex flex-col justify-center items-center p-[4px_8px] gap-[10px] w-[26px] h-[26px] bg-white border border-[#04C4D5] rounded-[4px]"
                  >
                    <div className="w-[10px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] text-center uppercase text-[#148BAF]">{workTime}</div>
                  </div>
                </div>
                
                {/* Break Control */}
                <div className="flex flex-row justify-center items-center p-0 gap-[4px] w-[72px] h-[26px]">
                  <span className="w-[42px] h-[16px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#148BAF]">break :</span>
                  <div 
                    data-testid="break-time-display" 
                    className="box-border flex flex-col justify-center items-center p-[4px_8px] gap-[10px] w-[26px] h-[26px] bg-white border border-[#04C4D5] rounded-[4px]"
                  >
                    <div className="w-[10px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] text-center uppercase text-[#148BAF]">{breakTime}</div>
                  </div>
                </div>
              </div>
              
              {/* Timer Display */}
              <div data-testid="timer-time" className="w-[157px] h-[77px] font-['Happy_Monkey'] font-normal text-[64px] leading-[77px] lowercase text-[#000000
              ]">
                {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
              </div>
              
              {/* Cycles Control */}
              <div data-testid="cycles-control-section" className="flex flex-col items-center p-0 gap-[20px] w-[122px] h-[26px]">
                <div className="flex flex-row justify-center items-center p-0 gap-[4px] w-[122px] h-[26px]">
                  <span className="w-[44px] h-[16px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#148BAF]">cycles :</span>
                  
                  {/* Decrease Button */}
                  <button 
                    data-testid="decrease-cycles-button"
                    className="box-border flex flex-row justify-center items-center p-[4px] gap-[10px] w-[20px] h-[20px] max-w-[20px] max-h-[20px] bg-[#F7FFFF] border border-[#04C4D5] rounded-[4px]"
                    onClick={() => setCycles(Math.max(1, cycles - 1))}
                    style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
                  >
                    <div className="flex flex-row justify-center items-center p-0 gap-[10px] w-[8px] h-[2px]">
                      <div className="bg-[#148BAF] rounded-[0.5px] w-[8px] h-[2px]"></div>
                    </div>
                  </button>
                  
                  {/* Cycles Display */}
                  <div 
                    data-testid="cycles-display" 
                    className="box-border flex flex-col justify-center items-center p-[4px_8px] gap-[10px] w-[26px] h-[26px] bg-white border border-[#04C4D5] rounded-[4px]"
                  >
                    <div className="w-[10px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] text-center uppercase text-[#148BAF]">{cycles}</div>
                  </div>
                  
                  {/* Increase Button */}
                  <button 
                    data-testid="increase-cycles-button"
                    className="box-border flex flex-row justify-center items-center p-[4px] gap-[10px] w-[20px] h-[20px] max-w-[20px] max-h-[20px] bg-[#F7FFFF] border border-[#04C4D5] rounded-[4px]"
                    onClick={() => setCycles(Math.min(10, cycles + 1))}
                    style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
                  >
                    <div className="flex flex-row justify-center items-center p-0 gap-[10px] w-[8px] h-[8px]">
                      <div className="w-[8px] h-[8px] bg-[#148BAF] rounded-[0.5px] transform rotate-45"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* Star Icon */}
            <div data-testid="timer-star-icon" className="absolute top-[calc(50%_-_20px)] right-[-20px] transform translate-x-1/2 -translate-y-1/2 bg-[#148BAF] border-2 border-white w-10 h-10 flex items-center justify-center rounded-md shadow-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Focus Presets Section - Desktop Design Exactly as Per CSS */}
        <section data-testid="focus-presets-section" className="w-[360px] h-[225px] bg-[#F5F5F5] rounded-[20px] mx-auto relative hidden md:block">
          {/* Focus Presets Container */}
          <div className="relative w-full h-full">
            {/* First Preset - Top Left */}
            <button
              data-testid="focus-preset-button-0"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] absolute w-[165px] h-[62px] left-[10px] top-[10px] ${
                selectedPreset === 0 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(0)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="w-[105px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[0].label}
              </div>
              <div className="w-[55px] h-[32px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[0].work} min, b: {focusPresets[0].break} min
              </div>
            </button>
            
            {/* Second Preset - Top Right */}
            <button
              data-testid="focus-preset-button-1"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] absolute w-[165px] h-[62px] left-[185px] top-[10px] ${
                selectedPreset === 1 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(1)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="w-[105px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[1].label}
              </div>
              <div className="w-[55px] h-[32px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[1].work} min, b: {focusPresets[1].break} min
              </div>
            </button>
            
            {/* Third Preset - Middle Left */}
            <button
              data-testid="focus-preset-button-2"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] absolute w-[165px] h-[62px] left-[10px] top-[81.67px] ${
                selectedPreset === 2 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(2)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="w-[105px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[2].label}
              </div>
              <div className="w-[55px] h-[32px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[2].work} min, b: {focusPresets[2].break} min
              </div>
            </button>
            
            {/* Fourth Preset - Middle Right */}
            <button
              data-testid="focus-preset-button-3"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] absolute w-[165px] h-[62px] left-[185px] top-[81.67px] ${
                selectedPreset === 3 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(3)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="w-[105px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[3].label}
              </div>
              <div className="w-[55px] h-[32px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[3].work} min, b: {focusPresets[3].break} min
              </div>
            </button>
            
            {/* Create Preset - Bottom (Full Width) */}
            <button 
              data-testid="create-preset-button"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] absolute w-[340px] h-[62px] left-[10px] top-[153.33px] ${
                selectedPreset === createPresetIndex 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(createPresetIndex)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="w-[59px] h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[createPresetIndex].label}
              </div>
              <div className="w-[55px] h-[32px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {workTime} min, b: {breakTime} min
              </div>
            </button>
          </div>
        </section>
        
        {/* Mobile Focus Presets Section - Responsive Design for Small Screens */}
        <section data-testid="focus-presets-section-mobile" className="w-[95%] bg-[#F5F5F5] rounded-[20px] mx-auto block md:hidden py-3 px-3">
          <div className="grid grid-cols-2 gap-3">
            {/* First Preset - Mobile */}
            <button
              data-testid="focus-preset-button-mobile-0"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] h-[62px] ${
                selectedPreset === 0 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(0)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[0].label}
              </div>
              <div className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[0].work} min, b: {focusPresets[0].break} min
              </div>
            </button>
            
            {/* Second Preset - Mobile */}
            <button
              data-testid="focus-preset-button-mobile-1"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] h-[62px] ${
                selectedPreset === 1 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(1)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[1].label}
              </div>
              <div className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[1].work} min, b: {focusPresets[1].break} min
              </div>
            </button>
            
            {/* Third Preset - Mobile */}
            <button
              data-testid="focus-preset-button-mobile-2"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] h-[62px] ${
                selectedPreset === 2 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(2)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[2].label}
              </div>
              <div className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[2].work} min, b: {focusPresets[2].break} min
              </div>
            </button>
            
            {/* Fourth Preset - Mobile */}
            <button
              data-testid="focus-preset-button-mobile-3"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] h-[62px] ${
                selectedPreset === 3 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(3)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[3].label}
              </div>
              <div className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {focusPresets[3].work} min, b: {focusPresets[3].break} min
              </div>
            </button>
            
            {/* Create Preset - Mobile (Full Width) */}
            <button 
              data-testid="create-preset-button-mobile"
              className={`box-border flex flex-col justify-center items-center p-[4px_8px] gap-[4px] h-[62px] col-span-2 ${
                selectedPreset === createPresetIndex 
                  ? 'bg-[rgba(83,252,255,0.1)]' 
                  : 'bg-white'
              } border border-[#04C4D5] rounded-[8px]`}
              onClick={() => setSelectedPreset(createPresetIndex)}
              style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className="font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase text-[#148BAF] order-0">
                {focusPresets[createPresetIndex].label}
              </div>
              <div className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#04C4D5] order-1">
                w: {workTime} min, b: {breakTime} min
              </div>
            </button>
          </div>
        </section>

        {/* Player Controls Section */}
        <footer data-testid="player-controls-container" className="fixed inset-0 z-50 pointer-events-none">
          {/* Player Controls Center Panel - Fixed 20px from bottom and centered */}
          <div 
            data-testid="player-controls-center-panel" 
            className="absolute left-1/2 bottom-[20px] transform -translate-x-1/2 flex justify-center items-center gap-[20px] py-1.5 px-5 bg-[#FCDF4D] rounded-full border-2 border-white shadow-2xl pointer-events-auto"
          >
            {/* Play/Pause Button */}
            <button 
              data-testid="play-pause-button"
              onClick={() => setIsRunning(!isRunning)}
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? (
                <img src={PauseIconPath} alt="Pause" className="w-11 h-11" />
              ) : (
                <img src={PlayIconPath} alt="Play" className="w-11 h-11" />
              )}
            </button>
            {/* Stop Button */}
            <button 
              data-testid="stop-button" 
              onClick={() => {
                setIsRunning(false);
                setCurrentCycle(1);
                setIsWorkPhase(true);
                if (selectedPreset !== null && selectedPreset !== createPresetIndex) {
                  const preset = focusPresets[selectedPreset];
                  setTimer(preset.work * 60);
                } else {
                  setTimer(workTime * 60); 
                }
              }}
              aria-label="Reset timer"
            >
              <img src={StopIconPath} alt="Stop" className="w-11 h-11" />
            </button>
          </div>
          
          {/* Music Button and Drawer - Positioned on the right side */}
          <div className="absolute right-[20px] bottom-[20px] w-16 h-16 pointer-events-auto">
            <button 
                data-testid="music-button"
                className={`w-16 h-16 bg-[#FCDF4D] rounded-full flex items-center justify-center border-2 border-white shadow-2xl pointer-events-auto hover:bg-[#cbeef2] transition-colors active:scale-90 ${selectedMusic ? 'bg-[#148BAF] text-white' : ''}`}
                onClick={() => toggleMusicDrawer()}
                aria-label="Open music options"
              >
              <svg width="26" height="30" viewBox="0 0 21 24" fill={selectedMusic ? "white" : "#148BAF"}>
                <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"/>
              </svg>
            </button>
            {/* Music Drawer Popup */}
            {musicDrawerOpen && (
              <div 
                data-testid="music-drawer"
                className="absolute w-[314px] h-[52px] py-1 px-3 bg-[#148BAF] border border-white shadow-lg rounded-3xl flex flex-row items-center justify-center gap-2"
                style={{ 
                  boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)",
                  zIndex: 60,
                  transform: "rotate(-90deg)",
                  bottom: "130px",
                  right: "-130px",
                }}
              >
                {musicOptions.map((option) => (
                  <button
                    key={option.id}
                    data-testid={`music-option-${option.id}`}
                    className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center transition-all ${
                      selectedMusic === option.id 
                        ? 'bg-white border border-[#04C4D5] text-[#148BAF]' 
                        : 'bg-[rgba(83,252,255,0.1)] border border-white text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent clicking from closing the drawer
                      handleMusicSelect(option.id);
                    }}
                    aria-label={`Play ${option.name}`}
                    style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
  // --- COMPONENT RENDER END ---
};

export default FocusTimer;
