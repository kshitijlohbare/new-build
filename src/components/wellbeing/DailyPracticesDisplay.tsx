import { useState } from 'react';
import { useDailyPractices } from '@/context/DailyPracticeContext';

/**
 * DailyPracticesDisplay component shows the user's daily practices 
 * and allows interaction with the enhanced practices system.
 */
export default function DailyPracticesDisplay() {
  const { 
    dailyPractices, 
    todayCompletedPractices,
    userPoints, 
    userStreaks,
    longestStreak,
    levelInfo,
    isLoading,
    error,
    addToDailyPractices,
    removeFromDailyPractices,
    completePractice,
    refreshDailyPractices
  } = useDailyPractices();
  
  const [selectedDuration, setSelectedDuration] = useState<number>(5);
  const [completionMessage, setCompletionMessage] = useState<string>('');

  // Get practice completion status
  const isPracticeCompletedToday = (practiceId: number) => {
    return todayCompletedPractices.some(
      completion => completion.practice_id === practiceId
    );
  };

  // Calculate total points earned today
  const todayPointsEarned = todayCompletedPractices.reduce(
    (total, completion) => total + completion.points_earned, 
    0
  );
  
  // Handle practice completion
  const handleCompletePractice = async (practiceId: number) => {
    console.log('[DailyPracticesDisplay] Completing practice', practiceId, 'with duration', selectedDuration);
    const pointsEarned = await completePractice(practiceId, selectedDuration);
    console.log('[DailyPracticesDisplay] RPC result:', pointsEarned);
    if (pointsEarned > 0) {
      setCompletionMessage(`🎉 You earned ${pointsEarned} points!`);
      setTimeout(() => setCompletionMessage(''), 3000);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading your daily practices...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={refreshDailyPractices}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="daily-practices-container">
      <div className="user-stats">
        <h2>Your Practice Journey</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Level</h3>
            <div className="level-display">
              <span className="level-number">{levelInfo.level}</span>
              <div className="level-progress-bar">
                <div 
                  className="level-progress-fill" 
                  style={{ width: `${levelInfo.progress}%` }}
                ></div>
              </div>
              <span className="next-level">
                {levelInfo.nextLevelPoints < Infinity 
                  ? `${levelInfo.progress}% to Level ${levelInfo.level + 1}`
                  : 'Max Level Reached!'}
              </span>
            </div>
          </div>
          
          <div className="stat-box">
            <h3>Total Points</h3>
            <div className="points-display">{userPoints}</div>
            <div className="today-points">
              Today: +{todayPointsEarned} points
            </div>
          </div>
          
          <div className="stat-box">
            <h3>Current Streak</h3>
            <div className="streak-display">
              <span className="streak-number">{userStreaks}</span>
              <span className="streak-label">days</span>
            </div>
            <div className="longest-streak">
              Longest: {longestStreak} days
            </div>
          </div>
        </div>
      </div>
      
      {completionMessage && (
        <div className="completion-message">{completionMessage}</div>
      )}
      
      <h2>Your Daily Practices</h2>
      {dailyPractices.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any daily practices yet.</p>
          <p>Add practices to start earning points and building streaks!</p>
        </div>
      ) : (
        <div className="daily-practices-list">
          {dailyPractices.map(practice => (
            <div 
              key={practice.id} 
              className={`practice-card ${isPracticeCompletedToday(practice.id) ? 'completed' : ''}`}
            >
              <div className="practice-content">
                <h3>{practice.name}</h3>
                <p>{practice.description}</p>
                <div className="practice-stats">
                  <span className="points-info">
                    {practice.points_per_minute || 1} points/minute
                  </span>
                </div>
              </div>
              
              <div className="practice-actions">
                {!isPracticeCompletedToday(practice.id) ? (
                  <>
                    <div className="duration-selector">
                      <label>Duration (min):</label>
                      <select 
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                      >
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                      </select>
                    </div>
                    <button 
                      className="complete-button"
                      onClick={() => handleCompletePractice(practice.id)}
                    >
                      Complete
                    </button>
                  </>
                ) : (
                  <div className="completed-tag">
                    ✓ Completed Today
                  </div>
                )}
                
                <button 
                  className="remove-button"
                  onClick={() => removeFromDailyPractices(practice.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
