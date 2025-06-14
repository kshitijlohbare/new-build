import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface BadgeAnimationProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export function BadgeAnimation({ 
  achievement, 
  onClose, 
  autoClose = true, 
  autoCloseTime = 5000 
}: BadgeAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-close logic
    let closeTimer: ReturnType<typeof setTimeout> | null = null;
    if (autoClose) {
      closeTimer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }

    return () => {
      clearTimeout(enterTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [autoClose, autoCloseTime]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 500); // Match this with the CSS animation time
  };

  if (!isVisible && isExiting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={handleClose} />
      <div 
        className={cn(
          "relative max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden pointer-events-auto transition-all duration-500 transform",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-10 opacity-0 scale-95",
          isExiting && "translate-y-10 opacity-0 scale-95"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching the background overlay
      >
        {/* Confetti effect at the top */}
        <div className="absolute -top-10 left-0 right-0 h-20 overflow-hidden flex justify-center">
          <div className="badge-confetti"></div>
        </div>
        
        {/* Close button (X icon) - Always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute right-3 top-3 p-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors text-[#148BAF] active:scale-95 z-10 shadow-sm border border-white/30"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 bg-gradient-to-b from-[#E6F9FA] to-white">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[rgba(83,252,255,0.20)] flex items-center justify-center mb-4 animate-pulse">
              <span className="text-5xl">{achievement.icon}</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-happy-monkey text-[#148BAF] mb-2 animate-bounce">
                Achievement Unlocked!
              </h2>
              <h3 className="text-xl font-happy-monkey text-[#04C4D5] mb-2">
                {achievement.name}
              </h3>
              <p className="text-base text-gray-600 mb-4">
                {achievement.description}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="px-5 py-2 bg-[#148BAF] text-white rounded-full font-happy-monkey lowercase hover:bg-[#04C4D5] transition-colors"
                >
                  awesome!
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-[#148BAF] rounded-full font-happy-monkey lowercase transition-colors"
                >
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeAnimation;