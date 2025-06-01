/**
 * This file provides navigation fixes for practitioner onboarding and edit profile workflow
 * It addresses issues with navigation from practitioner onboarding to edit profile
 */
import { NavigateFunction } from "react-router-dom";

interface PractitionerData {
  id?: string | number;
  [key: string]: any;
}

/**
 * Helper function to ensure proper navigation from onboarding to edit profile
 * @param practitionerData - The practitioner data 
 * @param navigate - React Router navigate function
 */
export const navigateToEditProfile = (
  practitionerData: PractitionerData | undefined, 
  navigate: NavigateFunction
): void => {
  // Make sure we have a practitioner ID before proceeding
  if (!practitionerData?.id) {
    console.error("No practitioner ID available for navigation");
    
    // Set a fallback flag without ID
    localStorage.setItem('practitioner-registration-complete', 'true');
    
    // Use direct navigation as fallback
    window.location.href = '/practitioner-edit-profile';
    return;
  }
  
  // Set flags for the receiving page
  localStorage.setItem('practitioner-registration-complete', 'true');
  localStorage.setItem('practitioner-id', practitionerData.id.toString());
  
  console.log("Attempting navigation to edit profile page with data:", practitionerData);
  
  try {
    // First try the React Router navigation
    navigate('/practitioner-edit-profile', { 
      state: { fromOnboarding: true, practitionerId: practitionerData.id }
    });
    
    // Set a backup with timeout to handle potential navigation issues
    setTimeout(() => {
      // Check if we're still not on the edit profile page
      if (!window.location.pathname.includes('practitioner-edit-profile')) {
        console.log("Navigation timeout triggered - forcing redirect");
        window.location.href = '/practitioner-edit-profile';
      }
    }, 2000);
    
    // We can't return a cleanup function from here since it's not a React hook
    // The timeout will clear when navigation completes or the page unloads
  } catch (navigationError) {
    console.error("Navigation error:", navigationError);
    // Fallback to direct location change
    window.location.href = '/practitioner-edit-profile';
  }
};

/**
 * Helper function to check if user already has a practitioner profile
 * @param user - The authenticated user object
 * @param supabase - The Supabase client instance
 * @returns Promise resolving to practitioner data or null
 */
