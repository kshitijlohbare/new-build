import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Practitioner {
  id: number;
  name: string;
  specialty: string;
  reviews: number;
  rating: number;
  price: number;
  image_url: string;
  badge: 'top rated' | 'new' | 'experienced' | null;
  education: string;
  degree: string;
  location_type: string;
  conditions: string[];
  calendly_link?: string;
}

// Utility constants
const therapyConditions = [
  { id: "depression", label: "depression", active: false },
  { id: "adhd", label: "adhd", active: false },
  { id: "ocd", label: "ocd", active: false },
  { id: "anxiety", label: "anxiety", active: false },
  { id: "postpartum", label: "postpartum depression", active: false },
  { id: "bipolar", label: "bi-polar disorder", active: false }
];

const tabs = [
  { id: "recommended", label: "recommended" },
  { id: "online", label: "online" },
  { id: "face-to-face", label: "face-to-face" }
];

// These options are now defined inline where they're used
// const sortOptions = [
//   { value: 'recommended', label: 'Recommended' },
//   { value: 'price-low', label: 'Price: Low to High' },
//   { value: 'price-high', label: 'Price: High to Low' },
//   { value: 'rating', label: 'Highest Rated' },
// ];

const TherapistListing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOption, setSortOption] = useState('recommended');

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      
      try {
        // Set up a query to the correct table
        let query = supabase.from('practitioners').select('*');
        
        if (selectedConditions.length > 0) {
          query = query.overlaps('conditions', selectedConditions);
        }
        
        if (activeTab === "online") {
          query = query.in('location_type', ['online', 'both']);
        } else if (activeTab === "face-to-face") {
          query = query.in('location_type', ['in-person', 'both']);
        }
        
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        if (searchQuery) {
          query = query.or(`specialty.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`);
        }
        
        switch (sortOption) {
          case "price-low":
            query = query.order('price', { ascending: true });
            break;
          case "price-high":
            query = query.order('price', { ascending: false });
            break;
          case "rating":
            query = query.order('rating', { ascending: false });
            break;
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Database error:', error);
          setPractitioners([]);
          setLoading(false);
          return;
        }
        
        if (!data || !Array.isArray(data)) {
          console.log('No data returned from database');
          setPractitioners([]);
          setLoading(false);
          return;
        }

        const mappedPractitioners = data.map((p: any) => ({
          id: Number(p.id),
          name: String(p.name || ''),
          specialty: String(p.specialty || ''),
          reviews: Number(p.reviews || 0),
          rating: Number(p.rating || 0),
          price: Number(p.price || 0),
          image_url: String(p.image_url || ''),
          badge: p.badge as 'top rated' | 'new' | 'experienced' | null,
          education: String(p.education || ''),
          degree: String(p.degree || ''),
          location_type: String(p.location_type || ''),
          conditions: Array.isArray(p.conditions) ? p.conditions.map(String) : [],
          calendly_link: p.calendly_link ? String(p.calendly_link) : undefined,
        }));
        
        setPractitioners(mappedPractitioners);
        
      } catch (err) {
        setPractitioners([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPractitioners();
  }, [selectedConditions, activeTab, priceRange, searchQuery, sortOption]);

  const handleToggleCondition = (conditionId: string) => {
    if (selectedConditions.includes(conditionId)) {
      setSelectedConditions(prev => prev.filter(id => id !== conditionId));
    } else {
      setSelectedConditions(prev => [...prev, conditionId]);
    }
  };
  
  const handleResetFilters = () => {
    setSelectedConditions([]);
    setActiveTab("recommended");
    setPriceRange([0, 5000]);
    setSortOption('recommended');
    setSearchQuery("");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative" id="therapist-page" aria-label="Therapist Listing Page">
      {/* Background embed frame */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-auto">
        <iframe 
          src='https://my.spline.design/glassmorphlandingpage-dTRlb7D9jEqp40V25exFI0oj/' 
          frameBorder='0' 
          width='100%' 
          height='100vh' 
          className="w-full h-full"
          title="Background 3D animation"
          style={{ 
            minHeight: '100vh',
            pointerEvents: 'auto'
          }}
        ></iframe>
      </div>
      
      {/* Header with Title and Filters */}
      <div className="sticky top-0 z-20 bg-transparent backdrop-blur-sm">
        {/* Title and Filters Container */}
        <div className="flex flex-col justify-center items-center p-[20px] gap-[20px] w-full bg-transparent" id="therapist-title-filters-container">
          {/* Page Title */}
          <div className="w-full h-[18px] text-center" id="therapist-page-title">
            <span className="font-['Happy_Monkey'] font-normal text-[16px] leading-[18px] text-center lowercase text-[#04C4D5]">
              find your perfect therapist
            </span>
          </div>
          
          {/* Filter Chips - Horizontal scrolling categories */}
          <div className="flex flex-row items-start p-0 pl-[4px] pr-[4px] w-screen -mx-[20px] h-[36px] overflow-x-auto scrollbar-hide z-20 gap-2 pointer-events-auto" id="therapist-filter-chips-container">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] w-auto min-w-max cursor-pointer pointer-events-auto ${
                activeTab === tab.id 
                  ? 'bg-[#FCDF4D] border border-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)]' 
                  : 'border border-[#04C4D5]'
              } rounded-[20px] whitespace-nowrap px-4`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className={`font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase ${
                activeTab === tab.id ? 'text-black' : 'text-[#148BAF]'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
          
          {/* Condition Filter Tags */}
          {therapyConditions.map((condition) => (
            <button
              key={condition.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleCondition(condition.id);
              }}
              className={`box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] w-auto min-w-max cursor-pointer pointer-events-auto ${
                selectedConditions.includes(condition.id) 
                  ? 'bg-[#FCDF4D] border border-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)]' 
                  : 'border border-[#04C4D5]'
              } rounded-[20px] whitespace-nowrap px-4`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className={`font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase ${
                selectedConditions.includes(condition.id) ? 'text-black' : 'text-[#148BAF]'
              }`}>
                {condition.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 relative z-10 pointer-events-auto p-[20px] pt-0">
        {/* Main Content - Therapists Grid */}
        <div className="pb-24" id="therapists-container">
        {/* Therapist cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 sm:px-0 max-w-3xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#04C4D5] mx-auto mb-4"></div>
                <p className="text-[#148BAF] font-['Happy_Monkey'] lowercase">finding therapists for you...</p>
              </div>
            </div>
          ) : practitioners.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block p-4 rounded-full bg-[#EDFEFF]/80 backdrop-blur-xl mb-4">
                <svg className="w-8 h-8 text-[#04C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl text-[#148BAF] font-['Happy_Monkey'] lowercase mb-2">no therapists found</h3>
              <p className="text-[#148BAF] mb-4 font-['Happy_Monkey'] lowercase">try adjusting your filters for better results</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#04C4D5] text-white rounded-md font-['Happy_Monkey'] lowercase hover:bg-[#148BAF] transition-colors"
              >
                reset filters
              </button>
            </div>
          ) : (
            practitioners.map((practitioner) => (
              <div 
                key={practitioner.id} 
                className="w-full bg-[#EDFEFF]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[20px] p-4 hover:bg-[#EDFEFF]/90 transition-all cursor-pointer"
                onClick={() => navigate(`/practitioner/${practitioner.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/practitioner/${practitioner.id}`);
                  }
                }}
              >
                {/* Practitioner image and badge */}
                <div className="relative h-48 bg-[rgba(255,255,255,0.05)] rounded-lg mb-4 overflow-hidden">
                  {practitioner.image_url && (
                    <img 
                      src={practitioner.image_url}
                      alt={practitioner.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {practitioner.badge && (
                    <div className="absolute top-2 left-2 bg-[#EDFEFF]/90 backdrop-blur-xl px-2 py-1 rounded text-xs font-medium text-[#148BAF]">
                      {practitioner.badge === 'top rated' && (
                        <span className="flex items-center font-['Happy_Monkey'] lowercase">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {practitioner.badge}
                        </span>
                      )}
                      {practitioner.badge !== 'top rated' && (
                        <span className="font-['Happy_Monkey'] lowercase">{practitioner.badge}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Name and price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#04C4D5] font-['Happy_Monkey'] lowercase text-lg font-medium">{practitioner.name}</h3>
                  <div className="text-[#04C4D5] font-['Happy_Monkey'] font-medium">${practitioner.price}</div>
                </div>
                
                {/* Specialty */}
                <p className="text-sm text-[#148BAF] mb-3 font-['Happy_Monkey'] lowercase">{practitioner.specialty}</p>
                
                {/* Condition tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {practitioner.conditions.slice(0, 2).map((condition, index) => (
                    <span key={index} className="text-xs bg-[#EDFEFF]/60 text-[#148BAF] px-2 py-0.5 rounded-full font-['Happy_Monkey'] lowercase border border-[rgba(255,255,255,0.3)]">
                      {condition}
                    </span>
                  ))}
                  {practitioner.conditions.length > 2 && (
                    <span className="text-xs text-[#148BAF] font-['Happy_Monkey'] lowercase">+{practitioner.conditions.length - 2}</span>
                  )}
                </div>
                
                {/* Ratings */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(practitioner.rating) ? 'text-[#FCDF4D] fill-[#FCDF4D]' : 'text-[rgba(255,255,255,0.3)]'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-[#148BAF] ml-1 font-['Happy_Monkey'] lowercase">{practitioner.rating} ({practitioner.reviews})</span>
                </div>
                
                {/* Book button */}
                <button className="w-full py-2 bg-[#04C4D5] text-white rounded-md font-['Happy_Monkey'] lowercase hover:bg-[#148BAF] transition-colors">
                  book free session
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Search Bar (fixed to bottom, like Practices and Learn) */}
      <div className="fixed bottom-[20px] left-0 w-full flex justify-center z-[20] pointer-events-auto" id="therapist-search-bar-container">
        <div 
          className="box-border flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] w-full max-w-[380px] h-[52px] bg-[#148BAF] border border-white rounded-[100px]" 
          id="therapist-search-bar"
          style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
        >
          <input
            type="text"
            placeholder="search therapists"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#F7FFFF] placeholder-[#F7FFFF]"
            id="therapist-search-input"
          />
          <div className="flex flex-row justify-center items-center w-[31px] h-[32px] flex-none" id="therapist-search-button">
            <svg className="w-[19.28px] h-[20px] text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default TherapistListing;
