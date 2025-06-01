import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Brain, Heart, Wind, Pause, Play, RotateCcw } from "lucide-react";

const MeditationEmbed = () => {
  return (
    <div className="w-full aspect-square max-w-3xl mx-auto overflow-hidden">
      <iframe 
        src='https://my.spline.design/holographicmeditation-ZyZ2UOlIO8oYYmAO0ywBI5Id/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        title="Holographic Meditation Visualization"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

const phaseLabels: Record<string, { label: string; color: string; icon: JSX.Element }> = {
  inhale: { label: "inhale", color: "#10B981", icon: <Wind className="inline-block mr-1 text-[#10B981]" size={18} /> },
  hold: { label: "hold", color: "#F59E42", icon: <Pause className="inline-block mr-1 text-[#F59E42]" size={18} /> },
  exhale: { label: "exhale", color: "#3B82F6", icon: <Wind className="inline-block mr-1 text-[#3B82F6] rotate-180" size={18} /> },
};

const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

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

  useEffect(() => {
    if (isActive) {
      const breathingInterval = setInterval(() => {
        setCurrentPhase(phase => {
          switch (phase) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'inhale';
          }
        });
      }, 4000);

      return () => clearInterval(breathingInterval);
    }
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(300);
    setCurrentPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF] min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6">
      <div className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-happy-monkey text-[#148BAF] lowercase tracking-wide drop-shadow">
          meditation & breathwork
        </h1>
        <p className="text-[#04C4D5] font-happy-monkey lowercase text-base sm:text-lg">
          calm your mind, focus your breath, and recharge
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        <div className="bg-white rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-10 flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-10 border border-[rgba(4,196,213,0.3)] shadow-lg">
          <div className="relative">
            <div className={cn(
              "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 sm:border-6 md:border-8 border-[#04C4D5] flex items-center justify-center bg-white transition-all duration-300",
              isActive ? "animate-breathe" : ""
            )}>
              <div className="text-center space-y-2 sm:space-y-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-happy-monkey text-[#148BAF] tracking-wider">
                  {formatTime(time)}
                </span>
                <div className="flex items-center justify-center">
                  <span className="px-2 sm:px-3 py-1 rounded-lg font-happy-monkey lowercase text-sm sm:text-base font-medium border border-[rgba(4,196,213,0.3)] bg-[#F7FFFF] flex items-center gap-1" style={{ color: phaseLabels[currentPhase].color }}>
                    {phaseLabels[currentPhase].icon}
                    {phaseLabels[currentPhase].label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={toggleTimer}
              className="flex-1 sm:w-32 font-happy-monkey lowercase bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white px-4 py-2 sm:py-3 rounded-lg transition-all shadow-md border-none flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'pause' : 'start'}
            </button>
            <button 
              onClick={resetTimer}
              className="flex-1 sm:w-32 font-happy-monkey lowercase bg-[#F7FFFF] text-[#148BAF] px-4 py-2 sm:py-3 rounded-lg transition-all border border-[rgba(4,196,213,0.3)] flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              <RotateCcw size={18} />
              reset
            </button>
          </div>

          <div className="w-full mt-4 sm:mt-6">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-[#148BAF] font-happy-monkey text-sm sm:text-base">
                <Brain size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                <span>5-min focus breathing (3:3:6 cycle)</span>
              </div>
              <ul className="list-disc ml-4 sm:ml-6 text-[#148BAF] text-xs sm:text-sm font-happy-monkey space-y-1">
                <li>Inhale for 3 seconds</li>
                <li>Hold for 3 seconds</li>
                <li>Exhale for 6 seconds</li>
                <li>Repeat for 5 minutes</li>
              </ul>
              <div className="flex items-start gap-2 text-[#04C4D5] font-happy-monkey text-sm sm:text-base mt-2">
                <Heart size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0 mt-0.5" />
                <span>Tip: Breathe through your nose and relax your shoulders</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-full bg-white rounded-2xl sm:rounded-[24px] border border-[rgba(4,196,213,0.3)] shadow-lg overflow-hidden">
            <MeditationEmbed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;