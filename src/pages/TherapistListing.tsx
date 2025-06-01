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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {practitioners.map((practitioner) => (
                  <div key={practitioner.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={practitioner.image_url || '/api/placeholder/64/64'}
                          alt={practitioner.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {practitioner.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">{practitioner.specialty}</p>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center">
                                  <span className="text-yellow-400">★</span>
                                  <span className="text-sm text-gray-600 ml-1">
                                    {practitioner.rating} ({practitioner.reviews} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                            {practitioner.badge && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(practitioner.badge)}`}>
                                {practitioner.badge}
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{practitioner.degree}</span> • {practitioner.education}
                            </p>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {practitioner.location_type === 'online' ? 'Online' : 'In-Person'}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-gray-900">
                              ${practitioner.price}/session
                            </div>
                            <button
                              onClick={() => handleBookNow(practitioner)}
                              className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors text-sm font-medium"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
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