import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Enhanced CSS animations with mobile-optimized styles
const bookingAnimationStyles = `
@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(20, 139, 175, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(20, 139, 175, 0.1); }
}

.booking-card-hover {
  transition: all 0.3s ease-out;
}

.booking-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 139, 175, 0.15);
}

/* Mobile-specific hover effects */
@media (hover: hover) {
  .booking-card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(20, 139, 175, 0.15);
  }
}

@media (hover: none) {
  .booking-card-hover:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(20, 139, 175, 0.1);
  }
}

.session-card {
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.session-card:active {
  transform: scale(0.98);
}

.time-slot {
  transition: all 0.2s ease-out;
  cursor: pointer;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-slot:active {
  transform: scale(0.95);
}

.date-slot {
  transition: all 0.2s ease-out;
  cursor: pointer;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.date-slot:active {
  transform: scale(0.95);
}

/* Mobile-optimized focus states */
@media (max-width: 768px) {
  .focus-mobile:focus {
    outline: 2px solid rgba(20, 139, 175, 0.5);
    outline-offset: 2px;
  }
}

.booking-button {
  min-height: 52px;
  transition: all 0.3s ease-out;
}

.booking-button:active {
  transform: translateY(1px);
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulseGlow 2s infinite;
}
`;

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
  bio?: string;
  years_experience?: number;
  approach?: string;
  languages?: string[];
  certifications?: string[];
  availability?: string;
  insurance_accepted?: string[];
  session_format?: string[];
}

// Commented out unused interface
// interface TimeSlot {
//   id: string;
//   time: string;
//   available: boolean;
// }

