import { useState, useEffect, useCallback } from "react";
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

// Mobile-first utility constants
const therapyConditions = [
  { id: "depression", label: "Depression", active: false },
  { id: "anxiety", label: "Anxiety", active: false },
  { id: "adhd", label: "ADHD", active: false },
  { id: "ocd", label: "OCD", active: false },
  { id: "postpartum", label: "Postpartum", active: false },
  { id: "bipolar", label: "Bipolar", active: false },
  { id: "trauma", label: "Trauma", active: false },
  { id: "stress", label: "Stress", active: false }
];

const tabs = [
  { id: "recommended", label: "Recommended" },
  { id: "online", label: "Online" },
  { id: "face-to-face", label: "In-Person" }
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Increased default price range to include all practitioners
  const [sortOption, setSortOption] = useState('recommended'); // Default sort option
  const [showFilters, setShowFilters] = useState(false); // For filter dropdown

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      
      try {
        let query = supabase.from('practitioners').select('*');
        
        // Filter by conditions
        if (selectedConditions.length > 0) {
          query = query.overlaps('conditions', selectedConditions);
        }
        
        // Filter by location type
        if (activeTab === "online") {
          query = query.in('location_type', ['online', 'both']);
        } else if (activeTab === "face-to-face") {
          query = query.in('location_type', ['in-person', 'both']);
        }
        
        // Filter by price range
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        // Search by name or specialty
        if (searchQuery) {
          query = query.or(`specialty.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`);
        }
        
        // Sorting
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
          calendly_link: p.calendly_link ? String(p.calendly_link) : undefined, // Added for Calendly
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
    // Implement search functionality here
  };

  // Function to handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  // Function to handle price range change
  const handlePriceRangeChange = (index: number, value: number) => {
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  // Function to toggle filters dropdown
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Reset all filters to default state
  const handleResetFilters = () => {
    setSelectedConditions([]);
    setActiveTab("recommended");
    setPriceRange([0, 5000]); // Updated to match new default
    setSortOption('recommended');
    setSearchQuery("");
    setLocationQuery("");
  };

  // Handle booking session
  const handleBookSession = (practitioner: Practitioner, e: React.MouseEvent) => {
    // If there's a Calendly link, open it in a new tab
    if (practitioner.calendly_link && practitioner.calendly_link.startsWith('https://calendly.com/')) {
      e.preventDefault();
      window.open(practitioner.calendly_link, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise navigate to the practitioner detail page
    navigate(`/practitioner/${practitioner.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Hero Banner */}
      <div className="bg-gradient-to-b from-[#E6F9FA] to-[#F7FFFF] px-4 py-6 md:px-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl text-[#148BAF] font-happy-monkey font-bold mb-3 md:mb-4 leading-tight">
              Find Your Perfect Therapist
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-6 max-w-2xl mx-auto md:mx-0">
              Connect with licensed professionals who understand your journey
            </p>
            
            {/* Mobile-optimized feature badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
            {/* Mobile-optimized feature badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              <div className="bg-white px-4 py-2 rounded-full text-[#148BAF] text-sm border border-[#04C4D5] shadow-sm">
                ✓ First session free
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-[#148BAF] text-sm border border-[#04C4D5] shadow-sm">
                ✓ Online & in-person
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-[#148BAF] text-sm border border-[#04C4D5] shadow-sm">
                ✓ Licensed professionals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Search Section */}
      <div className="bg-white mx-4 md:mx-8 rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="p-4 md:p-6">
          {/* Search Input - Mobile optimized */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search therapists, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#04C4D5] focus:outline-none text-base"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-2 w-8 h-8 bg-[#04C4D5] rounded-md flex items-center justify-center text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Location Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Location (optional)"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#04C4D5] focus:outline-none text-base"
            />
            <div className="absolute right-4 top-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Condition Tags - Horizontal scroll on mobile */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">What do you need help with?</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {therapyConditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleToggleCondition(condition.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedConditions.includes(condition.id) 
                      ? 'bg-[#148BAF] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <div className="bg-white mx-4 md:mx-8 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="px-4 py-3">
          {/* Tabs */}
          <div className="flex mb-4 bg-gray-50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-[#148BAF] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
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
              className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:border-[#04C4D5] focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <div className="relative">
              <button 
                onClick={toggleFilters}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filter
              </button>
              
              {/* Filter dropdown - Mobile optimized */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[320px] bg-white rounded-lg border border-gray-200 shadow-lg z-20 p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                  {/* Price range filter */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[#148BAF] text-base font-medium flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15 6H9V8H15V6ZM15 10H9V12H15V10ZM9 16H12V14H9V16Z" fill="#148BAF"/>
                      </svg>
                      Price range: ${priceRange[0]} - ${priceRange[1]}
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#04C4D5] text-xs">$0</span>
                        <span className="text-[#04C4D5] text-xs">$5000</span>
                      </div>
                      <div className="relative h-6">
                        <div className="absolute inset-0 h-[4px] top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full"></div>
                        <div 
                          className="absolute h-[4px] top-1/2 transform -translate-y-1/2 bg-[#148BAF] rounded-full"
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
                          className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#148BAF] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                        />
                        <input 
                          type="range" 
                          min="0" 
                          max="5000" 
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                          className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#148BAF] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="bg-gray-100 rounded-md px-3 py-1.5">
                        <span className="text-[#148BAF] text-sm font-medium">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <button
                        onClick={() => setPriceRange([0, 5000])}
                        className="text-[#148BAF] text-sm hover:underline flex items-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-1">
                          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        Reset
                      </button>
                    </div>
                    
                    {/* Apply button */}
                    <button
                      onClick={toggleFilters}
                      className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-md font-medium transition-all hover:shadow-lg focus:ring-2 focus:ring-[#04C4D5] focus:ring-opacity-50"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 2H13M4 6H10M6 10H8" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Filter dropdown - Mobile optimized */}
                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[320px] bg-white rounded-lg border border-[#04C4D5] shadow-[0px_8px_16px_rgba(0,0,0,0.1)] z-10 p-4 sm:p-5 animate-fade-in max-h-[60vh] overflow-y-auto">
                      {/* Price range filter */}
                      <div className="flex flex-col gap-4">
                        <h4 className="text-[#148BAF] text-base font-happy-monkey font-medium lowercase flex items-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15 6H9V8H15V6ZM15 10H9V12H15V10ZM9 16H12V14H9V16Z" fill="#148BAF"/>
                          </svg>
                          Price range: ${priceRange[0]} - ${priceRange[1]}
                        </h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[#04C4D5] text-xs font-happy-monkey lowercase">$0</span>
                            <span className="text-[#04C4D5] text-xs font-happy-monkey lowercase">$500</span>
                          </div>
                          <div className="relative h-6">
                            <div className="absolute inset-0 h-[4px] top-1/2 transform -translate-y-1/2 bg-[rgba(4,196,213,0.2)] rounded-full"></div>
                            <div 
                              className="absolute h-[4px] top-1/2 transform -translate-y-1/2 bg-[#148BAF] rounded-full"
                              style={{ 
                                left: `${(priceRange[0] / 500) * 100}%`, 
                                right: `${100 - (priceRange[1] / 500) * 100}%` 
                              }}
                            ></div>
                            <input 
                              type="range" 
                              min="0" 
                              max="5000" 
                              step="100"
                              value={priceRange[0]}
                              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                              className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#148BAF] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0px_1px_3px_rgba(0,0,0,0.2)] hover:[&::-webkit-slider-thumb]:bg-[#0A7A9A]"
                            />
                            <input 
                              type="range" 
                              min="0" 
                              max="5000" 
                              step="100"
                              value={priceRange[1]}
                              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                              className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#148BAF] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0px_1px_3px_rgba(0,0,0,0.2)] hover:[&::-webkit-slider-thumb]:bg-[#0A7A9A]"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="bg-[rgba(4,196,213,0.1)] rounded-md px-3 py-1.5">
                            <span className="text-[#148BAF] text-sm font-happy-monkey lowercase">
                              ${priceRange[0]} - ${priceRange[1]}
                            </span>
                          </div>
                          <button
                            onClick={() => setPriceRange([0, 500])}
                            className="text-[#148BAF] text-sm font-happy-monkey lowercase hover:underline flex items-center"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-1"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 12a9 9 0 1 0-9 9 9 9 0 0 0 9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M16.24 7.76a6 6 0 1 0 0 8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            Reset
                          </button>
                        </div>
                        
                        {/* Apply button */}
                        <button 
                          onClick={toggleFilters}
                          className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-md font-happy-monkey lowercase transition-all hover:shadow-lg hover:from-[#03b1c1] hover:to-[#0f7a99] focus:ring-2 focus:ring-[#04C4D5] focus:ring-opacity-50"
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
          
          {/* Therapist cards grid */}
          <div className="p-3 sm:p-4 md:p-6">
            {loading ? (
              // Loading state with animation
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#04C4D5] mb-4"></div>
                <div className="text-lg sm:text-xl font-happy-monkey text-[#148BAF]">Finding perfect matches for you...</div>
              </div>
            ) : practitioners.length === 0 ? (
              // Empty state with improved UI
              <div className="text-center py-8 sm:py-12 max-w-md mx-auto px-4">
                <div className="bg-[rgba(4,196,213,0.1)] p-4 sm:p-6 rounded-2xl mb-4">
                  <svg width="48" height="48" className="sm:w-16 sm:h-16 mx-auto mb-4 text-[#04C4D5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-lg sm:text-xl font-happy-monkey text-[#148BAF]">No therapists found matching your criteria</h3>
                  <p className="mt-3 text-gray-600 text-sm sm:text-base">
                    We couldn't find any therapists that match your current filters.
                  </p>
                  <div className="mt-5">
                    <button 
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-md font-happy-monkey lowercase transition-all hover:shadow-lg"
                    >
                      Show all therapists
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Practitioner cards grid - Mobile responsive
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {practitioners.map((practitioner) => (
                  <div
                    key={practitioner.id}
                    className="bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 relative group hover:shadow-lg transition-all duration-300 border border-[rgba(4,196,213,0.3)] hover:border-[#04C4D5] hover:translate-y-[-2px] cursor-pointer"
                    data-practitioner-id={practitioner.id}
                    onClick={(e) => {
                      // Don't interfere with clicks on buttons or links
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
                    <div className="relative rounded-lg overflow-hidden h-[140px] sm:h-[160px] mb-3 sm:mb-4 bg-[rgba(83,252,255,0.10)] group-hover:shadow-md transition-all">
                      {practitioner.image_url && (
                        <img 
                          src={practitioner.image_url} 
                          alt={practitioner.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      {practitioner.badge && (
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-[#E6F9FA] rounded-lg border border-[rgba(4,196,213,0.3)] shadow-sm">
                          <span className="text-[#148BAF] text-xs font-happy-monkey lowercase flex items-center">
                            {practitioner.badge === 'top rated' && (
                              <svg width="10" height="10" className="sm:w-3 sm:h-3 mr-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                              </svg>
                            )}
                            {practitioner.badge === 'new' && (
                              <svg width="10" height="10" className="sm:w-3 sm:h-3 mr-1" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 3v18m3-18v18m3-18v18M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            )}
                            <span className="text-xs">{practitioner.badge}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Practitioner Info */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div 
                        className="flex-1 cursor-pointer min-w-0" 
                        onClick={(e) => handleBookSession(practitioner, e)}
                      >
                        {/* Name */}
                        <h3 className="font-happy-monkey text-base sm:text-lg text-[#148BAF] lowercase group-hover:text-[#0A7A9A] transition-colors truncate">
                          {practitioner.name}
                        </h3>
                        
                        {/* Specialty */}
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                          {practitioner.specialty}
                        </p>
                      </div>
                      
                      {/* Price */}
                      <div className="bg-[rgba(83,252,255,0.10)] px-2 sm:px-3 py-1 rounded-md border border-[#04C4D5] text-[#148BAF] text-xs sm:text-sm font-happy-monkey lowercase flex items-center flex-shrink-0">
                        <span className="whitespace-nowrap">${practitioner.price}</span>
                        <span className="text-xs ml-1 opacity-75 hidden sm:inline">/session</span>
                      </div>
                    </div>
                    
                    {/* Conditions tags */}
                    {practitioner.conditions && practitioner.conditions.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1 sm:gap-2">
                        {practitioner.conditions.slice(0, 2).map((condition, index) => (
                          <span 
                            key={index} 
                            className="bg-[rgba(4,196,213,0.15)] text-[#148BAF] text-xs px-2 py-1 rounded-full"
                          >
                            {condition}
                          </span>
                        ))}
                        {practitioner.conditions.length > 2 && (
                          <span className="text-[#148BAF] text-xs">+{practitioner.conditions.length - 2} more</span>
                        )}
                      </div>
                    )}
                    
                    {/* Education and Degree */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#49DADD]">
                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="currentColor"/>
                          <path d="M6.9292 6.00409H14.5143V7.50609H6.9292V6.00409Z" fill="currentColor"/>
                          <path d="M6.9292 9.00818H14.5143V10.5102H6.9292V9.00818Z" fill="currentColor"/>
                          <path d="M8.88141 11.261C7.82993 11.261 7.00391 12.087 7.00391 13.1385C7.00391 13.7392 7.30436 14.265 7.75491 14.6405V18.0199L8.88141 16.8934L10.0079 18.0199V14.6403C10.4585 14.2648 10.7589 13.7391 10.7589 13.2133C10.7589 12.087 9.93271 11.261 8.88141 11.261Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="text-[#148BAF] text-xs sm:text-sm font-happy-monkey lowercase truncate">
                        {practitioner.education} • {practitioner.degree}
                      </span>
                    </div>
                    
                    {/* Rating and Location */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-[#49DADD] mr-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="10" height="10" className="sm:w-3 sm:h-3 mr-0.5" viewBox="0 0 16 15" fill={i < Math.floor(practitioner.rating) ? "currentColor" : "none"} 
                              stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-[#148BAF] text-xs sm:text-sm font-happy-monkey">
                          {practitioner.rating}
                        </span>
                        <span className="text-[#148BAF] text-xs font-happy-monkey ml-1 hidden sm:inline">
                          ({practitioner.reviews} reviews)
                        </span>
                      </div>
                      
                      {/* Location Type Badge */}
                      <span className="text-xs px-2 py-1 bg-[rgba(4,196,213,0.15)] text-[#148BAF] rounded-full">
                        {practitioner.location_type}
                      </span>
                    </div>
                    
                    {/* Book button */}
                    <div className="flex justify-center mt-4">
                      <button 
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] hover:from-[#03b1c1] hover:to-[#0f7a99] text-white rounded-md font-happy-monkey lowercase transition-all shadow-[1px_2px_4px_rgba(73,218,234,0.5)] border border-[#04C4D5] transform group-hover:scale-105 duration-300 z-20 relative text-sm"
                        onClick={(e) => {
                          console.log('Book free session button clicked!', practitioner.name);
                          // Stop event propagation to prevent the card click handler from firing
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