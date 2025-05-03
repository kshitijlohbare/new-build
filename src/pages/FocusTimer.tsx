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
  { label: "quick focus", work: 15, break: 5 },
  { label: "quick focus", work: 15, break: 5 },
  { label: "quick focus", work: 15, break: 5 },
  { label: "create", work: 15, break: 5 }, // Index 4
];

const musicOptions = [
  "Ocene waves",
  "wind chimes",
  "cafe ambience",
  "white noise",
  "rainfall",
  "Silence",
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
  const [selectedMusic, setSelectedMusic] = useState(musicOptions[0]);
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
    <div className="flex flex-col gap-10 p-2 md:p-5 items-center w-full min-h-screen">
      <div className="text-center text-[#04C4D5] text-3xl font-happy-monkey lowercase w-full">get things done</div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-wrap justify-center gap-2">
          {focusPresets.map((preset, idx) => (
            <div
              key={idx}
              className={`w-[205px] p-2 rounded-lg border outline outline-1 outline-[#04C4D5] shadow-md flex flex-col items-center gap-1 cursor-pointer ${
                selectedPreset === idx
                  ? "bg-[#148BAF] text-white" : "bg-white text-[#148BAF]"
              }`}
              onClick={() => {
                setSelectedPreset(idx);
                // No need to set work/break time here, useEffect handles it
              }}
            >
              <div className={`text-center font-happy-monkey text-base lowercase ${selectedPreset === idx ? "text-white" : "text-[#148BAF]"}`}>{preset.label}</div>
              <div className={`text-center font-happy-monkey text-sm lowercase ${selectedPreset === idx ? "text-white" : "text-[#04C4D5]"}`}>work: {preset.work} min<br/>break : {preset.break} mins</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start gap-4 mt-6">
          {/* Customize session - Conditionally render with width: fit-content and standardized height */}
          {selectedPreset === createPresetIndex && (
            <div className="bg-[#53FCFF1A] rounded-lg flex flex-col items-center gap-5 p-5 w-fit h-[350px]">
              <div className="text-[#148BAF] font-happy-monkey text-base lowercase">customize session</div>
              <div className="flex justify-around h-[220px] gap-4">
                {/* Work Slider */}
                <div className="flex flex-col items-center justify-start h-full">
                  {/* Fixed text color to black/dark */}
                  <div className="bg-white border outline outline-1 outline-[#04C4D5] rounded px-2 py-1 font-happy-monkey text-lg w-[50px] text-center text-black">{workTime}</div>
                  <span className="font-happy-monkey text-black text-xs mt-1">min</span>
                  <div className="flex-grow flex items-center justify-center w-full py-2">
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={workTime}
                      onChange={e => setWorkTime(Number(e.target.value))}
                      className="vertical-rotated-slider"
                      style={{ '--slider-percentage': `${workPercentage}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="text-[#148BAF] font-happy-monkey text-base">work</span>
                </div>
                {/* Break Slider */}
                <div className="flex flex-col items-center justify-start h-full">
                  {/* Fixed text color to black/dark */}
                  <div className="bg-white border outline outline-1 outline-[#04C4D5] rounded px-2 py-1 font-happy-monkey text-lg w-[50px] text-center text-black">{breakTime}</div>
                  <span className="font-happy-monkey text-black text-xs mt-1">min</span>
                  <div className="flex-grow flex items-center justify-center w-full py-2">
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={breakTime}
                      onChange={e => setBreakTime(Number(e.target.value))}
                      className="vertical-rotated-slider"
                      style={{ '--slider-percentage': `${breakPercentage}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="text-[#148BAF] font-happy-monkey text-base">break</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Focus session */}
          <div className="bg-[#53FCFF1A] rounded-lg flex flex-col items-center gap-2 p-5 min-w-[350px] h-[350px]">
            <div className="text-[#148BAF] font-happy-monkey text-base lowercase">
              {isWorkPhase ? 'work phase' : 'break phase'}
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-[#148BAF] font-happy-monkey text-base lowercase">cycle {currentCycle} of {cycles}</div>
              <span className="text-[#148BAF] font-happy-monkey text-base">|</span>
              <div className="text-[#148BAF] font-happy-monkey text-base lowercase">total time : {workTime * cycles + breakTime * (cycles > 0 ? cycles -1 : 0)} mins</div>
            </div>
            <div className="bg-white rounded-lg flex flex-col items-center justify-center w-[300px] h-[120px] my-2">
              {/* Fixed text color to #148BAF */}
              <div className="text-[#148BAF] font-happy-monkey text-5xl">{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#148BAF] font-happy-monkey text-sm">cycles :</span>
              <button className="w-5 h-5 bg-[#FFFFFF] shadow-md rounded outline outline-1 outline-[#04C4D5] flex items-center justify-center disabled:opacity-50" onClick={() => setCycles(Math.max(1, cycles - 1))} disabled={isRunning}>-</button>
              {/* Fixed text color to black */}
              <div className="bg-white border outline outline-1 outline-[#04C4D5] rounded px-2 py-1 font-happy-monkey text-base text-black">{cycles}</div>
              <button className="w-5 h-5 bg-[#FFFFFF] shadow-md rounded outline outline-1 outline-[#04C4D5] flex items-center justify-center disabled:opacity-50" onClick={() => setCycles(cycles + 1)} disabled={isRunning}>+</button>
            </div>
            <div className="flex gap-2 mt-2">
              {/* Toggle Play/Pause */}
              <button className="p-2 bg-[#FFFFFF] shadow-md rounded outline outline-1 outline-[#04C4D5]" onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? (
                  <svg width="24" height="24" fill="#148BAF"><rect x="8" y="8" width="3" height="8" rx="1"/><rect x="13" y="8" width="3" height="8" rx="1"/></svg> // Pause Icon
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#148BAF"><path d="M8 5v14l11-7z"/></svg> // Play Icon
                )}
              </button>
              {/* Reset Button */}
              <button
                className="p-2 bg-[#FFFFFF] shadow-md rounded outline outline-1 outline-[#04C4D5]"
                onClick={() => {
                  setIsRunning(false);
                  setCurrentCycle(1);
                  setIsWorkPhase(true);
                  setTimer(workTime * 60); // Reset timer based on current workTime
                }}
              >
                <svg width="24" height="24" fill="#148BAF"><rect x="6" y="6" width="12" height="12" rx="2"/></svg> {/* Stop/Reset Icon */}
              </button>
            </div>
          </div>
          
          {/* Add music - Full Height containers and standardized height */}
          <div className="bg-[#53FCFF1A] rounded-lg flex flex-col items-center gap-5 p-5 min-w-[300px] h-[350px]">
            <div className="text-[#148BAF] font-happy-monkey text-base lowercase w-full text-center">add music to the session</div>
            <div className="flex w-full justify-between gap-4 flex-grow">
              {/* Music Options List */}
              <div className="flex flex-col gap-2 w-3/4 h-full overflow-y-auto scrollbar-hide">
                {musicOptions.map((music) => (
                  <div
                    key={music}
                    className={`w-full px-2 py-1 rounded bg-white flex items-center gap-2 cursor-pointer
                      ${selectedMusic === music ? "shadow-md outline outline-1 outline-[#49DADD]" : ""}`}
                    onClick={() => setSelectedMusic(music)}
                  >
                    {/* Added text-center class and w-full to center the text */}
                    <span className="text-[#148BAF] font-happy-monkey text-sm lowercase truncate text-center w-full py-1.5">{music}</span>
                  </div>
                ))}
              </div>
              {/* Vertical Volume Slider Column - Reduced gap between slider and icon */}
              <div className="flex flex-col items-center justify-start h-full w-1/4">
                {/* Slider takes most space */}
                <div className="flex-grow flex items-center justify-center w-full">
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="vertical-rotated-slider"
                    style={{ '--slider-percentage': `${volumePercentage}%` } as React.CSSProperties}
                  />
                </div>
                {/* Volume Icon - Reduced top margin */}
                <div className="mt-0"> {/* Removed gap and added minimal/no margin */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        {/* Focus History Graph */}
        <div className="bg-[#53FCFF1A] rounded-lg flex flex-col items-center gap-5 p-5 w-full mt-6 max-w-4xl mx-auto">
          <div className="text-[#148BAF] font-happy-monkey text-base lowercase w-full text-center">YOUR WEEKLY ACTIVITY TREND</div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusHistoryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(73, 218, 234, 0.2)" />
                <XAxis dataKey="day" stroke="#148BAF" fontSize={14} />
                <YAxis 
                  yAxisId="left" 
                  fontSize={14}
                  orientation="left"
                  stroke="#148BAF" 
                  label={{ value: 'work hours', angle: -90, position: 'insideLeft', fill: '#148BAF', style: { textAnchor: 'middle' } }} 
                />
                <YAxis 
                  yAxisId="right" 
                  fontSize={14}
                  orientation="right" 
                  stroke="#04C4D5" 
                  label={{ value: 'break %', angle: 90, position: 'insideRight', fill: '#04C4D5', style: { textAnchor: 'middle' } }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(247, 255, 255, 0.9)',
                    borderColor: '#49DADD',
                    fontFamily: 'Happy Monkey, cursive',
                    textAlign: 'center',
                    fontSize: '14px',
                    borderRadius: '4px'
                  }} 
                  labelStyle={{ color: '#148BAF' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Righteous, cursive' }} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="workHours" 
                  stroke="#148BAF" 
                  strokeWidth={2} 
                  activeDot={{ r: 8, fill: '#148BAF', stroke: '#FFFFFF' }} 
                  name="work hours" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="breakPercentage" 
                  stroke="#04C4D5" 
                  strokeWidth={2} 
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