import { useState, useEffect, Component, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from 'react-select';
import { navigateToEditProfile } from "@/utils/practitionerNavigationFix";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Error boundary with proper TypeScript types
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg relative max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="absolute right-3 top-3 p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 active:scale-95"
            aria-label="Go back"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="pr-12">
            <h2 className="text-red-600 text-xl mb-2">Something went wrong</h2>
            <p className="text-gray-700 mb-4">Please try reloading the page or contact support if the issue persists.</p>
            {this.state.error && (
              <p className="text-red-500 text-sm mb-4">{this.state.error.message}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reload page
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Form error display component with dismissible cross icon
const FormErrorDisplay = ({ errors, onDismiss }: { errors: Record<string, string>; onDismiss?: () => void }) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 relative">
      {/* Cross icon to dismiss errors */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 active:scale-95"
          aria-label="Dismiss errors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 pr-8">
          <h3 className="text-sm font-medium text-red-800">
            Please fix the following errors:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
          
          {/* CTA to help users fix errors */}
          <div className="mt-3">
            <button 
              onClick={() => {
                // Scroll to the first form field with an error
                const firstErrorField = document.querySelector('.border-red-500, [class*="border-red"]');
                if (firstErrorField) {
                  firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  (firstErrorField as HTMLElement).focus?.();
                }
              }}
              className="text-sm text-red-800 underline hover:text-red-900 transition-colors"
            >
              Go to first error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define the form data type for better TypeScript support
interface PractitionerFormData {
  name: string;
  specialty: string;
  education: string;
  degree: string;
  bio: string;
  location_type: string;
  price: number;
  years_experience: number;
  languages: string[];
  approach: string;
  certifications: string;
  conditions: string[];
  insurance_accepted: string[];
  session_format: string[];
  availability: string;
  calendly_link: string; // Added Calendly link
}

const PractitionerOnboarding = () => {
  console.log("PractitionerOnboarding component rendering"); // Debug log

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Clean up any stale flags that might cause navigation issues
  useEffect(() => {
    // Clear any leftover flags from previous sessions
    localStorage.removeItem('practitioner-registration-complete');
    localStorage.removeItem('practitioner-id');
    
    console.log("Cleaned up any stale practitioner navigation flags");
  }, []);
  
  // Add component rendering tracker and clean up stale flags
  useEffect(() => {
    console.log("PractitionerOnboarding mounted");
    
    // Clear any leftover flags from previous sessions that might cause navigation issues
    localStorage.removeItem('practitioner-registration-complete');
    localStorage.removeItem('practitioner-id');
    
    return () => {
      console.log("PractitionerOnboarding unmounted");
    };
  }, []);
  
  // Debug step changes
  useEffect(() => {
    console.log(`Step changed to: ${step}`);
  }, [step]);
  
  // Add protection if user isn't loaded
  useEffect(() => {
    if (!user) {
      console.warn("No user found. Redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  // Check if the user already has a practitioner record
  useEffect(() => {
    const checkExistingPractitioner = async () => {
      if (!user) return;

      try {
        console.log("Checking if user already has a practitioner record");
        const { data, error } = await supabase
          .from('practitioners')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error checking for existing practitioner:", error);
          return;
        }

        // If data exists, user already has a profile
        if (data) {
          console.log("Existing practitioner record found:", data);
          toast({
            title: "Existing Profile",
            description: "You already have a practitioner profile. Redirecting to edit page."
          });
          navigate('/practitioner-edit-profile');
        } else {
          console.log("No existing practitioner record found. Proceeding with onboarding.");
        }
      } catch (err) {
        console.error("Error checking practitioner status:", err);
      }
    };

    checkExistingPractitioner();
  }, [user, navigate, toast]);

  // Remove unused state
  // const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Load saved form data and step from localStorage
  const loadSavedFormData = () => {
    if (!user) return null;
    try {
      const savedData = localStorage.getItem(`practitioner-form-${user.id}`);
      if (savedData) return JSON.parse(savedData);
    } catch (e) { console.error("Error loading saved form data:", e); }
    return null;
  };
  const loadSavedStep = () => {
    if (!user) return 1;
    try {
      const savedStep = localStorage.getItem(`practitioner-step-${user.id}`);
      if (savedStep) return parseInt(savedStep, 10);
    } catch (e) { console.error("Error loading saved step:", e); }
    return 1;
  };

  // Initialize formData and step from localStorage if available
  const [formData, setFormData] = useState<PractitionerFormData>({
    name: '',
    specialty: '',
    education: '',
    degree: '',
    bio: '',
    location_type: 'online',
    price: 1500,
    years_experience: 1,
    languages: ['English'],
    approach: '',
    certifications: '',
    conditions: [],
    insurance_accepted: [],
    session_format: ['Individual Therapy'],
    availability: 'Weekdays 9am-5pm',
    calendly_link: '',
  });
  
  // Debug formData changes
  useEffect(() => {
    console.log("FormData updated:", formData);
  }, [formData]);
  
  useEffect(() => {
    if (user) {
      const saved = loadSavedFormData();
      if (saved) setFormData((prev) => ({ ...prev, ...saved }));
      const savedStep = loadSavedStep();
      if (savedStep) setStep(savedStep);
    }
    // eslint-disable-next-line
  }, [user]);

  // Save formData and step to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(`practitioner-form-${user.id}`, JSON.stringify(formData));
  }, [formData, user]);
  useEffect(() => {
    if (user) localStorage.setItem(`practitioner-step-${user.id}`, step.toString());
  }, [step, user]);
  
  // Log user information to verify if it's loaded correctly
  useEffect(() => {
    if (user && user.user_metadata?.name && !formData.name) {
      setFormData((prev) => ({ ...prev, name: user.user_metadata.name }));
    }
    console.log("User data:", user);
    if (!user) {
      console.error("No user data available - this could cause rendering issues");
    }
  }, [user]);
  
  // Define options for select inputs
  const sessionFormatOptions = [
    { value: 'Individual Therapy', label: 'Individual Therapy' },
    { value: 'Couples Therapy', label: 'Couples Therapy' },
    { value: 'Group Therapy', label: 'Group Therapy' },
    { value: 'Family Therapy', label: 'Family Therapy' }
  ];
  
  const priceRangeOptions = [
    { value: 1000, label: '₹1000 per session' },
    { value: 1500, label: '₹1500 per session' },
    { value: 2000, label: '₹2000 per session' },
    { value: 2500, label: '₹2500 per session' },
    { value: 3000, label: '₹3000 per session' }
  ];
  
  const experienceOptions = [
    { value: 1, label: '1+ years' },
    { value: 3, label: '3+ years' },
    { value: 5, label: '5+ years' },
    { value: 10, label: '10+ years' },
    { value: 15, label: '15+ years' }
  ];
  
  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Tamil', label: 'Tamil' }
  ];
  
  const approachOptions = [
    { value: 'Cognitive Behavioral Therapy', label: 'Cognitive Behavioral Therapy (CBT)' },
    { value: 'Psychodynamic', label: 'Psychodynamic' },
    { value: 'Mindfulness-Based', label: 'Mindfulness-Based' },
    { value: 'Humanistic', label: 'Humanistic' },
    { value: 'Solution-Focused', label: 'Solution-Focused' }
  ];
  
  const conditionOptions = [
    { value: 'Anxiety', label: 'Anxiety' },
    { value: 'Depression', label: 'Depression' },
    { value: 'Stress', label: 'Stress' },
    { value: 'Trauma', label: 'Trauma' },
    { value: 'Relationships', label: 'Relationships' },
    { value: 'Self-esteem', label: 'Self-esteem' }
  ];
  
  const insuranceOptions = [
    { value: 'None', label: 'None' },
    { value: 'HDFC ERGO', label: 'HDFC ERGO' },
    { value: 'ICICI Lombard', label: 'ICICI Lombard' },
    { value: 'Star Health', label: 'Star Health' }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user edits it
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (selectedOptions: any, { name }: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setFormData((prev) => ({
      ...prev,
      [name]: values
    }));
    
    // Clear error for this field when user edits it
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSingleSelectChange = (selectedOption: any, { name }: any) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user edits it
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleNumberSelectChange = (selectedOption: any, { name }: any) => {
    const value = selectedOption ? selectedOption.value : 0;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user edits it
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Add the missing handleLanguagesChange function
  const handleLanguagesChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : ['English'];
    setFormData((prev) => ({
      ...prev,
      languages: values
    }));
    
    if (formErrors.languages) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.languages;
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // File is stored directly in preview, we don't need to keep a separate reference
      // setImageFile(file) was unused
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateStep = (currentStep: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (currentStep === 1) { // Personal Information
      if (!formData.name.trim()) {
        newErrors.name = "Name is required.";
        isValid = false;
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters long.";
        isValid = false;
      }
      
      if (!formData.specialty.trim()) {
        newErrors.specialty = "Specialty is required.";
        isValid = false;
      }
      
      if (!formData.education.trim()) {
        newErrors.education = "Education is required.";
        isValid = false;
      } else if (formData.education.trim().length < 5) {
        newErrors.education = "Education should be at least 5 characters long.";
        isValid = false;
      }
      
      if (!formData.degree.trim()) {
        newErrors.degree = "Degree is required.";
        isValid = false;
      }
      
    } else if (currentStep === 2) { // Professional Details
      if (!formData.bio.trim()) {
        newErrors.bio = "Bio is required.";
        isValid = false;
      } else if (formData.bio.trim().length < 50) {
        newErrors.bio = `Bio should be at least 50 characters long. Current length: ${formData.bio.trim().length}`;
        isValid = false;
      } else if (formData.bio.trim().length > 1000) {
        newErrors.bio = "Bio should not exceed 1000 characters.";
        isValid = false;
      }
      
      if (!formData.approach.trim()) {
        newErrors.approach = "Therapeutic approach is required.";
        isValid = false;
      }
      
      if (!formData.languages || formData.languages.length === 0) {
        newErrors.languages = "At least one language is required.";
        isValid = false;
      }
      
      if (formData.years_experience < 1) {
        newErrors.years_experience = "Years of experience must be at least 1.";
        isValid = false;
      }
      
    } else if (currentStep === 3) { // Session Details
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price must be a positive number.";
        isValid = false;
      } else if (formData.price < 500) {
        newErrors.price = "Price should be at least ₹500.";
        isValid = false;
      } else if (formData.price > 10000) {
        newErrors.price = "Price should not exceed ₹10,000.";
        isValid = false;
      }
      
      if (!formData.availability.trim()) {
        newErrors.availability = "Availability is required.";
        isValid = false;
      } else if (formData.availability.trim().length < 10) {
        newErrors.availability = "Please provide more detailed availability information.";
        isValid = false;
      }
      
      if (!formData.session_format || formData.session_format.length === 0) {
        newErrors.session_format = "At least one session format must be selected.";
        isValid = false;
      }
      
      // Enhanced Calendly link validation
      if (formData.calendly_link && formData.calendly_link.trim()) {
        const calendlyLink = formData.calendly_link.trim();
        if (!calendlyLink.includes('calendly.com/')) {
          newErrors.calendly_link = "Please enter a valid Calendly link (e.g., https://calendly.com/your-username).";
          isValid = false;
        } else if (!calendlyLink.startsWith('http')) {
          newErrors.calendly_link = "Calendly link must start with http:// or https://.";
          isValid = false;
        }
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (step >= 3) {
      console.log("Already at final step, can't go further");
      return;
    }
    
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3)); // Ensure we don't go beyond step 3
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive"
      });
    }
  };
  
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };
  
  // Only show confirmation dialog and allow submission on step 3
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // We should only reach this function on step 3
    // Additional safety check
    if (step !== 3) {
      console.log("handleSubmit called on step", step);
      return;
    }
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly before submitting.", variant: "destructive" });
      return;
    }
    setShowConfirmDialog(true);
  };
  
  // Confirmed submit logic with enhanced error handling
  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast({ 
          title: "Authentication error", 
          description: "Please login before submitting your profile", 
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }

      // Validate all steps before submission
      const step1Valid = validateStep(1);
      const step2Valid = validateStep(2);
      const step3Valid = validateStep(3);
      
      if (!step1Valid || !step2Valid || !step3Valid) {
        toast({ 
          title: "Validation Error", 
          description: "Please fix all validation errors before submitting.", 
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }

      // First check if this user already has a practitioner record
      console.log("Checking for existing practitioner record...");
      const { data: existingData, error: checkError } = await supabase
        .from('practitioners')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking for existing practitioner:', checkError);
        throw new Error(`Database check failed: ${checkError.message}`);
      }
      
      if (existingData) {
        console.log('User already has a practitioner record:', existingData);
        toast({
          title: "Profile Already Exists",
          description: "You already have a practitioner profile. Redirecting to edit page."
        });
        
        // Clear saved form data since we don't need it
        localStorage.removeItem(`practitioner-form-${user.id}`);
        localStorage.removeItem(`practitioner-step-${user.id}`);
        
        // Redirect to edit page
        navigate('/practitioner-edit-profile');
        return;
      }

      // Prepare data to match practitioners table schema
      const practitionerData = {
        user_id: user.id,
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        education: formData.education.trim(),
        degree: formData.degree.trim(),
        bio: formData.bio.trim(),
        location_type: formData.location_type,
        price: Number(formData.price),
        years_experience: Number(formData.years_experience),
        languages: Array.isArray(formData.languages) ? formData.languages : ['English'],
        approach: formData.approach.trim(),
        certifications: formData.certifications.trim(),
        // Fixed field mappings to match actual database schema
        conditions: Array.isArray(formData.conditions) ? formData.conditions : [],
        insurance_accepted: Array.isArray(formData.insurance_accepted) ? formData.insurance_accepted : [],
        session_formats: Array.isArray(formData.session_format) ? formData.session_format : ['Individual Therapy'],
        availability_schedule: formData.availability.trim(),
        calendly_link: formData.calendly_link.trim(),
        // Set default values for system fields
        reviews: 0,
        rating: 5.0,
        badge: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Log the data to help with debugging
      console.log("Prepared practitioner data for submission:", practitionerData);
      
      console.log("Submitting data to Supabase...");
      const { data: insertedData, error } = await supabase
        .from('practitioners')
        .insert([practitionerData])
        .select();

      if (error) {
        console.error("Database insertion error:", error);
        // Provide more specific error messages based on error type
        let errorMessage = "Failed to submit your profile. ";
        
        if (error.code === '23505') {
          errorMessage += "You may already have a profile. Please try logging out and back in.";
        } else if (error.code === '42703') {
          errorMessage += "Database schema issue. Please contact support.";
        } else if (error.code === '23502') {
          errorMessage += "Some required information is missing. Please check all fields.";
        } else {
          errorMessage += `Error: ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      console.log("Successfully inserted practitioner data:", insertedData);
      
      toast({
        title: "Success!",
        description: "Your practitioner profile has been submitted successfully.",
      });
      
      // Clear saved form data
      localStorage.removeItem(`practitioner-form-${user.id}`);
      localStorage.removeItem(`practitioner-step-${user.id}`);
      
      // Use the navigation fix utility for reliable navigation
      navigateToEditProfile(insertedData?.[0], navigate);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#148BAF] file:text-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name*</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.name ? 'border-red-500' : ''}`}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Specialization*</label>
              <input 
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="e.g. Clinical Psychologist, Psychiatrist, Therapist"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.specialty ? 'border-red-500' : ''}`}
              />
              {formErrors.specialty && <p className="text-red-500 text-sm mt-1">{formErrors.specialty}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Education*</label>
              <input 
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g. Mumbai University"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.education ? 'border-red-500' : ''}`}
              />
              {formErrors.education && <p className="text-red-500 text-sm mt-1">{formErrors.education}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Degree*</label>
              <input 
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="e.g. M.Phil. Clinical Psychology"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.degree ? 'border-red-500' : ''}`}
              />
              {formErrors.degree && <p className="text-red-500 text-sm mt-1">{formErrors.degree}</p>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">Professional Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Professional Bio*</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell clients about yourself, your background, and approach to therapy (minimum 50 characters)"
                className={`w-full min-h-[120px] sm:min-h-[80px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation resize-y ${formErrors.bio ? 'border-red-500' : ''}`}
              ></textarea>
              {formErrors.bio && <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.bio.length}/50 characters minimum</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Therapeutic Approach*</label>
              <Select
                isMulti={false}
                name="approach"
                options={approachOptions}
                value={formData.approach ? { value: formData.approach, label: approachOptions.find(opt => opt.value === formData.approach)?.label || formData.approach } : null}
                onChange={(selected, action) => handleSingleSelectChange(selected, action)}
                placeholder="Select your primary therapeutic approach"
                className={`basic-select touch-manipulation ${formErrors.approach ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={true}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation',
                    ...(formErrors.approach ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.approach && <p className="text-red-500 text-sm mt-1">{formErrors.approach}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Conditions Treated</label>
              <Select
                isMulti
                name="conditions"
                options={conditionOptions}
                value={formData.conditions.map(cond => ({ 
                  value: cond, 
                  label: conditionOptions.find(opt => opt.value === cond)?.label || cond 
                }))}
                onChange={(selected, action) => handleSelectChange(selected, action)}
                placeholder="Select conditions you specialize in treating"
                className="basic-multi-select touch-manipulation"
                classNamePrefix="react-select"
                isSearchable={true}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation'
                  })
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Languages*</label>
              <Select
                isMulti
                name="languages"
                options={languageOptions}
                value={formData.languages.map(lang => ({ 
                  value: lang, 
                  label: languageOptions.find(opt => opt.value === lang)?.label || lang 
                }))}
                onChange={handleLanguagesChange}
                placeholder="Select languages you're fluent in"
                className={`basic-multi-select touch-manipulation ${formErrors.languages ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={true}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation',
                    ...(formErrors.languages ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.languages && <p className="text-red-500 text-sm mt-1">{formErrors.languages}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Certifications/Licenses</label>
              <textarea 
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="List your professional certifications and licenses"
                className="w-full min-h-[96px] sm:min-h-[80px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation resize-y"
              ></textarea>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">Session Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Session Format*</label>
              <Select
                isMulti
                name="session_format"
                options={sessionFormatOptions}
                value={formData.session_format.map(format => ({ 
                  value: format, 
                  label: sessionFormatOptions.find(opt => opt.value === format)?.label || format 
                }))}
                onChange={(selected, action) => handleSelectChange(selected, action)}
                placeholder="Select session formats you offer"
                className={`basic-multi-select touch-manipulation ${formErrors.session_format ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation',
                    ...(formErrors.session_format ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.session_format && <p className="text-red-500 text-sm mt-1">{formErrors.session_format}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location Type</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label className="inline-flex items-center min-h-[44px] sm:min-h-[36px] touch-manipulation">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="online" 
                    checked={formData.location_type === 'online'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF] w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <span className="ml-3 sm:ml-2 text-base sm:text-sm">Online only</span>
                </label>
                <label className="inline-flex items-center min-h-[44px] sm:min-h-[36px] touch-manipulation">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="in-person" 
                    checked={formData.location_type === 'in-person'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF] w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <span className="ml-3 sm:ml-2 text-base sm:text-sm">In-person only</span>
                </label>
                <label className="inline-flex items-center min-h-[44px] sm:min-h-[36px] touch-manipulation">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="hybrid" 
                    checked={formData.location_type === 'hybrid'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF] w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <span className="ml-3 sm:ml-2 text-base sm:text-sm">Both online and in-person</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Session Price*</label>
              <Select
                name="price"
                options={priceRangeOptions}
                value={{ 
                  value: formData.price, 
                  label: priceRangeOptions.find(opt => opt.value === formData.price)?.label || `₹${formData.price} per session` 
                }}
                onChange={(selected, action) => handleNumberSelectChange(selected, action)}
                className={`basic-select touch-manipulation ${formErrors.price ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation',
                    ...(formErrors.price ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Years of Experience*</label>
              <Select
                name="years_experience"
                options={experienceOptions}
                value={{ 
                  value: formData.years_experience, 
                  label: experienceOptions.find(opt => opt.value === formData.years_experience)?.label || `${formData.years_experience}+ years` 
                }}
                onChange={(selected, action) => handleNumberSelectChange(selected, action)}
                className={`basic-select touch-manipulation ${formErrors.years_experience ? 'border-red-500' : ''}`}
                classNamePrefix="react-select"
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation',
                    ...(formErrors.years_experience ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.years_experience && <p className="text-red-500 text-sm mt-1">{formErrors.years_experience}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Insurance Accepted</label>
              <Select
                isMulti
                name="insurance_accepted"
                options={insuranceOptions}
                value={formData.insurance_accepted.map(ins => ({ 
                  value: ins, 
                  label: insuranceOptions.find(opt => opt.value === ins)?.label || ins 
                }))}
                onChange={(selected, action) => handleSelectChange(selected, action)}
                placeholder="Select insurance plans you accept"
                className="basic-multi-select touch-manipulation"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    '@media (min-width: 640px)': {
                      minHeight: '40px'
                    },
                    touchAction: 'manipulation'
                  })
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Typical Availability*</label>
              <input 
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g. Weekdays 9am-5pm, Weekends 10am-2pm"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.availability ? 'border-red-500' : ''}`}
              />
              {formErrors.availability && <p className="text-red-500 text-sm mt-1">{formErrors.availability}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calendly Link (Optional)</label>
              <input
                type="url"
                name="calendly_link"
                value={formData.calendly_link}
                onChange={handleInputChange}
                placeholder="https://calendly.com/your-username"
                className="w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation"
              />
              {formErrors.calendly_link && <p className="text-red-500 text-xs mt-1">{formErrors.calendly_link}</p>}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Add console logging to help with debugging
  console.log("Rendering PractitionerOnboarding component", { step, formData });
  
  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-happy-monkey text-[#148BAF] mb-2">Become a Practitioner</h1>
        <p className="text-gray-600 mb-8">Complete the form below to join our network of practitioners.</p>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6" data-testid="fixed-indicator">
          <p className="text-green-700">Application form is ready - please fill all required fields.</p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              Step {step} of 3
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-[#148BAF] rounded-full" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
  
        <Card className="p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) {
              handleNext();
            } else {
              handleSubmit(e);
            }
          }}>
            {/* Show general form error if any exist */}
            {Object.keys(formErrors).length > 0 && (
              <FormErrorDisplay errors={formErrors} onDismiss={() => setFormErrors({})} />
            )}
            
            {renderFormStep()}
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button 
                  type="button" 
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Back
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <Button 
                    type="submit"  // Changed to submit to use our form's submit handler
                    className="bg-[#148BAF] text-white hover:bg-[#1079A0]"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#148BAF] text-white hover:bg-[#1079A0]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit your practitioner profile? You'll be able to edit your details after submission.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button onClick={handleConfirmedSubmit}>Confirm Submission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default PractitionerOnboarding;