const sessionTypes = [
  { id: "initial", name: "Initial Consultation", duration: "50 min", price: 0 },
  { id: "therapy", name: "Therapy Session", duration: "50 min", price: null },
  { id: "followup", name: "Follow-up Session", duration: "30 min", price: null },
];

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("initial");
  // Commented out unused state variables
  // const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    date: string;
    time: string;
    type: string;
    isRescheduling: boolean;
  } | null>(null);

  // Effect to get URL parameters and fetch practitioner data
  useEffect(() => {
    // Get the practitioner ID from the URL or state
    const practitionerId = new URLSearchParams(location.search).get("id") || id;
    const rescheduleParam = new URLSearchParams(location.search).get("reschedule");
    
    if (rescheduleParam) {
      setIsRescheduling(true);
      setRescheduleId(rescheduleParam);
    }

    if (!practitionerId) {
      navigate("/therapist-listing");
      return;
    }
    
    const fetchPractitioner = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("practitioners")
          .select("*")
          .eq("id", practitionerId)
          .single();
          
        if (error) {
          console.error("Error fetching practitioner:", error);
          toast({
            title: "Error",
            description: "Could not find the requested practitioner.",
            variant: "destructive"
          });
          navigate("/therapist-listing");
          return;
        }
        
        // Map/cast to Practitioner interface directly from Supabase data
        const practitionerData: Practitioner = {
          id: Number(data.id),
          name: String(data.name),
          specialty: String(data.specialty),
          reviews: Number(data.reviews),
          rating: Number(data.rating),
          price: Number(data.price),
          image_url: String(data.image_url),
          badge: data.badge as 'top rated' | 'new' | 'experienced' | null,
          education: String(data.education),
          degree: String(data.degree),
          location_type: String(data.location_type),
          conditions: Array.isArray(data.conditions) ? data.conditions.map(String) : [],
          bio: data.bio ? String(data.bio) : "A compassionate and dedicated therapist with a strong commitment to helping clients achieve their goals.",
          years_experience: data.years_experience ? Number(data.years_experience) : 8,
          approach: data.approach ? String(data.approach) : undefined,
          languages: Array.isArray(data.languages) ? data.languages.map(String) : ["English"],
          certifications: Array.isArray(data.certifications) ? data.certifications.map(String) : undefined,
          availability: data.availability ? String(data.availability) : undefined,
          insurance_accepted: Array.isArray(data.insurance_accepted) ? data.insurance_accepted.map(String) : undefined,
          session_format: Array.isArray(data.session_format) ? data.session_format.map(String) : undefined,
        };
        setPractitioner(practitionerData);
        
        // If rescheduleId is present, fetch the existing appointment
        if (rescheduleParam) {
          fetchAppointmentToReschedule(rescheduleParam);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
        navigate("/therapist-listing");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPractitioner();
  }, [location.search, navigate, id, toast]);
  
  // Function to fetch appointment details for rescheduling
  const fetchAppointmentToReschedule = async (appointmentId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", appointmentId)
        .eq("user_id", user.id) 
        .single();
        
      if (error) {
        console.error("Error fetching appointment:", error);
        toast({
          title: "Error",
          description: "Could not retrieve appointment details for rescheduling.",
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Set existing appointment type
        if (data.session_type !== undefined) {
          setSelectedType(String(data.session_type));
        }
        
        // Show a message that we're rescheduling
        toast({
          title: "Reschedule Appointment",
          description: "Please select a new date and time for your appointment."
        });
      }
    } catch (err) {
      console.error("Unexpected error fetching appointment:", err);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle session type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  // Open confirmation dialog
  const openConfirmation = () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a date, time and session type.",
        variant: "destructive"
      });
      return;
    }
    
    setAppointmentDetails({
      date: selectedDate,
      time: selectedTime,
      type: sessionTypes.find(t => t.id === selectedType)?.name || selectedType,
      isRescheduling
    });
    
    setConfirmationOpen(true);
  };

  // Process the booking
  const processBooking = async () => {
    if (!user || !practitioner || !selectedDate || !selectedTime || !selectedType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required information.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Handle rescheduling
      if (isRescheduling && rescheduleId) {
        const updateData = {
          date: selectedDate,
          time: selectedTime,
          session_type: selectedType,
        };
        
        const { error } = await supabase
          .from("appointments")
          .update(updateData)
          .eq("id", rescheduleId)
          .eq("user_id", user.id);

        if (error) {
          console.error(`Error updating booking:`, error);
          toast({
            title: "Reschedule Failed",
            description: `There was an error: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
      } else {
        // Handle new booking
        const insertData = {
          practitioner_id: practitioner.id,
          practitioner_name: practitioner.name,
          date: selectedDate,
          time: selectedTime,
          session_type: selectedType,
          user_id: user.id,
          status: "confirmed",
          created_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from("appointments")
          .insert(insertData);
        
        if (error) {
          console.error(`Error inserting booking:`, error);
          toast({
            title: "Booking Failed",
            description: `There was an error: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
      }
      
      // Success toast notification
      const dateObject = new Date(selectedDate);
      toast({
        title: isRescheduling ? "Appointment Rescheduled" : "Appointment Confirmed",
        description: `Your session with ${practitioner.name} on ${dateObject.toDateString()} at ${selectedTime} is ${isRescheduling ? "rescheduled" : "confirmed"}.`,
        variant: "success",
      });
      
      navigate("/appointments");
    } catch (err: any) {
      console.error(`An unexpected error occurred:`, err);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${err.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF] p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#148BAF]/20 border-t-[#148BAF] rounded-full animate-spin mb-4 sm:mb-6 mx-auto"></div>
          <p className="text-lg sm:text-xl text-[#148BAF] font-happy-monkey mb-2">Loading practitioner details...</p>
          <p className="text-sm sm:text-base text-gray-600">Please wait while we prepare your booking experience</p>
        </div>
      </div>
    );
  }

  // Enhanced error state if practitioner not found
  if (!practitioner) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF] flex items-center justify-center">
        <Card className="p-6 sm:p-8 relative w-full booking-card-hover border-0 shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(247,255,255,0.95))',
          boxShadow: '0 4px 20px rgba(20, 139, 175, 0.1)'
        }}>
          <button
            onClick={() => navigate("/therapist-listing")}
            className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 active:scale-95 touch-button focus-mobile"
            aria-label="Close and go back"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-happy-monkey text-[#148BAF] mb-3 sm:mb-4 pr-8">
              Practitioner Not Found
            </h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              We couldn't find the practitioner you're looking for. This might be because:
            </p>
            <ul className="mb-6 sm:mb-8 text-gray-700 list-disc text-left max-w-md mx-auto space-y-2 text-sm sm:text-base">
              <li>The practitioner profile has been removed</li>
              <li>The link you followed is outdated</li>
              <li>There was a temporary issue loading the data</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <Button 
                onClick={() => navigate("/therapist-listing")}
                className="booking-button bg-gradient-to-r from-[#148BAF] to-[#04C4D5] text-white font-medium flex-1 focus-mobile"
                style={{ minHeight: '48px' }}
              >
                Browse All Practitioners
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="booking-button border-[#148BAF] text-[#148BAF] hover:bg-[#148BAF] hover:text-white flex-1 focus-mobile"
                style={{ minHeight: '48px' }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate the session price
  const getSessionPrice = (sessionType: string) => {
    const selectedSessionType = sessionTypes.find(t => t.id === sessionType);
    // If the session type has a specified price, use that
    if (selectedSessionType && selectedSessionType.price !== null) {
      return selectedSessionType.price;
    }
    // Otherwise use the practitioner's price
    return practitioner.price;
  };

  // Generate dummy available dates (next 7 days)
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF]">
      {/* Add the enhanced CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: bookingAnimationStyles }} />
      
      <Button
        onClick={() => navigate("/therapist-listing")}
        className="text-[#148BAF] mb-4 sm:mb-6 booking-button touch-button focus-mobile animate-fade-in-up"
        variant="outline"
        style={{ minHeight: '48px' }}
      >
        ← Back to Therapists
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {/* Enhanced Practitioner Information - Left Column */}
        <div className="lg:col-span-2 animate-slide-in-left">
          <Card className="p-4 sm:p-6 booking-card-hover border-0 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(247,255,255,0.95))',
            boxShadow: '0 4px 20px rgba(20, 139, 175, 0.1)'
          }}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left mb-4 sm:mb-6">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#E6F9FA] to-[#F7FFFF] mx-auto lg:mx-0 lg:mr-4 mb-4 lg:mb-0 flex-shrink-0 animate-pulse-glow"
                style={{ 
                  backgroundImage: practitioner.image_url ? `url(${practitioner.image_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '3px solid rgba(20, 139, 175, 0.2)'
                }}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-xl font-happy-monkey text-[#148BAF] mb-1 sm:mb-2">
                  {practitioner.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{practitioner.specialty}</p>
                <div className="flex items-center justify-center lg:justify-start mt-1 sm:mt-2">
                  <div className="flex text-amber-400 text-sm sm:text-base">
                    {'★'.repeat(Math.floor(practitioner.rating))}
                    {'☆'.repeat(5 - Math.floor(practitioner.rating))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 ml-2">
                    {practitioner.rating} ({practitioner.reviews} reviews)
                  </span>
                </div>
                
                {/* Enhanced badge display for mobile */}
                {practitioner.badge && (
                  <div className="mt-2 sm:mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      practitioner.badge === 'top rated' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      practitioner.badge === 'new' ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white' :
                      'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                    }`}>
                      {practitioner.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <hr className="my-4 sm:my-6 border-gray-200" />
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-[#148BAF] mb-2 sm:mb-3">About</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{practitioner.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-[#F7FFFF] to-[#E6F9FA] p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-sm sm:text-base text-[#148BAF] mb-1">Experience</h3>
                  <p className="text-sm sm:text-base text-gray-700">{practitioner.years_experience} years</p>
                </div>
                <div className="bg-gradient-to-br from-[#F7FFFF] to-[#E6F9FA] p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-sm sm:text-base text-[#148BAF] mb-1">Education</h3>
                  <p className="text-sm sm:text-base text-gray-700">{practitioner.education}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#F7FFFF] to-[#E6F9FA] p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-sm sm:text-base text-[#148BAF] mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {practitioner.languages?.map((language, index) => (
                    <span 
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-[#148BAF] border border-[#148BAF]/20"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Enhanced Booking Section - Right Column */}
        <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="p-4 sm:p-6 booking-card-hover border-0 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(247,255,255,0.95))',
            boxShadow: '0 4px 20px rgba(20, 139, 175, 0.1)'
          }}>
            <h2 className="text-xl sm:text-2xl font-happy-monkey text-[#148BAF] mb-4 sm:mb-6 text-center lg:text-left">
              {isRescheduling ? "Reschedule Your Appointment" : "Book Your Appointment"}
            </h2>
            
            {/* Enhanced Session Type Selection */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-base sm:text-lg text-[#148BAF] mb-3 sm:mb-4">Select Session Type</h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {sessionTypes.map((type, index) => (
                  <div
                    key={type.id}
                    className={`session-card p-4 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 touch-button focus-mobile ${
                      selectedType === type.id 
                        ? "border-[#148BAF] bg-gradient-to-br from-blue-50 to-[#E6F9FA] shadow-md" 
                        : "border-gray-200 hover:border-[#148BAF]/50 hover:bg-gray-50"
                    }`}
                    onClick={() => handleTypeSelect(type.id)}
                    style={{ 
                      animationDelay: `${0.1 + index * 0.1}s`,
                      minHeight: '72px'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm sm:text-base text-gray-900 mb-1">{type.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{type.duration}</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className={`text-lg sm:text-xl font-bold ${
                          selectedType === type.id ? 'text-[#148BAF]' : 'text-gray-700'
                        }`}>
                          {type.price === 0 ? "Free" : 
                           type.price === null ? `$${practitioner.price}` : 
                           `$${type.price}`}
                        </span>
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <div className="mt-2 flex justify-end">
                        <div className="w-4 h-4 rounded-full bg-[#148BAF] flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Date Selection */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-base sm:text-lg text-[#148BAF] mb-3 sm:mb-4">Select Date</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                {next7Days.map((date, index) => {
                  const d = new Date(date);
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div
                      key={date}
                      className={`date-slot p-2 sm:p-3 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 touch-button focus-mobile ${
                        selectedDate === date 
                          ? "border-[#148BAF] bg-gradient-to-br from-blue-50 to-[#E6F9FA] shadow-md transform scale-105" 
                          : "border-gray-200 hover:border-[#148BAF]/50 hover:bg-gray-50"
                      }`}
                      onClick={() => handleDateSelect(date)}
                      style={{ 
                        animationDelay: `${0.3 + index * 0.05}s`,
                        minHeight: '72px'
                      }}
                    >
                      <div className={`text-xs font-medium mb-1 ${
                        selectedDate === date ? 'text-[#148BAF]' : 'text-gray-600'
                      }`}>
                        {dayName}
                      </div>
                      <div className={`text-lg sm:text-xl font-bold ${
                        selectedDate === date ? 'text-[#148BAF]' : 'text-gray-900'
                      }`}>
                        {dayNum}
                      </div>
                      <div className={`text-xs ${
                        selectedDate === date ? 'text-[#148BAF]' : 'text-gray-500'
                      }`}>
                        {monthName}
                      </div>
                      {isToday && (
                        <div className="text-xs font-medium text-green-600 mt-1">Today</div>
                      )}
                      {selectedDate === date && (
                        <div className="mt-1 flex justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#148BAF]"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced Time Selection - only show if date is selected */}
            {selectedDate && (
              <div className="mb-6 sm:mb-8 animate-fade-in-up">
                <h3 className="font-semibold text-base sm:text-lg text-[#148BAF] mb-3 sm:mb-4">Select Time</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {/* Enhanced time slots for better mobile experience */}
                  {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time, index) => (
                    <div
                      key={time}
                      className={`time-slot p-3 sm:p-4 border-2 rounded-xl text-center cursor-pointer transition-all duration-200 touch-button focus-mobile ${
                        selectedTime === time
                          ? "border-[#148BAF] bg-gradient-to-br from-blue-50 to-[#E6F9FA] shadow-md transform scale-105" 
                          : "border-gray-200 hover:border-[#148BAF]/50 hover:bg-gray-50"
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      style={{ 
                        animationDelay: `${0.1 + index * 0.05}s`,
                        minHeight: '56px'
                      }}
                    >
                      <span className={`text-sm sm:text-base font-medium ${
                        selectedTime === time ? 'text-[#148BAF]' : 'text-gray-900'
                      }`}>
                        {time}
                      </span>
                      {selectedTime === time && (
                        <div className="mt-1 flex justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#148BAF]"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Enhanced Summary and Book Button */}
            {selectedTime && (
              <div className="mt-6 sm:mt-8 animate-fade-in-up">
                <h3 className="font-semibold text-base sm:text-lg text-[#148BAF] mb-3 sm:mb-4">Booking Summary</h3>
                <div className="bg-gradient-to-br from-gray-50 to-[#F7FFFF] p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-gray-200 shadow-sm">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600 font-medium">Session Type</span>
                      <span className="font-semibold text-sm sm:text-base text-gray-900">
                        {sessionTypes.find(t => t.id === selectedType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm sm:text-base text-gray-600 font-medium">Date & Time</span>
                      <div className="text-right">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">
                          {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">at {selectedTime}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 pt-3">
                      <span className="font-bold text-base sm:text-lg text-[#148BAF]">Total</span>
                      <span className="font-bold text-lg sm:text-xl text-[#148BAF]">
                        {getSessionPrice(selectedType) === 0 
                          ? "Free" 
                          : `$${getSessionPrice(selectedType)}`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={openConfirmation}
                  className="w-full booking-button bg-gradient-to-r from-[#148BAF] to-[#04C4D5] text-white font-semibold text-base sm:text-lg py-4 sm:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-mobile animate-pulse-glow"
                  style={{ minHeight: '56px' }}
                >
                  {isRescheduling ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Reschedule Appointment
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Book Appointment
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-happy-monkey text-[#148BAF]">
              {isRescheduling ? "Confirm Rescheduling" : "Confirm Booking"}
            </DialogTitle>
            <DialogDescription>
              Please review your appointment details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {appointmentDetails && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Type</span>
                  <span className="font-medium">{appointmentDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(appointmentDetails.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{appointmentDetails.time}</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#148BAF] text-white"
              onClick={processBooking}
            >
              {appointmentDetails?.isRescheduling ? "Reschedule" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Booking;
