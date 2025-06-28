import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { navigateToEditProfile, checkExistingPractitioner } from '@/utils/practitionerNavigationFix';
import PageBackgroundImproved from '@/components/common/PageBackgroundImproved';
import PageTitleImproved from '@/components/common/PageTitleImproved';
import '@/styles/PractitionerOnboardingStyles.css';

// Types
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
  session_formats: string[]; 
  availability_schedule: string;
  calendly_link: string;
}

interface FormErrors {
  [key: string]: string;
}

// Multi-step form component
const MultiStepForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Default form data
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
  
  // Options for select inputs
  const sessionFormatOptions = [
    { value: 'Individual Therapy', label: 'Individual Therapy' },
    { value: 'Couples Therapy', label: 'Couples Therapy' },
    { value: 'Group Therapy', label: 'Group Therapy' },
    { value: 'Family Therapy', label: 'Family Therapy' }
  ];
  
  const locationTypeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'in-person', label: 'In-person' },
    { value: 'hybrid', label: 'Hybrid (Online & In-person)' }
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
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Other', label: 'Other' }
  ];
  
  const conditionOptions = [
    { value: 'Anxiety', label: 'Anxiety' },
    { value: 'Depression', label: 'Depression' },
    { value: 'Trauma', label: 'Trauma' },
    { value: 'PTSD', label: 'PTSD' },
    { value: 'Relationship Issues', label: 'Relationship Issues' },
    { value: 'Self-Esteem', label: 'Self-Esteem' },
    { value: 'Stress', label: 'Stress' },
    { value: 'Grief', label: 'Grief' }
  ];
  
  const insuranceOptions = [
    { value: 'None', label: 'No insurance accepted (self-pay only)' },
    { value: 'CGHS', label: 'CGHS' },
    { value: 'Star Health', label: 'Star Health' },
    { value: 'Religare', label: 'Religare' },
    { value: 'HDFC ERGO', label: 'HDFC ERGO' }
  ];
  
  // Clean up navigation flags and check for existing profile
  useEffect(() => {
    // Clean up any stale flags from previous sessions
    localStorage.removeItem('practitioner-registration-complete');
    localStorage.removeItem('practitioner-id');
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    // Load saved form data
    const loadSavedFormData = () => {
      try {
        const savedData = localStorage.getItem(`practitioner-form-${user.id}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          return true;
        }
      } catch (e) { 
        console.error("Error loading saved form data:", e); 
      }
      return false;
    };
    
    // Load saved step
    const loadSavedStep = () => {
      try {
        const savedStep = localStorage.getItem(`practitioner-step-${user.id}`);
        if (savedStep) {
          const stepNum = parseInt(savedStep, 10);
          setStep(stepNum);
          return true;
        }
      } catch (e) { 
        console.error("Error loading saved step:", e); 
      }
      return false;
    };
    
    // Check if practitioner record already exists
    const checkProfile = async () => {
      const existingProfile = await checkExistingPractitioner(user, supabase);
      if (existingProfile) {
        toast({
          title: "Existing Profile",
          description: "You already have a practitioner profile. Redirecting to edit page."
        });
        navigate('/practitioner-edit-profile');
      } else {
        // If no existing profile, try loading saved progress
        const hasSavedData = loadSavedFormData();
        const hasSavedStep = loadSavedStep();
        
        if (hasSavedData || hasSavedStep) {
          toast({
            title: "Progress Restored",
            description: "We've restored your previous progress"
          });
        }
      }
    };
    
    checkProfile();
  }, [user, navigate, toast]);
  
  // Save form progress when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`practitioner-form-${user.id}`, JSON.stringify(formData));
      localStorage.setItem(`practitioner-step-${user.id}`, step.toString());
    }
  }, [formData, step, user]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select changes (for react-select)
  const handleSelectChange = (name: string, selectedOptions: any) => {
    if (Array.isArray(selectedOptions)) {
      // Multi-select
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions.map(option => option.value)
      }));
    } else {
      // Single select
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions ? selectedOptions.value : ''
      }));
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any image-related errors
      if (formErrors.image) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };
  
  // Validate current step
  const validateStep = (): boolean => {
    const errors: FormErrors = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.specialty.trim()) errors.specialty = 'Specialty is required';
        if (!formData.education.trim()) errors.education = 'Education is required';
        if (!formData.degree.trim()) errors.degree = 'Degree is required';
        break;
        
      case 2: // Professional Details
        if (!formData.bio.trim()) errors.bio = 'Bio is required';
        if (formData.bio.trim().length < 50) errors.bio = 'Bio should be at least 50 characters';
        if (!formData.location_type) errors.location_type = 'Location type is required';
        if (!formData.approach.trim()) errors.approach = 'Therapeutic approach is required';
        if (!formData.session_formats.length) errors.session_formats = 'At least one session format is required';
        break;
        
      case 3: // Experience and Qualifications
        if (formData.conditions.length === 0) errors.conditions = 'At least one condition is required';
        if (!formData.certifications.trim()) errors.certifications = 'Certifications are required';
        break;
        
      case 4: // Scheduling and Availability
        if (!formData.availability_schedule.trim()) errors.availability_schedule = 'Availability is required';
        // Validate Calendly link if provided (should be a proper URL)
        if (formData.calendly_link && !formData.calendly_link.trim().startsWith('http')) {
          errors.calendly_link = 'Calendly link should be a valid URL';
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle navigation between steps
  const nextStep = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding",
        variant: "destructive"
      });
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for Supabase
      const practitionerData = {
        user_id: user.id,
        ...formData
      };
      
      // Insert record into practitioners table
      const { data, error } = await supabase
        .from('practitioners')
        .insert([practitionerData])
        .select()
        .single();
        
      if (error) throw error;
      
      // If there's an image, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `practitioner-images/${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('profile-images')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: publicURL } = supabase
          .storage
          .from('profile-images')
          .getPublicUrl(filePath);
          
        // Update the practitioner record with the image URL
        if (publicURL) {
          const { error: updateError } = await supabase
            .from('practitioners')
            .update({ profile_image: publicURL.publicUrl })
            .eq('id', data.id);
            
          if (updateError) {
            console.error('Error updating profile image:', updateError);
          }
        }
      }
      
      // Success! Navigate to edit profile
      toast({
        title: "Profile Created",
        description: "Your practitioner profile has been created successfully!",
      });
      
      // Show success animation
      showSuccessAnimation();
      
      // Clean up local storage
      if (user) {
        localStorage.removeItem(`practitioner-form-${user.id}`);
        localStorage.removeItem(`practitioner-step-${user.id}`);
      }
      
      // Navigate to edit profile
      setTimeout(() => {
        navigateToEditProfile(data, navigate);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating practitioner profile:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An error occurred while creating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Success animation with confetti effect
  const showSuccessAnimation = () => {
    const confetti = document.createElement('div');
    confetti.className = 'success-confetti';
    document.body.appendChild(confetti);
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      
      // Randomize position, color, and animation delay
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      piece.style.animationDelay = `${Math.random() * 2}s`;
      
      confetti.appendChild(piece);
    }
    
    // Remove the confetti after animation completes
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 4000);
  };
  
  // Render progress indicator
  const renderProgressBar = () => (
    <div className="onboarding-progress">
      {[1, 2, 3, 4].map((stepNum) => (
        <div 
          key={stepNum}
          className={`progress-step ${step === stepNum ? 'active' : ''} ${step > stepNum ? 'completed' : ''}`}
          onClick={() => step > stepNum && setStep(stepNum)}
        >
          {step > stepNum ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : stepNum}
        </div>
      ))}
    </div>
  );
  
  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderProfessionalDetailsStep();
      case 3:
        return renderExperienceQualificationsStep();
      case 4:
        return renderSchedulingAvailabilityStep();
      case 5:
        return renderReviewSubmitStep();
      default:
        return null;
    }
  };
  
  // Step 1: Personal Information
  const renderPersonalInfoStep = () => (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      
      <div className="image-upload-container">
        <div 
          className="image-preview"
          style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
        >
          {!imagePreview && (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>
        
        <label className="image-upload-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload Profile Photo
          <input
            type="file"
            accept="image/*"
            className="image-upload-input"
            onChange={handleImageUpload}
          />
        </label>
        {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${formErrors.name ? 'border-red-500' : ''}`}
          placeholder="Dr. Jane Doe"
        />
        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="specialty">Specialty *</label>
        <input
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          className={`form-input ${formErrors.specialty ? 'border-red-500' : ''}`}
          placeholder="e.g., Clinical Psychologist"
        />
        {formErrors.specialty && <p className="text-red-500 text-sm mt-1">{formErrors.specialty}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="education">Education *</label>
        <input
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          className={`form-input ${formErrors.education ? 'border-red-500' : ''}`}
          placeholder="e.g., Mumbai University"
        />
        {formErrors.education && <p className="text-red-500 text-sm mt-1">{formErrors.education}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="degree">Degree/Qualification *</label>
        <input
          id="degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          className={`form-input ${formErrors.degree ? 'border-red-500' : ''}`}
          placeholder="e.g., M.Phil in Clinical Psychology"
        />
        {formErrors.degree && <p className="text-red-500 text-sm mt-1">{formErrors.degree}</p>}
      </div>
    </div>
  );
  
  // Step 2: Professional Details
  const renderProfessionalDetailsStep = () => (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
      
      <div className="form-group">
        <label htmlFor="bio">Professional Bio *</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={`form-textarea ${formErrors.bio ? 'border-red-500' : ''}`}
          placeholder="Tell potential clients about yourself, your approach, and your experience..."
          rows={6}
        />
        <div className="flex justify-between">
          {formErrors.bio ? (
            <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{formData.bio.length} characters</p>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="location_type">Location Type *</label>
        <Select
          id="location_type"
          options={locationTypeOptions}
          value={locationTypeOptions.find(option => option.value === formData.location_type)}
          onChange={(selected) => handleSelectChange('location_type', selected)}
          className={formErrors.location_type ? 'border-red-500' : ''}
          classNamePrefix="react-select"
          placeholder="Select location type"
        />
        {formErrors.location_type && <p className="text-red-500 text-sm mt-1">{formErrors.location_type}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="approach">Therapeutic Approach *</label>
        <textarea
          id="approach"
          name="approach"
          value={formData.approach}
          onChange={handleChange}
          className={`form-textarea ${formErrors.approach ? 'border-red-500' : ''}`}
          placeholder="Describe your therapeutic approach and methodology..."
          rows={4}
        />
        {formErrors.approach && <p className="text-red-500 text-sm mt-1">{formErrors.approach}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="session_formats">Session Formats *</label>
        <Select
          id="session_formats"
          isMulti
          options={sessionFormatOptions}
          value={sessionFormatOptions.filter(option => formData.session_formats.includes(option.value))}
          onChange={(selected) => handleSelectChange('session_formats', selected)}
          className={formErrors.session_formats ? 'border-red-500' : ''}
          classNamePrefix="react-select"
          placeholder="Select session formats"
        />
        {formErrors.session_formats && <p className="text-red-500 text-sm mt-1">{formErrors.session_formats}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price per Session</label>
        <Select
          id="price"
          options={priceRangeOptions}
          value={priceRangeOptions.find(option => option.value === formData.price)}
          onChange={(selected) => handleSelectChange('price', selected)}
          classNamePrefix="react-select"
          placeholder="Select price range"
        />
      </div>
    </div>
  );
  
  // Step 3: Experience and Qualifications
  const renderExperienceQualificationsStep = () => (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-4">Experience and Qualifications</h2>
      
      <div className="form-group">
        <label htmlFor="years_experience">Years of Experience</label>
        <Select
          id="years_experience"
          options={experienceOptions}
          value={experienceOptions.find(option => option.value === formData.years_experience)}
          onChange={(selected) => handleSelectChange('years_experience', selected)}
          classNamePrefix="react-select"
          placeholder="Select years of experience"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="languages">Languages</label>
        <Select
          id="languages"
          isMulti
          options={languageOptions}
          value={languageOptions.filter(option => formData.languages.includes(option.value))}
          onChange={(selected) => handleSelectChange('languages', selected)}
          classNamePrefix="react-select"
          placeholder="Select languages"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="conditions">Conditions Treated *</label>
        <Select
          id="conditions"
          isMulti
          options={conditionOptions}
          value={conditionOptions.filter(option => formData.conditions.includes(option.value))}
          onChange={(selected) => handleSelectChange('conditions', selected)}
          className={formErrors.conditions ? 'border-red-500' : ''}
          classNamePrefix="react-select"
          placeholder="Select conditions treated"
        />
        {formErrors.conditions && <p className="text-red-500 text-sm mt-1">{formErrors.conditions}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="certifications">Certifications and Licenses *</label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          className={`form-textarea ${formErrors.certifications ? 'border-red-500' : ''}`}
          placeholder="List your professional certifications and licenses..."
          rows={4}
        />
        {formErrors.certifications && <p className="text-red-500 text-sm mt-1">{formErrors.certifications}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="insurance_accepted">Insurance Accepted</label>
        <Select
          id="insurance_accepted"
          isMulti
          options={insuranceOptions}
          value={insuranceOptions.filter(option => formData.insurance_accepted.includes(option.value))}
          onChange={(selected) => handleSelectChange('insurance_accepted', selected)}
          classNamePrefix="react-select"
          placeholder="Select accepted insurance plans"
        />
      </div>
    </div>
  );
  
  // Step 4: Scheduling and Availability
  const renderSchedulingAvailabilityStep = () => (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-4">Scheduling and Availability</h2>
      
      <div className="form-group">
        <label htmlFor="availability_schedule">Availability *</label>
        <textarea
          id="availability_schedule"
          name="availability_schedule"
          value={formData.availability_schedule}
          onChange={handleChange}
          className={`form-textarea ${formErrors.availability_schedule ? 'border-red-500' : ''}`}
          placeholder="Describe your general availability, e.g., 'Weekdays 9am-5pm, Weekends by appointment'"
          rows={4}
        />
        {formErrors.availability_schedule && <p className="text-red-500 text-sm mt-1">{formErrors.availability_schedule}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="calendly_link">Calendly Link (Optional)</label>
        <input
          id="calendly_link"
          name="calendly_link"
          value={formData.calendly_link}
          onChange={handleChange}
          className={`form-input ${formErrors.calendly_link ? 'border-red-500' : ''}`}
          placeholder="e.g., https://calendly.com/your-username"
        />
        {formErrors.calendly_link && <p className="text-red-500 text-sm mt-1">{formErrors.calendly_link}</p>}
        <p className="text-sm text-gray-500 mt-1">Add your Calendly link to enable easy appointment booking</p>
      </div>
    </div>
  );
  
  // Step 5: Review and Submit
  const renderReviewSubmitStep = () => (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-4">Review and Submit</h2>
      <p className="mb-6">Please review your information before submitting. You can edit your profile later.</p>
      
      <div className="preview-card">
        <div className="preview-header">
          <h3 className="text-xl font-bold">{formData.name}</h3>
          <p className="text-sm opacity-80">{formData.specialty}</p>
        </div>
        
        <div className="preview-body">
          <div className="preview-field">
            <div className="preview-field-label">Education</div>
            <div className="preview-field-value">{formData.degree}, {formData.education}</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Experience</div>
            <div className="preview-field-value">{formData.years_experience}+ years</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Session Format</div>
            <div className="preview-field-value">{formData.session_formats.join(', ')}</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Location</div>
            <div className="preview-field-value">{
              formData.location_type === 'online' ? 'Online' : 
              formData.location_type === 'in-person' ? 'In-person' : 
              'Hybrid (Online & In-person)'
            }</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Languages</div>
            <div className="preview-field-value">{formData.languages.join(', ')}</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Price</div>
            <div className="preview-field-value">₹{formData.price} per session</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Bio</div>
            <div className="preview-field-value">{formData.bio}</div>
          </div>
          
          <div className="preview-field">
            <div className="preview-field-label">Areas of Expertise</div>
            <div className="preview-field-value">{formData.conditions.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Navigation buttons
  const renderNavigationButtons = () => (
    <div className="form-nav-buttons">
      {step > 1 && (
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Previous
        </Button>
      )}
      
      {step < 5 ? (
        <Button
          onClick={nextStep}
          disabled={isSubmitting}
          className="ml-auto"
        >
          Continue
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="ml-auto"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Profile'
          )}
        </Button>
      )}
    </div>
  );
  
  return (
    <div className="practitioner-onboarding-container">
      <PageTitleImproved title="Create Your Practitioner Profile" subtitle="Complete all steps to set up your profile" />
      {renderProgressBar()}
      {renderStepContent()}
      {renderNavigationButtons()}
    </div>
  );
};

// Main component with error boundary
const PractitionerOnboardingImproved: React.FC = () => {
  return (
    <PageBackgroundImproved>
      <React.Suspense fallback={<div className="text-center pt-10">Loading...</div>}>
        <MultiStepForm />
      </React.Suspense>
    </PageBackgroundImproved>
  );
};

export default PractitionerOnboardingImproved;
