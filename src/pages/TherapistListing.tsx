import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  location_type: "online" | "in-person" | "both";
  conditions: string[];
}

const therapyConditions = [
  { id: "depression", label: "depression" },
  { id: "adhd", label: "adhd" },
  { id: "ocd", label: "ocd" },
  { id: "anxiety", label: "anxiety" },
  { id: "postpartum", label: "postpartum" },
  { id: "bipolar", label: "bi-polar" },
  { id: "anger", label: "anger" },
  { id: "grief", label: "grief & loss" },
  { id: "trauma", label: "trauma" }
];

const tabs = [
  { id: "recommended", label: "recommended" },
  { id: "online", label: "Online" },
  { id: "face-to-face", label: "Face-to-face" }
];

// Dummy data for therapists
const dummyTherapists: Practitioner[] = [
  {
    id: 1,
    name: "Dr. Andrew Schulz",
    specialty: "Depression, Anxiety, Stress Management",
    reviews: 42,
    rating: 4.8,
    price: 120,
    image_url: "https://randomuser.me/api/portraits/men/32.jpg",
    badge: 'top rated',
    education: "PhD in Clinical Psychology",
    degree: "Psychology",
    location_type: "online",
    conditions: ["depression", "anxiety", "trauma"]
  },
  {
    id: 2,
    name: "Sarah Johnson, LMFT",
    specialty: "Relationship Issues, Trauma, PTSD",
    reviews: 28,
    rating: 4.5,
    price: 95,
    image_url: "https://randomuser.me/api/portraits/women/44.jpg",
    badge: 'experienced',
    education: "Masters in Family Therapy",
    degree: "Psychology",
    location_type: "both",
    conditions: ["depression", "grief", "trauma"]
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    specialty: "ADHD, Behavioral Issues, Life Transitions",
    reviews: 16,
    rating: 4.7,
    price: 150,
    image_url: "https://randomuser.me/api/portraits/men/64.jpg",
    badge: 'new',
    education: "PsyD in Clinical Psychology",
    degree: "Psychology",
    location_type: "in-person",
    conditions: ["adhd", "anxiety", "bipolar"]
  },
  {
    id: 4,
    name: "Emily Rodriguez, LCSW",
    specialty: "Anxiety, OCD, Stress Management",
    reviews: 34,
    rating: 4.9,
    price: 110,
    image_url: "https://randomuser.me/api/portraits/women/28.jpg",
    badge: 'top rated',
    education: "Masters in Social Work",
    degree: "Social Work",
    location_type: "online",
    conditions: ["ocd", "anxiety", "depression"]
  },
  {
    id: 5,
    name: "Dr. James Wilson",
    specialty: "Bipolar Disorder, Depression, PTSD",
    reviews: 51,
    rating: 4.6,
    price: 130,
    image_url: "https://randomuser.me/api/portraits/men/22.jpg",
    badge: 'experienced',
    education: "PhD in Psychiatry",
    degree: "Psychiatry",
    location_type: "both",
    conditions: ["bipolar", "depression", "trauma"]
  },
  {
    id: 6,
    name: "Olivia Park, LMHC",
    specialty: "Grief & Loss, Trauma, Anxiety",
    reviews: 19,
    rating: 4.7,
    price: 100,
    image_url: "https://randomuser.me/api/portraits/women/56.jpg",
    badge: 'new',
    education: "Masters in Mental Health Counseling",
    degree: "Counseling",
    location_type: "online",
    conditions: ["grief", "trauma", "anxiety"]
  }
];

const TherapistListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedConditions, setSelectedConditions] = useState<string[]>(["ocd"]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>(dummyTherapists);
  const [loading, setLoading] = useState(false);

  // Fetch practitioners from Supabase
  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true);
      try {
        // Filter dummy data based on selected conditions
        let filteredResults = dummyTherapists;
        
        if (selectedConditions.length > 0) {
          filteredResults = dummyTherapists.filter(therapist => 
            therapist.conditions.some(condition => selectedConditions.includes(condition))
          );
        }
        
        // Apply tab filters
        if (activeTab === "online") {
          filteredResults = filteredResults.filter(
            therapist => therapist.location_type === "online" || therapist.location_type === "both"
          );
        } else if (activeTab === "face-to-face") {
          filteredResults = filteredResults.filter(
            therapist => therapist.location_type === "in-person" || therapist.location_type === "both"
          );
        }
        
        // You can also add Supabase query here when ready to switch to real data
        setPractitioners(filteredResults);
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
    console.log("Searching for:", searchQuery, "in", locationQuery);
    // Filter by search query
    const filteredResults = dummyTherapists.filter(therapist => 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.conditions.some(condition => condition.includes(searchQuery.toLowerCase()))
    );
    
    setPractitioners(filteredResults);
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
          
          {/* Condition chips - COMPACT SIZE */}
          <div className="Frame17 flex flex-wrap justify-start items-start gap-[5px]">
            {therapyConditions.map((condition) => (
              <div
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`w-auto py-[4px] px-[8px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] overflow-hidden rounded-[6px] border border-[#04C4D5] flex justify-center items-center cursor-pointer ${
                  selectedConditions.includes(condition.id) 
                    ? 'bg-[#148BAF] text-white' 
                    : 'bg-white text-[#04C4D5]'
                }`}
              >
                <span className="text-center font-happy-monkey text-[12px] lowercase whitespace-nowrap">{condition.label}</span>
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
          <div className="Frame31 self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {loading ? (
              // Loading state
              <div className="col-span-full flex justify-center items-center p-8">
                <div className="loading-spinner"></div>
              </div>
            ) : practitioners.length > 0 ? (
              // Therapist cards
              practitioners.map((therapist) => (
                <Card key={therapist.id} className="TherapistCard overflow-hidden border border-[#04C4D5] rounded-[10px] shadow-md">
                  <div className="flex flex-col h-full">
                    {/* Therapist header with image and badge */}
                    <div className="relative">
                      <img 
                        src={therapist.image_url} 
                        alt={therapist.name} 
                        className="w-full h-[180px] object-cover"
                      />
                      {therapist.badge && (
                        <div className="absolute top-2 right-2 bg-[#148BAF] text-white text-[12px] py-1 px-2 rounded-full">
                          {therapist.badge}
                        </div>
                      )}
                    </div>
                    
                    {/* Therapist info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-[18px] font-bold text-[#148BAF]">{therapist.name}</h3>
                      <p className="text-[14px] text-gray-600">{therapist.education}</p>
                      <p className="text-[14px] text-gray-700 mt-1">{therapist.specialty}</p>
                      
                      {/* Rating and reviews */}
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={`text-${i < Math.floor(therapist.rating) ? '[#FFD700]' : 'gray-300'}`}>★</span>
                          ))}
                        </div>
                        <span className="ml-1 text-[14px]">({therapist.reviews})</span>
                      </div>
                      
                      {/* Conditions */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {therapist.conditions.slice(0, 3).map((condition) => (
                          <span key={condition} className="text-[11px] bg-[#E6F7F8] text-[#148BAF] px-2 py-1 rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                      
                      {/* Session type and price */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[13px] text-gray-600">
                          {therapist.location_type === "online" ? "Online" : 
                           therapist.location_type === "in-person" ? "In-person" : 
                           "Online & In-person"}
                        </span>
                        <span className="text-[14px] font-semibold">${therapist.price}/hr</span>
                      </div>
                      
                      {/* Book button */}
                      <Button 
                        className="mt-4 w-full bg-[#148BAF] hover:bg-[#04C4D5] text-white font-happy-monkey lowercase"
                        onClick={() => {
                          // Navigate to booking page with therapist ID
                          window.location.href = `/therapy-booking/${therapist.id}`;
                        }}
                      >
                        Book free session
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              // No results
              <div className="col-span-full text-center p-8">
                <p className="text-[#148BAF] text-[18px] font-happy-monkey">No therapists found matching your criteria</p>
                <p className="text-gray-600 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistListing;