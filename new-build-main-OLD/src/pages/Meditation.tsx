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
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF] min-h-screen py-8 px-2">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-happy-monkey text-[#148BAF] lowercase tracking-wide drop-shadow">meditation & breathwork</h1>
        <p className="text-[#04C4D5] font-happy-monkey lowercase text-lg">calm your mind, focus your breath, and recharge</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-[24px] p-10 flex flex-col items-center space-y-10 border border-[rgba(4,196,213,0.3)] shadow-lg">
          <div className="relative">
            <div className={cn(
              "w-56 h-56 rounded-full border-8 border-[#04C4D5] flex items-center justify-center bg-white transition-all duration-300",
              isActive ? "animate-breathe" : ""
            )}>
              <div className="text-center space-y-3">
                <span className="text-5xl font-happy-monkey text-[#148BAF] tracking-wider">{formatTime(time)}</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-lg font-happy-monkey lowercase text-base font-medium border border-[rgba(4,196,213,0.3)] bg-[#F7FFFF] flex items-center gap-1" style={{ color: phaseLabels[currentPhase].color }}>
                    {phaseLabels[currentPhase].icon}
                    {phaseLabels[currentPhase].label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={toggleTimer}
              className="w-32 font-happy-monkey lowercase bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white px-4 py-2 rounded-lg transition-all shadow-md border-none flex items-center justify-center gap-2 text-lg"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'pause' : 'start'}
            </button>
            <button 
              onClick={resetTimer}
              className="w-32 font-happy-monkey lowercase bg-[#F7FFFF] text-[#148BAF] px-4 py-2 rounded-lg transition-all border border-[rgba(4,196,213,0.3)] flex items-center justify-center gap-2 text-lg"
            >
              <RotateCcw size={18} />
              reset
            </button>
          </div>

          <div className="w-full mt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#148BAF] font-happy-monkey text-base">
                <Brain size={18} />
                <span>5-min focus breathing (3:3:6 cycle)</span>
              </div>
              <ul className="list-disc ml-6 text-[#148BAF] text-sm font-happy-monkey">
                <li>Inhale for 3 seconds</li>
                <li>Hold for 3 seconds</li>
                <li>Exhale for 6 seconds</li>
                <li>Repeat for 5 minutes</li>
              </ul>
              <div className="flex items-center gap-2 text-[#04C4D5] font-happy-monkey text-base mt-2">
                <Heart size={18} />
                <span>Tip: Breathe through your nose and relax your shoulders</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-full bg-white rounded-[24px] border border-[rgba(4,196,213,0.3)] shadow-lg overflow-hidden">
            <MeditationEmbed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;