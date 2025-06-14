import { useState, useEffect } from "react";
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
    <div className="Main self-stretch p-[20px_20px_40px_20px] flex flex-col justify-start items-start gap-10">
      <div className="Frame32 self-stretch overflow-hidden flex flex-col justify-start items-start gap-[40px]">
        {/* Title */}
        <h2 className="BookYourFirstFreeSession self-stretch text-center text-[#04C4D5] text-[32px] font-happy-monkey lowercase">
          Book your first free session
        </h2>
        
        {/* Search Section */}
        <div className="Frame70 self-stretch flex flex-col justify-start items-start gap-[20px]">
          {/* Search bar */}
          <div className="Frame27 self-stretch p-[4px_10px] bg-white rounded-[10px] border border-[#04C4D5] flex justify-center items-center gap-[10px]">
            <input
              type="text"
              placeholder="TRY 'ANGER MANAGEMENT'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[#49DADD] text-[16px] font-happy-monkey lowercase bg-transparent focus:outline-none"
            />
            <div className="text-[#49DADD] text-[32px] font-happy-monkey">|</div>
            <input
              type="text"
              placeholder="where do you want the therapy"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="flex-1 text-[#49DADD] text-[16px] font-happy-monkey lowercase bg-transparent focus:outline-none"
            />
            <button 
              onClick={handleSearch}
              className="bg-[#148BAF] text-white py-[10px] px-[10px] rounded-[10px] border border-[#04C4D5] flex justify-center items-center"
            >
              <span className="text-center text-[16px] font-happy-monkey lowercase">SEARCH</span>
            </button>
          </div>
          
          {/* Condition chips */}
          <div className="Frame17 flex flex-wrap justify-start items-start gap-[10px]">
            {therapyConditions.map((condition) => (
              <div
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`w-[205.5px] py-[10px] px-[10px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] overflow-hidden rounded-[8px] border border-[#04C4D5] flex justify-center items-center cursor-pointer ${
                  selectedConditions.includes(condition.id) 
                    ? 'bg-[#148BAF] text-white' 
                    : 'bg-white text-[#04C4D5]'
                }`}
              >
                <span className="text-center font-happy-monkey text-[16px] lowercase">{condition.label}</span>
              </div>
            ))}
          </div>
          
          {/* Tabs */}
          <div className="Frame45 self-stretch flex justify-start items-center gap-[20px]">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-[4px] flex justify-center items-center gap-[10px] cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-[#148BAF] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]' 
                    : ''
                }`}
              >
                <span 
                  className={`min-w-[100px] text-center font-happy-monkey text-[16px] lowercase ${
                    activeTab === tab.id ? 'text-[#148BAF]' : 'text-[#04C4D5]'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Therapist cards grid */}
          <div className="Frame31 self-stretch flex flex-wrap justify-start items-start gap-[20px] content-start">
            {loading ? (
              // Loading state
              <div className="w-full flex justify-center items-center py-10">
                <div className="text-[#148BAF] font-happy-monkey">Loading therapists...</div>
              </div>
            ) : practitioners.length === 0 ? (
              // Empty state
              <div className="w-full flex justify-center items-center py-10">
                <div className="text-[#148BAF] font-happy-monkey">No therapists found matching your criteria</div>
              </div>
            ) : (
              // Practitioner cards
              practitioners.map((practitioner) => (
                <div
                  key={practitioner.id}
                  className="flex-1 min-w-[300px] max-w-[500px] p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col justify-center items-center gap-[10px]"
                >
                  {/* Image with badge */}
                  <div className="Frame44 self-stretch h-[100px] relative overflow-hidden rounded-[4px] bg-[#f0f0f0]">
                    {practitioner.image_url && (
                      <img 
                        src={practitioner.image_url} 
                        alt={practitioner.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {practitioner.badge && (
                      <div className="Frame5 p-[6px] left-[10px] top-[8px] absolute bg-[#E6F9FA] overflow-hidden rounded-[10px] flex flex-col justify-start items-start gap-[10px]">
                        <span className="text-[#148BAF] text-[14px] font-happy-monkey lowercase">{practitioner.badge}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="AndrewSchulzOnline self-stretch text-black text-[16px] font-happy-monkey lowercase">
                    {practitioner.name}
                  </div>
                  
                  {/* Specialty */}
                  <div className="SomeParametersForUsersToMakeDecision self-stretch text-[#148BAF] text-[14px] font-happy-monkey lowercase">
                    {practitioner.specialty}
                  </div>
                  
                  {/* Education */}
                  <div className="Frame72 self-stretch flex justify-start items-center gap-[2px]">
                    <div className="UniversityDegreeIconsvgCo relative">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="#49DADD"/>
                        <path d="M6.9292 6.00409H14.5143V7.50609H6.9292V6.00409Z" fill="#49DADD"/>
                        <path d="M6.9292 9.00818H14.5143V10.5102H6.9292V9.00818Z" fill="#49DADD"/>
                        <path d="M8.88141 11.261C7.82993 11.261 7.00391 12.087 7.00391 13.1385C7.00391 13.7392 7.30436 14.265 7.75491 14.6405V18.0199L8.88141 16.8934L10.0079 18.0199V14.6403C10.4585 14.2648 10.7589 13.7391 10.7589 13.2133C10.7589 12.087 9.93271 11.261 8.88141 11.261Z" fill="#49DADD"/>
                      </svg>
                    </div>
                    <span className="MastersInPsychology flex-1 text-[#148BAF] text-[14px] font-happy-monkey lowercase">
                      {practitioner.education}
                    </span>
                  </div>
                  
                  {/* Rating and Price */}
                  <div className="Frame71 self-stretch flex justify-center items-center gap-[10px]">
                    <div className="Frame72 flex justify-start items-center gap-[2px]">
                      <div className="Star1">
                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z" fill="#49DADD"/>
                        </svg>
                      </div>
                      <span className="34Reviews w-[118.38px] text-[#148BAF] text-[14px] font-happy-monkey lowercase">
                        {practitioner.rating} ({practitioner.reviews} reviews)
                      </span>
                    </div>
                    <span className="900Session flex-1 text-right text-black text-[14px] font-happy-monkey lowercase">
                      $ {practitioner.price}/session
                    </span>
                  </div>
                  
                  {/* Book button */}
                  <button className="w-full py-2 bg-[#148BAF] text-white rounded-[10px] font-happy-monkey lowercase">
                    Book session
                  </button>
                </div>
              ))
            )}
            
            {/* Empty placeholder cards (only show if there are practitioners) */}
            {practitioners.length > 0 && (
              <>
                <div className="Frame48 flex-1 h-[116px] max-w-[500px] min-w-[300px] p-[10px] bg-white rounded-[10px]"></div>
                <div className="Frame39 flex-1 h-[68px] max-w-[500px] min-w-[400px] p-[10px] bg-white rounded-[10px]"></div>
                <div className="Frame40 flex-1 h-[68px] max-w-[500px] min-w-[400px] p-[10px] bg-white rounded-[10px]"></div>
                <div className="Frame41 flex-1 h-[68px] max-w-[500px] min-w-[400px] p-[10px] bg-white rounded-[10px]"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyBooking;