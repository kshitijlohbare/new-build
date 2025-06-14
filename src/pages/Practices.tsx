import { useEffect, useState } from "react";
import { usePractices, Practice } from "@/context/PracticeContext";
import { useToast } from '@/hooks/useToast';
import AddPracticeDialog from "@/components/wellbeing/AddPracticeDialog";
import PracticeDetailPopup from '@/components/wellbeing/PracticeDetailPopup';

// Import icons
import QuotesIcon from "../assets/icons/quotes.svg";

// Define a type for the active tab state for better type safety
type ActiveTabType = 'all' | 'meditation' | 'physical' | 'journal' | 'huberman' | 'naval' | 'neuroscience';

const Practices = () => {
  const { practices, isLoading, addPractice } = usePractices(); // Removed userProgress
  const { toast } = useToast();
  const [activeTab] = useState<ActiveTabType>('all');
  const [isAddPracticeDialogOpen, setIsAddPracticeDialogOpen] = useState(false);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add debug output to help diagnose issues
  console.log(`Found ${practices.length} total practices:`);
  
  // Practice count tracking is currently disabled
  // These were used in previous versions of the UI but are kept for future reference
  /*
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
  */
  
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
  // Currently not used but kept for future UI improvements
  /* 
  const getStreakIcon = (streakCount: number) => {
    if (streakCount >= 21) return StreakGreaterThan21;
    if (streakCount >= 10) return StreakGreaterThan10;
    return StreakLesserThan10;
  };
  */

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
  
  // Handle practice name click to show details popup
  const handlePracticeNameClick = (id: number) => {
    setSelectedPracticeId(id);
  };
  
  // Close practice details popup
  const handleClosePopup = () => {
    setSelectedPracticeId(null);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="practices-loading-container">
        <div className="animate-pulse text-2xl text-primary font-happy-monkey" data-testid="practices-loading-text">Loading your practices...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-[20px]" data-testid="practices-page-container">
      {/* Title and Filters Container */}
      <div className="flex flex-col justify-center items-center p-0 gap-[20px] w-full h-[74px] bg-white mb-4" 
           data-testid="title-filters-container">
        {/* Page Title - "your practices" */}
        <div className="w-full h-[18px] text-center" data-testid="practices-page-title">
          <span className="font-['Happy_Monkey'] font-normal text-[16px] leading-[18px] text-center lowercase text-[#04C4D5]" 
                data-testid="practices-title-text">your practices</span>
        </div>

        {/* Filter Chips - Horizontal scrolling categories */}
        <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[36px] overflow-x-auto scrollbar-hide" 
             data-testid="filter-chips-container">
          {/* Filter chip - Habits (with background) */}
          <button className="box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] bg-[rgba(83,252,255,0.1)] border border-[#04C4D5] rounded-[20px] whitespace-nowrap" 
                  data-testid="filter-chip-habits">
            <span className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase text-[#148BAF]">habits</span>
          </button>
          
          {/* Filter chip - Naval (no background) */}
          <button className="box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] border border-[#04C4D5] rounded-[20px] whitespace-nowrap" 
                  data-testid="filter-chip-naval">
            <span className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase text-[#148BAF]">naval ravikant</span>
          </button>
          
          {/* Filter chip - Huberman (no background) */}
          <button className="box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] border border-[#04C4D5] rounded-[20px] whitespace-nowrap" 
                  data-testid="filter-chip-huberman">
            <span className="font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase text-[#148BAF]">andrew huberman</span>
          </button>
          
          {/* Additional filter chips would go here */}
        </div>
      </div>

      {/* Practices Grid - Main content showing practice cards */}
      <div className="grid grid-cols-2 gap-2" data-testid="practices-grid-container">
        {filteredPractices.map((practice) => (
          <div key={practice.id} 
               className="flex flex-col justify-center items-center p-[10px] gap-[10px] w-full h-[200px] bg-[#F5F5F5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[8px]"
               data-testid={`practice-card-${practice.id}`}
               onClick={() => handlePracticeNameClick(practice.id)}
               style={{ 
                 boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)",
                 position: "relative"
               }}> 
            {/* Practice Card Title */}
            <div className={`w-full h-[36px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center justify-center text-center uppercase ${practice.isDaily ? 'text-[#FFD400]' : 'text-[#148BAF]'} flex-none order-0 self-stretch`}
                 data-testid={`practice-card-title-${practice.id}`}>
              <span>{practice.name}</span>
            </div>
            {/* Practice Card Description */}
            <div className="w-full h-[64px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase text-black flex-none order-1 self-stretch overflow-hidden"
                 data-testid={`practice-card-description-${practice.id}`}>
              <div className="line-clamp-3 overflow-ellipsis">
                {practice.description}
              </div>
            </div>
            {/* Practice Card Source Tag */}
            <div className="flex flex-row justify-center items-center py-[4px] px-[8px] gap-[4px] w-full h-[24px] bg-white rounded-[8px] flex-none order-2 self-stretch"
                 data-testid={`practice-card-source-${practice.id}`}>
              {/* Left quote icon */}
              <img src={QuotesIcon} alt="quotes" className="w-auto h-[8px] flex-none order-0 flex-grow-0" />
              {/* Source Text */}
              <div className="mx-2 font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase text-[#148BAF] flex-none order-1 flex-grow-1 truncate overflow-hidden max-w-[75%]">
                {practice.source || 'source'}
              </div>
              {/* Right quote icon */}
              <img src={QuotesIcon} alt="quotes" className="w-auto h-[8px] transform rotate-180 flex-none order-2 flex-grow-0" />
            </div>
            {/* Practice Card Action Button */}
            <button
              onClick={e => { e.stopPropagation(); handleToggleDailyPractice(practice); }}
              className={`box-border flex flex-col justify-center items-center py-[4px] px-[8px] gap-[4px] w-full h-[26px] rounded-[8px] flex-none order-3 self-stretch ${practice.isDaily ? 'bg-[#FFE066] border border-[#FFE066]' : 'bg-white border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]'}`}
              data-testid={`practice-card-action-button-${practice.id}`}
              style={practice.isDaily ? {} : { boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
            >
              <div className={`w-auto h-[18px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex items-center text-center uppercase flex-none order-0 flex-grow-0 ${practice.isDaily ? 'text-white' : 'text-[#148BAF]'}`}>
                {practice.isDaily ? "I'M DOING IT" : "I'LL DO IT"}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Search Bar - Fixed at bottom */}
      <div className="fixed bottom-[20px] left-0 w-full flex justify-center z-[2]" data-testid="search-bar-container">
        <div 
          className="box-border flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] w-[380px] h-[52px] bg-[#148BAF] border border-white rounded-[100px]" 
          data-testid="search-bar"
          style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
        >
          {/* Search Input Field */}
          <input
            type="text"
            placeholder="search practices"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#F7FFFF] placeholder-[#F7FFFF]"
            data-testid="search-input"
          />
          {/* Search Button */}
          <div className="flex flex-row justify-center items-center w-[31px] h-[32px] flex-none" data-testid="search-button">
            {/* Search Icon */}
            <svg className="w-[19.28px] h-[20px] text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" data-testid="search-icon">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      {/* Practice Detail Popup - Shows when a practice is clicked */}
      {selectedPracticeId !== null && (
        <PracticeDetailPopup
          practiceId={selectedPracticeId}
          onClose={handleClosePopup}
          data-testid="practice-detail-popup"
        />
      )}
      {/* Add Practice Dialog - For adding new practices */}
      <AddPracticeDialog 
        isOpen={isAddPracticeDialogOpen}
        onClose={() => setIsAddPracticeDialogOpen(false)} 
        data-testid="add-practice-dialog"
      />
    </div>
  );
};

export default Practices;