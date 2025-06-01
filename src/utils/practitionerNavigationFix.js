/**
 * This file provides navigation fixes for practitioner onboarding and edit profile workflow
 * It addresses issues with navigation from practitioner onboarding to edit profile
 */

/**
 * Helper function to ensure proper navigation from onboarding to edit profile
 * @param {string} userId - The user ID
 * @param {Object} practitionerData - The practitioner data 
 * @param {Function} navigate - React Router navigate function
 */
export const navigateToEditProfile = (userId, practitionerData, navigate) => {
  // Set a flag to indicate successful registration
  localStorage.setItem('practitioner-registration-complete', 'true');
  localStorage.setItem('practitioner-id', practitionerData?.id || '');
  
  console.log("Attempting navigation to edit profile page with data:", practitionerData);
  
  try {
    // First try the React Router navigation
    navigate('/practitioner-edit-profile', { 
      state: { fromOnboarding: true, practitionerId: practitionerData?.id }
    });
    
    // Set a backup with timeout to handle potential navigation issues
    setTimeout(() => {
      // Check if we're still not on the edit profile page
      if (!window.location.pathname.includes('practitioner-edit-profile')) {
        console.log("Navigation timeout triggered - forcing redirect");
        window.location.href = '/practitioner-edit-profile';
      }
    }, 2000);
  } catch (navigationError) {
    console.error("Navigation error:", navigationError);
    // Fallback to direct location change
    window.location.href = '/practitioner-edit-profile';
  }
};

/**
 * Helper function to check if user already has a practitioner profile
 * @param {Object} user - The authenticated user object
 * @param {Object} supabase - The Supabase client instance
 * @returns {Promise<Object>} - Promise resolving to practitioner data or null
 */
export const checkExistingPractitioner = async (user, supabase) => {
  if (!user) return null;
  
  try {
    console.log("Checking if user already has a practitioner record");
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking for existing practitioner:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error checking practitioner status:", err);
    return null;
  }
};

/**
 * Helper function to ensure edit profile page loads properly
 * @param {Object} user - The authenticated user object
 * @param {Object} supabase - The Supabase client instance
 * @returns {Promise<boolean>} - Promise resolving to true if successful
 */
export const ensureEditProfileLoads = async (user, supabase) => {
  if (!user) return false;
  
  // Check if we're coming from successful registration 
  const registrationComplete = localStorage.getItem('practitioner-registration-complete') === 'true';
  const practitionerId = localStorage.getItem('practitioner-id');
  
  console.log("Edit profile check - Registration complete flag:", registrationComplete);
  console.log("Edit profile check - Practitioner ID:", practitionerId);
  
  // Clear the flags once we've used them
  localStorage.removeItem('practitioner-registration-complete');
  localStorage.removeItem('practitioner-id');
  
  // If we just registered, try to fetch the practitioner data directly
  if (registrationComplete && practitionerId) {
    try {
      // Attempt to fetch by ID first if available
      const { data: dataById, error: errorById } = await supabase
        .from('practitioners')
        .select('*')
        .eq('id', practitionerId)
        .single();
        
      if (!errorById && dataById) {
        console.log("Successfully loaded practitioner data by ID:", dataById);
        return true;
      }
    } catch (err) {
      console.error("Error fetching by ID:", err);
    }
  }
  
  // Fall back to fetching by user_id
  try {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error("Error fetching practitioner data:", error);
      return false;
    }
    
    if (data) {
      console.log("Successfully loaded practitioner data by user_id:", data);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error ensuring edit profile loads:", error);
    return false;
  }
};

/**
 * Comprehensive function to fetch practitioner data and update form state
 * @param {Object} user - The authenticated user object
 * @param {Object} supabase - The Supabase client instance
 * @param {Function} setFormData - Function to set the form data state
 * @param {Function} setImagePreview - Function to set the image preview state
 * @param {Function} setIsLoading - Function to set the loading state
 * @param {Function} toast - Toast notification function
 * @param {Function} navigate - React Router navigate function
 */
export const fetchPractitionerData = async (
  user,
  supabase,
  setFormData,
  setImagePreview,
  setIsLoading,
  toast,
  navigate
) => {
  if (!user) {
    console.error("No user provided to fetchPractitionerData");
    navigate('/practitioner-register');
    return;
  }

  setIsLoading(true);

  try {
    console.log("Fetching practitioner data for user:", user.id);
    
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching practitioner data:", error);
      
      if (error.code === 'PGRST116') {
        // No practitioner found - redirect to registration
        console.log("No practitioner profile found, redirecting to registration");
        toast({
          title: "No Profile Found",
          description: "Please complete your practitioner registration first.",
          variant: "destructive"
        });
        navigate('/practitioner-register');
        return;
      } else {
        // Other database error
        toast({
          title: "Error Loading Profile",
          description: "Failed to load practitioner data. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    }

    if (data) {
      console.log("Successfully loaded practitioner data:", data);
      
      // Update form data with the fetched data
      setFormData({
        name: data.name || '',
        specialty: data.specialty || '',
        education: data.education || '',
        degree: data.degree || '',
        bio: data.bio || '',
        location_type: data.location_type || '',
        price: data.price || 0,
        years_experience: data.years_experience || 0,
        languages: data.languages || [],
        approach: data.approach || '',
        certifications: data.certifications || '',
        conditions: data.conditions || [],
        insurance_accepted: data.insurance_accepted || [],
        session_formats: data.session_formats || [],
        availability_schedule: data.availability_schedule || '',
        calendly_link: data.calendly_link || ''
      });

      // Set image preview if profile image exists
      if (data.profile_image) {
        setImagePreview(data.profile_image);
      }

      toast({
        title: "Profile Loaded",
        description: "Your practitioner profile has been loaded successfully.",
        variant: "default"
      });
    }
  } catch (err) {
    console.error("Unexpected error in fetchPractitionerData:", err);
    toast({
      title: "Error",
      description: "An unexpected error occurred while loading your profile.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
