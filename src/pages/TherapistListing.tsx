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
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch practitioners from Supabase
  const fetchPractitioners = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('practitioners')
        .select('*');

      if (activeTab === 'online') {
        query = query.eq('location_type', 'online');
      } else if (activeTab === 'face-to-face') {
        query = query.eq('location_type', 'in-person');
      }

      const { data, error } = await query;
      if (error) throw error;

      // Type the data properly as Practitioner array
      let filteredData: Practitioner[] = (data || []).map((item: any) => ({
        id: Number(item.id),
        name: String(item.name || ''),
        specialty: String(item.specialty || ''),
        reviews: Number(item.reviews || 0),
        rating: Number(item.rating || 0),
        price: Number(item.price || 0),
        image_url: String(item.image_url || ''),
        badge: item.badge as 'top rated' | 'new' | 'experienced' | null,
        education: String(item.education || ''),
        degree: String(item.degree || ''),
        location_type: String(item.location_type || ''),
        conditions: Array.isArray(item.conditions) ? item.conditions.map(String) : [],
        calendly_link: item.calendly_link ? String(item.calendly_link) : undefined
      }));

      // Filter by search query
      if (searchQuery) {
        filteredData = filteredData.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by conditions
      if (selectedConditions.length > 0) {
        filteredData = filteredData.filter(p => 
          p.conditions.some((condition: string) => 
            selectedConditions.includes(condition.toLowerCase())
          )
        );
      }

      // Sort practitioners
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return b.rating - a.rating; // Default to rating for recommended
        }
      });

      setPractitioners(filteredData);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, selectedConditions, sortBy]);

  useEffect(() => {
    fetchPractitioners();
  }, [fetchPractitioners]);

  const handleConditionToggle = (conditionId: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleBookNow = (practitioner: Practitioner) => {
    if (practitioner.calendly_link) {
      window.open(practitioner.calendly_link, '_blank');
    } else {
      navigate(`/booking/${practitioner.id}`);
    }
  };

  const handleCardClick = (practitionerId: number) => {
    navigate(`/therapist/${practitionerId}`);
  };

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'top rated': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-green-100 text-green-800';
      case 'experienced': return 'bg-blue-100 text-blue-800';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Mobile Optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Therapist
            </h1>
            
            {/* Search Bar - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-base"
                />
              </div>
              <div className="flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-sage-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Mobile Responsive */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4 lg:block">
                <h3 className="font-semibold text-gray-900">Conditions</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {therapyConditions.map((condition) => (
                  <label key={condition.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition.id)}
                      onChange={() => handleConditionToggle(condition.id)}
                      className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{condition.label}</span>
                  </label>
                ))}
              </div>

              {selectedConditions.length > 0 && (
                <button
                  onClick={() => setSelectedConditions([])}
                  className="mt-4 text-sm text-sage-600 hover:text-sage-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : practitioners.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No therapists found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {practitioners.map((practitioner) => (
                  <div 
                    key={practitioner.id} 
                    onClick={() => handleCardClick(practitioner.id)}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-[rgba(4,196,213,0.2)] hover:border-[rgba(4,196,213,0.4)] min-h-[280px] sm:min-h-[320px]"
                  >
                    {/* Enhanced mobile-first card header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                        <img
                          src={practitioner.image_url || '/api/placeholder/64/64'}
                          alt={practitioner.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-[rgba(4,196,213,0.2)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 pr-2">
                              <h3 className="text-lg sm:text-xl font-happy-monkey text-[#148BAF] lowercase leading-tight truncate">
                                {practitioner.name}
                              </h3>
                              <p className="text-sm text-gray-600 font-happy-monkey lowercase leading-relaxed truncate">
                                {practitioner.specialty}
                              </p>
                            </div>
                            {practitioner.badge && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getBadgeColor(practitioner.badge)}`}>
                                {practitioner.badge}
                              </span>
                            )}
                          </div>
                          
                          {/* Enhanced mobile rating display */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(practitioner.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 font-happy-monkey">
                              {practitioner.rating} ({practitioner.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced mobile-first credentials */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-[#04C4D5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                          <span className="font-happy-monkey truncate">
                            <span className="font-medium">{practitioner.degree}</span> • {practitioner.education}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-[#04C4D5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-happy-monkey lowercase">
                            {practitioner.location_type === 'online' ? 'Online Sessions Available' : 'In-Person Sessions'}
                          </span>
                        </div>
                      </div>

                      {/* Mobile-optimized specialties */}
                      {practitioner.conditions && practitioner.conditions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 font-happy-monkey lowercase mb-2">Specializes in:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {practitioner.conditions.slice(0, 2).map((condition, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 text-xs bg-[rgba(4,196,213,0.1)] text-[#148BAF] rounded-full font-happy-monkey lowercase"
                              >
                                {condition}
                              </span>
                            ))}
                            {practitioner.conditions.length > 2 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-happy-monkey">
                                +{practitioner.conditions.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Enhanced mobile-first price and book section */}
                      <div className="flex items-center justify-between pt-4 border-t border-[rgba(4,196,213,0.1)]">
                        <div>
                          <div className="text-xl sm:text-2xl font-happy-monkey text-[#148BAF] font-bold">
                            ${practitioner.price}
                          </div>
                          <div className="text-xs text-gray-500 font-happy-monkey lowercase">
                            per session
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookNow(practitioner);
                          }}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-xl hover:from-[#148BAF] hover:to-[#04C4D5] transition-all duration-300 text-sm font-happy-monkey lowercase shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 min-h-[44px] min-w-[100px] justify-center"
                        >
                          <span>Book Now</span>
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced mobile hover effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(4,196,213,0.02)] to-[rgba(20,139,175,0.02)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl sm:rounded-2xl"></div>
                    
                    {/* Mobile-optimized click indicator */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#148BAF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
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