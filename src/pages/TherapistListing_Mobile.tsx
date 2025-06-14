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

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const TherapistListing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOption, setSortOption] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      
      try {
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

  const handleSearch = () => {
    // Search functionality already handled by useEffect
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleResetFilters = () => {
    setSelectedConditions([]);
    setActiveTab("recommended");
    setPriceRange([0, 5000]);
    setSortOption('recommended');
    setSearchQuery("");
    setLocationQuery("");
  };
  
  return (
    <div className="min-h-screen bg-[#F7FFFF] font-happy-monkey">
      {/* Simplified Header with Teal background */}
      <div className="bg-[#06C4D5] text-white py-6 px-4 text-center">
        <h1 className="text-3xl lowercase font-happy-monkey">cactus coco</h1>
      </div>

      {/* Main content area */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#06C4D5] font-happy-monkey lowercase">
            find the perfect therapist for you
          </h1>
          <p className="text-[#208EB1] mt-2">
            Our specialized therapists are ready to support your unique journey. Get your first session free.
          </p>
          
          {/* Features */}
          <div className="flex flex-col gap-2 items-center mt-4">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full mr-2 border border-[#06C4D5]"></div>
              <span className="text-sm text-[#208EB1]">Personalized matching</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full mr-2 border border-[#06C4D5]"></div>
              <span className="text-sm text-[#208EB1]">Online & in-person options</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full mr-2 border border-[#06C4D5]"></div>
              <span className="text-sm text-[#208EB1]">First session free</span>
            </div>
          </div>
        </div>

        {/* Search area */}
        <div className="bg-[#E6F9FA] p-5 rounded-xl mb-6">
          <h2 className="text-xl text-[#208EB1] font-happy-monkey lowercase text-center mb-4">
            find your perfect therapist
          </h2>
          
          {/* Search Input - Styled like screenshot */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Try 'Anger Management'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 border border-[#FFFFFF] rounded-md focus:outline-none focus:border-[#06C4D5] bg-white"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-[6px] bg-[#06C4D5] h-8 w-8 rounded-md flex items-center justify-center text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Location Input styled like screenshot */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Where do you want the therapy"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full py-3 px-4 border border-[#FFFFFF] rounded-md focus:outline-none focus:border-[#06C4D5] bg-white"
            />
            <div className="absolute right-4 top-4 text-[#208EB1]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          {/* Condition Tags - Horizontal scroll on mobile */}
          <div className="mb-4 overflow-x-auto whitespace-nowrap pb-2 flex gap-2 scrollbar-hide">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {therapyConditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleToggleCondition(condition.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all min-w-max ${
                    selectedConditions.includes(condition.id) 
                      ? 'bg-[#208EB1] text-[#FFFFFF] shadow-md' 
                      : 'bg-[#FFFFFF] text-[#000000] hover:bg-[#FFFFFF]'
                  }`}
                >
                  {condition.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Filter Bar */}
      <div className="bg-[#FFFFFF] mx-4 md:mx-8 rounded-xl shadow-sm border border-[#FFFFFF] mb-6">
        <div className="px-4 py-3">
          {/* Tabs */}
          <div className="flex mb-4 bg-[#F7FFFF] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#FFFFFF] text-[#208EB1] shadow-sm' 
                    : 'text-[#000000] hover:text-[#000000]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort and Filter Row */}
          <div className="flex gap-3">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="flex-1 h-10 px-3 border border-[#FFFFFF] rounded-lg text-sm focus:border-[#06C4D5] focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <div className="relative">
              <button 
                onClick={toggleFilters}
                className="px-4 py-2 border border-[#FFFFFF] rounded-lg text-sm font-medium text-[#000000] hover:bg-[#F7FFFF] flex items-center gap-2 min-h-[40px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filter
              </button>
              
              {/* Filter dropdown - Mobile optimized */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[320px] bg-[#FFFFFF] rounded-lg border border-[#FFFFFF] shadow-lg z-20 p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[#208EB1] text-base font-medium flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#208EB1"/>
                      </svg>
                      Price range: ${priceRange[0]} - ${priceRange[1]}
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#06C4D5] text-xs">$0</span>
                        <span className="text-[#06C4D5] text-xs">$5000</span>
                      </div>
                      <div className="relative h-6">
                        <div className="absolute inset-0 h-[4px] top-1/2 transform -translate-y-1/2 bg-[#FFFFFF] rounded-full"></div>
                        <div 
                          className="absolute h-[4px] top-1/2 transform -translate-y-1/2 bg-[#208EB1] rounded-full"
                          style={{ 
                            left: `${(priceRange[0] / 5000) * 100}%`, 
                            right: `${100 - (priceRange[1] / 5000) * 100}%` 
                          }}
                        ></div>
                        <input 
                          type="range" 
                          min="0" 
                          max="5000" 
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                          className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#208EB1] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#FFFFFF] [&::-webkit-slider-thumb]:shadow-md"
                        />
                        <input 
                          type="range" 
                          min="0" 
                          max="5000" 
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                          className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#208EB1] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#FFFFFF] [&::-webkit-slider-thumb]:shadow-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="bg-[#FFFFFF] rounded-md px-3 py-1.5">
                        <span className="text-[#208EB1] text-sm font-medium">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <button
                        onClick={() => setPriceRange([0, 5000])}
                        className="text-[#208EB1] text-sm hover:underline flex items-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-1">
                          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        Reset
                      </button>
                    </div>
                    
                    <button
                      onClick={toggleFilters}
                      className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-[#FFFFFF] rounded-md font-medium transition-all hover:shadow-lg focus:ring-2 focus:ring-[#06C4D5] focus:ring-opacity-50"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-4 md:mx-8">
        <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#FFFFFF]">
          {/* Therapist cards grid */}
          <div className="p-4 md:p-6">
            {loading ? (
              /* Loading state with animation */
              <div className="text-center py-12 md:py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06C4D5] mb-4"></div>
                <div className="text-xl font-medium text-[#208EB1]">Finding perfect matches for you...</div>
              </div>
            ) : practitioners.length === 0 ? (
              /* Empty state with improved UI */
              <div className="text-center py-12 md:py-16 max-w-md mx-auto px-4">
                <div className="bg-[rgba(6,196,213,0.1)] p-6 rounded-2xl mb-4">
                  <svg width="64" height="64" className="mx-auto mb-4 text-[#06C4D5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-xl font-medium text-[#208EB1] mb-3">No therapists found matching your criteria</h3>
                  <p className="text-[#000000] text-base mb-5">
                    We couldn't find any therapists that match your current filters.
                  </p>
                  <button 
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-[#FFFFFF] rounded-md font-medium transition-all hover:shadow-lg"
                  >
                    Show all therapists
                  </button>
                </div>
              </div>
            ) : (
              /* Practitioner cards grid - Mobile responsive */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {practitioners.map((practitioner) => (
                  <div
                    key={practitioner.id}
                    className="bg-[#FFFFFF] rounded-2xl p-5 relative group hover:shadow-xl transition-all duration-300 border border-[#FFFFFF] hover:border-[#06C4D5] hover:-translate-y-1 cursor-pointer"
                    onClick={(e) => {
                      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) {
                        return;
                      }
                      
                      if (practitioner.calendly_link && practitioner.calendly_link.startsWith('https://calendly.com/')) {
                        window.open(practitioner.calendly_link, '_blank', 'noopener,noreferrer');
                      } else {
                        navigate(`/practitioner/${practitioner.id}`);
                      }
                    }}
                  >
                    {/* Image with badge */}
                    <div className="relative rounded-xl overflow-hidden h-48 mb-4 bg-gradient-to-br from-[#06C4D5] to-[#F7FFFF] group-hover:shadow-md transition-all">
                      {practitioner.image_url && (
                        <img 
                          src={practitioner.image_url} 
                          alt={practitioner.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      {practitioner.badge && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFFFFF]/90 backdrop-blur-sm rounded-lg border border-[#06C4D5]/20 shadow-sm">
                          <span className="text-[#208EB1] text-xs font-medium flex items-center">
                            {practitioner.badge === 'top rated' && (
                              <svg width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                              </svg>
                            )}
                            {practitioner.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Practitioner Info */}
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-[#208EB1] group-hover:text-[#208EB1] transition-colors truncate mb-1">
                          {practitioner.name}
                        </h3>
                        <p className="text-[#000000] text-sm line-clamp-2">
                          {practitioner.specialty}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#06C4D5] to-[#F7FFFF] px-3 py-1.5 rounded-lg border border-[#06C4D5]/20 text-[#208EB1] text-sm font-semibold flex-shrink-0">
                        ${practitioner.price}
                        <span className="text-xs ml-1 opacity-75 hidden sm:inline">/session</span>
                      </div>
                    </div>
                    
                    {/* Conditions tags */}
                    {practitioner.conditions && practitioner.conditions.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {practitioner.conditions.slice(0, 2).map((condition, index) => (
                          <span 
                            key={index} 
                            className="bg-[#06C4D5]/10 text-[#208EB1] text-xs px-2.5 py-1 rounded-full font-medium"
                          >
                            {condition}
                          </span>
                        ))}
                        {practitioner.conditions.length > 2 && (
                          <span className="text-[#208EB1] text-xs font-medium">+{practitioner.conditions.length - 2} more</span>
                        )}
                      </div>
                    )}
                    
                    {/* Education and Degree */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 flex-shrink-0 text-[#06C4D5]">
                        <svg viewBox="0 0 22 22" fill="currentColor">
                          <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z"/>
                          <path d="M6.9292 6.00409H14.5143V7.50609H6.9292V6.00409Z"/>
                          <path d="M6.9292 9.00818H14.5143V10.5102H6.9292V9.00818Z"/>
                          <path d="M8.88141 11.261C7.82993 11.261 7.00391 12.087 7.00391 13.1385C7.00391 13.7392 7.30436 14.265 7.75491 14.6405V18.0199L8.88141 16.8934L10.0079 18.0199V14.6403C10.4585 14.2648 10.7589 13.7391 10.7589 13.2133C10.7589 12.087 9.93271 11.261 8.88141 11.261Z"/>
                        </svg>
                      </div>
                      <span className="text-[#208EB1] text-sm font-medium truncate">
                        {practitioner.education} • {practitioner.degree}
                      </span>
                    </div>
                    
                    {/* Rating and Location */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center">
                        <div className="text-[#06C4D5] mr-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" className="mr-0.5" viewBox="0 0 16 15" fill={i < Math.floor(practitioner.rating) ? "currentColor" : "none"} 
                              stroke="currentColor">
                              <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-[#208EB1] text-sm font-medium">
                          {practitioner.rating}
                        </span>
                        <span className="text-[#000000] text-xs ml-1 hidden sm:inline">
                          ({practitioner.reviews} reviews)
                        </span>
                      </div>
                      
                      <span className="text-xs px-2.5 py-1 bg-[#06C4D5]/10 text-[#208EB1] rounded-full font-medium">
                        {practitioner.location_type}
                      </span>
                    </div>
                    
                    {/* Book button */}
                    <button 
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#06C4D5] to-[#208EB1] hover:from-[#06C4D5] hover:to-[#208EB1] text-[#FFFFFF] rounded-lg font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(6,196,213,0.3)] hover:shadow-[0_6px_16px_rgba(6,196,213,0.4)] transform group-hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        
                        if (practitioner.calendly_link && practitioner.calendly_link.startsWith('https://calendly.com/')) {
                          window.open(practitioner.calendly_link, '_blank', 'noopener,noreferrer');
                        } else {
                          navigate(`/practitioner/${practitioner.id}`);
                        }
                      }}
                    >
                      Book free session
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistListing;
