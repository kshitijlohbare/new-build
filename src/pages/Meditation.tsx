import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Brain, Heart, Wind, Pause, Play, RotateCcw, Palette, ChevronRight } from "lucide-react";

// CSS animations for meditation page
const meditationStyles = `
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes inhale {
  from { transform: scale(1); }
  to { transform: scale(1.3); }
}

@keyframes exhale {
  from { transform: scale(1.3); }
  to { transform: scale(1); }
}

@keyframes hold {
  from { transform: scale(1.3); }
  to { transform: scale(1.3); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slide-up {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
}

.animate-inhale {
  animation: inhale var(--phase-duration) ease-out forwards;
}

.animate-hold {
  animation: hold var(--phase-duration) linear forwards;
}

.animate-exhale {
  animation: exhale var(--phase-duration) ease-in forwards;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

.animate-progress {
  animation: progress linear forwards;
}

.circular-progress {
  transition: stroke-dashoffset 0.1s linear;
  transform: rotate(-90deg);
  transform-origin: center;
}
`;

// Meditation theme configurations
const meditationThemes = [
  {
    id: 'holographic',
    name: 'Holographic',
    src: 'https://my.spline.design/holographicmeditation-ZyZ2UOlIO8oYYmAO0ywBI5Id/',
    description: 'Ethereal holographic meditation experience'
  },
  {
    id: 'breathing',
    name: 'Breathing Portal',
    src: 'https://my.spline.design/breathingportalvisualmeditation-Es8XGr6Tohj6GGv3XtULXBjN/',
    description: 'Immersive breathing portal visualization'
  },
  {
    id: 'reality',
    name: 'Reality Designer',
    src: 'https://my.spline.design/youarearealitydesigner-kjiCziYr3wxyQn4APdmi2VZm/',
    description: 'Transform your reality through meditation'
  }
];

interface MeditationBackgroundProps {
  currentTheme: typeof meditationThemes[0];
}

const MeditationBackground = ({ currentTheme }: MeditationBackgroundProps) => {
  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <iframe 
        src={currentTheme.src}
        frameBorder='0' 
        width='100%' 
        height='100%'
        title={currentTheme.description}
        className="w-full h-full object-cover"
        allow="autoplay; fullscreen"
      ></iframe>
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
    </div>
  );
};

const phaseLabels: Record<string, { label: string; color: string; icon: JSX.Element; duration: number }> = {
  inhale: { label: "inhale", color: "#06C4D5", icon: <Wind className="inline-block mr-1 text-[#06C4D5]" size={18} />, duration: 3000 },
  hold: { label: "hold", color: "#06C4D5", icon: <Pause className="inline-block mr-1 text-[#06C4D5]" size={18} />, duration: 3000 },
  exhale: { label: "exhale", color: "#06C4D5", icon: <Wind className="inline-block mr-1 text-[#06C4D5] rotate-180" size={18} />, duration: 6000 },
};

