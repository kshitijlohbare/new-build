import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Practitioner, 
  PractitionerService 
} from '@/services/PractitionerService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar,
  ChevronDown,
  Clock,
  ThumbsUp,
  GraduationCap,
  Languages,
  CreditCard,
  ListFilter
} from 'lucide-react';

// Animation styles
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.practitioner-card {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

export default function PractitionerListing() {
  const navigate = useNavigate();
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [tableCreationStatus, setTableCreationStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    // First check if practitioners table exists and create it if needed
    initializePractitionersTable();
  }, []);

  useEffect(() => {
    // Re-fetch data when filters change
    if (!tableCreationStatus) {
      fetchPractitioners();
    }
  }, [currentPage, activeFilter, selectedSpecialty, tableCreationStatus]);

  const initializePractitionersTable = async () => {
    try {
      setTableCreationStatus('Checking practitioners table...');
      const tableExists = await PractitionerService.checkAndCreateTable();
      
      if (tableExists) {
        setTableCreationStatus('');
        await fetchPractitioners();
        await fetchSpecialties();
      } else {
        setTableCreationStatus('Error initializing practitioners data');
      }
    } catch (error) {
      console.error('Error initializing practitioners:', error);
      setTableCreationStatus('Error setting up practitioners');
      setLoading(false);
    }
  };

  const fetchPractitioners = async () => {
    setLoading(true);
    try {
      let result;
      
      // Apply filters based on the activeFilter
      if (activeFilter === 'topRated') {
        result = await PractitionerService.getByMinimumRating(4.5);
      } else if (activeFilter === 'experienced') {
        // Since we don't have a direct method for this, we'll filter client-side
        const { data, error } = await PractitionerService.getAll();
        if (error) throw error;
        result = { 
          data: data?.filter(p => p.years_experience >= 10) || [], 
          error: null 
        };
      } else if (searchTerm) {
        result = await PractitionerService.searchByText(searchTerm);
      } else if (selectedSpecialty) {
        result = await PractitionerService.getBySpecialty(selectedSpecialty);
      } else {
        // Default: paginated list
        const paginatedResult = await PractitionerService.getPaginated(currentPage, pageSize);
        result = { data: paginatedResult.data, error: paginatedResult.error };
        setTotalCount(paginatedResult.count || 0);
      }
      
      if (result.error) throw result.error;
      setPractitioners(result.data || []);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSpecialties = async () => {
    try {
      const { data, error } = await PractitionerService.getSpecialties();
      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPractitioners();
  };

  const filteredPractitioners = practitioners;
  
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleViewPractitioner = (id: string) => {
    navigate(`/practitioner/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FCFD] font-happy-monkey pb-12">
      {/* Header */}
      <div className="w-full bg-[rgba(6,196,213,0.10)] px-4 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-[#06C4D5] text-2xl sm:text-3xl lowercase mb-2">Caktus Coco Practitioners</h1>
          <p className="text-center text-gray-600 text-sm mb-6">Connect with wellness professionals specialized in your unique needs</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, specialty, or treatment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06C4D5] focus:border-transparent text-sm shadow-sm hover:border-gray-300 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white font-medium rounded-full px-6 py-2.5 transition hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] sm:w-auto w-full text-sm"
            >
              Find Practitioners
            </button>
          </form>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 items-center justify-between text-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                activeFilter === 'all' 
                  ? 'bg-[#E8F7FA] text-[#208EB1]' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              All Practitioners
            </button>
            <button 
              onClick={() => setActiveFilter('topRated')}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center ${
                activeFilter === 'topRated' 
                  ? 'bg-[#E8F7FA] text-[#208EB1]' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Star className="mr-1.5 h-3.5 w-3.5" />
              Top Rated
            </button>
            <button 
              onClick={() => setActiveFilter('experienced')}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center ${
                activeFilter === 'experienced' 
                  ? 'bg-[#E8F7FA] text-[#208EB1]' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
              Most Experienced
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#06C4D5] focus:border-[#06C4D5] text-gray-700 text-sm"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Summary or Table Status */}
      <div className="w-full bg-white px-4 py-2 border-b border-gray-100 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {tableCreationStatus ? (
            <p className="text-sm text-[#208EB1] italic animate-pulse">
              {tableCreationStatus}
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredPractitioners.length}</span> practitioners available
              </p>
              <p className="text-xs text-gray-400 italic">Results based on your filters</p>
            </>
          )}
        </div>
      </div>
      
      {/* Practitioner Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeletons during loading
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border border-gray-200 animate-pulse">
              <div className="flex flex-col h-full">
                <Skeleton className="w-full h-40 bg-gray-200" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200 mb-4" />
                  <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200 mb-4" />
                  <Skeleton className="h-8 w-full bg-gray-200 mt-4" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredPractitioners.length > 0 ? (
          filteredPractitioners.map((practitioner) => (
            <Card key={practitioner.id} className="practitioner-card overflow-hidden border border-gray-200 hover:border-[#06C4D5] hover:shadow-md transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="w-full h-40 bg-gray-100">
                  {practitioner.image_url ? (
                    <img 
                      src={practitioner.image_url} 
                      alt={practitioner.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[rgba(6,196,213,0.05)] to-[rgba(32,142,177,0.05)]">
                      <span className="text-[#208EB1] font-happy-monkey lowercase">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-happy-monkey text-gray-900">{practitioner.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-[#208EB1]" />
                    <span>{practitioner.location}</span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <div className="mr-3 flex items-center">
                      <div className="bg-[#E8F7FA] p-1 rounded-full mr-1.5">
                        <Star className="h-3.5 w-3.5 text-[#208EB1]" />
                      </div>
                      <span className="font-happy-monkey">{practitioner.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-gray-500 flex items-center">
                      <Clock className="h-3.5 w-3.5 text-[#208EB1] mr-1.5" />
                      {practitioner.years_experience} years experience
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{practitioner.bio}</p>
                  
                  {/* Additional details */}
                  <div className="mt-3 space-y-2 text-xs text-gray-600">
                    {practitioner.education && (
                      <div className="flex items-center">
                        <GraduationCap className="h-3.5 w-3.5 text-[#208EB1] mr-1.5" />
                        <span className="line-clamp-1">{practitioner.education}</span>
                      </div>
                    )}
                    
                    {practitioner.hourly_rate && (
                      <div className="flex items-center">
                        <CreditCard className="h-3.5 w-3.5 text-[#208EB1] mr-1.5" />
                        <span>${practitioner.hourly_rate}/hour</span>
                      </div>
                    )}
                    
                    {practitioner.languages && practitioner.languages.length > 0 && (
                      <div className="flex items-center">
                        <Languages className="h-3.5 w-3.5 text-[#208EB1] mr-1.5" />
                        <span>{practitioner.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 mb-1 flex flex-wrap gap-1.5">
                    <span className="inline-block bg-[#E8F7FA] text-[#208EB1] rounded-full px-3 py-1 text-xs">
                      {practitioner.specialty}
                    </span>
                    {practitioner.certifications && practitioner.certifications.slice(0, 1).map((cert, i) => (
                      <span key={i} className="inline-block bg-[#E8F7FA]/50 text-[#208EB1] rounded-full px-3 py-1 text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <Button 
                      onClick={() => handleViewPractitioner(practitioner.id)}
                      className="w-full bg-gradient-to-r from-[#06C4D5] to-[#208EB1] hover:from-[#04B0C0] hover:to-[#1A7A9A] text-white flex items-center justify-center group transition-all"
                    >
                      <Calendar className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      View Profile & Book
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-[rgba(6,196,213,0.10)] rounded-full flex items-center justify-center mb-4">
              <ListFilter className="w-10 h-10 text-[#06C4D5]" />
            </div>
            <h3 className="text-xl font-happy-monkey text-gray-800 mb-2 lowercase">No practitioners found</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              We couldn't find practitioners matching your criteria. Try adjusting your filters for more results.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setActiveFilter('all');
              }}
              className="bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white font-happy-monkey rounded-full px-6 py-2.5 hover:shadow-lg transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="max-w-6xl mx-auto px-4 mt-8 flex justify-center">
          <div className="flex space-x-1">
            <button 
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded-md ${
                currentPage === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === index 
                    ? 'bg-[#E8F7FA] text-[#208EB1] font-happy-monkey' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
    </div>
  );
}