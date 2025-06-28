import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { ensureEditProfileLoadsSimple, fetchPractitionerDataSimple } from '@/utils/practitionerNavigationFixSimple';
import PageBackgroundImproved from '@/components/common/PageBackgroundImproved';
import PageTitleImproved from '@/components/common/PageTitleImproved';
import '@/styles/PractitionerOnboardingStyles.css';

// Define the form data type for better TypeScript support
interface PractitionerFormData {
  id?: string | number;
  user_id?: string;
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
  session_formats: string[]; // Changed from session_format to match DB schema
  availability_schedule: string; // Changed from availability to match DB schema
  calendly_link: string;
  profile_image?: string;
}

interface FormErrors {
  [key: string]: string;
}

const PractitionerEditProfileImproved: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  // State for practitioner data
  const [activeSection, setActiveSection] = useState<string>('profile');
  
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
  
  // Fetch practitioner data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Check for any navigation flags
        const fromOnboarding = location.state?.fromOnboarding || localStorage.getItem('practitioner-registration-complete') === 'true';
        const practitionerId = location.state?.practitionerId || localStorage.getItem('practitioner-id');
        
        // If coming from onboarding, show a welcome message
        if (fromOnboarding) {
          toast({
            title: "Welcome to Your Profile",
            description: "Your profile has been created. You can now edit and update your information."
          });
          
          // Clean up flags after use
          localStorage.removeItem('practitioner-registration-complete');
          localStorage.removeItem('practitioner-id');
        }
        
        // Fetch practitioner data using the utility
        const data = await fetchPractitionerDataSimple(user, supabase, practitionerId);
        
        if (!data) {
          toast({
            title: "Profile Not Found",
            description: "Redirecting to onboarding...",
            variant: "destructive"
          });
          navigate("/practitioner-onboarding");
          return;
        }
        
        // Update form data with fetched data
        const mappedData = {
          ...formData,
          ...data,
          // Ensure proper mapping for renamed fields
          session_formats: data.session_formats || data.session_format || ['Individual Therapy'],
          availability_schedule: data.availability_schedule || data.availability || 'Weekdays 9am-5pm',
        };
        
        setFormData(mappedData);
        
        // Set image preview if available
        if (data.profile_image) {
          setImagePreview(data.profile_image);
        }
        
        // Set flag for ensureEditProfileLoads - useful for preventing navigation issues
        ensureEditProfileLoadsSimple();
        
      } catch (error) {
        console.error('Error fetching practitioner data:', error);
        toast({
          title: "Error Loading Profile",
          description: "There was an error loading your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, location, navigate, toast]);
  
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
  
  // Validate form
  const validateForm = (section: string): boolean => {
    const errors: FormErrors = {};
    
    switch (section) {
      case 'profile':
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.specialty.trim()) errors.specialty = 'Specialty is required';
        if (!formData.education.trim()) errors.education = 'Education is required';
        if (!formData.degree.trim()) errors.degree = 'Degree is required';
        if (!formData.bio.trim()) errors.bio = 'Bio is required';
        if (formData.bio.trim().length < 50) errors.bio = 'Bio should be at least 50 characters';
        break;
      case 'expertise':
        if (!formData.approach.trim()) errors.approach = 'Therapeutic approach is required';
        if (formData.conditions.length === 0) errors.conditions = 'At least one condition is required';
        if (!formData.certifications.trim()) errors.certifications = 'Certifications are required';
        break;
      case 'availability':
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
  
  // Handle save for a specific section
  const handleSave = async (section: string) => {
    if (!validateForm(section)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive"
      });
      
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    if (!user || !formData.id) {
      toast({
        title: "Error",
        description: "Missing user or profile data",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update practitioner record
      const { error } = await supabase
        .from('practitioners')
        .update(formData)
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // If there's a new image, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `practitioner-images/${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('profile-images')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Image Upload Error",
            description: "Your profile data was saved, but there was an error uploading your image",
            variant: "destructive"
          });
          setIsSaving(false);
          return;
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
            .eq('id', formData.id);
            
          if (updateError) {
            console.error('Error updating profile image URL:', updateError);
          }
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
      
    } catch (error) {
      console.error('Error updating practitioner profile:', error);
      toast({
        title: "Update Error",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render section navigation
  const renderSectionNavigation = () => (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-4">
        {[
          { id: 'profile', label: 'Profile Details' },
          { id: 'expertise', label: 'Expertise & Qualifications' },
          { id: 'availability', label: 'Availability & Booking' }
        ].map(section => (
          <button
            key={section.id}
            className={`py-2 px-1 -mb-px text-sm font-medium ${
              activeSection === section.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
  
  // Render profile details section
  const renderProfileSection = () => (
    <div className={`form-section ${activeSection === 'profile' ? '' : 'hidden'}`}>
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
          {imagePreview ? 'Change Profile Photo' : 'Upload Profile Photo'}
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
      
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => handleSave('profile')}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Profile Details'
          )}
        </Button>
      </div>
    </div>
  );
  
  // Render expertise section
  const renderExpertiseSection = () => (
    <div className={`form-section ${activeSection === 'expertise' ? '' : 'hidden'}`}>
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
        <label htmlFor="languages">Languages</label>
        <Select
          id="languages"
          isMulti
          options={languageOptions}
          value={languageOptions.filter(option => formData.languages?.includes(option.value))}
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
          value={conditionOptions.filter(option => formData.conditions?.includes(option.value))}
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
          value={insuranceOptions.filter(option => formData.insurance_accepted?.includes(option.value))}
          onChange={(selected) => handleSelectChange('insurance_accepted', selected)}
          classNamePrefix="react-select"
          placeholder="Select accepted insurance plans"
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => handleSave('expertise')}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Expertise & Qualifications'}
        </Button>
      </div>
    </div>
  );
  
  // Render availability section
  const renderAvailabilitySection = () => (
    <div className={`form-section ${activeSection === 'availability' ? '' : 'hidden'}`}>
      <div className="form-group">
        <label htmlFor="session_formats">Session Formats *</label>
        <Select
          id="session_formats"
          isMulti
          options={sessionFormatOptions}
          value={sessionFormatOptions.filter(option => formData.session_formats?.includes(option.value))}
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
      
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => handleSave('availability')}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Availability & Booking'}
        </Button>
      </div>
    </div>
  );
  
  // Loading state
  if (isLoading) {
    return (
      <PageBackgroundImproved>
        <div className="practitioner-onboarding-container flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading your profile...</p>
          </div>
        </div>
      </PageBackgroundImproved>
    );
  }
  
  return (
    <PageBackgroundImproved>
      <div className="practitioner-onboarding-container">
        <PageTitleImproved title="Edit Practitioner Profile" subtitle="Update your professional information" />
        {renderSectionNavigation()}
        {renderProfileSection()}
        {renderExpertiseSection()}
        {renderAvailabilitySection()}
      </div>
    </PageBackgroundImproved>
  );
};

export default PractitionerEditProfileImproved;
