import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from 'react-select';
import { 
  ensureEditProfileLoads,
  fetchPractitionerData
} from "@/utils/practitionerNavigationFix";

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
  session_formats: string[]; // Note: changed from session_format to match DB schema
  availability_schedule: string; // Note: changed from availability to match DB schema
  calendly_link: string;
}

const PractitionerEditProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
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
    session_formats: ['Individual Therapy'],
    availability_schedule: 'Weekdays 9am-5pm',
    calendly_link: '',
  });
  
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
  
  // Get location for accessing state passed during navigation
  
  // Add component mounting tracker
  useEffect(() => {
    console.log("PractitionerEditProfile component mounted");
    // Check if we're coming from a successful registration
    const registrationComplete = localStorage.getItem('practitioner-registration-complete');
    const practitionerId = localStorage.getItem('practitioner-id');
    const locationState = location.state as { fromOnboarding?: boolean, practitionerId?: string | number } | null;
    if (registrationComplete === 'true' || (locationState?.fromOnboarding && locationState?.practitionerId)) {
      console.log("Coming from successful registration");
      console.log("Location state:", locationState);
      console.log("Practitioner ID from localStorage:", practitionerId);
      // Clear the flags
      localStorage.removeItem('practitioner-registration-complete');
      localStorage.removeItem('practitioner-id');
    }
    return () => {
      console.log("PractitionerEditProfile component unmounted");
    };
  }, [location]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPractitionerData(
      user,
      supabase,
      setFormData,
      setImagePreview,
      setIsLoading,
      toast,
      navigate
    );
  }, [user, toast, navigate]);
  
  // Handler functions start here
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    
    if (!formData.specialty.trim()) {
      newErrors.specialty = "Specialty is required.";
      isValid = false;
    }
    
    if (!formData.education.trim()) {
      newErrors.education = "Education is required.";
      isValid = false;
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required.";
      isValid = false;
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = "Bio should be at least 50 characters.";
      isValid = false;
    }
    
    if (!formData.approach) {
      newErrors.approach = "Therapeutic approach is required.";
      isValid = false;
    }
    
    if (!formData.languages || formData.languages.length === 0) {
      newErrors.languages = "At least one language is required.";
      isValid = false;
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be a positive number.";
      isValid = false;
    }
    
    if (!formData.availability_schedule.trim()) {
      newErrors.availability_schedule = "Availability is required.";
      isValid = false;
    }
    
    if (formData.session_formats.length === 0) {
      newErrors.session_formats = "At least one session format must be selected.";
      isValid = false;
    }
    
    // Validate Calendly link (basic validation)
    if (formData.calendly_link && !formData.calendly_link.includes('calendly.com/')) {
      newErrors.calendly_link = "Please enter a valid Calendly link (e.g., https://calendly.com/your-username).";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Additional checks to prevent blank screen issues
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.error('Window error caught:', msg, 'at', url, lineNo, columnNo, error);
      return false;
    };
    
    if (!validateForm()) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill all required fields correctly before saving.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to save your profile.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Starting profile update process");
      
      // First check if the record still exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('practitioners')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (checkError) {
        console.error("Error checking for existing practitioner record:", checkError);
        
        if (checkError.code === 'PGRST116') {
          // No record found - this should not happen since we loaded the data previously
          console.error("Record not found during update. Redirecting to onboarding.");
          
          // Create a debug log of what happened
          const debugInfo = {
            userId: user.id,
            timestamp: new Date().toISOString(),
            error: checkError,
            formData: formData
          };
          console.error("Debug info for missing record:", debugInfo);
          
          toast({
            title: "Record Not Found",
            description: "Your practitioner profile could not be found. Redirecting to onboarding.",
            variant: "destructive"
          });
          
          // Clear any localStorage data that might be causing issues
          localStorage.removeItem(`practitioner-form-${user.id}`);
          localStorage.removeItem(`practitioner-step-${user.id}`);
          
          setTimeout(() => navigate('/practitioner-onboarding'), 2000);
          return;
        } else {
          throw new Error(checkError.message);
        }
      }
      
      console.log("Found existing record with ID:", existingRecord?.id);
      
      // Prepare data to match practitioners table schema
      const practitionerData = {
        name: formData.name || '',
        specialty: formData.specialty || '',
        education: formData.education || '',
        degree: formData.degree || '',
        bio: formData.bio || '',
        location_type: formData.location_type || 'online',
        price: formData.price || 0,
        years_experience: formData.years_experience || 0,
        languages: formData.languages || ['English'],
        approach: formData.approach || '',
        certifications: formData.certifications || '',
        conditions_treated: formData.conditions || [],
        insurance_accepted: formData.insurance_accepted || [],
        session_formats: formData.session_formats || [],
        availability_schedule: formData.availability_schedule || '',
        calendly_link: formData.calendly_link || '',
        // profile_image_url would be handled separately with storage
      };
      
      console.log("Updating practitioner data:", practitionerData);
      
      const { error } = await supabase
        .from('practitioners')
        .update(practitionerData)
        .eq('user_id', user.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully."
      });
      
      // Optionally refetch data instead of full page reload
      const shouldRefresh = localStorage.getItem('practitioner-registration-complete') === 'true';
      
      if (shouldRefresh) {
        // For a newly registered practitioner, do a full reload to ensure everything is fresh
        console.log("Newly registered practitioner - doing full reload for data consistency");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // For regular updates, refetch data without a full page reload
        console.log("Update successful - refetching data");
        setTimeout(() => {
          // Trigger a re-render by updating state
          setIsLoading(true);
          fetchPractitionerData(
            user,
            supabase,
            setFormData,
            setImagePreview,
            setIsLoading,
            toast,
            navigate
          );
        }, 500);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Error",
        description: error instanceof Error ? error.message : "An unknown error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Ensure the component correctly handles navigation from the practitioner onboarding flow
  useEffect(() => {
    ensureEditProfileLoads(location, navigate, user);
  }, [location, navigate, user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#148BAF] border-r-[#148BAF] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-happy-monkey text-[#148BAF] mb-2">Edit Your Practitioner Profile</h1>
      <p className="text-gray-600 mb-8">Update your information to keep your profile accurate and current.</p>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="space-y-6 mb-8">
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
              <label className="block text-gray-700 mb-2">Degree</label>
              <input 
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="e.g. M.Phil. Clinical Psychology"
                className="w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation"
              />
            </div>
          </div>
          
          {/* Professional Details Section */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">Professional Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Professional Bio*</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell clients about yourself, your background, and approach to therapy (minimum 50 characters)"
                className={`w-full min-h-[120px] sm:min-h-[128px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation resize-y ${formErrors.bio ? 'border-red-500' : ''}`}
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
                    touchAction: 'manipulation',
                    ...(formErrors.conditions ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.conditions && <p className="text-red-500 text-sm mt-1">{formErrors.conditions}</p>}
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
                onChange={(selected, action) => handleSelectChange(selected, action)}
                placeholder="Select languages you're fluent in"
                className={`basic-multi-select touch-manipulation ${formErrors.languages ? 'border-red-500' : ''}`}
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
                className="w-full min-h-[96px] sm:min-h-[96px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation resize-y"
              ></textarea>
            </div>
          </div>
          
          {/* Session Details Section */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-happy-monkey text-[#148BAF] mb-4">Session Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Session Format*</label>
              <Select
                isMulti
                name="session_formats"
                options={sessionFormatOptions}
                value={formData.session_formats.map(format => ({ 
                  value: format, 
                  label: sessionFormatOptions.find(opt => opt.value === format)?.label || format 
                }))}
                onChange={(selected, action) => handleSelectChange(selected, action)}
                placeholder="Select session formats you offer"
                className={`basic-multi-select touch-manipulation ${formErrors.session_formats ? 'border-red-500' : ''}`}
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
                    ...(formErrors.session_formats ? {
                      borderColor: '#ef4444',
                      '&:hover': { borderColor: '#ef4444' }
                    } : {})
                  })
                }}
              />
              {formErrors.session_formats && <p className="text-red-500 text-sm mt-1">{formErrors.session_formats}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Typical Availability*</label>
              <input 
                type="text"
                name="availability_schedule"
                value={formData.availability_schedule}
                onChange={handleInputChange}
                placeholder="e.g. Weekdays 9am-5pm, Weekends 10am-2pm"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.availability_schedule ? 'border-red-500' : ''}`}
              />
              {formErrors.availability_schedule && <p className="text-red-500 text-sm mt-1">{formErrors.availability_schedule}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Session Price</label>
              <Select
                name="price"
                options={priceRangeOptions}
                value={{ 
                  value: formData.price, 
                  label: priceRangeOptions.find(opt => opt.value === formData.price)?.label || `₹${formData.price} per session` 
                }}
                onChange={(selected, action) => handleNumberSelectChange(selected, action)}
                className="basic-select touch-manipulation"
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
                    touchAction: 'manipulation'
                  })
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Years of Experience</label>
              <Select
                name="years_experience"
                options={experienceOptions}
                value={{ 
                  value: formData.years_experience, 
                  label: experienceOptions.find(opt => opt.value === formData.years_experience)?.label || `${formData.years_experience}+ years` 
                }}
                onChange={(selected, action) => handleNumberSelectChange(selected, action)}
                className="basic-select touch-manipulation"
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
                    touchAction: 'manipulation'
                  })
                }}
              />
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
                    touchAction: 'manipulation'
                  })
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calendly Link (Optional)</label>
              <input
                type="url"
                name="calendly_link"
                value={formData.calendly_link}
                onChange={handleInputChange}
                placeholder="https://calendly.com/your-username"
                className={`w-full min-h-[48px] sm:min-h-[40px] px-4 sm:px-3 py-3 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] text-base touch-manipulation ${formErrors.calendly_link ? 'border-red-500' : ''}`}
              />
              {formErrors.calendly_link && <p className="text-red-500 text-sm mt-1">{formErrors.calendly_link}</p>}
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={() => navigate('/profile')}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Back to Profile
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#148BAF] text-white hover:bg-[#1079A0]"
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Saving...</span>
                </div>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PractitionerEditProfile;
