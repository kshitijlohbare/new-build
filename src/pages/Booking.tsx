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
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-[#148BAF]">Loading...</p>
      </div>
    );
  }

  // Show error if practitioner not found
  if (!practitioner) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-6 relative">
          <button
            onClick={() => navigate("/therapist-listing")}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 active:scale-95"
            aria-label="Close and go back"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-happy-monkey text-[#148BAF] mb-4 pr-12">
            Practitioner Not Found
          </h2>
          <p className="mb-6 text-gray-700">
            We couldn't find the practitioner you're looking for. This might be because:
          </p>
          <ul className="mb-6 text-gray-700 list-disc pl-5 space-y-1">
            <li>The practitioner profile has been removed</li>
            <li>The link you followed is outdated</li>
            <li>There was a temporary issue loading the data</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate("/therapist-listing")}
              className="bg-[#148BAF] text-white"
            >
              Browse All Practitioners
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[#148BAF] text-[#148BAF] hover:bg-[#148BAF] hover:text-white"
            >
              Try Again
            </Button>
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Button
        onClick={() => navigate("/therapist-listing")}
        className="text-[#148BAF] mb-4 sm:mb-6"
        variant="outline"
      >
        ← Back to Therapists
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Practitioner Information - Left Column */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0"
                style={{ 
                  backgroundImage: practitioner.image_url ? `url(${practitioner.image_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-happy-monkey text-[#148BAF]">
                  {practitioner.name}
                </h2>
                <p className="text-sm text-gray-600">{practitioner.specialty}</p>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <span className="text-amber-500">★★★★★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {practitioner.rating} ({practitioner.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <hr className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-700 mb-4">{practitioner.bio}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-sm">Experience</h3>
                  <p className="text-sm text-gray-700">{practitioner.years_experience} years</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Education</h3>
                  <p className="text-sm text-gray-700">{practitioner.education}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Languages</h3>
                <p className="text-sm text-gray-700">
                  {practitioner.languages?.join(", ")}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Booking Section - Right Column */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">
              {isRescheduling ? "Reschedule Your Appointment" : "Book Your Appointment"}
            </h2>
            
            {/* Session Type Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Session Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sessionTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-3 sm:p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedType === type.id 
                        ? "border-[#148BAF] bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm sm:text-base">{type.name}</h4>
                      <span className="text-sm sm:text-base font-medium">
                        {type.price === 0 ? "Free" : 
                         type.price === null ? `$${practitioner.price}` : 
                         `$${type.price}`}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{type.duration}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Date</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {next7Days.map((date) => {
                  const d = new Date(date);
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  
                  return (
                    <div
                      key={date}
                      className={`p-2 sm:p-3 border rounded-md text-center cursor-pointer transition-colors ${
                        selectedDate === date 
                          ? "border-[#148BAF] bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-xs sm:text-sm font-medium">{dayName}</div>
                      <div className="text-sm sm:text-lg font-medium">{dayNum}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Time Selection - only show if date is selected */}
            {selectedDate && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Time</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {/* Simplified time slots for demo purposes */}
                  {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                    <div
                      key={time}
                      className={`p-2 sm:p-3 border rounded-md text-center cursor-pointer transition-colors ${
                        selectedTime === time
                          ? "border-[#148BAF] bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <span className="text-sm sm:text-base">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Summary and Book Button */}
            {selectedTime && (
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Session Type</span>
                    <span className="font-medium">{sessionTypes.find(t => t.id === selectedType)?.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {getSessionPrice(selectedType) === 0 
                        ? "Free" 
                        : `$${getSessionPrice(selectedType)}`}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={openConfirmation}
                  className="w-full bg-[#148BAF] text-white"
                >
                  {isRescheduling ? "Reschedule Appointment" : "Book Appointment"}
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
