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
}

// Define keyframes for fade-in animation
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

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
  { id: "online", label: "Online" },
  { id: "face-to-face", label: "Face-to-face" }
];

// Sort options
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]); // Default price range
  const [sortOption, setSortOption] = useState('recommended'); // Default sort option
  const [showFilters, setShowFilters] = useState(false); // For filter dropdown

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      let query = supabase.from('practitioners').select('*');
      // Filter by conditions
      if (selectedConditions.length > 0) {
        query = query.contains('conditions', selectedConditions);
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
        // recommended: no sort
      }
      const { data, error } = await query;
      if (!error && data) {
        setPractitioners(data);
      } else {
        setPractitioners([]);
      }
      setLoading(false);
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
    console.log("Searching for:", searchQuery, "in", locationQuery);
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

  // Handle booking session
  const handleBookSession = (practitionerId: number) => {
    navigate(`/booking?id=${practitionerId}`);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#E6F9FA] to-[#F7FFFF] rounded-[30px] shadow-[0px_4px_24px_rgba(0,0,0,0.05)] mb-8 overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl text-[#148BAF] font-happy-monkey lowercase mb-4">
              Find the perfect therapist for you
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Our specialized therapists are ready to support your unique journey. Get your first session free.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-white rounded-full text-[#148BAF] text-sm border border-[rgba(4,196,213,0.3)] shadow-sm flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Personalized matching
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-[#148BAF] text-sm border border-[rgba(4,196,213,0.3)] shadow-sm flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Online & in-person options
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-[#148BAF] text-sm border border-[rgba(4,196,213,0.3)] shadow-sm flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                First session free
              </span>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white transform rotate-1 hover:rotate-0 transition-transform">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Therapy session" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* END of Hero Banner */}

      {/* Main content container */}
      <div className="bg-white rounded-[30px] shadow-[0px_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Title */}
        <div className="bg-[#F7FFFF] border-b border-[rgba(4,196,213,0.3)] py-6">
          <h2 className="text-center text-3xl text-[#148BAF] font-happy-monkey lowercase">
            Find your perfect therapist
          </h2>
        </div>
        
        {/* Search Section */}
        <div className="bg-[#F7FFFF] p-4 md:p-6 flex flex-col gap-[20px]">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,196,213,0.1)] to-[rgba(20,139,175,0.1)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -m-0.5"></div>
              <input
                type="text"
                placeholder="Try 'Anger Management'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-[#04C4D5] rounded-lg focus:ring-[#04C4D5] focus:border-[#04C4D5] text-sm text-[#148BAF] font-happy-monkey shadow-[0px_2px_8px_rgba(4,196,213,0.15)] transition-shadow focus:shadow-[0px_4px_12px_rgba(4,196,213,0.25)]"
              />
              <svg
                className="absolute right-4 top-3.5 h-4 w-4 text-[#148BAF] transition-transform group-hover:scale-110"
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
            
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,196,213,0.1)] to-[rgba(20,139,175,0.1)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -m-0.5"></div>
              <input
                type="text"
                placeholder="Where do you want the therapy"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-[#04C4D5] rounded-lg focus:ring-[#04C4D5] focus:border-[#04C4D5] text-sm text-[#148BAF] font-happy-monkey shadow-[0px_2px_8px_rgba(4,196,213,0.15)] transition-shadow focus:shadow-[0px_4px_12px_rgba(4,196,213,0.25)]"
              />
              <svg
                className="absolute right-4 top-3.5 h-4 w-4 text-[#148BAF] transition-transform group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            
            <button 
              onClick={handleSearch}
              className="px-6 py-2.5 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-lg font-happy-monkey flex items-center justify-center transition-all hover:shadow-lg hover:opacity-90 duration-300 shadow-[0px_2px_8px_rgba(4,196,213,0.25)] focus:ring-2 focus:ring-[#04C4D5] focus:ring-opacity-50"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="lowercase">search</span>
            </button>
          </div>
          
          {/* Condition chips - with enhanced UI */}
          <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
            <div className="inline-flex gap-3 whitespace-nowrap">
              {therapyConditions.map((condition) => (
                <div
                  key={condition.id}
                  onClick={() => handleToggleCondition(condition.id)}
                  className={`py-2 px-4 rounded-full border cursor-pointer flex-shrink-0 transition-all duration-200 ${
                    selectedConditions.includes(condition.id) 
                      ? 'bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white border-transparent shadow-[0px_2px_6px_rgba(4,196,213,0.3)] transform scale-105' 
                      : 'bg-white text-[#148BAF] border-[rgba(4,196,213,0.3)] hover:border-[#04C4D5] hover:bg-[rgba(4,196,213,0.05)]'
                  }`}
                >
                  <span className="text-center font-happy-monkey text-sm lowercase whitespace-nowrap">{condition.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs and Sort/Filter section - rearranged layout */}
          <div className="border-b border-[rgba(4,196,213,0.3)] pb-4 mb-4">
            {/* Tabs, sort dropdown and filter button row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Tabs */}
              <div className="flex gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-happy-monkey lowercase transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'text-[#148BAF] border-b-2 border-[#148BAF] font-medium'
                        : 'text-gray-500 hover:text-[#148BAF]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort dropdown and filter button */}
              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="pl-3 pr-10 py-2 border border-[#04C4D5] rounded-lg text-[#148BAF] text-sm font-happy-monkey lowercase bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#04C4D5]"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Filter button */}
                <div className="relative">
                  <button 
                    onClick={toggleFilters}
                    className="px-3 py-2 rounded-lg border border-[#04C4D5] text-[#148BAF] text-sm font-happy-monkey lowercase bg-white hover:bg-[#F7FFFF] flex items-center gap-2 transition-all shadow-[1px_1px_2px_rgba(73,218,234,0.3)]"
                  >
                    <span>Filter</span>
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 2H13M4 6H10M6 10H8" stroke="#148BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Filter dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-lg border border-[#04C4D5] shadow-[0px_8px_16px_rgba(0,0,0,0.1)] z-10 p-5 animate-fade-in">
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
                              max="500" 
                              step="10"
                              value={priceRange[0]}
                              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                              className="absolute left-0 top-0 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#148BAF] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0px_1px_3px_rgba(0,0,0,0.2)] hover:[&::-webkit-slider-thumb]:bg-[#0A7A9A]"
                            />
                            <input 
                              type="range" 
                              min="0" 
                              max="500" 
                              step="10"
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
          <div className="p-4 md:p-6">
            {loading ? (
              // Loading state with animation
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#04C4D5] mb-4"></div>
                <div className="text-xl font-happy-monkey text-[#148BAF]">Finding perfect matches for you...</div>
              </div>
            ) : practitioners.length === 0 ? (
              // Empty state with improved UI
              <div className="text-center py-12 max-w-md mx-auto">
                <div className="bg-[rgba(4,196,213,0.1)] p-6 rounded-2xl mb-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-[#04C4D5]">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-xl font-happy-monkey text-[#148BAF]">No therapists found matching your criteria</h3>
                  <p className="mt-3 text-gray-600">
                    We couldn't find any therapists that match your current filters.
                  </p>
                  <div className="mt-5">
                    <button 
                      onClick={() => {
                        setSelectedConditions([]);
                        setPriceRange([0, 500]);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-md font-happy-monkey lowercase transition-all hover:shadow-lg"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Practitioner cards grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {practitioners.map((practitioner) => (
                  <div
                    key={practitioner.id}
                    className="bg-white rounded-[20px] p-5 relative group hover:shadow-lg transition-all duration-300 border border-[rgba(4,196,213,0.3)] hover:border-[#04C4D5] hover:translate-y-[-2px]"
                  >
                    {/* Image with badge */}
                    <div className="relative rounded-lg overflow-hidden h-[160px] mb-4 bg-[rgba(83,252,255,0.10)] group-hover:shadow-md transition-all">
                      {practitioner.image_url && (
                        <img 
                          src={practitioner.image_url} 
                          alt={practitioner.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      {practitioner.badge && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#E6F9FA] rounded-lg border border-[rgba(4,196,213,0.3)] shadow-sm">
                          <span className="text-[#148BAF] text-xs font-happy-monkey lowercase flex items-center">
                            {practitioner.badge === 'top rated' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                              </svg>
                            )}
                            {practitioner.badge === 'new' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M9.5 3v18m3-18v18m3-18v18M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            )}
                            {practitioner.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Practitioner Info */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 cursor-pointer" onClick={() => handleBookSession(practitioner.id)}>
                        {/* Name */}
                        <h3 className="font-happy-monkey text-lg text-[#148BAF] lowercase group-hover:text-[#0A7A9A] transition-colors">
                          {practitioner.name}
                        </h3>
                        
                        {/* Specialty */}
                        <p className="text-gray-600 text-sm truncate max-w-[200px]">
                          {practitioner.specialty}
                        </p>
                      </div>
                      
                      {/* Price */}
                      <div className="bg-[rgba(83,252,255,0.10)] px-3 py-1 rounded-md border border-[#04C4D5] text-[#148BAF] text-sm font-happy-monkey lowercase flex items-center">
                        <span className="whitespace-nowrap">${practitioner.price}</span>
                        <span className="text-xs ml-1 opacity-75">/session</span>
                      </div>
                    </div>
                    
                    {/* Conditions tags */}
                    {practitioner.conditions && practitioner.conditions.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
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
                      <div className="w-5 h-5 flex-shrink-0 text-[#49DADD]">
                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="currentColor"/>
                          <path d="M6.9292 6.00409H14.5143V7.50609H6.9292V6.00409Z" fill="currentColor"/>
                          <path d="M6.9292 9.00818H14.5143V10.5102H6.9292V9.00818Z" fill="currentColor"/>
                          <path d="M8.88141 11.261C7.82993 11.261 7.00391 12.087 7.00391 13.1385C7.00391 13.7392 7.30436 14.265 7.75491 14.6405V18.0199L8.88141 16.8934L10.0079 18.0199V14.6403C10.4585 14.2648 10.7589 13.7391 10.7589 13.2133C10.7589 12.087 9.93271 11.261 8.88141 11.261Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="text-[#148BAF] text-sm font-happy-monkey lowercase">
                        {practitioner.education} • {practitioner.degree}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="text-[#49DADD] mr-1 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="12" height="12" viewBox="0 0 16 15" fill={i < Math.floor(practitioner.rating) ? "currentColor" : "none"} 
                            stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
                            <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-[#148BAF] text-sm font-happy-monkey">
                        {practitioner.rating} ({practitioner.reviews} reviews)
                      </span>
                      
                      {/* Location Type Badge */}
                      <span className="ml-auto text-xs px-2 py-1 bg-[rgba(4,196,213,0.15)] text-[#148BAF] rounded-full">
                        {practitioner.location_type}
                      </span>
                    </div>
                    
                    {/* Book button */}
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      {/* Location type badge moved here for better layout */}
                      <span className="text-xs px-3 py-1 bg-[rgba(4,196,213,0.15)] rounded-full text-[#148BAF]">
                        {practitioner.location_type}
                      </span>
                      
                      <button 
                        onClick={() => handleBookSession(practitioner.id)}
                        className="px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] hover:from-[#03b1c1] hover:to-[#0f7a99] text-white rounded-md font-happy-monkey lowercase transition-all shadow-[1px_2px_4px_rgba(73,218,234,0.5)] border border-[#04C4D5] ml-auto transform group-hover:scale-105 duration-300"
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