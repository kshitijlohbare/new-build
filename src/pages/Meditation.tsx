import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-happy-monkey text-moody-primary">Meditation Timer</h1>
        <p className="text-moody-text font-happy-monkey lowercase">Follow the breathing circle for guided breathing</p>
      </div>

      <Card className="p-8 flex flex-col items-center space-y-8">
        <div className="relative">
          <div className={cn(
            "w-48 h-48 rounded-full border-4 border-moody-primary/20 flex items-center justify-center",
            isActive && "animate-breathe"
          )}>
            <div className="text-center space-y-2">
              <span className="text-4xl font-happy-monkey text-moody-primary">{formatTime(time)}</span>
              <Badge variant="secondary" className="font-happy-monkey lowercase">
                {currentPhase}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Button 
            onClick={toggleTimer}
            variant="outline" 
            className="w-32 font-happy-monkey lowercase"
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button 
            onClick={resetTimer}
            variant="ghost" 
            className="w-32 font-happy-monkey lowercase"
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Meditation;