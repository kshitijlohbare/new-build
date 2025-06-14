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

  const handleSearch = () => {
    // Search functionality already handled by useEffect
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  // This handler will be used when the price range slider is implemented
  // const handlePriceRangeChange = (index: number, value: number) => {
  //   setPriceRange(prev => {
  //     const newRange = [...prev] as [number, number];
  //     newRange[index] = value;
  //     return newRange;
  //   });
  // };

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
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {therapyConditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedConditions.includes(condition.id) 
                    ? 'bg-[#208EB1] text-white' 
                    : 'bg-white text-[#000000] border border-[#208EB1]/20'
                }`}
              >
                {condition.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter tabs - styled like screenshot */}
        <div className="flex justify-between border-b pb-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1 font-happy-monkey lowercase ${
                activeTab === tab.id 
                  ? 'text-[#06C4D5] border-b-2 border-[#06C4D5]' 
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <div className="flex items-center gap-2">
            <select 
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 text-sm font-happy-monkey lowercase"
            >
              <option value="recommended">recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button
              onClick={toggleFilters}
              className="flex items-center gap-1 border border-gray-200 rounded px-3 py-1 text-sm font-happy-monkey lowercase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              filter
            </button>
          </div>
        </div>

        {/* Therapist cards grid - styled like screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06C4D5]"></div>
            </div>
          ) : practitioners.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="inline-block p-4 rounded-full bg-[#E6F9FA] mb-4">
                <svg className="w-8 h-8 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl text-[#208EB1] font-happy-monkey mb-2">No therapists found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters for better results</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#06C4D5] text-white rounded-md font-happy-monkey lowercase"
              >
                Reset filters
              </button>
            </div>
          ) : (
            practitioners.map((practitioner) => (
              <div 
                key={practitioner.id} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                onClick={() => navigate(`/practitioner/${practitioner.id}`)}
              >
                {/* Practitioner image and badge */}
                <div className="relative h-48 bg-[#E6F9FA] rounded-lg mb-4 overflow-hidden">
                  {practitioner.image_url && (
                    <img 
                      src={practitioner.image_url}
                      alt={practitioner.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {practitioner.badge && (
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#208EB1]">
                      {practitioner.badge === 'top rated' && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {practitioner.badge}
                        </span>
                      )}
                      {practitioner.badge !== 'top rated' && practitioner.badge}
                    </div>
                  )}
                </div>
                
                {/* Name and price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#208EB1] font-happy-monkey lowercase text-lg">{practitioner.name}</h3>
                  <div className="text-[#06C4D5] font-medium">${practitioner.price}</div>
                </div>
                
                {/* Specialty */}
                <p className="text-sm text-gray-600 mb-3">{practitioner.specialty}</p>
                
                {/* Condition tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {practitioner.conditions.slice(0, 2).map((condition, index) => (
                    <span key={index} className="text-xs bg-[#E6F9FA] text-[#208EB1] px-2 py-0.5 rounded-full">
                      {condition}
                    </span>
                  ))}
                  {practitioner.conditions.length > 2 && (
                    <span className="text-xs text-[#208EB1]">+{practitioner.conditions.length - 2}</span>
                  )}
                </div>
                
                {/* Ratings */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(practitioner.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{practitioner.rating} ({practitioner.reviews})</span>
                </div>
                
                {/* Book button */}
                <button className="w-full py-2 bg-[#06C4D5] text-white rounded-md font-medium hover:bg-[#05b0c0] transition-colors">
                  book free session
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistListing;
