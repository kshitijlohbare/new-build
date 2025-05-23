import { useEffect, useState } from "react";
import { usePractices, Practice } from "@/context/PracticeContext";
import WeeklyPointsChart from '@/components/wellbeing/WeeklyPointsChart';
import { useToast } from '@/hooks/useToast';
import AddPracticeDialog from "@/components/wellbeing/AddPracticeDialog";
import PracticeDetailPopup from '@/components/wellbeing/PracticeDetailPopup';
import BadgeCarousel from '@/components/wellbeing/BadgeCarousel';

// Import icons
import StreakLesserThan10 from "../assets/icons/Streak_lesser_than_10.svg";
import StreakGreaterThan10 from "../assets/icons/Streak_greater_than_10.svg";
import StreakGreaterThan21 from "../assets/icons/Streak_greater_than_21.svg";

// Define a type for the active tab state for better type safety
type ActiveTabType = 'all' | 'meditation' | 'physical' | 'journal' | 'huberman' | 'naval' | 'neuroscience';

const Practices = () => {
  const { practices, isLoading, addPractice } = usePractices(); // Removed userProgress
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('all');
  const [isAddPracticeDialogOpen, setIsAddPracticeDialogOpen] = useState(false);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add debug output to help diagnose issues
  console.log(`Found ${practices.length} total practices:`);
  const meditationCount = practices.filter(p => 
    p.icon === 'sparkles' || 
    p.name.toLowerCase().includes('meditation') || 
    p.name.toLowerCase().includes('breathe') || 
    p.name.toLowerCase().includes('breathing')
  ).length;
  const physicalCount = practices.filter(p => 
    p.icon === 'shower' || 
    p.name.toLowerCase().includes('exercise') || 
    p.name.toLowerCase().includes('shower') || 
    p.name.toLowerCase().includes('cold')
  ).length;
  const journalCount = practices.filter(p => 
    p.icon === 'moleskine' || 
    p.name.toLowerCase().includes('journal') || 
    p.name.toLowerCase().includes('write') || 
    p.name.toLowerCase().includes('gratitude')
  ).length;
  const hubermanCount = practices.filter(p => 
    p.source?.toLowerCase().includes('huberman') || 
    p.source?.toLowerCase().includes('andrew')
  ).length;
  const navalCount = practices.filter(p => 
    p.source?.toLowerCase().includes('naval') ||
    p.source?.toLowerCase().includes('ravikant')
  ).length;
  const neuroscienceCount = practices.filter(p => 
    p.source?.toLowerCase().includes('neuroscience') || 
    (p.tags && p.tags.some(tag => tag.toLowerCase() === 'neuroscience')) // Ensure correct tag check
  ).length;
  
  // Filter practices based on active tab and search query
  const filteredPractices = practices
    .filter(practice => {
      // Filter by tab
      switch (activeTab) {
        case 'meditation':
          return practice.icon === 'sparkles' || practice.icon === 'meditation' || practice.icon === 'breathing' ||
                 practice.name.toLowerCase().includes('meditation') || practice.name.toLowerCase().includes('mindfulness') ||
                 practice.name.toLowerCase().includes('breathe') || practice.name.toLowerCase().includes('breathing');
        case 'physical':
          return practice.icon === 'shower' || practice.icon === 'yoga' ||
                 practice.name.toLowerCase().includes('exercise') || practice.name.toLowerCase().includes('stretching') ||
                 practice.name.toLowerCase().includes('shower') || practice.name.toLowerCase().includes('cold') ||
                 practice.name.toLowerCase().includes('yoga');
        case 'journal':
          return practice.icon === 'moleskine' || practice.icon === 'journal' ||
                 practice.name.toLowerCase().includes('journal') || practice.name.toLowerCase().includes('write') || 
                 practice.name.toLowerCase().includes('gratitude');
        case 'huberman':
          return practice.source?.toLowerCase().includes('huberman') || 
                 practice.source?.toLowerCase().includes('andrew');
        case 'naval':
          return practice.source?.toLowerCase().includes('naval') || 
                 practice.source?.toLowerCase().includes('ravikant');
        case 'neuroscience':
          return practice.source?.toLowerCase().includes('neuroscience') || 
                 practice.source?.toLowerCase().includes('stress reduction') ||
                 (practice.tags && practice.tags.some(tag => 
                   tag.toLowerCase() === 'neuroscience' || 
                   tag.toLowerCase() === 'stress' || 
                   tag.toLowerCase() === 'anxiety' || 
                   tag.toLowerCase() === 'focus'
                 )) || 
                 practice.name.toLowerCase().includes('breathing') || 
                 practice.name.toLowerCase().includes('mindfulness');
        case 'all':
        default:
          return true;
      }
    })
    .filter(practice => {
      // Filter by search
      if (!searchQuery) return true;
      return practice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             practice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (practice.tags && practice.tags.some(tag => 
               tag.toLowerCase().includes(searchQuery.toLowerCase())
             ));
    });
  
  // This effect runs once to initialize practices if needed
  useEffect(() => {
    if (isLoading || practices.length === 0) return;
    console.log(`Initialized with ${practices.length} practices`);
  }, [isLoading, practices]);
  
  // Helper function to get streak icon based on count
  const getStreakIcon = (streakCount: number) => {
    if (streakCount >= 21) return StreakGreaterThan21;
    if (streakCount >= 10) return StreakGreaterThan10;
    return StreakLesserThan10;
  };

  // Helper function to calculate points for a practice
  const calculatePoints = (duration?: number): number => {
    // Simple calculation: 1 point per minute, minimum 1 point
    return Math.max(1, duration || 1);
  };
  
  // Handler to add/remove from daily practices
  const handleToggleDailyPractice = (practice: Practice) => {
    if (practice.isDaily) {
      // Remove from daily practices
      addPractice({
        ...practice,
        isDaily: false
      });
      
      toast({
        title: 'Removed from Daily Practices',
        description: 'This practice has been removed from your daily practices.',
        variant: 'default'
      });
    } else {
      // Add to daily practices
      addPractice({
        ...practice,
        isDaily: true
      });
      
      toast({
        title: 'Added to Daily Practices!',
        description: 'This practice has been added to your daily practices for easy access.',
        variant: 'success',
      });
    }
  };
  
  // Completion functionality removed
  
  const handlePracticeNameClick = (id: number) => {
    setSelectedPracticeId(id);
  };
  
  const handleClosePopup = () => {
    setSelectedPracticeId(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary font-happy-monkey">Loading your practices...</div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Weekly Points Chart - Styled consistently with the page */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-happy-monkey text-black lowercase mb-4 pl-2">Your Progress</h2>
        <WeeklyPointsChart />
      </div>
      
      {/* Badge Carousel Section */}
      <div className="mb-8">
        <BadgeCarousel />
      </div>
      
      {/* Section divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(4,196,213,0.3)]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xl font-happy-monkey text-[#148BAF] lowercase">
            Your Practices
          </span>
        </div>
      </div>
      
      {/* Main Practices Section - Redesigned */}
      <div className="bg-[rgba(83,252,255,0.10)] rounded-2xl shadow-lg overflow-hidden">
        {/* Header with filter tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[rgba(4,196,213,0.2)] px-4 md:px-6 py-4">
          <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              All Practices
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {practices.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('meditation')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'meditation'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Meditation
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {meditationCount}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('physical')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'physical'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Physical
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {physicalCount}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('journal')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'journal'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Journaling
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {journalCount}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('huberman')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'huberman'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Huberman
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {hubermanCount}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('naval')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'naval'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Naval
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {navalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('neuroscience')}
              className={`py-2 px-4 text-sm whitespace-nowrap font-happy-monkey lowercase transition-all flex items-center gap-1.5 ${
                activeTab === 'neuroscience'
                  ? 'text-[#148BAF] border-b-2 border-[#148BAF]'
                  : 'text-gray-500 hover:text-[#148BAF]'
              }`}
            >
              Neuroscience
              <span className="bg-[rgba(4,196,213,0.15)] px-1.5 py-0.5 rounded-full text-xs">
                {neuroscienceCount}
              </span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search practices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-auto pl-3 pr-10 py-2 border border-[#04C4D5] rounded-lg focus:ring-[#04C4D5] focus:border-[#04C4D5] text-sm bg-white"
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-[#148BAF]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Add Practice button */}
            <button
              onClick={() => setIsAddPracticeDialogOpen(true)}
              className="bg-white hover:bg-[#F7FFFF] text-[#148BAF] px-4 py-2 rounded-lg font-happy-monkey flex items-center justify-center transition-all shadow-[1px_2px_4px_rgba(73,218,234,0.5)] border border-[#04C4D5]"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              add new practice
            </button>
          </div>
        </div>
        
        {/* Practices grid layout */}
        <div className="p-4 md:p-6">
          {filteredPractices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-happy-monkey text-[#148BAF]">
                {searchQuery 
                  ? "No matching practices found" 
                  : activeTab === 'all'
                    ? "No practices available"
                    : `No ${activeTab} practices found`
                }
              </h3>
              <p className="mt-2 text-black font-happy-monkey lowercase">
                {activeTab !== 'all' && "Try selecting a different category or adding new practices"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPractices.map(practice => (
                <div 
                  key={practice.id} 
                  className="bg-white rounded-[20px] p-4 relative hover:shadow-md transition-all duration-300 border border-[rgba(4,196,213,0.3)]"
                >
                  {/* Practice Icon and Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div 
                      className="flex items-start gap-3 cursor-pointer" 
                      onClick={() => handlePracticeNameClick(practice.id)}
                    >
                      {practice.icon && (
                        <div className="w-10 h-10 flex-shrink-0 bg-[rgba(83,252,255,0.15)] rounded-lg flex items-center justify-center">
                          <span className="text-[#148BAF] text-lg">
                            {practice.icon === 'shower' && '🚿'}
                            {practice.icon === 'sun' && '☀️'}
                            {practice.icon === 'moleskine' && '📓'}
                            {practice.icon === 'smelling' && '👃'}
                            {practice.icon === 'sparkles' && '✨'}
                            {practice.icon === 'brain' && '🧠'} 
                            {practice.icon === 'anchor' && '⚓'}
                            {practice.icon === 'breathing' && '💨'}
                            {practice.icon === 'meditation' && '🧘'}
                            {practice.icon === 'journal' && '📔'}
                            {practice.icon === 'phone' && '📱'}
                            {practice.icon === 'yoga' && '🧘‍♀️'}
                            {/* New wellness practice icons */}
                            {practice.icon === 'water' && '💧'}
                            {practice.icon === 'food' && '🥗'}
                            {practice.icon === 'sleep' && '😴'}
                            {practice.icon === 'sunrise' && '🌅'}
                            {practice.icon === 'focus' && '🎯'}
                            {practice.icon === 'book' && '📚'}
                            {practice.icon === 'relax' && '😌'}
                            {practice.icon === 'tree' && '🌳'}
                            {practice.icon === 'calendar' && '📅'}
                            {practice.icon === 'review' && '📋'}
                            {practice.icon === 'disconnect' && '🔌'}
                            {practice.icon === 'screen' && '📱'}
                            {practice.icon === 'caffeine' && '☕'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-happy-monkey text-lg text-[#148BAF] lowercase">{practice.name}</h3>
                        <p className="text-gray-600 text-sm truncate max-w-[200px]">
                          {practice.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Only show badges for daily practices */}
                    {practice.isDaily && (
                      <div className="flex items-center gap-2">
                        {/* Points Badge */}
                        <div className="flex items-center space-x-1 bg-[rgba(83,252,255,0.10)] rounded-lg px-2 py-1 border border-[#04C4D5]">
                          <span className="text-[#148BAF] font-happy-monkey text-sm">
                            {practice.points ?? calculatePoints(practice.duration)} pts
                          </span>
                        </div>
                        
                        {/* Streak Badge */}
                        <div className="flex items-center space-x-1 bg-[rgba(83,252,255,0.10)] rounded-lg px-2 py-1 border border-[#04C4D5]">
                          <img 
                            src={getStreakIcon(practice.streak || 0)} 
                            alt="streak" 
                            className="h-4 w-4" 
                          />
                          <span className="text-[#148BAF] font-happy-monkey text-sm">
                            {practice.streak || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Benefits tags */}
                  {practice.benefits && practice.benefits.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {practice.benefits.slice(0, 2).map((benefit, index) => (
                        <span 
                          key={index} 
                          className="bg-[rgba(4,196,213,0.15)] text-[#148BAF] text-xs px-2 py-1 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                      {practice.benefits.length > 2 && (
                        <span className="text-[#148BAF] text-xs">+{practice.benefits.length - 2} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Source tag for Huberman and Naval */}
                  {practice.source && (
                    <div className="mb-3">
                      <span className="bg-[rgba(4,196,213,0.25)] text-[#148BAF] text-xs px-2 py-1 rounded-md font-medium">
                        Source: {practice.source}
                      </span>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                    {/* Removed duration/points display here as requested */}
                    <div className="flex flex-wrap gap-2 ml-auto">
                      {/* Add to Daily Practices button */}
                      <button 
                        onClick={() => handleToggleDailyPractice(practice)}
                        className={`${practice.isDaily 
                          ? 'bg-white hover:bg-gray-100 text-[#148BAF] border border-[#04C4D5]' 
                          : 'bg-[#148BAF] hover:bg-[#0A7C9C] text-white border border-[#0A7C9C]'
                        } px-3 py-1 rounded-md text-xs font-happy-monkey lowercase shadow-[1px_1px_2px_rgba(73,218,234,0.3)] flex items-center gap-1 transition-all`}
                      >
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill={practice.isDaily ? "#148BAF" : "#ffffff"}
                          stroke={practice.isDaily ? "#148BAF" : "#ffffff"}
                          strokeWidth="2"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {practice.isDaily ? 'in daily practices' : 'add to daily practices'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Practice Detail Popup */}
      {selectedPracticeId !== null && (
        <PracticeDetailPopup
          practiceId={selectedPracticeId}
          onClose={handleClosePopup}
        />
      )}
      
      {/* Add Practice Dialog */}
      <AddPracticeDialog 
        isOpen={isAddPracticeDialogOpen}
        onClose={() => setIsAddPracticeDialogOpen(false)} 
      />
    </div>
  );
};

export default Practices;