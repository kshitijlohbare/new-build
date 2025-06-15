import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { KeyboardAwareInput } from "@/components/ui/KeyboardAwareInput";

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

const TherapyBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      try {
        let query = supabase.from('practitioners').select('*');
        
        // Apply filters based on selected conditions
        if (selectedConditions.length > 0) {
          // Note: This assumes 'conditions' is stored as an array in Supabase
          // For PostgreSQL arrays, you'd use the 'overlap' operator
          query = query.overlaps('conditions', selectedConditions);
        }
        
        // Apply tab filters
        if (activeTab === "online") {
          query = query.eq('location_type', 'online');
        } else if (activeTab === "face-to-face") {
          query = query.eq('location_type', 'in-person');
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching practitioners:", error);
          setPractitioners([]);
        } else {
          setPractitioners((data || []).map((p: any) => ({
            id: Number(p.id),
            name: String(p.name),
            specialty: String(p.specialty),
            reviews: Number(p.reviews),
            rating: Number(p.rating),
            price: Number(p.price),
            image_url: String(p.image_url),
            badge: p.badge as 'top rated' | 'new' | 'experienced' | null,
            education: String(p.education),
            degree: String(p.degree),
            location_type: String(p.location_type),
            conditions: Array.isArray(p.conditions) ? p.conditions.map(String) : [],
          })));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setPractitioners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioners();
  }, [selectedConditions, activeTab]);

  const handleToggleCondition = (conditionId: string) => {
    if (selectedConditions.includes(conditionId)) {
      setSelectedConditions(prev => prev.filter(id => id !== conditionId));
    } else {
      setSelectedConditions(prev => [...prev, conditionId]);
    }
  };

  const handleSearch = () => {
    // Implement search functionality here
    // This would update the filters and trigger a new fetch
    console.log("Searching for:", searchQuery, "in", locationQuery);
  };
  
  return (
    <div className="Main self-stretch p-4 sm:p-5 lg:p-[20px_20px_40px_20px] flex flex-col justify-start items-start gap-6 sm:gap-8 lg:gap-10">
      <div className="Frame32 self-stretch overflow-hidden flex flex-col justify-start items-start gap-6 sm:gap-8 lg:gap-[40px]">
        {/* Title */}
        <h2 className="BookYourFirstFreeSession self-stretch text-center text-[#04C4D5] text-2xl sm:text-3xl lg:text-[32px] font-happy-monkey lowercase">
          Book your first free session
        </h2>
        
        {/* Search Section */}
        <div className="Frame70 self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5 lg:gap-[20px]">
          {/* Search bar - Mobile Responsive */}
          <div className="Frame27 self-stretch p-2 sm:p-[4px_10px] bg-white rounded-[10px] border border-[#04C4D5] flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 sm:gap-[10px]">
            <KeyboardAwareInput
              type="text"
              placeholder="TRY 'ANGER MANAGEMENT'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-2 text-[#49DADD] bg-transparent focus:outline-none border-b sm:border-b-0 border-[#04C4D5] sm:border-0 min-h-[48px] sm:min-h-[40px] touch-action-manipulation"
              style={{ fontSize: '16px' }}
            />
            <div className="hidden sm:block text-[#49DADD] text-[32px] font-happy-monkey">|</div>
            <KeyboardAwareInput
              type="text"
              placeholder="where do you want the therapy"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-2 text-[#49DADD] bg-transparent focus:outline-none border-b sm:border-b-0 border-[#04C4D5] sm:border-0 min-h-[48px] sm:min-h-[40px] touch-action-manipulation"
              style={{ fontSize: '16px' }}
            />
            <button 
              onClick={handleSearch}
              className="bg-[#148BAF] text-white py-3 px-4 sm:py-[10px] sm:px-[10px] rounded-[10px] border border-[#04C4D5] flex justify-center items-center w-full sm:w-auto min-h-[48px] touch-action-manipulation transition-all duration-300 active:scale-95"
            >
              <span className="text-center font-happy-monkey lowercase" style={{ fontSize: '16px' }}>SEARCH</span>
            </button>
          </div>
          
          {/* Condition chips - Mobile Responsive */}
          <div className="Frame17 flex flex-wrap justify-start items-start gap-2 sm:gap-3 lg:gap-[10px]">
            {therapyConditions.map((condition) => (
              <div
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`min-w-0 flex-1 max-w-full sm:max-w-[205.5px] py-3 px-4 sm:py-[10px] sm:px-[10px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] overflow-hidden rounded-[8px] border border-[#04C4D5] flex justify-center items-center cursor-pointer transition-colors min-h-[48px] sm:min-h-[40px] touch-action-manipulation active:scale-95 ${
                  selectedConditions.includes(condition.id) 
                    ? 'bg-[#148BAF] text-white' 
                    : 'bg-white text-[#04C4D5] hover:bg-gray-50'
                }`}
              >
                <span className="text-center font-happy-monkey lowercase truncate" style={{ fontSize: '16px' }}>{condition.label}</span>
              </div>
            ))}
          </div>
          
          {/* Tabs - Mobile Responsive */}
          <div className="Frame45 self-stretch flex justify-start items-center gap-4 sm:gap-5 lg:gap-[20px] overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 sm:px-[4px] flex justify-center items-center gap-[10px] cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-[#148BAF] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]' 
                    : ''
                }`}
              >
                <span 
                  className={`min-w-[80px] sm:min-w-[100px] text-center font-happy-monkey text-sm sm:text-[16px] lowercase ${
                    activeTab === tab.id ? 'text-[#148BAF]' : 'text-[#04C4D5]'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Therapist cards grid - Mobile Responsive */}
          <div className="Frame31 self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-[20px]">
            {loading ? (
              // Loading state
              <div className="col-span-full flex justify-center items-center py-10">
                <div className="text-[#148BAF] font-happy-monkey">Loading therapists...</div>
              </div>
            ) : practitioners.length === 0 ? (
              // Empty state
              <div className="col-span-full flex justify-center items-center py-10">
                <div className="text-[#148BAF] font-happy-monkey">No therapists found matching your criteria</div>
              </div>
            ) : (
              // Practitioner cards
              practitioners.map((practitioner) => (
                <div
                  key={practitioner.id}
                  className="p-3 sm:p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col justify-center items-center gap-2 sm:gap-[10px]"
                >
                  {/* Image with badge */}
                  <div className="Frame44 self-stretch h-20 sm:h-24 lg:h-[100px] relative overflow-hidden rounded-[4px] bg-[#f0f0f0]">
                    {practitioner.image_url && (
                      <img 
                        src={practitioner.image_url} 
                        alt={practitioner.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {practitioner.badge && (
                      <div className="Frame5 p-1 sm:p-[6px] left-1 sm:left-[10px] top-1 sm:top-[8px] absolute bg-[#E6F9FA] overflow-hidden rounded-[10px] flex flex-col justify-start items-start gap-[10px]">
                        <span className="text-[#148BAF] text-xs sm:text-[14px] font-happy-monkey lowercase">{practitioner.badge}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="AndrewSchulzOnline self-stretch text-black text-sm sm:text-[16px] font-happy-monkey lowercase text-center">
                    {practitioner.name}
                  </div>
                  
                  {/* Specialty */}
                  <div className="SomeParametersForUsersToMakeDecision self-stretch text-[#148BAF] text-xs sm:text-[14px] font-happy-monkey lowercase text-center">
                    {practitioner.specialty}
                  </div>
                  
                  {/* Education */}
                  <div className="Frame72 self-stretch flex justify-start items-center gap-1 sm:gap-[2px]">
                    <div className="UniversityDegreeIconsvgCo relative flex-shrink-0">
                      <svg width="18" height="18" className="sm:w-[22px] sm:h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="#49DADD"/>
                        <path d="M6.9292 6.00409H14.5143V7.50609H6.9292V6.00409Z" fill="#49DADD"/>
                        <path d="M6.9292 9.00818H14.5143V10.5102H6.9292V9.00818Z" fill="#49DADD"/>
                        <path d="M8.88141 11.261C7.82993 11.261 7.00391 12.087 7.00391 13.1385C7.00391 13.7392 7.30436 14.265 7.75491 14.6405V18.0199L8.88141 16.8934L10.0079 18.0199V14.6403C10.4585 14.2648 10.7589 13.7391 10.7589 13.2133C10.7589 12.087 9.93271 11.261 8.88141 11.261Z" fill="#49DADD"/>
                      </svg>
                    </div>
                    <span className="MastersInPsychology flex-1 text-[#148BAF] text-xs sm:text-[14px] font-happy-monkey lowercase truncate">
                      {practitioner.education}
                    </span>
                  </div>
                  
                  {/* Rating and Price */}
                  <div className="Frame71 self-stretch flex justify-between items-center gap-2 sm:gap-[10px]">
                    <div className="Frame72 flex justify-start items-center gap-1 sm:gap-[2px] flex-1">
                      <div className="Star1 flex-shrink-0">
                        <svg width="14" height="13" className="sm:w-[16px] sm:h-[15px]" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z" fill="#49DADD"/>
                        </svg>
                      </div>
                      <span className="34Reviews text-[#148BAF] text-xs sm:text-[14px] font-happy-monkey lowercase truncate">
                        {practitioner.rating} ({practitioner.reviews})
                      </span>
                    </div>
                    <span className="900Session text-right text-black text-xs sm:text-[14px] font-happy-monkey lowercase">
                      ${practitioner.price}/session
                    </span>
                  </div>
                  
                  {/* Book button */}
                  <button className="w-full py-3 bg-[#148BAF] text-white rounded-[10px] font-happy-monkey lowercase hover:bg-[#127a9a] transition-colors min-h-[48px] touch-action-manipulation active:scale-95" style={{ fontSize: '16px' }}>
                    Book session
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyBooking;