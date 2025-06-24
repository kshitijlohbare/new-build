import { useEffect, useState } from "react";
import { usePractices, Practice } from "@/context/PracticeContext";
import { useToast } from '@/hooks/useToast';
import AddPracticeDialog from "@/components/wellbeing/AddPracticeDialog";
import SimplePracticePopup from '@/components/wellbeing/SimplePracticePopup';
import ClickablePortal from '@/components/common/ClickablePortal';
import '@/components/wellbeing/popupFix.css';
import '@/styles/reset.css'; // Import reset CSS first to establish baseline
import '@/styles/ChipFixes.css';
import '@/styles/MinHeightFix.css'; // Import specific fix for min-height issue
import '@/styles/PracticeCardFixes.css';
import '@/styles/HappyMonkeyFont.css'; // Import Happy Monkey font for title
import '@/styles/overrideInjectedStyles.css'; // Import overrides for injected styles
import '@/styles/FilterChipsOverflow.css'; // Import specialized styles for filter chips

// Import icons
import QuotesIcon from "../assets/icons/quotes.svg";

// Define a type for the active tab state that allows any string (for dynamic categories)
type ActiveTabType = string;

const Practices = () => {
  const { practices, isLoading, addPractice } = usePractices(); // Removed userProgress
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('all');
  const [isAddPracticeDialogOpen, setIsAddPracticeDialogOpen] = useState(false);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add state for dynamic filter categories
  const [filterCategories, setFilterCategories] = useState<Array<{id: string, label: string, count: number}>>([]);
  
  // Helper function to get emoji based on practice icon
  const getIconEmoji = (icon?: string) => {
    const iconMap: Record<string, string> = {
      'shower': '🚿', 'sun': '☀️', 'moleskine': '📓', 'book': '📚',
      'relax': '😌', 'tree': '🌳', 'calendar': '📅', 'review': '📋',
      'disconnect': '🔌', 'screen': '📱', 'caffeine': '☕', 'smelling': '👃',
      'sparkles': '✨', 'anchor': '⚓', 'brain': '🧠'
    };
    
    return iconMap[icon || ''] || '📝';
  };
  
  // Generate dynamic filter categories based on practice data
  useEffect(() => {
    if (practices.length > 0) {
      // Start with the "all" filter
      const categories: Array<{id: string, label: string, count: number}> = [
        { id: 'all', label: 'all', count: practices.length }
      ];
      
      // Create maps to count different types of practices
      const sourcesMap = new Map<string, number>();
      const iconsMap = new Map<string, number>();
      const tagsMap = new Map<string, number>();
      const durationMap = new Map<string, number>();
      const pointsMap = new Map<string, number>();
      
      // Process each practice to extract filter data
      practices.forEach(practice => {
        // Extract sources
        if (practice.source) {
          // Source-based categories (huberman, naval)
          if (practice.source.toLowerCase().includes('huberman')) {
            const count = sourcesMap.get('huberman') || 0;
            sourcesMap.set('huberman', count + 1);
          } else if (practice.source.toLowerCase().includes('naval')) {
            const count = sourcesMap.get('naval') || 0;
            sourcesMap.set('naval', count + 1);
          }
          
          // Add other common sources if they appear multiple times
          const sourceLower = practice.source.toLowerCase();
          const count = sourcesMap.get(sourceLower) || 0;
          sourcesMap.set(sourceLower, count + 1);
        }
        
        // Extract practice types from icons
        if (practice.icon) {
          const count = iconsMap.get(practice.icon) || 0;
          iconsMap.set(practice.icon, count + 1);
          
          // Specific mappings for common practice types
          if (['meditation', 'sparkles', 'breathing'].includes(practice.icon)) {
            const count = sourcesMap.get('meditation') || 0;
            sourcesMap.set('meditation', count + 1);
          }
          
          if (['shower', 'yoga'].includes(practice.icon)) {
            const count = sourcesMap.get('physical') || 0;
            sourcesMap.set('physical', count + 1);
          }
          
          if (['journal', 'moleskine'].includes(practice.icon)) {
            const count = sourcesMap.get('journal') || 0;
            sourcesMap.set('journal', count + 1);
          }
        }
        
        // Extract from practice name
        const nameLower = practice.name.toLowerCase();
        if (nameLower.includes('meditation') || nameLower.includes('breathing')) {
          const count = sourcesMap.get('meditation') || 0;
          sourcesMap.set('meditation', count + 1);
        }
        
        if (nameLower.includes('exercise') || nameLower.includes('yoga') || 
            nameLower.includes('physical')) {
          const count = sourcesMap.get('physical') || 0;
          sourcesMap.set('physical', count + 1);
        }
        
        if (nameLower.includes('journal') || nameLower.includes('gratitude')) {
          const count = sourcesMap.get('journal') || 0;
          sourcesMap.set('journal', count + 1);
        }
        
        // Extract from tags
        if (practice.tags) {
          practice.tags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            const count = tagsMap.get(tagLower) || 0;
            tagsMap.set(tagLower, count + 1);
            
            if (tagLower === 'neuroscience' || tagLower === 'brain') {
              const count = sourcesMap.get('neuroscience') || 0;
              sourcesMap.set('neuroscience', count + 1);
            }
          });
        }
        
        // Track daily practices
        if (practice.isDaily) {
          const count = sourcesMap.get('daily') || 0;
          sourcesMap.set('daily', count + 1);
        }
        
        // Track duration categories
        if (practice.duration) {
          if (practice.duration <= 5) {
            const count = durationMap.get('quick') || 0;
            durationMap.set('quick', count + 1);
            
            // Also add to sources map for quick practices
            const count2 = sourcesMap.get('quick') || 0;
            sourcesMap.set('quick', count2 + 1);
          } else if (practice.duration <= 15) {
            const count = durationMap.get('medium') || 0;
            durationMap.set('medium', count + 1);
          } else {
            const count = durationMap.get('long') || 0;
            durationMap.set('long', count + 1);
          }
        }
        
        // Track high point practices (popular)
        if (practice.points) {
          if (practice.points >= 5) {
            const count = pointsMap.get('high') || 0;
            pointsMap.set('high', count + 1);
            
            // Also add to sources map for popular practices
            const count2 = sourcesMap.get('popular') || 0;
            sourcesMap.set('popular', count2 + 1);
          }
        }
      });
      
      // Add sources with at least one practice
      sourcesMap.forEach((count, source) => {
        if (count > 0) {
          let label = source;
          if (source === 'huberman') label = 'andrew huberman';
          if (source === 'naval') label = 'naval ravikant';
          
          // Only add if not already in categories
          if (!categories.some(cat => cat.id === source)) {
            categories.push({
              id: source,
              label,
              count
            });
          }
        }
      });
      
      // Sort categories by count (except 'all' stays first)
      const sortedCategories = [
        categories[0],
        ...categories.slice(1).sort((a, b) => b.count - a.count)
      ];
      
      // Limit to a reasonable number of categories
      const finalCategories = sortedCategories.slice(0, 12);
      
      setFilterCategories(finalCategories);
    }
  }, [practices]);
  
  // Add debug output to help diagnose issues
  console.log(`Found ${practices.length} total practices with ${filterCategories.length} filter categories`);
  console.log(`Current active tab: ${activeTab}`);
  
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
      // Return all practices for the "all" tab
      if (activeTab === 'all') return true;

      // Common predefined filter categories
      switch (activeTab) {
        case 'meditation':
          return (
            practice.icon === 'sparkles' || 
            practice.icon === 'meditation' || 
            practice.icon === 'breathing' ||
            practice.name.toLowerCase().includes('meditation') || 
            practice.name.toLowerCase().includes('mindfulness') ||
            practice.name.toLowerCase().includes('breathe') || 
            practice.name.toLowerCase().includes('breathing') ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('meditation') || 
              tag.toLowerCase().includes('mindful') || 
              tag.toLowerCase().includes('breath')
            ))
          );
        case 'physical':
          return (
            practice.icon === 'shower' || 
            practice.icon === 'yoga' ||
            practice.name.toLowerCase().includes('exercise') || 
            practice.name.toLowerCase().includes('stretching') ||
            practice.name.toLowerCase().includes('shower') || 
            practice.name.toLowerCase().includes('cold') ||
            practice.name.toLowerCase().includes('yoga') ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('physical') || 
              tag.toLowerCase().includes('exercise') || 
              tag.toLowerCase().includes('yoga') || 
              tag.toLowerCase().includes('cold')
            ))
          );
        case 'journal':
          return (
            practice.icon === 'moleskine' || 
            practice.icon === 'journal' ||
            practice.name.toLowerCase().includes('journal') || 
            practice.name.toLowerCase().includes('write') || 
            practice.name.toLowerCase().includes('gratitude') ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('journal') || 
              tag.toLowerCase().includes('writing') || 
              tag.toLowerCase().includes('gratitude')
            ))
          );
        case 'huberman':
          return (
            (practice.source?.toLowerCase().includes('huberman') || 
            practice.source?.toLowerCase().includes('andrew')) ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('huberman') || 
              tag.toLowerCase().includes('andrew huberman')
            ))
          );
        case 'naval':
          return (
            (practice.source?.toLowerCase().includes('naval') || 
            practice.source?.toLowerCase().includes('ravikant')) ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('naval') || 
              tag.toLowerCase().includes('ravikant') || 
              tag.toLowerCase().includes('naval ravikant')
            ))
          );
        case 'neuroscience':
          return (
            practice.source?.toLowerCase().includes('neuroscience') || 
            practice.source?.toLowerCase().includes('stress reduction') ||
            practice.name.toLowerCase().includes('breathing') || 
            practice.name.toLowerCase().includes('mindfulness') ||
            practice.name.toLowerCase().includes('neuroscience') || 
            practice.name.toLowerCase().includes('stress') ||
            (practice.tags && practice.tags.some(tag => 
              tag.toLowerCase().includes('neuroscience') || 
              tag.toLowerCase().includes('stress') || 
              tag.toLowerCase().includes('anxiety') || 
              tag.toLowerCase().includes('focus') ||
              tag.toLowerCase().includes('brain')
            ))
          );
        case 'popular':
          // Practices with higher points (indicating popularity)
          return Boolean(practice.points && practice.points >= 5);
        case 'daily':
          // Only show daily practices
          return practice.isDaily === true;
        case 'quick':
          // Practices that take less time
          return practice.duration && practice.duration <= 5;
      }

      // Dynamic tag-based filtering for any other category
      const activeCategoryLower = activeTab.toLowerCase();
      
      // Check if the active category matches any practice attributes
      return (
        // Check source
        (practice.source && practice.source.toLowerCase().includes(activeCategoryLower)) ||
        
        // Check name
        practice.name.toLowerCase().includes(activeCategoryLower) ||
        
        // Check description
        practice.description.toLowerCase().includes(activeCategoryLower) ||
        
        // Check tags 
        (practice.tags && practice.tags.some(tag => 
          tag.toLowerCase().includes(activeCategoryLower)
        )) ||
        
        // Check icon (exact match)
        practice.icon?.toLowerCase() === activeCategoryLower
      );
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
    <div className="min-h-screen flex flex-col p-[20px] bg-transparent relative pointer-events-none" id="practices-page" data-testid="practices-page-container">
      {/* Critical inline style for filter chips */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Critical CSS for filter chips - no borders */
        #practices-filter-chips-container button,
        .filter-chip {
          height: 36px !important;
          min-height: 36px !important;
          max-height: 36px !important;
          min-width: auto !important; /* Override the 44px min-width */
          width: auto !important;
          box-sizing: border-box !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 10px !important;
          border-radius: 4px !important;
          white-space: nowrap !important;
          touch-action: manipulation !important;
          border: none !important;
          outline: none !important;
        }
        
        .filter-chip div {
          font-family: 'Happy Monkey', cursive !important;
          font-size: 12px !important;
          line-height: 16px !important;
          height: 16px !important;
          min-height: 16px !important;
          max-height: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          outline: none !important;
        }
      ` }} />
      
      {/* Background container - embed frame removed to reduce server load */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-auto p-0 bg-gradient-to-b from-[#e9fbfd] to-white" id="practices-background-container">
        {/* iframe removed to reduce server load */}
      </div>
      
      {/* Title and Filters Container */}
      <div className="flex flex-col justify-center items-center p-0 gap-[20px] w-full h-[74px] bg-transparent mb-4 relative z-20 pointer-events-auto" 
           id="practices-title-filters-container" data-testid="title-filters-container">
        {/* Page Title - "your practices" */}
        <div className="w-full h-[18px] text-center relative z-20" id="practices-page-title" data-testid="practices-page-title">
          <span className="happy-monkey font-normal text-[16px] leading-[18px] text-center lowercase text-[#04C4D5]" 
                id="practices-title-text" data-testid="practices-title-text">your practices</span>
        </div>

        {/* Filter Chips - Horizontal scrolling categories */}
        <div id="practices-filter-chips-container" data-testid="filter-chips-container">
          {filterCategories.map((category) => (
            <button 
              key={category.id}
              className={`filter-chip ${
                activeTab === category.id as ActiveTabType 
                  ? 'filter-chip-active' 
                  : 'filter-chip-inactive'
              } rounded-[4px] px-4`} 
              data-testid={`filter-chip-${category.id}`}
              data-category={category.id}
              aria-pressed={activeTab === category.id}
              onClick={() => setActiveTab(category.id)}>
              <div className={`filter-chip-text ${
                activeTab === category.id ? 'filter-chip-text-active' : 'filter-chip-text-inactive'
              }`}>
                {category.label}
                {category.count > 0 && category.id !== 'all' && (
                  <span className={`filter-chip-count ${
                    activeTab === category.id
                      ? 'filter-chip-count-active'
                      : 'filter-chip-count-inactive'
                  }`}>
                    {category.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Practices Grid - Main content showing practice cards */}
      <div className="grid grid-cols-2 gap-2 justify-items-center justify-center relative z-10 pointer-events-auto" id="practices-grid" data-testid="practices-grid-container">
        {filteredPractices.map((practice) => (
          <div key={practice.id} 
               className={`flex flex-col justify-start items-stretch p-[10px] gap-[10px] w-full h-[220px] ${practice.isDaily ? 'bg-[#FAF8EC]/80':'bg-[#EDFEFF]/80'} backdrop-blur-xl shadow-[1px_2px 4px rgba(73,218,234,0.5)] rounded-[8px]`}
               data-testid={`practice-card-${practice.id}`}
               onClick={() => handlePracticeNameClick(practice.id)}
               style={{ 
                 boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)",
                 position: "relative",
                 width: "100%"
               }}> 
            {/* Practice Card Title with Icon Circle */}
            <div className={`w-full min-h-[48px] font-['Righteous'] font-normal text-[16px] leading-[18px] flex flex-wrap items-center justify-start text-left uppercase ${practice.isDaily ? 'text-[#FFD400]' : 'text-[#148BAF]'} flex-none order-0 self-stretch relative`}
                 data-testid={`practice-card-title-${practice.id}`}>
              <div 
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-white ml-1 mr-2"
                style={{ 
                  boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                  border: `1px solid ${practice.isDaily ? 'rgba(255,212,0,0.3)' : 'rgba(4,196,213,0.2)'}`,
                  flexShrink: 0,
                  marginTop: "2px"
                }}
              >
                <span className="text-[13px]" style={{ lineHeight: 1 }}>
                  {getIconEmoji(practice.icon)}
                </span>
              </div>
              <div className="line-clamp-2 text-left flex-1">{practice.name}</div>
            </div>
            {/* Practice Card Description */}
            <div className="w-full h-[72px] font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center px-2 text-left lowercase text-black flex-none order-1 self-stretch overflow-hidden"
                 data-testid={`practice-card-description-${practice.id}`}>
              <div className="line-clamp-4 overflow-ellipsis w-full">
                {practice.description}
              </div>
            </div>
            {/* Practice Card Source Tag */}
            <div className="flex flex-row justify-start items-center py-[4px] px-[8px] gap-[4px] w-full h-[24px] bg-white rounded-[8px] flex-none order-2 self-stretch"
                 data-testid={`practice-card-source-${practice.id}`}>
              {/* Left quote icon */}
              <img src={QuotesIcon} alt="quotes" className="w-auto h-[8px] flex-none order-0 flex-grow-0" />
              {/* Source Text */}
              <div className="mx-2 font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-left lowercase text-[#148BAF] flex-none order-1 flex-grow-1 truncate overflow-hidden max-w-[75%]">
                {practice.source || 'source'}
              </div>
              {/* Right quote icon */}
              <img src={QuotesIcon} alt="quotes" className="w-auto h-[8px] transform rotate-180 flex-none order-2 flex-grow-0" />
            </div>
            {/* Practice Card Action Button */}
            <button
              onClick={e => { e.stopPropagation(); handleToggleDailyPractice(practice); }}
              className={`box-border flex flex-col justify-center items-center py-[4px] px-[8px] gap-[4px] w-full h-[26px] rounded-[8px] flex-none order-3 self-stretch ${practice.isDaily ? 'bg-[#FFE066] border border-[#FFE066]' : 'bg-white border border-[#04C4D5] shadow-[1px 2px 4px rgba(73,218,234,0.5)]'}`}
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
      <div className="fixed bottom-[20px] left-0 w-full flex justify-center z-[20] pointer-events-auto" id="practices-search-bar-container" data-testid="search-bar-container">
        <div 
          className="box-border flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] w-[380px] h-[52px] bg-[#148BAF] border border-white rounded-[100px]" 
          id="practices-search-bar" data-testid="search-bar"
          style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
        >
          {/* Search Input Field */}
          <input
            type="text"
            placeholder="search practices"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#F7FFFF] placeholder-[#F7FFFF]"
            id="practices-search-input" data-testid="search-input"
          />
          {/* Search Button */}
          <div className="flex flex-row justify-center items-center w-[31px] h-[32px] flex-none" id="practices-search-button" data-testid="search-button">
            {/* Search Icon */}
            <svg className="w-[19.28px] h-[20px] text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" id="practices-search-icon" data-testid="search-icon">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      {/* Practice Detail Popup - Shows when a practice is clicked */}
      <ClickablePortal isOpen={selectedPracticeId !== null} onClose={handleClosePopup}>
        {selectedPracticeId !== null && (
          <SimplePracticePopup
            practiceId={selectedPracticeId}
            onClose={handleClosePopup}
          />
        )}
      </ClickablePortal>
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