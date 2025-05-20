import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const focusPresets = [
  { label: "quick focus", work: 5, break: 5 },
  { label: "pomodoro", work: 25, break: 5 },
  { label: "deep work", work: 45, break: 15 },
  { label: "balanced", work: 30, break: 10 },
  { label: "create", work: 15, break: 5 }, // Index 4
];

const musicOptions = [
  { name: "Ocean waves" },
  { name: "Wind chimes" },
  { name: "Cafe ambience" },
  { name: "White noise" },
  { name: "Rainfall" },
  { name: "Silence" },
];

// Sample data for focus history graph
const focusHistoryData = [
  { day: 'mon', workHours: 1.5, breakPercentage: 25 },
  { day: 'tue', workHours: 2.0, breakPercentage: 20 },
  { day: 'wed', workHours: 1.0, breakPercentage: 30 },
  { day: 'thu', workHours: 2.5, breakPercentage: 22 },
  { day: 'fri', workHours: 1.8, breakPercentage: 28 },
  { day: 'sat', workHours: 3.0, breakPercentage: 15 },
  { day: 'sun', workHours: 2.2, breakPercentage: 18 },
];

const FocusTimer = () => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null); // Allow null initially
  const [workTime, setWorkTime] = useState(20);
  const [breakTime, setBreakTime] = useState(8);
  const [cycles, setCycles] = useState(3);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timer, setTimer] = useState(20 * 60); // Initialize with default workTime
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(musicOptions[0].name);
  const [volume, setVolume] = useState(50); // Add volume state
  const [isWorkPhase, setIsWorkPhase] = useState(true); // Track work/break phase

  const createPresetIndex = focusPresets.findIndex(p => p.label === "create");

  // Timer logic
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;

    console.log(`Effect run: isRunning=${isRunning}, timer=${timer}`); // Log effect run

    if (isRunning && timer > 0) {
      console.log("Setting interval..."); // Log interval set
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      console.log(`Interval set with ID: ${intervalId}`);
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
       console.log("Timer reached 0, handling phase/cycle change.");
    } else {
       console.log("Condition not met for setting interval (timer paused or finished).");
    }

    // Cleanup function
    return () => {
      if (intervalId !== undefined) {
        console.log(`Cleanup: Clearing interval ID: ${intervalId}`); // Log interval clear
        clearInterval(intervalId);
      } else {
        console.log("Cleanup: No interval ID to clear.");
      }
    };
  }, [isRunning, timer, workTime, breakTime, cycles, currentCycle, isWorkPhase]); // Dependencies remain the same

  // Update timer ONLY when workTime, breakTime, or selectedPreset changes and timer is not running
   useEffect(() => {
    // The check for !isRunning inside the effect is sufficient.
    // We don't want this effect to run *because* isRunning changed.
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
      } else {
         // Handle case where no preset is selected or custom times are adjusted directly
         setTimer(workTime * 60);
         setIsWorkPhase(true);
         setCurrentCycle(1);
      }
    }
    // REMOVED isRunning from dependencies
   }, [selectedPreset, workTime, breakTime, createPresetIndex]);

  // Calculate percentages for slider track fill
  const workPercentage = ((workTime - 5) / (60 - 5)) * 100;
  const breakPercentage = ((breakTime - 1) / (30 - 1)) * 100;
  const volumePercentage = volume; // Volume is already 0-100

  return (
    <div className="flex flex-col gap-8 p-3 md:p-6 items-center w-full min-h-screen bg-gradient-to-b from-white to-[#F7FFFF]">
      <div className="text-center text-[#148BAF] text-4xl font-happy-monkey lowercase w-full pt-3 animate-pulse">get things done</div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 w-full flex flex-col gap-5">
        {/* Section: Presets */}
        <div className="mb-3">
          <h2 className="text-[#148BAF] font-happy-monkey text-xl mb-3 lowercase text-center">choose your focus style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 justify-center">
            {focusPresets.map((preset, idx) => (
              <div
                key={idx}
                className={`preset-card p-3 rounded-xl border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  selectedPreset === idx
                    ? "active bg-[#F7FFFF] border-[#04C4D5] border-2" : "bg-white hover:bg-[#F7FFFF]"
                }`}
                onClick={() => {
                  setSelectedPreset(idx);
                }}
              >
                <div className="text-center font-happy-monkey text-lg lowercase font-medium text-[#148BAF]">{preset.label}</div>
                <div className="text-center font-happy-monkey text-xs lowercase text-[#04C4D5] bg-[rgba(4,196,213,0.1)] px-2 py-0.5 rounded-full w-full">
                  {preset.work}m/{preset.break}m
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 mt-4">
          {/* Section: Customize Session */}
          {selectedPreset === createPresetIndex && (
            <div className="bg-white rounded-[20px] flex flex-col items-center p-5 w-full lg:w-1/3 border border-[rgba(4,196,213,0.3)] shadow-[1px_2px_8px_rgba(73,218,234,0.3)]">
              <div className="flex items-center justify-center mb-3 gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <div className="text-[#148BAF] font-happy-monkey text-xl lowercase">customize session</div>
              </div>
              
              <div className="w-full p-3 mb-3 bg-[rgba(4,196,213,0.05)] rounded-xl border border-[rgba(4,196,213,0.1)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#148BAF] font-happy-monkey text-sm lowercase font-medium">customize your focus intervals</span>
                  <div className="text-xs text-gray-500 font-happy-monkey lowercase">5-60 min / 1-30 min</div>
                </div>
              </div>
              
              <div className="flex justify-around h-[250px] gap-8 w-full">
                {/* Work Slider */}
                <div className="flex flex-col items-center h-full">
                  {/* Top Section */}
                  <div className="flex flex-col items-center">
                    {/* Work label at top */}
                    <div className="bg-[rgba(4,196,213,0.1)] text-[#148BAF] font-happy-monkey text-sm lowercase px-3 py-1 rounded-full mb-2">
                      work time
                    </div>
                    
                    {/* Improved work time display */}
                    <div className="bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white border-2 border-[#04C4D5] rounded-xl px-4 py-2 font-happy-monkey text-xl w-[60px] text-center shadow-[1px_2px_6px_rgba(73,218,234,0.3)]">{workTime}</div>
                    <span className="font-happy-monkey text-[#148BAF] text-xs mt-1 mb-4">minutes</span>
                  </div>
                  
                  {/* Middle Section - Slider */}
                  <div className="slider-container">
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={workTime}
                      onChange={e => setWorkTime(Number(e.target.value))}
                      className="vertical-rotated-slider"
                      style={{ 
                        '--slider-percentage': `${workPercentage}%`
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                
                {/* Break Slider */}
                <div className="flex flex-col items-center h-full">
                  {/* Top Section */}
                  <div className="flex flex-col items-center">
                    {/* Break label at top */}
                    <div className="bg-[rgba(4,196,213,0.1)] text-[#148BAF] font-happy-monkey text-sm lowercase px-3 py-1 rounded-full mb-2">
                      break time
                    </div>
                    
                    {/* Improved break time display */}
                    <div className="bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white border-2 border-[#04C4D5] rounded-xl px-4 py-2 font-happy-monkey text-xl w-[60px] text-center shadow-[1px_2px_6px_rgba(73,218,234,0.3)]">{breakTime}</div>
                    <span className="font-happy-monkey text-[#148BAF] text-xs mt-1 mb-4">minutes</span>
                  </div>
                  
                  {/* Middle Section - Slider */}
                  <div className="slider-container">
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={breakTime}
                      onChange={e => setBreakTime(Number(e.target.value))}
                      className="vertical-rotated-slider"
                      style={{ 
                        '--slider-percentage': `${breakPercentage}%`
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Section: Focus Session */}
          <div className="bg-white rounded-[20px] flex flex-col items-center gap-3 p-4 w-full lg:w-1/3 border border-[rgba(4,196,213,0.3)] shadow-[0px_4px_24px_rgba(4,196,213,0.2)]">
            <div className="text-[#148BAF] font-happy-monkey text-xl mb-1 lowercase">focus session</div>
            <div className="bg-[rgba(4,196,213,0.1)] text-[#148BAF] font-happy-monkey text-sm lowercase px-3 py-0.5 rounded-full">
              {isWorkPhase ? 'work phase' : 'break phase'}
            </div>
            <div className="flex gap-3 items-center">
              <div className="text-[#148BAF] font-happy-monkey text-base lowercase">cycle {currentCycle} of {cycles}</div>
              <span className="text-[#148BAF] font-happy-monkey text-base">|</span>
              <div className="text-[#148BAF] font-happy-monkey text-base lowercase">total: {workTime * cycles + breakTime * (cycles > 0 ? cycles - 1 : 0)} mins</div>
            </div>
            
            {/* Circular Timer */}
            <div className="timer-container my-4">
              <div className="timer-display">
                <div 
                  className="timer-progress"
                  style={{ 
                    '--progress-percentage': `${isWorkPhase 
                      ? 100 - (timer / (workTime * 60)) * 100
                      : 100 - (timer / (breakTime * 60)) * 100}%` 
                  } as React.CSSProperties}
                ></div>
                <div className="timer-inner">
                  <div className={`text-[#148BAF] font-happy-monkey text-5xl font-medium ${isRunning ? 'breathing-animation' : ''}`}>
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[#148BAF] font-happy-monkey text-base lowercase">cycles:</span>
              <button 
                className="w-8 h-8 bg-white hover:bg-[#F7FFFF] rounded-lg border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.2)] flex items-center justify-center disabled:opacity-50 transition-all" 
                onClick={() => setCycles(Math.max(1, cycles - 1))} 
                disabled={isRunning}
              >-</button>
              {/* Fixed text color and styling */}
              <div className="bg-white border-2 border-[#04C4D5] rounded-xl px-4 py-1 font-happy-monkey text-xl text-[#148BAF] min-w-[40px] text-center">{cycles}</div>
              <button 
                className="w-8 h-8 bg-white hover:bg-[#F7FFFF] rounded-lg border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.2)] flex items-center justify-center disabled:opacity-50 transition-all" 
                onClick={() => setCycles(cycles + 1)} 
                disabled={isRunning}
              >+</button>
            </div>
            <div className="flex gap-4 mt-2">
              {/* Toggle Play/Pause */}
              <button 
                className="px-6 py-3 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] hover:from-[#04C4D5] hover:to-[#0F6A85] rounded-full border-none shadow-md transition-all text-white font-happy-monkey flex items-center gap-2" 
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <>
                    <svg width="24" height="24" fill="white"><rect x="8" y="8" width="3" height="8" rx="1"/><rect x="13" y="8" width="3" height="8" rx="1"/></svg>
                    <span>pause</span>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    <span>start</span>
                  </>
                )}
              </button>
              {/* Reset Button */}
              <button
                className="px-4 py-3 bg-white hover:bg-[#F7FFFF] rounded-full border border-[#04C4D5] shadow-md transition-all text-[#148BAF] font-happy-monkey"
                onClick={() => {
                  setIsRunning(false);
                  setCurrentCycle(1);
                  setIsWorkPhase(true);
                  setTimer(workTime * 60); // Reset timer based on current workTime
                }}
              >
                reset
              </button>
            </div>
          </div>
          
          {/* Section: Add Music */}
          <div className="bg-white rounded-[20px] flex flex-col items-center p-5 w-full lg:w-1/3 border border-[rgba(4,196,213,0.3)] shadow-[1px_2px_8px_rgba(73,218,234,0.3)]">
            <div className="flex items-center justify-center mb-3 gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <div className="text-[#148BAF] font-happy-monkey text-xl lowercase">ambient sounds</div>
            </div>
            
            <div className="w-full p-3 mb-3 bg-[rgba(4,196,213,0.05)] rounded-xl border border-[rgba(4,196,213,0.1)]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#148BAF] font-happy-monkey text-sm lowercase font-medium">improve your focus with ambient sounds</span>
              </div>
            </div>
            
            <div className="flex w-full justify-between gap-4 flex-grow h-[200px]">
              {/* Music Options List */}
              <div className="flex flex-col gap-2 w-3/4 h-full overflow-y-auto pr-2 scrollbar-hide">
                {musicOptions.map((music) => (
                  <div
                    key={music.name}
                    className={`w-full px-3 py-3 rounded-lg border transition-all
                      ${selectedMusic === music.name 
                        ? "border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] bg-gradient-to-r from-[rgba(4,196,213,0.1)] to-[rgba(20,139,175,0.05)]" 
                        : "border-[rgba(4,196,213,0.2)] bg-white hover:bg-[rgba(4,196,213,0.03)]"}`}
                    onClick={() => setSelectedMusic(music.name)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedMusic === music.name ? "bg-[#04C4D5]" : "bg-[rgba(4,196,213,0.2)]"}`}></div>
                      <span className="text-[#148BAF] font-happy-monkey text-sm lowercase truncate">{music.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Vertical Volume Slider Column */}
              <div className="flex flex-col items-center h-full w-1/4">
                {/* Volume number display */}
                <div className="bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white border-2 border-[#04C4D5] rounded-xl px-3 py-1 font-happy-monkey text-sm w-[45px] text-center shadow-[1px_2px_6px_rgba(73,218,234,0.3)] mb-2">
                  {volume}
                </div>
                
                {/* Slider container with fixed dimensions */}
                <div className="slider-container">
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="vertical-rotated-slider"
                    style={{ 
                      '--slider-percentage': `${volumePercentage}%`
                    } as React.CSSProperties}
                  />
                </div>
                
                {/* Volume Icon */}
                <div className="mt-4 p-2 bg-[rgba(4,196,213,0.1)] rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {volume === 0 ? (
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    ) : volume < 50 ? (
                      <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </>
                    ) : (
                      <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section: Focus History */}
        <div className="bg-white rounded-[20px] flex flex-col items-center gap-4 p-4 w-full mt-6 max-w-5xl mx-auto border border-[rgba(4,196,213,0.3)] shadow-[1px_2px_8px_rgba(73,218,234,0.3)]">
          <div className="text-[#148BAF] font-happy-monkey text-xl mb-2 lowercase">focus history</div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusHistoryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(73, 218, 234, 0.2)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#148BAF" 
                  fontSize={14}
                  tick={{ fontFamily: 'Happy Monkey, cursive' }}
                />
                <YAxis 
                  yAxisId="left" 
                  fontSize={14}
                  orientation="left"
                  stroke="#148BAF" 
                  tick={{ fontFamily: 'Happy Monkey, cursive' }}
                  label={{ value: 'work hours', angle: -90, position: 'insideLeft', fill: '#148BAF', style: { textAnchor: 'middle', fontFamily: 'Happy Monkey, cursive' } }} 
                />
                <YAxis 
                  yAxisId="right" 
                  fontSize={14}
                  orientation="right" 
                  stroke="#04C4D5" 
                  tick={{ fontFamily: 'Happy Monkey, cursive' }}
                  label={{ value: 'break %', angle: 90, position: 'insideRight', fill: '#04C4D5', style: { textAnchor: 'middle', fontFamily: 'Happy Monkey, cursive' } }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(247, 255, 255, 0.95)',
                    borderColor: '#04C4D5',
                    fontFamily: 'Happy Monkey, cursive',
                    textAlign: 'center',
                    fontSize: '14px',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 4px 12px rgba(4, 196, 213, 0.15)'
                  }} 
                  labelStyle={{ color: '#148BAF', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontFamily: 'Happy Monkey, cursive',
                    paddingTop: '15px' 
                  }}
                  iconSize={12}
                  iconType="circle"
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="workHours" 
                  stroke="#148BAF" 
                  strokeWidth={3}
                  dot={{ stroke: '#148BAF', strokeWidth: 2, r: 4, fill: 'white' }} 
                  activeDot={{ r: 8, fill: '#148BAF', stroke: '#FFFFFF' }} 
                  name="work hours" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="breakPercentage" 
                  stroke="#04C4D5" 
                  strokeWidth={3} 
                  dot={{ stroke: '#04C4D5', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 8, fill: '#04C4D5', stroke: '#FFFFFF' }} 
                  name="break %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;