export const checkExistingPractitioner = async (
  user: { id: string } | null, 
  supabase: any
): Promise<PractitionerData | null> => {
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
 * This checks for navigation flags and handles edge cases
 * @param location - React Router location object
 * @param navigate - React Router navigate function
 * @param user - The authenticated user object
 */
export const ensureEditProfileLoads = (
  location: any,
  navigate: NavigateFunction,
  user: { id: string } | null
): void => {
  if (!user) {
    console.warn("No user found in ensureEditProfileLoads");
    navigate('/login');
    return;
  }
  
  // Check if we're coming from successful registration 
  const registrationComplete = localStorage.getItem('practitioner-registration-complete') === 'true';
  const practitionerId = localStorage.getItem('practitioner-id');
  const locationState = location.state as { fromOnboarding?: boolean, practitionerId?: string | number } | null;
  
  console.log("Edit profile check - Registration complete flag:", registrationComplete);
  console.log("Edit profile check - Practitioner ID:", practitionerId);
  console.log("Edit profile check - Location state:", locationState);
  
  // Validate that we're in the right place - no action needed if we're here correctly
};

/**
 * Handles state-preserving reload for PractitionerEditProfile component
 * @param shouldRefresh - Whether to perform a full refresh
 * @param fetchDataFunction - Function to refetch data
 */
export const handleProfileReload = (
  shouldRefresh: boolean,
  fetchDataFunction: () => void
): void => {
  if (shouldRefresh) {
    // For a newly registered practitioner, do a controlled reload
    console.log("Newly registered practitioner - doing controlled reload for data consistency");
    
    // Set temporary flag to indicate we're doing a controlled reload
    localStorage.setItem('practitioner-reload-in-progress', 'true');
    
    // Use setTimeout to ensure React state updates have completed
    setTimeout(() => {
      // Clear the flag since we're about to reload
      localStorage.removeItem('practitioner-reload-in-progress');
      
      // Perform the reload
      window.location.reload();
    }, 500);
  } else {
    // For regular updates, refetch data without a full page reload
    console.log("Update successful - refetching data");
    
    // Small delay to let database changes propagate
    setTimeout(() => {
      fetchDataFunction();
    }, 300);
  }
};

/**
 * Helper function to fetch practitioner data with proper error handling
 * This is designed to be used in the PractitionerEditProfile component
 * @param user - The authenticated user object
 * @param supabase - Supabase client instance
 * @param setFormData - Function to set form data state
 * @param setImagePreview - Function to set image preview state
 * @param setIsLoading - Function to set loading state
 * @param toast - Toast notification function
 * @param navigate - React Router navigate function
 */
export const fetchPractitionerData = async (
  user: { id: string } | null,
  supabase: any,
  setFormData: Function,
  setImagePreview: Function, 
  setIsLoading: Function,
  toast: Function,
  navigate: NavigateFunction
): Promise<void> => {
  if (!user) {
    console.warn("No user found in fetchPractitionerData");
    toast({
      title: "Authentication Error",
      description: "Please login to edit your profile.",
      variant: "destructive"
    });
    navigate('/login');
    return;
  }
  
  console.log("User authenticated:", user.id);
  
  try {
    console.log("Fetching practitioner data for user ID:", user.id);
    setIsLoading(true);
    
    // Check if we're coming from successful registration
    const registrationComplete = localStorage.getItem('practitioner-registration-complete') === 'true';
    const practitionerId = localStorage.getItem('practitioner-id');
    
    if (registrationComplete && practitionerId) {
      console.log("Coming from successful registration. Using practitioner ID:", practitionerId);
      
      // Try to fetch by ID first
      const { data: dataById, error: errorById } = await supabase
        .from('practitioners')
        .select('*')
        .eq('id', practitionerId)
        .single();
        
      if (!errorById && dataById) {
        console.log("Successfully loaded practitioner data by ID:", dataById);
        
        // Map the data to our form structure
        setFormData({
          name: (dataById?.name as string) || '',
          specialty: (dataById?.specialty as string) || '',
          education: (dataById?.education as string) || '',
          degree: (dataById?.degree as string) || '',
          bio: (dataById?.bio as string) || '',
          location_type: (dataById?.location_type as string) || 'online',
          price: (dataById?.price as number) || 1500,
          years_experience: (dataById?.years_experience as number) || 1,
          languages: (dataById?.languages as string[]) || ['English'],
          approach: (dataById?.approach as string) || '',
          certifications: (dataById?.certifications as string) || '',
          conditions: (dataById?.conditions_treated as string[]) || [],
          insurance_accepted: (dataById?.insurance_accepted as string[]) || [],
          session_formats: (dataById?.session_formats as string[]) || ['Individual Therapy'],
          availability_schedule: (dataById?.availability_schedule as string) || 'Weekdays 9am-5pm',
          calendly_link: (dataById?.calendly_link as string) || '',
        });
        
        // Load profile image if available
        if (dataById && dataById.profile_image_url) {
          setImagePreview((dataById?.profile_image_url as string) || null);
        }
        
        // Clear the flags
        localStorage.removeItem('practitioner-registration-complete');
        localStorage.removeItem('practitioner-id');
        
        setIsLoading(false);
        return;
      }
    }
    
    // Debug database connection
    const { data: dbTest, error: dbTestError } = await supabase
      .from('practitioners')
      .select('count(*)');
      
    if (dbTestError) {
      console.error("Database connection test failed:", dbTestError);
    } else {
      console.log("Database connection test successful:", dbTest);
    }
    
    // Actual practitioner data fetch by user_id
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error("Error fetching practitioner data:", error);
      
      if (error.code === 'PGRST116') {
        // No data found - redirect to onboarding
        console.log("No practitioner profile found for this user");
        toast({
          title: "No Profile Found",
          description: "You haven't created a practitioner profile yet. Redirecting to onboarding page."
        });
        navigate('/practitioner-onboarding');
        return;
      } else {
        // Other DB error
        throw new Error(error.message);
      }
    }
    
    if (data) {
      console.log("Successfully loaded practitioner data by user_id:", data);
      console.log("Practitioner ID:", data.id);
      
      // Map the data to our form structure
      setFormData({
        name: (data?.name as string) || '',
        specialty: (data?.specialty as string) || '',
        education: (data?.education as string) || '',
        degree: (data?.degree as string) || '',
        bio: (data?.bio as string) || '',
        location_type: (data?.location_type as string) || 'online',
        price: (data?.price as number) || 1500,
        years_experience: (data?.years_experience as number) || 1,
        languages: (data?.languages as string[]) || ['English'],
        approach: (data?.approach as string) || '',
        certifications: (data?.certifications as string) || '',
        conditions: (data?.conditions_treated as string[]) || [],
        insurance_accepted: (data?.insurance_accepted as string[]) || [],
        session_formats: (data?.session_formats as string[]) || ['Individual Therapy'],
        availability_schedule: (data?.availability_schedule as string) || 'Weekdays 9am-5pm',
        calendly_link: (data?.calendly_link as string) || '',
      });
      
      // Load profile image if available
      if (data && data.profile_image_url) {
        setImagePreview((data?.profile_image_url as string) || null);
      }
    } else {
      // This shouldn't happen due to the error handling above, but just in case
      console.warn("No practitioner data returned but no error either");
      toast({
        title: "No Profile Found",
        description: "You haven't created a practitioner profile yet. Redirecting to onboarding."
      });
      navigate('/practitioner-onboarding');
    }
  } catch (error) {
    console.error("Error fetching practitioner data:", error);
    toast({
      title: "Error",
      description: "Failed to load your profile data. Please try again.",
      variant: "destructive"
    });
    
    // If this is after a submission, we need to handle the error differently
    const registrationComplete = localStorage.getItem('practitioner-registration-complete');
    if (registrationComplete === 'true') {
      console.log("Error after registration. Attempting to recover...");
      
      // Clear flags
      localStorage.removeItem('practitioner-registration-complete');
      localStorage.removeItem('practitioner-id');
      
      // Wait and retry once with a page reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } finally {
    setIsLoading(false);
  }
};
