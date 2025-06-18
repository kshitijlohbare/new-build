import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import CalendarIntegration from '@/components/appointment/CalendarIntegration';
import VideoCallSetup from '@/components/appointment/VideoCallSetup';
import { appointmentService } from '@/services/AppointmentBookingService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  preferred_video_platform?: string;
  video_meeting_link?: string;
  email?: string;
}

const sessionTypes = [
  { 
    id: "initial", 
    name: "Initial Consultation", 
    duration: "50 min", 
    price: 0,
    description: "First session to understand your needs and goals" 
  },
  { 
    id: "therapy", 
    name: "Therapy Session", 
    duration: "50 min", 
    price: null,
    description: "Standard therapy session focused on your treatment plan"
  },
  { 
    id: "followup", 
    name: "Follow-up Session", 
    duration: "30 min", 
    price: null,
    description: "Check-in session to review progress and adjust treatment"
  },
];

const PractitionerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  console.log('PractitionerDetail rendered with id:', id);
  console.log('Current URL path:', window.location.pathname);
  console.log('React Router working:', !!navigate);
  
  // Add an indicator that the component loaded
  useEffect(() => {
    document.title = `Practitioner ${id} - Details`;
    console.log(`PractitionerDetail component mounted for practitioner ${id}`);
    
    // Debug info to help troubleshoot white screen
    if (document.body.innerHTML === "" || document.body.children.length === 0) {
      console.error('Body is empty - potential rendering issue!');
    }
    
    return () => {
      console.log(`PractitionerDetail component unmounted for practitioner ${id}`);
    };
  }, [id]);

  // State management
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<'type' | 'datetime' | 'video' | 'confirm' | 'success'>('type');
  
  // Booking form state
  const [selectedSessionType, setSelectedSessionType] = useState<string>('initial');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [videoMeetingDetails, setVideoMeetingDetails] = useState<any>(null);
  const [confirmedAppointmentId, setConfirmedAppointmentId] = useState<number | null>(null);
  
  // UI state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch practitioner data
  useEffect(() => {
    console.log('PractitionerDetail useEffect triggered with id:', id);
    
    const fetchPractitioner = async () => {
      console.log('fetchPractitioner called with id:', id);
      if (!id) {
        console.log('No ID found, redirecting to therapist-listing');
        navigate('/therapist-listing');
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('practitioners')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error('Database error or no data:', error);
          
          // Fallback to dummy data based on ID for testing navigation
          if (id === '1' || id === '2' || id === '3') {
            const dummyPractitioners = [
              {
                id: 1,
                name: "Dr. Sarah Johnson",
                specialty: "Clinical Psychologist specializing in anxiety disorders",
                reviews: 124,
                rating: 4.8,
                price: 1200,
                image_url: "https://randomuser.me/api/portraits/women/22.jpg",
                badge: "top rated" as const,
                education: "PhD in Clinical Psychology, Stanford University",
                degree: "PhD",
                location_type: "both",
                conditions: ["anxiety", "depression", "trauma", "stress"],
                bio: "Dr. Sarah Johnson is a compassionate clinical psychologist with over 10 years of experience helping clients overcome anxiety and trauma.",
                years_experience: 10,
                approach: "Cognitive Behavioral Therapy (CBT) and Trauma-focused therapy",
                languages: ["English", "Spanish"],
                certifications: ["Licensed Clinical Psychologist", "Trauma Specialist"],
                availability: "Monday - Friday, 9 AM - 6 PM",
                insurance_accepted: ["Blue Cross", "Aetna", "Cigna"],
                session_format: ["Video", "In-person"],
                preferred_video_platform: "zoom"
              },
              {
                id: 2,
                name: "Dr. Michael Chen",
                specialty: "Psychiatrist focusing on depression and mood disorders",
                reviews: 98,
                rating: 4.7,
                price: 1500,
                image_url: "https://randomuser.me/api/portraits/men/32.jpg",
                badge: "experienced" as const,
                education: "MD in Psychiatry, Johns Hopkins University",
                degree: "MD",
                location_type: "online",
                conditions: ["depression", "bipolar", "mood disorders"],
                bio: "Dr. Michael Chen specializes in mood disorders with a focus on medication management and therapy integration.",
                years_experience: 15,
                approach: "Psychopharmacology combined with Cognitive Behavioral Therapy",
                languages: ["English", "Mandarin"],
                certifications: ["Board Certified Psychiatrist", "Addiction Medicine"],
                availability: "Monday - Thursday, 10 AM - 4 PM",
                insurance_accepted: ["United Healthcare", "Humana", "Medicare"],
                session_format: ["Video", "Phone"],
                preferred_video_platform: "teams"
              },
              {
                id: 3,
                name: "Dr. Emily Rodriguez",
                specialty: "Licensed Therapist specializing in relationships",
                reviews: 76,
                rating: 4.9,
                price: 1100,
                image_url: "https://randomuser.me/api/portraits/women/45.jpg",
                badge: "new" as const,
                education: "MS in Marriage and Family Therapy, UCLA",
                degree: "MS",
                location_type: "in-person",
                conditions: ["relationships", "couples therapy", "family therapy"],
                bio: "Dr. Emily Rodriguez helps couples and families build stronger relationships through evidence-based therapeutic approaches.",
                years_experience: 6,
                approach: "Emotionally Focused Therapy (EFT) and Family Systems",
                languages: ["English", "Spanish"],
                certifications: ["Licensed Marriage and Family Therapist"],
                availability: "Tuesday - Saturday, 11 AM - 7 PM",
                insurance_accepted: ["Kaiser Permanente", "Blue Shield"],
                session_format: ["In-person", "Video"],
                preferred_video_platform: "zoom"
              }
            ];
            
            const dummyPractitioner = dummyPractitioners.find(p => p.id === Number(id));
            if (dummyPractitioner) {
              setPractitioner(dummyPractitioner);
              setLoading(false);
              return;
            }
          }
          
          toast({
            title: "Error",
            description: "Could not find the requested practitioner.",
            variant: "destructive"
          });
          navigate('/therapist-listing');
          return;
        }

        // Map data to practitioner interface
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
          approach: data.approach ? String(data.approach) : "Cognitive Behavioral Therapy (CBT) and Mindfulness-based approaches",
          languages: Array.isArray(data.languages) ? data.languages.map(String) : ["English"],
          certifications: Array.isArray(data.certifications) ? data.certifications.map(String) : ["Licensed Clinical Psychologist"],
          availability: data.availability ? String(data.availability) : "Monday - Friday, 9 AM - 5 PM",
          insurance_accepted: Array.isArray(data.insurance_accepted) ? data.insurance_accepted.map(String) : ["Most major insurance plans"],
          session_format: Array.isArray(data.session_format) ? data.session_format.map(String) : ["Video", "Phone", "In-person"],
          preferred_video_platform: data.preferred_video_platform ? String(data.preferred_video_platform) : 'zoom',
          video_meeting_link: data.video_meeting_link ? String(data.video_meeting_link) : undefined,
          email: data.email ? String(data.email) : undefined,
        };

        setPractitioner(practitionerData);
      } catch (error) {
        console.error('Error fetching practitioner:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
        navigate('/therapist-listing');
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id, navigate, toast]);

  // Handle session type selection
  const handleSessionTypeSelect = (typeId: string) => {
    setSelectedSessionType(typeId);
    setBookingStep('datetime');
  };

  // Handle date/time selection completion
  const handleDateTimeComplete = () => {
    if (selectedDate && selectedTime) {
      setBookingStep('video');
    }
  };

  // Handle video meeting setup completion
  const handleVideoMeetingCreated = (meetingDetails: any) => {
    setVideoMeetingDetails(meetingDetails);
    setBookingStep('confirm');
  };

  // Handle final booking confirmation
  const handleConfirmBooking = async () => {
    if (!user || !practitioner || !selectedDate || !selectedTime || !selectedSessionType) {
      toast({
        title: "Missing Information",
        description: "Please complete all booking steps.",
        variant: "destructive"
      });
      return;
    }

    setIsConfirming(true);
    
    try {
      // Get full session details
      const sessionInfo = sessionTypes.find(s => s.id === selectedSessionType);
      
      // Prepare appointment data for the booking service using correct interface
      const appointmentData = {
        userId: user.id,
        practitionerId: practitioner.id,
        practitionerName: practitioner.name,
        userEmail: user.email || 'user@example.com',
        userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        date: selectedDate,
        time: selectedTime,
        sessionType: sessionInfo?.name || 'Therapy Session',
        videoMeetingConfig: videoMeetingDetails ? {
          platform: videoMeetingDetails.platform.toLowerCase(),
          hostEmail: practitioner.email || `${practitioner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`
        } : {
          platform: (practitioner.preferred_video_platform as 'zoom' | 'google-meet' | 'microsoft-teams' | 'other') || 'zoom',
          hostEmail: practitioner.email || `${practitioner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`
        }
      };

      console.log('Creating appointment with data:', JSON.stringify(appointmentData, null, 2));

      // Use the appointment booking service to create the appointment
      const result = await appointmentService.createBooking(appointmentData);

      if (!result.success || !result.appointmentId) {
        throw new Error(result.error || 'Failed to create appointment');
      }

      // Store the appointment ID for the success view
      if (result.appointmentId) {
        setConfirmedAppointmentId(result.appointmentId);
      }

      // Success notification
      toast({
        title: "Appointment Confirmed!",
        description: `Your session with ${practitioner.name} is confirmed for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}.`,
        variant: "success"
      });

      // Show success view
      setBookingStep('success');
      
      // Track analytics event
      try {
        // Safely access analytics API if available
        const analyticsApi = (window as any).gtag || (window as any).analytics;
        if (analyticsApi) {
          analyticsApi('event', 'appointment_booked', {
            practitioner_id: practitioner.id,
            practitioner_name: practitioner.name,
            session_type: selectedSessionType,
            appointment_id: result.appointmentId
          });
        }
      } catch (analyticsError) {
        console.error('Analytics error:', analyticsError);
      }

    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset booking state
  const resetBookingState = () => {
    setBookingStep('type');
    setSelectedSessionType('initial');
    setSelectedDate('');
    setSelectedTime('');
    setVideoMeetingDetails(null);
  };

  // Calculate session price
  const getSessionPrice = () => {
    const sessionType = sessionTypes.find(t => t.id === selectedSessionType);
    if (sessionType?.price === 0) return 0;
    if (sessionType?.price !== null) return sessionType?.price;
    return practitioner?.price || 0;
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06C4D5] mb-4"></div>
          <p className="text-xl text-[#208EB1] font-happy-monkey">Loading practitioner details...</p>
        </div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-happy-monkey text-[#208EB1] mb-4">
            Practitioner Not Found
          </h2>
          <p className="text-[#208EB1] mb-6">
            We couldn't find the practitioner you're looking for.
          </p>
          <Button 
            onClick={() => navigate('/therapist-listing')}
            className="bg-[#208EB1] text-white"
          >
            Back to All Practitioners
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FFFF]">
      {/* Mobile-First Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#208EB1] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/therapist-listing')}
            className="flex items-center gap-2 text-[#208EB1] font-medium text-sm hover:text-[#06C4D5] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Therapists
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#208EB1] hover:text-[#208EB1] transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="p-2 text-[#208EB1] hover:text-[#208EB1] transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-24 sm:px-6 lg:pb-8">
        {/* Mobile-First Hero Section */}
        <div className="bg-gradient-to-br from-[#F7FFFF] to-[#F7FFFF] rounded-2xl p-6 mb-6 -mt-2">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image with Better Mobile Layout */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white p-1 shadow-lg">
                <img
                  src={practitioner.image_url}
                  alt={practitioner.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              
              {/* Badge */}
              {practitioner.badge && (
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-[#06C4D5] text-white text-xs font-medium rounded-full shadow-md">
                  {practitioner.badge}
                </div>
              )}

              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#06C4D5] border-4 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info - Mobile Optimized */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-happy-monkey font-bold text-[#208EB1] mb-2 leading-tight">
                {practitioner.name}
              </h1>
              <p className="text-base text-[#208EB1] mb-3 font-medium">{practitioner.specialty}</p>
              
              {/* Mobile-Optimized Rating */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#06C4D5]">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(practitioner.rating) ? 'fill-current' : 'fill-[#06C4D5]'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[#208EB1] font-medium">
                    {practitioner.rating} ({practitioner.reviews})
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white bg-opacity-70 text-[#208EB1] text-sm font-medium rounded-full">
                    {practitioner.location_type}
                  </span>
                </div>
              </div>

              {/* Mobile-First Price Display */}
              <div className="bg-white bg-opacity-70 rounded-xl p-4 inline-block">
                <div className="text-2xl font-bold text-[#208EB1]">
                  ₹{practitioner.price}
                  <span className="text-sm font-normal text-[#208EB1] ml-1">/session</span>
                </div>
                <p className="text-xs text-[#208EB1] mt-1">Starting from initial consultation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-[#208EB1] hover:border-[#06C4D5] transition-all">
            <div className="w-10 h-10 bg-[#F7FFFF] rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#208EB1]">Message</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-[#208EB1] hover:border-[#06C4D5] transition-all">
            <div className="w-10 h-10 bg-[#F7FFFF] rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#208EB1]">Call</span>
          </button>
          
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#06C4D5] to-[#06C4D5] rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">Book Now</span>
          </button>
        </div>

        {/* Mobile-First Content Sections */}
        <div className="space-y-6">
          {/* About Section - Mobile Optimized */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#208EB1]">
            <h2 className="text-xl font-happy-monkey font-bold text-[#208EB1] mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About
            </h2>
            <p className="text-[#208EB1] mb-6 leading-relaxed">{practitioner.bio}</p>
            
            {/* Mobile-First Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Experience</h3>
                  <p className="text-[#208EB1] text-sm">{practitioner.years_experience} years</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Education</h3>
                  <p className="text-[#208EB1] text-sm">{practitioner.education}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Approach</h3>
                  <p className="text-[#208EB1] text-sm">{practitioner.approach}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Languages</h3>
                  <p className="text-[#208EB1] text-sm">{practitioner.languages?.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations - Mobile Optimized */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#208EB1]">
            <h2 className="text-xl font-happy-monkey font-bold text-[#208EB1] mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Specializations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {practitioner.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-[#F7FFFF] to-[#F7FFFF] text-[#208EB1] px-4 py-3 rounded-xl text-sm font-medium text-center border border-[rgba(4,196,213,0.2)] hover:shadow-md transition-all"
                >
                  {condition}
                </div>
              ))}
            </div>
          </div>

          {/* Session Options - Mobile Optimized */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#208EB1]">
            <h2 className="text-xl font-happy-monkey font-bold text-[#208EB1] mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Session Options
            </h2>
            <div className="space-y-4">
              {sessionTypes.map((type) => (
                <div 
                  key={type.id}
                  className="border border-[#208EB1] rounded-xl p-4 hover:border-[#06C4D5] hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#208EB1]">{type.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#208EB1]">
                        {type.price === 0 ? 'FREE' : type.price || `₹${practitioner.price}`}
                      </span>
                      <div className="text-xs text-[#208EB1]">{type.duration}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#208EB1]">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information - Mobile Optimized */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#208EB1]">
            <h2 className="text-xl font-happy-monkey font-bold text-[#208EB1] mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Additional Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Availability</h3>
                  <p className="text-[#208EB1] text-sm">{practitioner.availability}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Session Formats</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {practitioner.session_format?.map((format, index) => (
                      <span key={index} className="px-3 py-1 bg-[#F7FFFF] text-[#208EB1] text-xs rounded-full">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#F7FFFF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#208EB1] mb-1">Insurance Accepted</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {practitioner.insurance_accepted?.map((insurance, index) => (
                      <span key={index} className="px-3 py-1 bg-[#F7FFFF] text-[#208EB1] text-xs rounded-full">
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Floating Action Button */}
      <div className="fixed bottom-6 left-4 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsBookingOpen(true)}
          className="w-full bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white font-happy-monkey text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Session - ₹{practitioner.price}
        </button>
      </div>

      {/* Mobile-First Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={(open) => {
        setIsBookingOpen(open);
        if (!open) resetBookingState();
      }}>
        <DialogContent className="w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto rounded-2xl p-0">
          {/* Mobile-First Modal Header */}
          <div className="sticky top-0 bg-white border-b border-[#208EB1] px-6 py-4 rounded-t-2xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-happy-monkey font-bold text-[#208EB1] flex items-center justify-between">
                Book with {practitioner.name}
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-2 hover:bg-[#F7FFFF] rounded-full transition-colors"
                >
                  <svg className="h-5 w-5 text-[#208EB1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-8 h-2 rounded-full ${bookingStep === 'type' ? 'bg-[#06C4D5]' : 'bg-[#208EB1]'}`}></div>
                <div className={`w-8 h-2 rounded-full ${bookingStep === 'datetime' ? 'bg-[#06C4D5]' : (bookingStep === 'video' || bookingStep === 'confirm') ? 'bg-[#06C4D5]' : 'bg-[#208EB1]'}`}></div>
                <div className={`w-8 h-2 rounded-full ${bookingStep === 'video' ? 'bg-[#06C4D5]' : bookingStep === 'confirm' ? 'bg-[#06C4D5]' : 'bg-[#208EB1]'}`}></div>
                <div className={`w-8 h-2 rounded-full ${bookingStep === 'confirm' ? 'bg-[#06C4D5]' : 'bg-[#208EB1]'}`}></div>
              </div>
              
              <div className="text-sm text-[#208EB1] mt-2">
                {bookingStep === 'type' && 'Step 1 of 4: Choose session type'}
                {bookingStep === 'datetime' && 'Step 2 of 4: Select date & time'}
                {bookingStep === 'video' && 'Step 3 of 4: Video setup'}
                {bookingStep === 'confirm' && 'Step 4 of 4: Confirm booking'}
              </div>
            </DialogHeader>
          </div>

          {/* Mobile-First Modal Content */}
          <div className="px-6 py-6">
            {/* Step 1: Session Type Selection - Mobile Optimized */}
            {bookingStep === 'type' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#208EB1]">Choose your session type</h3>
                <div className="space-y-3">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleSessionTypeSelect(type.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedSessionType === type.id 
                          ? 'border-[#06C4D5] bg-[#F7FFFF]' 
                          : 'border-[#208EB1] hover:border-[#06C4D5] hover:bg-[#F7FFFF]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-[#208EB1]">{type.name}</h4>
                        <span className="text-lg font-bold text-[#208EB1]">
                          {type.price === 0 ? 'FREE' : type.price || `₹${practitioner.price}`}
                        </span>
                      </div>
                      <p className="text-sm text-[#208EB1] mb-1">{type.description}</p>
                      <p className="text-xs text-[#208EB1]">Duration: {type.duration}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection - Mobile Optimized */}
            {bookingStep === 'datetime' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#208EB1]">Select date & time</h3>
                
                {/* Date Selection - Mobile Grid */}
                <div>
                  <h4 className="font-medium mb-3 text-[#208EB1]">Available dates</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {getAvailableDates().slice(0, 9).map((date) => {
                      const dateObj = new Date(date);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = dateObj.getDate();
                      const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                      
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedDate === date 
                              ? 'border-[#06C4D5] bg-[#F7FFFF] text-[#208EB1]' 
                              : 'border-[#208EB1] hover:border-[#06C4D5] text-[#208EB1]'
                          }`}
                        >
                          <div className="text-xs font-medium">{dayName}</div>
                          <div className="text-xl font-bold">{dayNum}</div>
                          <div className="text-xs">{month}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3 text-[#208EB1]">Available times</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-xl border-2 transition-all font-medium ${
                            selectedTime === time 
                              ? 'border-[#06C4D5] bg-[#F7FFFF] text-[#208EB1]' 
                              : 'border-[#208EB1] hover:border-[#06C4D5] text-[#208EB1]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <CalendarIntegration
                  practitionerId={practitioner.id}
                  selectedDate={selectedDate}
                  onTimeSlotSelect={(time) => {
                    setSelectedTime(time);
                    handleDateTimeComplete();
                  }}
                  selectedTime={selectedTime}
                />
              </div>
            )}

            {/* Step 3: Video Call Setup - Mobile Optimized */}
            {bookingStep === 'video' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#208EB1]">Video meeting setup</h3>
                <VideoCallSetup
                  practitioner={practitioner}
                  appointmentDetails={{
                    date: selectedDate,
                    time: selectedTime,
                    sessionType: selectedSessionType,
                    userEmail: user?.email || '',
                    userName: user?.user_metadata?.full_name || 'User'
                  }}
                  onMeetingCreated={handleVideoMeetingCreated}
                />
              </div>
            )}

            {/* Step 4: Confirmation - Mobile Optimized */}
            {bookingStep === 'confirm' && !isConfirming && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#208EB1]">Confirm your booking</h3>
                
                {/* Booking Summary Card */}
                <div className="bg-gradient-to-br from-[#F7FFFF] to-[#F7FFFF] rounded-2xl p-6 border border-[rgba(4,196,213,0.2)]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Session</span>
                      <span className="font-semibold text-right">
                        {sessionTypes.find(t => t.id === selectedSessionType)?.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Date</span>
                      <span className="font-semibold text-right">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Time</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    
                    {videoMeetingDetails && (
                      <div className="flex justify-between items-start">
                        <span className="text-[#208EB1] font-medium">Platform</span>
                        <span className="font-semibold capitalize">{videoMeetingDetails.platform}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-[rgba(4,196,213,0.3)] pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-[#208EB1]">Total</span>
                      <span className="text-2xl font-bold text-[#208EB1]">
                        {getSessionPrice() === 0 ? 'FREE' : `₹${getSessionPrice()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white border border-[#208EB1] rounded-xl p-4">
                  <h4 className="font-semibold text-[#208EB1] mb-3">What's included:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">Calendar sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">Secure video session</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Success - Mobile Optimized */}
            {bookingStep === 'success' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-[#F7FFFF] rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-happy-monkey font-bold text-[#208EB1] mb-2">Booking Confirmed!</h3>
                  <p className="text-[#208EB1] mb-6">Your appointment has been scheduled successfully.</p>
                </div>
                
                {/* Booking Summary Card */}
                <div className="bg-gradient-to-br from-[#F7FFFF] to-[#F7FFFF] rounded-2xl p-6 border border-[rgba(4,196,213,0.2)]">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#208EB1] mb-3">Appointment Details</h4>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Appointment ID</span>
                      <span className="font-semibold text-right">
                        {confirmedAppointmentId || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Session</span>
                      <span className="font-semibold text-right">
                        {sessionTypes.find(t => t.id === selectedSessionType)?.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Date</span>
                      <span className="font-semibold text-right">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[#208EB1] font-medium">Time</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    
                    {videoMeetingDetails && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className="text-[#208EB1] font-medium">Platform</span>
                          <span className="font-semibold capitalize">{videoMeetingDetails.platform}</span>
                        </div>
                        
                        <div className="flex justify-between items-start">
                          <span className="text-[#208EB1] font-medium">Meeting Link</span>
                          <a 
                            href={videoMeetingDetails.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            Join Meeting
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-[#208EB1] rounded-xl p-4">
                  <h4 className="font-semibold text-[#208EB1] mb-3">What's next:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">Check your email for confirmation details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">Add this appointment to your calendar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#F7FFFF] rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-[#06C4D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#208EB1]">You'll receive a reminder 24 hours before</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-First Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t border-[#208EB1] px-6 py-4 rounded-b-2xl">
            <div className="flex gap-3">
              {bookingStep !== 'type' && (
                <button
                  onClick={() => {
                    if (bookingStep === 'datetime') setBookingStep('type');
                    else if (bookingStep === 'video') setBookingStep('datetime');
                    else if (bookingStep === 'confirm') setBookingStep('video');
                  }}
                  className="flex-1 py-3 px-4 border-2 border-[#208EB1] text-[#208EB1] font-medium rounded-xl hover:bg-[#F7FFFF] transition-colors"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={() => {
                  if (bookingStep === 'type') setBookingStep('datetime');
                  else if (bookingStep === 'datetime') handleDateTimeComplete();
                  else if (bookingStep === 'video') setBookingStep('confirm');
                  else if (bookingStep === 'confirm') handleConfirmBooking();
                }}
                disabled={
                  (bookingStep === 'datetime' && (!selectedDate || !selectedTime)) ||
                  (bookingStep === 'video' && !videoMeetingDetails)
                }
                className={`flex-1 py-3 px-4 font-medium rounded-xl transition-colors ${
                  (bookingStep === 'datetime' && (!selectedDate || !selectedTime)) ||
                  (bookingStep === 'video' && !videoMeetingDetails)
                    ? 'bg-[#208EB1] text-[#208EB1] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white hover:shadow-lg'
                }`}
              >
                {bookingStep === 'type' && 'Continue'}
                {bookingStep === 'datetime' && 'Continue'}
                {bookingStep === 'video' && 'Continue'}
                {bookingStep === 'confirm' && `Confirm Booking`}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PractitionerDetail;