const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const phaseTimerRef = useRef<number | null>(null);

  const currentTheme = meditationThemes[currentThemeIndex];

  // Get the next phase based on the current phase
  const getNextPhase = (phase: 'inhale' | 'hold' | 'exhale'): 'inhale' | 'hold' | 'exhale' => {
    switch (phase) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return 'inhale';
    }
  };

  // Timer for overall meditation session
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  // Breathing phase control and progress tracking
  useEffect(() => {
    if (isActive) {
      // Clear any existing interval
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }
      
      // Reset progress
      setPhaseProgress(0);
      
      // Get current phase duration
      const phaseDuration = phaseLabels[currentPhase].duration;
      
      // Track progress with more frequent updates for smoother animation
      const updateFrequency = 50; // Update progress every 50ms
      const totalSteps = phaseDuration / updateFrequency;
      let currentStep = 0;
      
      phaseTimerRef.current = window.setInterval(() => {
        currentStep++;
        setPhaseProgress(Math.min((currentStep / totalSteps) * 100, 100));
        
        if (currentStep >= totalSteps) {
          // Phase complete, move to next phase
          setCurrentPhase(getNextPhase(currentPhase));
          clearInterval(phaseTimerRef.current!);
        }
      }, updateFrequency);
      
      return () => {
        if (phaseTimerRef.current) {
          clearInterval(phaseTimerRef.current);
        }
      };
    } else {
      // If not active, clear any existing interval
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
        phaseTimerRef.current = null;
      }
    }
  }, [isActive, currentPhase]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(300);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const switchTheme = (themeIndex: number) => {
    setCurrentThemeIndex(themeIndex);
    setShowThemeSelector(false);
  };

  // Get the next phase for the display
  const nextPhase = getNextPhase(currentPhase);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Inject CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: meditationStyles }} />
      
      {/* Fullscreen Background */}
      <MeditationBackground currentTheme={currentTheme} />
      
      {/* Centered Timer Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col items-center space-y-6 sm:space-y-8 border border-white/30 shadow-2xl max-w-md w-full">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-happy-monkey text-[#208EB1] lowercase tracking-wide">
              meditation & breathwork
            </h1>
            <p className="text-[#06C4D5] font-happy-monkey lowercase text-sm sm:text-base">
              {currentTheme.description}
            </p>
          </div>

          {/* Timer Circle */}
          <div className="relative">
            {/* Guide circles (dotted lines) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed border-[#06C4D5]/30"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(32rem*1.2)] h-[calc(32rem*1.2)] sm:w-[calc(40rem*1.2)] sm:h-[calc(40rem*1.2)] md:w-[calc(48rem*1.2)] md:h-[calc(48rem*1.2)] rounded-full border-2 border-dashed border-[#06C4D5]/20"></div>
            
            {/* Circular progress indicator */}
            {isActive && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="none" 
                  stroke={`${currentPhase === 'inhale' ? '#06C4D5' : currentPhase === 'hold' ? '#06C4D5' : '#06C4D5'}`}
                  strokeWidth="2" 
                  strokeDasharray="289.03"
                  strokeDashoffset={(1 - phaseProgress / 100) * 289.03}
                  strokeLinecap="round"
                  className="circular-progress"
                  opacity="0.8"
                />
              </svg>
            )}
            
            {/* Main breathing circle */}
            <div 
              className={cn(
                "relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 sm:border-6 border-[#06C4D5] flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300",
                isActive && currentPhase === 'inhale' && "animate-inhale",
                isActive && currentPhase === 'hold' && "animate-hold",
                isActive && currentPhase === 'exhale' && "animate-exhale",
                !isActive && "transform scale-100"
              )}
              style={{
                '--phase-duration': `${
                  currentPhase === 'inhale' 
                    ? phaseLabels.inhale.duration / 1000 
                    : currentPhase === 'hold' 
                    ? phaseLabels.hold.duration / 1000 
                    : phaseLabels.exhale.duration / 1000
                }s`
              } as React.CSSProperties}
            >
              <div className="text-center space-y-1 sm:space-y-2 transition-all">
                <span className="text-2xl sm:text-3xl md:text-4xl font-happy-monkey text-[#208EB1] tracking-wider font-bold">
                  {formatTime(time)}
                </span>
                <div className="flex items-center justify-center">
                  <span className="px-2 sm:px-3 py-1 rounded-lg font-happy-monkey lowercase text-xs sm:text-sm font-medium border border-[rgba(6,196,213,0.3)] bg-white/80 backdrop-blur-sm flex items-center gap-1 shadow-sm" style={{ color: phaseLabels[currentPhase].color }}>
                    {phaseLabels[currentPhase].icon}
                    {phaseLabels[currentPhase].label}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Phase Progress and Next Phase Indicator */}
          {isActive && (
            <div className="w-full bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-[rgba(6,196,213,0.2)] shadow-sm">
              <div className="space-y-3">
                {/* Current phase with progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-happy-monkey">
                    <span style={{ color: phaseLabels[currentPhase].color }} className="font-medium">
                      {phaseLabels[currentPhase].icon} Current: {phaseLabels[currentPhase].label}
                    </span>
                    <span className="text-[#208EB1]">
                      {phaseProgress.toFixed()}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F7FFFF] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${phaseProgress}%`, 
                        backgroundColor: phaseLabels[currentPhase].color,
                        transition: 'width 0.1s linear'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Next phase indicator */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-happy-monkey">
                  <ChevronRight size={14} className="text-[#208EB1]" />
                  <span>Next: </span>
                  <span style={{ color: phaseLabels[nextPhase].color }} className="flex items-center font-medium">
                    {phaseLabels[nextPhase].icon}
                    {phaseLabels[nextPhase].label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3 sm:gap-4 w-full">
            <button 
              onClick={toggleTimer}
              className="flex-1 font-happy-monkey lowercase bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white px-4 py-3 sm:py-4 rounded-xl transition-all shadow-lg border-none flex items-center justify-center gap-2 text-sm sm:text-base hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? 'pause' : 'start'}
            </button>
            <button 
              onClick={resetTimer}
              className="flex-1 font-happy-monkey lowercase bg-white/90 backdrop-blur-sm text-[#208EB1] px-4 py-3 sm:py-4 rounded-xl transition-all border border-[rgba(6,196,213,0.3)] flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <RotateCcw size={16} />
              reset
            </button>
          </div>

          {/* Breathing Instructions */}
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[rgba(6,196,213,0.2)] shadow-sm">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-[#208EB1] font-happy-monkey text-sm sm:text-base">
                <Brain size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                <span>5-min focus breathing (3:3:6 cycle)</span>
              </div>
              <ul className="list-disc ml-6 text-[#208EB1] text-xs sm:text-sm font-happy-monkey space-y-1">
                <li>Inhale for 3 seconds</li>
                <li>Hold for 3 seconds</li>
                <li>Exhale for 6 seconds</li>
                <li>Repeat for 5 minutes</li>
              </ul>
              <div className="flex items-start gap-2 text-[#06C4D5] font-happy-monkey text-xs sm:text-sm mt-2">
                <Heart size={14} className="sm:w-[16px] sm:h-[16px] flex-shrink-0 mt-0.5" />
                <span>Tip: Breathe through your nose and relax your shoulders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Switcher - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="relative">
          {/* Theme Selector Panel */}
          {showThemeSelector && (
            <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/30 min-w-[280px] animate-slide-up">
              <div className="text-center mb-3">
                <h3 className="font-happy-monkey text-[#208EB1] text-lg lowercase">meditation themes</h3>
              </div>
              <div className="space-y-2">
                {meditationThemes.map((theme, index) => (
                  <button
                    key={theme.id}
                    onClick={() => switchTheme(index)}
                    className={`w-full p-3 rounded-xl transition-all text-left font-happy-monkey text-sm lowercase flex items-center gap-3 ${
                      currentThemeIndex === index 
                        ? 'bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white shadow-lg' 
                        : 'bg-white/80 text-[#208EB1] hover:bg-[#06C4D5]/10 border border-[rgba(6,196,213,0.2)]'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      currentThemeIndex === index ? 'bg-white' : 'bg-[#06C4D5]'
                    }`}></div>
                    <div>
                      <div className="font-medium">{theme.name}</div>
                      <div className={`text-xs ${currentThemeIndex === index ? 'text-white/80' : 'text-[#208EB1]'}`}>
                        {theme.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="bg-white/95 backdrop-blur-md text-[#208EB1] p-4 rounded-full shadow-2xl border border-white/30 transition-all hover:bg-white hover:scale-110 active:scale-95 group"
            title="Change meditation theme"
          >
            <Palette size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Click outside to close theme selector */}
      {showThemeSelector && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowThemeSelector(false)}
        ></div>
      )}
    </div>
  );
};

export default Meditation;