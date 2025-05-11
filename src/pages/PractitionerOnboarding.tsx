import { useState, useEffect, Component, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from 'react-select';

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
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-600 text-xl mb-2">Something went wrong</h2>
          <p className="text-gray-700">Please try reloading the page or contact support if the issue persists.</p>
          {this.state.error && (
            <p className="text-red-500 text-sm mt-2">{this.state.error.message}</p>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Form error display component
const FormErrorDisplay = ({ errors }: { errors: Record<string, string> }) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
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
}

const PractitionerOnboarding = () => {
  console.log("PractitionerOnboarding component rendering"); // Debug log

  // Add component rendering tracker
  useEffect(() => {
    console.log("PractitionerOnboarding mounted");
    return () => {
      console.log("PractitionerOnboarding unmounted");
    };
  }, []);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Remove unused state
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Log user information to verify if it's loaded correctly
  useEffect(() => {
    console.log("User data:", user);
    if (!user) {
      console.error("No user data available - this could cause rendering issues");
    }
  }, [user]);
  
  const [formData, setFormData] = useState<PractitionerFormData>({
    name: user?.user_metadata?.name || '',
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
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.specialty.trim()) errors.specialty = 'Specialty is required';
      if (!formData.education.trim()) errors.education = 'Education is required';
    } else if (step === 2) {
      if (!formData.bio.trim()) errors.bio = 'Bio is required';
      else if (formData.bio.trim().length < 50) errors.bio = 'Bio should be at least 50 characters';
      if (!formData.approach) errors.approach = 'Therapeutic approach is required';
      if (!formData.languages || formData.languages.length === 0) errors.languages = 'At least one language is required';
    } else if (step === 3) {
      if (!formData.session_format || formData.session_format.length === 0) {
        errors.session_format = 'At least one session format is required';
      }
      if (!formData.availability.trim()) errors.availability = 'Availability information is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setStep((prev) => prev + 1);
    } else {
      // Show a toast with error message
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
  
  // Fixed submit application logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // If current step is not the final step, move to next step
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Only proceed with submission if we're on the final step
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

      // Prepare data to match practitioners table schema
      const practitionerData = {
        // Only include fields that exist in the database schema
        name: formData.name,
        specialty: formData.specialty,
        education: formData.education,
        degree: formData.degree,
        price: formData.price,
        location_type: formData.location_type === 'hybrid' ? 'both' : formData.location_type, // map 'hybrid' to 'both'
        conditions: Array.isArray(formData.conditions) ? formData.conditions : [],
        image_url: imagePreview || '',
        reviews: 0,
        rating: 5.0,
        badge: 'new'
      };

      console.log('Submitting data:', practitionerData); // Debug log

      const { error } = await supabase.from('practitioners').insert([practitionerData]);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Your application has been submitted successfully.",
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
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
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] ${formErrors.name ? 'border-red-500' : ''}`}
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
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] ${formErrors.specialty ? 'border-red-500' : ''}`}
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
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] ${formErrors.education ? 'border-red-500' : ''}`}
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
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF]"
              />
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
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] h-32 ${formErrors.bio ? 'border-red-500' : ''}`}
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
                className={`basic-select ${formErrors.approach ? 'border-red-500' : ''}`}
                styles={formErrors.approach ? {
                  control: (base) => ({
                    ...base,
                    borderColor: '#ef4444',
                    '&:hover': { borderColor: '#ef4444' }
                  })
                } : {}}
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
                className="basic-multi-select"
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
                className={`basic-multi-select ${formErrors.languages ? 'border-red-500' : ''}`}
                styles={formErrors.languages ? {
                  control: (base) => ({
                    ...base,
                    borderColor: '#ef4444',
                    '&:hover': { borderColor: '#ef4444' }
                  })
                } : {}}
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
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] h-24"
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
                className={`basic-multi-select ${formErrors.session_format ? 'border-red-500' : ''}`}
                styles={formErrors.session_format ? {
                  control: (base) => ({
                    ...base,
                    borderColor: '#ef4444',
                    '&:hover': { borderColor: '#ef4444' }
                  })
                } : {}}
              />
              {formErrors.session_format && <p className="text-red-500 text-sm mt-1">{formErrors.session_format}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="online" 
                    checked={formData.location_type === 'online'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF]"
                  />
                  <span className="ml-2">Online only</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="in-person" 
                    checked={formData.location_type === 'in-person'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF]"
                  />
                  <span className="ml-2">In-person only</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="location_type" 
                    value="hybrid" 
                    checked={formData.location_type === 'hybrid'}
                    onChange={handleInputChange}
                    className="form-radio text-[#148BAF]"
                  />
                  <span className="ml-2">Both online and in-person</span>
                </label>
              </div>
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
                className="basic-select"
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
                className="basic-select"
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
                className="basic-multi-select"
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
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#148BAF] ${formErrors.availability ? 'border-red-500' : ''}`}
              />
              {formErrors.availability && <p className="text-red-500 text-sm mt-1">{formErrors.availability}</p>}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-happy-monkey text-[#148BAF] mb-2">Become a Practitioner</h1>
        <p className="text-gray-600 mb-8">Complete the form below to join our network of practitioners.</p>
        
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
          <form onSubmit={handleSubmit}>
            {/* Show general form error if any exist */}
            {Object.keys(formErrors).length > 0 && (
              <FormErrorDisplay errors={formErrors} />
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
                    type="button" 
                    onClick={handleNext}
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
      </div>
    </ErrorBoundary>
  );
};

export default PractitionerOnboarding;