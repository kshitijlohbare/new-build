import { useState, useEffect, useRef } from "react";
import { usePractices } from "../../context/PracticeContext";
import PracticeDetailPopup from "./PracticeDetailPopup";
import DailyPracticeStatusIndicator from "./DailyPracticeStatusIndicator";

// Define mock userProgress for development purposes
// This would normally come from a context or prop
const userProgress = {
  totalPoints: 100,
  nextLevelPoints: 200,
  level: 1
};

// Helper function to calculate progress percentage
const calculateProgressPercentage = (currentPoints: number, nextLevelPoints: number): number => {
  if (nextLevelPoints === Infinity || nextLevelPoints <= 0) return 100; // Max level or invalid
  
  // Find the starting points of the current level to calculate progress within the level
  let levelStartPoints = 0;
  if (currentPoints >= 500) levelStartPoints = 500;
  else if (currentPoints >= 300) levelStartPoints = 300;
  else if (currentPoints >= 150) levelStartPoints = 150;
  else if (currentPoints >= 50) levelStartPoints = 50;
  
  const pointsInLevel = currentPoints - levelStartPoints;
  const pointsNeededForLevel = nextLevelPoints - levelStartPoints;
  
  if (pointsNeededForLevel <= 0) return 100;
  
  return Math.min(100, Math.max(0, (pointsInLevel / pointsNeededForLevel) * 100));
};

// Mock function is now commented out as it's not used yet
// const updatePracticeDuration = (practiceId: number, duration: number) => {
//   console.log(`Updating practice ${practiceId} duration to ${duration}`);
//   // Implementation would go here
// };

// Mock function for removing a practice (would normally be in context)
const removePractice = (practiceId: number, isTemp: boolean = false) => {
  console.log(`Removing practice ${practiceId}, temporary: ${isTemp}`);
  // Implementation would go here
};

const DailyPracticesSimple = () => {
  // Consume context
  const { practices, togglePracticeCompletion, isLoading } = usePractices();
  
  // Local state for UI interactions
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ practiceId: number; x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Status indicator for daily practice operations
  const [practiceStatus, setPracticeStatus] = useState<{
    status: 'idle' | 'adding' | 'added' | 'removing' | 'removed' | 'error';
    message?: string;
    practiceName?: string;
  }>({ status: 'idle' });

  // Use local Lottie animation data to avoid CORS issues
  useEffect(() => {
    // Handle clicks outside context menu
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter to show only daily practices
  const displayedPractices = practices.filter(p => p.isDaily === true);

  // Debug - Calculate progress percentage but not using it in the UI yet
  calculateProgressPercentage(userProgress.totalPoints, userProgress.nextLevelPoints);
  
  // Handler for practice click to show details
  const handlePracticeClick = (practiceId: number) => {
    setSelectedPracticeId(practiceId);
  };

  // Handler for removing a practice
  const handleRemovePractice = (practiceId: number) => {
    const practiceToRemove = practices.find(p => p.id === practiceId);
    removePractice(practiceId, true);
    
    // Update status display
    setPracticeStatus({
      status: 'removed',
      message: practiceToRemove ?
        `${practiceToRemove.name} removed from daily practices` :
        'Practice removed from daily practices'
    });
    
    setContextMenu(null);
  };

  return (
    <div className="daily-practices-container">
      {isLoading ? (
        <div className="loading-container">
          <p>Loading your daily practices...</p>
        </div>
      ) : displayedPractices.length === 0 ? (
        <div className="empty-practices-container">
          <p>You don't have any daily practices yet.</p>
          <button className="add-practice-button">
            Add Your First Daily Practice
          </button>
        </div>
      ) : (
        <>
          <div className="practices-grid">
            {displayedPractices.map((practice) => (
              <div
                key={practice.id}
                className="practice-card"
                onClick={() => handlePracticeClick(practice.id)}
              >
                <div className="practice-header">
                  <h3>{practice.name}</h3>
                  <span>{practice.duration || 0} min</span>
                </div>
                <div className="practice-actions">
                  <button 
                    className={`complete-button ${practice.completed ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePracticeCompletion(practice.id);
                    }}
                  >
                    {practice.completed ? 'Completed' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPracticeId && (
            <PracticeDetailPopup 
              practiceId={selectedPracticeId}
              onClose={() => setSelectedPracticeId(null)}
            />
          )}
          
          {contextMenu && (
            <div
              ref={contextMenuRef}
              className="context-menu"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button onClick={() => handleRemovePractice(contextMenu.practiceId)}>
                Remove from Daily Practices
              </button>
            </div>
          )}
          
          <div className="add-practice-container">
            <button className="add-practice-button">
              Add New Daily Practice
            </button>
          </div>
        </>
      )}
      
      {/* Status Indicator */}
      {practiceStatus.status !== 'idle' && (
        <DailyPracticeStatusIndicator
          status={practiceStatus.status}
          message={practiceStatus.message}
          onDismiss={() => setPracticeStatus({ status: 'idle' })}
          autoDismiss={true}
          autoDismissTime={3000}
        />
      )}
    </div>
  );
};

export default DailyPracticesSimple;
