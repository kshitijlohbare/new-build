// React is automatically imported by the JSX transform
import { usePractices } from '@/context/PracticeContext';
import { useAchievement } from '@/context/AchievementContext';

const TestAchievements = () => {
  const { addPointsForAction, togglePracticeCompletion, practices, userProgress } = usePractices();
  const { showAchievementPopup } = useAchievement();

  // Find practice IDs by name
  const getColdShowerId = () => practices.find(p => p.name.includes('Cold Shower'))?.id;
  const getDigitalMinimalismId = () => practices.find(p => p.name.includes('Digital Minimalism'))?.id;
  // Commented out unused functions
  // const getFocusBreathingId = () => practices.find(p => p.name.includes('Focus Breathing'))?.id;
  // const getGratitudeJournalId = () => practices.find(p => p.name.includes('Gratitude Journal'))?.id;

  // Test functions
  const simulateEarnPoints = () => {
    addPointsForAction(50, 'Test points');
  };

  const simulateStreak = () => {
    // This simulates completing an activity today to start or continue a streak
    addPointsForAction(10, 'Daily practice completion');
  };

  const completeColdShower = () => {
    const id = getColdShowerId();
    if (id) togglePracticeCompletion(id);
  };

  const completeDigitalMinimalism = () => {
    const id = getDigitalMinimalismId();
    if (id) togglePracticeCompletion(id);
  };

  const simulateManualAchievement = () => {
    showAchievementPopup({
      id: 'manual_test',
      name: 'Testing Achievement',
      description: 'You successfully tested the achievement animation!',
      icon: '🎉'
    });
  };

  // New function to show current streak info
  const showStreakInfo = () => {
    const streakDays = userProgress.streakDays;
    const lastDate = userProgress.lastCompletionDate 
      ? new Date(userProgress.lastCompletionDate).toLocaleDateString() 
      : 'None';
    
    alert(`Current streak: ${streakDays} days\nLast completion: ${lastDate}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-happy-monkey text-[#148BAF] mb-4">Test Achievement System</h3>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={simulateEarnPoints}
          className="px-4 py-2 bg-[#E6F7F9] border border-[#04C4D5] rounded-md text-[#148BAF] hover:bg-[#D0F1F5] transition-colors"
        >
          Earn 50 Points
        </button>
        
        <button 
          onClick={simulateStreak}
          className="px-4 py-2 bg-[#FFEDCC] border border-[#FFC700] rounded-md text-[#FF8A00] hover:bg-[#FFE5B3] transition-colors"
        >
          Record Daily Activity
        </button>
        
        <button 
          onClick={completeColdShower}
          className="px-4 py-2 bg-[#E6F7F9] border border-[#04C4D5] rounded-md text-[#148BAF] hover:bg-[#D0F1F5] transition-colors"
        >
          Complete Cold Shower
        </button>
        
        <button 
          onClick={completeDigitalMinimalism}
          className="px-4 py-2 bg-[#E6F7F9] border border-[#04C4D5] rounded-md text-[#148BAF] hover:bg-[#D0F1F5] transition-colors"
        >
          Complete Digital Minimalism
        </button>
        
        <button 
          onClick={simulateManualAchievement}
          className="px-4 py-2 bg-gradient-to-r from-[#49DADD] to-[#04C4D5] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Show Manual Achievement
        </button>
        
        <button
          onClick={showStreakInfo}
          className="px-4 py-2 bg-[#E6F7F9] border border-[#04C4D5] rounded-md text-[#148BAF] hover:bg-[#D0F1F5] transition-colors mt-2"
        >
          Show Current Streak Info
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">
          Current streak: <span className="font-medium text-[#148BAF]">{userProgress.streakDays} days</span>
        </p>
        {userProgress.lastCompletionDate && (
          <p className="text-sm text-gray-600 mt-1">
            Last completion: <span className="font-medium text-[#148BAF]">
              {new Date(userProgress.lastCompletionDate).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default TestAchievements;