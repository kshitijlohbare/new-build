import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Predefined meditation websites for embeds
const meditationWebsites = [
  { name: "Calm", url: "https://www.calm.com/meditate" },
  { name: "Headspace", url: "https://www.headspace.com/meditation" },
  { name: "Insight Timer", url: "https://insighttimer.com/" },
  { name: "Mindful", url: "https://www.mindful.org/meditation/" },
  { name: "UCLA Mindful", url: "https://www.uclahealth.org/marc/mindful-meditations" }
];

// Website Embedder Component
const EmbeddedWebsite = () => {
  const [url, setUrl] = useState<string>("");
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCustomUrl, setIsCustomUrl] = useState<boolean>(false);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleLoad = () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setActiveUrl(url);
  };

  const selectPresetWebsite = (websiteUrl: string) => {
    setUrl(websiteUrl);
    setActiveUrl(websiteUrl);
    setIsCustomUrl(false);
    setError("");
  };

  const toggleCustomUrl = () => {
    setIsCustomUrl(!isCustomUrl);
    if (!isCustomUrl) {
      setUrl("");
      setActiveUrl("");
    }
  };

  return (
    <Card className="p-6 mt-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-happy-monkey text-moody-primary">External Meditation Resources</h2>
        
        <div className="flex flex-wrap gap-2">
          {meditationWebsites.map((website) => (
            <Button
              key={website.name}
              variant={activeUrl === website.url ? "default" : "outline"}
              className="font-happy-monkey lowercase"
              onClick={() => selectPresetWebsite(website.url)}
            >
              {website.name}
            </Button>
          ))}
          <Button
            variant={isCustomUrl ? "default" : "outline"}
            className="font-happy-monkey lowercase"
            onClick={toggleCustomUrl}
          >
            Custom
          </Button>
        </div>

        {isCustomUrl && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-moody-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-moody-primary/30"
              />
              <Button 
                onClick={handleLoad}
                className="font-happy-monkey lowercase"
              >
                Load
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}

        {activeUrl && (
          <div className="border border-moody-primary/20 rounded-lg overflow-hidden h-[500px]">
            <iframe
              src={activeUrl}
              title="Embedded Meditation Website"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Card>
  );
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4">
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
      
      {/* Add the embedded website component */}
      <EmbeddedWebsite />
    </div>
  );
};

export default Meditation;