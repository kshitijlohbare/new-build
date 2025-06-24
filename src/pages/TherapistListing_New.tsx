import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TherapistListing_New.css";
import "../styles/TherapistsCardsFix.css";
import Vector from "../components/Vector";
import BackgroundEmbed from "../components/BackgroundEmbed";
import { supabase } from "../lib/browser-safe-supabase";
import { testSupabaseConnection, attemptSupabaseConnectionFix } from "../lib/supabase-diagnostics";

// Note: The practitioners table has RLS disabled as of June 2025
// No special authentication required for read access

// Define interface for practitioner data from Supabase
// This interface provides type documentation for the expected schema
// We use any type in the actual mapping for more robust type handling
// Using @ts-expect-error to silence the unused interface warning as this is for documentation
// @ts-expect-error - Used for documentation purposes
interface PractitionerSchema {
  id: string;
  name: string;
  specialty: string;
  price: number;
  location_type: string;
  rating: number;
  reviews: number;
  conditions: string[];
  image_url: string;
  badge?: string;
  years_experience?: number;
  languages?: string[];
  education?: string;
  degree?: string;
  calendly_link?: string;
  created_at?: string;
  user_id?: string;
}

// Map from practitioner data to our component's therapist format
interface TherapistData {
  id: string;
  name: string;
  experience: string;
  price: string;
  specialisation: string;
  languages: string;
  image: string;
}

// Fallback data to use if Supabase connection fails
const FALLBACK_THERAPISTS: TherapistData[] = [
  {
    id: 'fallback-1',
    name: 'Dr. Sarah Johnson',
    experience: '10+ years of experience',
    price: '$ 120/session',
    specialisation: 'anxiety, depression, stress, burnout',
    languages: 'English, Spanish',
    image: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: 'fallback-2',
    name: 'Dr. Michael Chen',
    experience: '8+ years of experience',
    price: '$ 100/session',
    specialisation: 'anxiety, trauma, PTSD, OCD',
    languages: 'English, Mandarin',
    image: 'https://randomuser.me/api/portraits/men/62.jpg'
  },
  {
    id: 'fallback-3',
    name: 'Amanda Rodriguez',
    experience: '6+ years of experience',
    price: '$ 90/session',
    specialisation: 'relationships, family issues, couples therapy',
    languages: 'English, Spanish',
    image: 'https://randomuser.me/api/portraits/women/43.jpg'
  }
];

const TherapistListing_New = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState<TherapistData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null); // Track which therapist is being booked
  
  // Custom hook for ticker effect
  function useTickerEffect() {
    const specialisationRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const languageRefs = useRef<(HTMLSpanElement | null)[]>([]);
    
    // Function to check if text overflows and add ticker class
    const checkOverflow = () => {
      // Check specialisation texts
      specialisationRefs.current.forEach((ref) => {
        if (ref && ref.scrollWidth > ref.clientWidth + 1) { // Add 1px threshold to avoid edge cases
          ref.classList.add('ticker');
          ref.setAttribute('title', ref.textContent || ''); // Set tooltip on overflow
        } else if (ref) {
          ref.classList.remove('ticker');
        }
      });
      
      // Check language texts
      languageRefs.current.forEach((ref) => {
        if (ref && ref.scrollWidth > ref.clientWidth + 1) {
          ref.classList.add('ticker');
          ref.setAttribute('title', ref.textContent || ''); // Set tooltip on overflow
        } else if (ref) {
          ref.classList.remove('ticker');
        }
      });
    };
    
    // Run check after render and on window resize
    useEffect(() => {
      specialisationRefs.current = specialisationRefs.current.slice(0, therapists.length);
      languageRefs.current = languageRefs.current.slice(0, therapists.length);
      
      // Check on initial render with multiple attempts to ensure fonts are loaded
      setTimeout(checkOverflow, 100);
      setTimeout(checkOverflow, 500);
      setTimeout(checkOverflow, 1000);
      
      // Check on window resize using a debounce function to improve performance
      let resizeTimer: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkOverflow, 100);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }, [therapists]);
    
    return { specialisationRefs, languageRefs };
  }
  
  // Initialize ticker refs
  const { specialisationRefs, languageRefs } = useTickerEffect();
  
  // Filter state
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    specialty: '',
    location: '',
    language: ''
  });
  
  // Filter popup state
  const [activePopup, setActivePopup] = useState<string | null>(null);
  
  // References for popup positioning
  const locationFilterRef = useRef<HTMLDivElement>(null);
  const specialtyFilterRef = useRef<HTMLDivElement>(null);
  const languageFilterRef = useRef<HTMLDivElement>(null);
  const priceFilterRef = useRef<HTMLDivElement>(null);
  
  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePopup && 
          !locationFilterRef.current?.contains(event.target as Node) && 
          !specialtyFilterRef.current?.contains(event.target as Node) &&
          !languageFilterRef.current?.contains(event.target as Node) &&
          !priceFilterRef.current?.contains(event.target as Node)) {
        // Remove active-popup class from all filters when clicking outside
        document.querySelectorAll('.InputBar').forEach(el => {
          el.classList.remove('active-popup');
        });
        
        setActivePopup(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopup]);

  // Define filter options
  const specialtyOptions = ['depression', 'anxiety', 'trauma', 'relationships', 'addiction', 'grief'];
  const languageOptions = ['english', 'hindi', 'marathi', 'tamil', 'spanish', 'french'];
  const locationOptions = ['in-person', 'online', 'both'];
  
  // Toggle filter popup
  const toggleFilterPopup = (filterType: string) => {
    // Remove active-popup class from all filters first
    document.querySelectorAll('.InputBar').forEach(el => {
      el.classList.remove('active-popup');
    });
    
    // If we're opening a popup, add the active-popup class to the clicked filter
    if (activePopup !== filterType) {
      // Get the corresponding ref based on filter type
      let currentRef;
      if (filterType === 'location') currentRef = locationFilterRef;
      else if (filterType === 'specialty') currentRef = specialtyFilterRef;
      else if (filterType === 'language') currentRef = languageFilterRef;
      else if (filterType === 'price') currentRef = priceFilterRef;
      
      // Add active-popup class to the current filter element
      if (currentRef?.current) {
        currentRef.current.classList.add('active-popup');
      }
    }
    
    // Toggle the active popup state
    setActivePopup(activePopup === filterType ? null : filterType);
  };

  useEffect(() => {
    const initializeSupabase = async () => {
      // Log database connection status
      console.log('TherapistListing: Initializing connection to Supabase');
      console.log('Note: The practitioners table has RLS disabled');
      
      try {
        // Output the Supabase URL (but not the key for security)
        if (typeof window !== 'undefined' && (window as any).SUPABASE_URL) {
          console.log('Using Supabase URL:', (window as any).SUPABASE_URL);
        } else {
          console.log('Using default Supabase URL from browser-safe-supabase.ts');
        }
        
        // Run diagnostic test to verify connection
        console.log('Testing Supabase connection...');
        const diagnosticResult = await testSupabaseConnection();
        console.log('Connection test result:', diagnosticResult);
        
        if (!diagnosticResult.connection.success) {
          console.warn('Supabase connection test failed, attempting to fix...');
          const fixResult = await attemptSupabaseConnectionFix();
          console.log('Connection fix result:', fixResult);
          
          if (!fixResult.connection.success) {
            setError(`Database connection error: ${fixResult.connection.message || 'Unknown error'}`);
            // Use fallback data since connection failed
            setTherapists(FALLBACK_THERAPISTS);
            setLoading(false);
            return;
          }
        }
        
        // Connection is good, fetch practitioners
        console.log('Supabase connection established successfully, fetching practitioners...');
        fetchPractitioners();
      } catch (err) {
        console.error('Error during Supabase initialization:', err);
        setError('Failed to connect to database. Using sample data instead.');
        setTherapists(FALLBACK_THERAPISTS);
        setLoading(false);
      }
    };
    
    initializeSupabase();
  }, [filters]);

  async function fetchPractitioners() {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase client is available
      if (!supabase.from) {
        console.error('Supabase client is not properly initialized');
        console.log('Using fallback data instead');
        setTherapists(FALLBACK_THERAPISTS);
        setLoading(false);
        return;
      }
      
      console.log('Connecting to practitioners table in Supabase (RLS disabled)...');
      console.log('Current filter settings:', filters);
      
      try {
        // Build query with filters
        let query = supabase.from('practitioners').select('*');
        
        // Apply price range filter
        query = query.gte('price', filters.priceMin).lte('price', filters.priceMax);
        
        // Apply specialty filter if specified
        if (filters.specialty) {
          query = query.overlaps('conditions', [filters.specialty]);
        }
        
        // Apply location filter if specified
        if (filters.location) {
          query = query.eq('location_type', filters.location);
        }
           // First, do a simple count query to check if the table exists and has data
      console.log('Checking if practitioners table exists and has data...');
      const countCheck = await supabase
        .from('practitioners')
        .select('*', { count: 'exact', head: true });
        
      if (countCheck.error) {
        console.error('Error checking table:', countCheck.error);
        console.log('Table may not exist, attempting direct check...');
        
        try {
          // Try a direct SQL query to check if the table exists
          const tableCheck = await supabase.rpc('pg_execute', {
            query: `SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'practitioners'
            );`
          });
          
          console.log('Table existence check result:', tableCheck);
          
          if (tableCheck.error) {
            console.error('Could not check if table exists:', tableCheck.error);
            throw new Error('Unable to verify table structure');
          } else if (!tableCheck.data?.[0]?.exists) {
            console.log('Table does not exist, attempting to create...');
            const created = await createPractitionersTable();
            if (created) {
              console.log('Table created successfully! Fetching data...');
              await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
              // Re-run the fetch after creating the table
              return fetchPractitioners();
            } else {
              throw new Error('Failed to create practitioners table');
            }
          }
        } catch (e) {
          console.error('Error during table existence check:', e);
          throw e;
        }
      } else {
        console.log(`Practitioners table exists with ${countCheck.count || 0} records`);
        if (countCheck.count === 0) {
          console.log('Table exists but is empty, attempting to add sample data...');
          await createPractitionersTable(); // This will add sample data
        }
      }
      
      console.log('Executing Supabase query for practitioners with filters');
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
        
        if (data) {
          console.log(`Successfully fetched ${data.length} practitioners`);
          
          // Check if we got any practitioners back
          if (data.length === 0) {
            console.log('No practitioners found based on the current filters');
            console.log('Using fallback data since query returned empty results');
            setTherapists(FALLBACK_THERAPISTS);
            setLoading(false);
            return;
          }
          
          // Map practitioners to our therapist format with improved type checking
          const formattedTherapists = data.map((p: any) => {
            // Handle ID (could be number or string)
            const id = p.id ? String(p.id) : `fallback-${Math.random().toString(36).substr(2, 9)}`;
            
            // Handle name with fallback
            const name = typeof p.name === 'string' ? p.name : 'Unknown Practitioner';
            
            // Handle years_experience (might be missing in older schema)
            let experience;
            if (typeof p.years_experience === 'number') {
              experience = `${p.years_experience}+ years of experience`;
            } else if (typeof p.years_experience === 'string' && !isNaN(parseInt(p.years_experience))) {
              experience = `${parseInt(p.years_experience)}+ years of experience`;
            } else {
              experience = '5+ years of experience'; // Default
            }
            
            // Handle price formatting
            const price = typeof p.price === 'number' || !isNaN(Number(p.price)) 
              ? `$ ${Number(p.price || 0).toFixed(0)}/session` 
              : '$ 100/session'; // Default price
            
            // Handle specialisation/conditions with multiple fallbacks
            let specialisation;
            if (Array.isArray(p.conditions) && p.conditions.length > 0) {
              specialisation = p.conditions.join(', ');
            } else if (typeof p.conditions === 'string') {
              // Handle case where conditions might be a string
              specialisation = p.conditions;
            } else if (typeof p.specialty === 'string') {
              specialisation = p.specialty;
            } else {
              specialisation = 'general therapy';
            }
            
            // Handle languages with proper type checking
            let languages;
            if (Array.isArray(p.languages) && p.languages.length > 0) {
              languages = p.languages.join(', ');
            } else if (typeof p.languages === 'string') {
              languages = p.languages;
            } else {
              languages = 'english'; // Default language
            }
            
            // Handle image_url with fallback
            const image = typeof p.image_url === 'string' && p.image_url.trim() !== '' 
              ? p.image_url 
              : `https://placehold.co/155x93?text=${encodeURIComponent(name.split(' ')[0] || 'Therapist')}`;
            
            return {
              id,
              name,
              experience,
              price,
              specialisation,
              languages,
              image
            };
          });
          
          // Log the first item for debugging
          if (formattedTherapists.length > 0) {
            console.log('Sample practitioner data:', formattedTherapists[0]);
          }
          
          setTherapists(formattedTherapists);
        }
      } catch (queryError) {
        console.error('Error executing Supabase query:', queryError);
        setError('Failed to fetch practitioners. Please try again later.');
        
        // Set fallback data in case of query error
        setTherapists(FALLBACK_THERAPISTS);
      }
    } catch (err: any) {
      console.error('Error fetching practitioners:', err);
      
      // Attempt to diagnose the specific issue
      let isConnectionIssue = false;
      let isStructureIssue = false;
      
      // Generate a user-friendly error message
      let errorMessage = 'Failed to load practitioners. Using sample data instead.';
      
      // Always show at least the fallback data
      setTherapists(FALLBACK_THERAPISTS);
      
      if (err && err.message) {
        if (err.message.includes('relation "practitioners" does not exist')) {
          errorMessage = 'The practitioners table does not exist. Attempting to create it...';
          const created = await createPractitionersTable();
          if (created) {
            // Table created successfully, try fetching again
            setError("Created practitioners table. Reloading data...");
            setTimeout(() => fetchPractitioners(), 2000);
            return;
          } else {
            errorMessage = 'The practitioners table does not exist. Please run the setup script.';
          }
          isStructureIssue = true;
        } else if (err.message.includes('column') && err.message.includes('does not exist')) {
          errorMessage = 'Database schema issue: Some required columns are missing in the practitioners table. Click "Update Schema" to fix this issue.';
          isStructureIssue = true;
        } else if (err.message.includes('supabase') || err.message.includes('database') || err.message.includes('connection')) {
          errorMessage = 'Database connection error. Please check your Supabase configuration.';
          isConnectionIssue = true;
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
          isConnectionIssue = true;
        }
      }
      
      setError(errorMessage);
      
      // If it's a connection issue, attempt to fix it
      if (isConnectionIssue) {
        console.log('Attempting to fix connection issues...');
        const fixed = await attemptSupabaseConnectionFix();
        if (fixed) {
          console.log('Connection fixed, retrying fetch...');
          fetchPractitioners();
          return;
        }
      }
      
      // Show specific UI for structure issues
      if (isStructureIssue) {
        console.log('Schema structure issue detected. Consider running update-practitioners-schema.js');
      }
      
      // Set fallback data with more varied examples
      setTherapists(FALLBACK_THERAPISTS);
    } finally {
      setLoading(false);
    }
  }
  
  async function createPractitionersTable() {
    try {
      console.log("Attempting to create practitioners table...");
      if (!supabase.rpc) {
        console.error("Supabase client missing RPC method");
        return false;
      }
      
      // Create practitioners table
      const createTableResult = await supabase.rpc('pg_execute', {
        query: `
          CREATE TABLE IF NOT EXISTS public.practitioners (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            specialty TEXT,
            price NUMERIC DEFAULT 100,
            location_type TEXT DEFAULT 'online',
            rating NUMERIC DEFAULT 4.5,
            reviews INTEGER DEFAULT 0,
            conditions TEXT[] DEFAULT ARRAY['general therapy'],
            image_url TEXT,
            badge TEXT,
            years_experience INTEGER DEFAULT 5,
            languages TEXT[] DEFAULT ARRAY['English'],
            education TEXT,
            degree TEXT,
            calendly_link TEXT,
            user_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `
      });
      
      if (createTableResult.error) {
        console.error("Error creating table:", createTableResult.error);
        return false;
      }
      
      // Insert sample data if needed
      console.log("Table created, adding sample data...");
      const { error: insertError } = await supabase
        .from('practitioners')
        .insert([
          {
            name: 'Dr. Sarah Johnson',
            specialty: 'Clinical Psychologist',
            reviews: 48,
            rating: 4.9,
            price: 120,
            image_url: 'https://randomuser.me/api/portraits/women/22.jpg',
            badge: 'top rated',
            education: 'PhD in Clinical Psychology',
            degree: 'PhD',
            location_type: 'both',
            conditions: ['anxiety', 'depression', 'stress'],
            years_experience: 10,
            languages: ['English', 'Spanish']
          },
          {
            name: 'Dr. Michael Chen',
            specialty: 'Cognitive Behavioral Therapist',
            reviews: 36,
            rating: 4.7,
            price: 100,
            image_url: 'https://randomuser.me/api/portraits/men/62.jpg',
            badge: 'experienced',
            education: 'PsyD in Clinical Psychology',
            degree: 'PsyD',
            location_type: 'online',
            conditions: ['anxiety', 'trauma', 'OCD'],
            years_experience: 8,
            languages: ['English', 'Mandarin']
          }
        ]);
        
      if (insertError) {
        console.error("Error inserting sample data:", insertError);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in createPractitionersTable:", err);
      return false;
    }
  }
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Remove active-popup class when selection is made
    document.querySelectorAll('.InputBar').forEach(el => {
      el.classList.remove('active-popup');
    });
    setActivePopup(null);
  };

  // Handle specialty selection
  const handleSpecialtySelect = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialty: prev.specialty === specialty ? '' : specialty
    }));
    // Remove active-popup class when selection is made
    document.querySelectorAll('.InputBar').forEach(el => {
      el.classList.remove('active-popup');
    });
    setActivePopup(null);
  };
  
  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setFilters(prev => ({
      ...prev,
      language: prev.language === language ? '' : language
    }));
    // Remove active-popup class when selection is made
    document.querySelectorAll('.InputBar').forEach(el => {
      el.classList.remove('active-popup');
    });
    setActivePopup(null);
  };
  
  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setFilters(prev => ({
      ...prev,
      location: prev.location === location ? '' : location
    }));
    // Remove active-popup class when selection is made
    document.querySelectorAll('.InputBar').forEach(el => {
      el.classList.remove('active-popup');
    });
    setActivePopup(null);
  };
  
  // We're using handleFilterChange for price range changes

  // Handle booking button click with visual feedback
  const handleBookNowClick = (e: React.MouseEvent<HTMLDivElement>, therapistId: string) => {
    e.stopPropagation(); // Prevent triggering parent's onClick
    setBookingInProgress(therapistId); // Set booking in progress for this therapist
    
    // Small delay to show the visual feedback before navigation
    setTimeout(() => {
      navigate(`/practitioner/${therapistId}`);
    }, 300);
  };

  // Handle therapist card click (navigate to details page)
  const handleTherapistClick = (therapistId: string) => {
    console.log(`Navigating to practitioner/${therapistId}`);
    navigate(`/practitioner/${therapistId}`);
  };
  
  return (
    <div id="therapist-page" className="Main" data-testid="therapist-listing-page" role="main" aria-label="Therapist Listing">
      <BackgroundEmbed 
        src="https://www.vectary.com/viewer/v1/viewer.html?model=e21f0b71-96ec-43e9-ba0c-77e6e269130f&env=studio3"
        title="Background 3D Animation"
        className="therapist-background-embed"
        data-name="therapist-background"
        aria-hidden="true"
        overlayColor="#ffffff"
        overlayOpacity={0.3}
      />
      <div className="Frame126" data-testid="therapist-header-section" role="banner">
        <div className="FindSomeoneWhoHelpsYouUnderstandYourself" data-name="page-title" role="heading" aria-level={1}>
          find someone who helps you understand yourself
        </div>
        <div className="Frame124" data-testid="filter-container" role="group" aria-label="Therapist filters">
          <div 
            className={`InputBar ${filters.location ? 'active' : ''}`} 
            onClick={() => toggleFilterPopup('location')}
            ref={locationFilterRef}
            data-testid="location-filter"
            data-name="location-filter"
            role="button"
            aria-haspopup="true" 
            aria-expanded={activePopup === 'location'}
            aria-label="Filter by location"
          >
            <div className="SelectCenter" data-name="location-filter-label">
              {filters.location ? `${filters.location}` : 'select center'}
              {activePopup === 'location' && (
                <div 
                  className="filter-popup location-popup" 
                  data-testid="location-dropdown"
                  role="listbox"
                  aria-label="Location options"
                >
                  {locationOptions.map(option => (
                    <div 
                      key={option}
                      className={`filter-option ${filters.location === option ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(option);
                      }}
                      data-testid={`location-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      data-name={`location-${option}`}
                      role="option"
                      aria-selected={filters.location === option}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div 
            className={`InputBar ${filters.specialty ? 'active' : ''}`} 
            onClick={() => toggleFilterPopup('specialty')}
            ref={specialtyFilterRef}
            data-testid="specialty-filter"
            data-name="specialty-filter"
            role="button"
            aria-haspopup="true"
            aria-expanded={activePopup === 'specialty'}
            aria-label="Filter by specialty"
          >
            <div className="Specialisation" data-name="specialty-filter-label">
              {filters.specialty ? `${filters.specialty}` : 'specialisation'}
              {activePopup === 'specialty' && (
                <div 
                  className="filter-popup specialty-popup"
                  data-testid="specialty-dropdown"
                  role="listbox"
                  aria-label="Specialty options"
                >
                  {specialtyOptions.map(option => (
                    <div 
                      key={option}
                      className={`filter-option ${filters.specialty === option ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpecialtySelect(option);
                      }}
                      data-testid={`specialty-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      data-name={`specialty-${option}`}
                      role="option"
                      aria-selected={filters.specialty === option}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div 
            className={`InputBar ${filters.language ? 'active' : ''}`}
            onClick={() => toggleFilterPopup('language')}
            ref={languageFilterRef}
            data-testid="language-filter"
            data-name="language-filter"
            role="button"
            aria-haspopup="true"
            aria-expanded={activePopup === 'language'}
            aria-label="Filter by language"
          >
            <div className="Languages" data-name="language-filter-label">
              {filters.language ? `${filters.language}` : 'languages'}
              {activePopup === 'language' && (
                <div 
                  className="filter-popup language-popup"
                  data-testid="language-dropdown"
                  role="listbox"
                  aria-label="Language options"
                >
                  {languageOptions.map(option => (
                    <div 
                      key={option}
                      className={`filter-option ${filters.language === option ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageSelect(option);
                      }}
                      data-testid={`language-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      data-name={`language-${option}`}
                      role="option"
                      aria-selected={filters.language === option}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div 
            className={`InputBar ${(filters.priceMin > 0 || filters.priceMax < 1000) ? 'active' : ''}`}
            onClick={() => toggleFilterPopup('price')}
            ref={priceFilterRef}
            data-testid="price-filter"
            data-name="price-filter"
            role="button"
            aria-haspopup="true"
            aria-expanded={activePopup === 'price'}
            aria-label="Filter by price range"
          >
            <div className="Price" data-name="price-filter-label">
              {(filters.priceMin > 0 || filters.priceMax < 1000) ? 
                `$${filters.priceMin}-$${filters.priceMax}` : 'price range'}
              {activePopup === 'price' && (
                <div 
                  className="filter-popup price-popup"
                  data-testid="price-dropdown"
                  role="dialog"
                  aria-label="Price range selector"
                >
                  <div className="price-range" data-name="price-range-controls" role="group" aria-label="Price range sliders">
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="100"
                      value={filters.priceMin}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        // Ensure min doesn't exceed max
                        const min = Math.min(newMin, filters.priceMax - 100);
                        handleFilterChange('priceMin', min);
                      }}
                      data-testid="price-min-slider"
                      data-name="price-min-slider"
                      aria-label="Minimum price"
                      aria-valuemin={0}
                      aria-valuemax={1000}
                      aria-valuenow={filters.priceMin}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="100"
                      value={filters.priceMax}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        // Ensure max doesn't go below min
                        const max = Math.max(newMax, filters.priceMin + 100);
                        handleFilterChange('priceMax', max);
                      }}
                      data-testid="price-max-slider"
                      data-name="price-max-slider"
                      aria-label="Maximum price"
                      aria-valuemin={0}
                      aria-valuemax={1000}
                      aria-valuenow={filters.priceMax}
                    />
                    <div className="price-labels">
                      <span>${filters.priceMin}</span>
                      <span>${filters.priceMax}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="Frame125">
        {loading ? (
          <div 
            className="loading-container"
            data-testid="loading-container"
            data-name="loading-state"
            role="status"
            aria-live="polite"
          >
            <div className="loader">
              <div className="loader-circle"></div>
              <div className="loader-line-mask">
                <div className="loader-line"></div>
              </div>
              <svg className="loader-logo" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 30c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" fill="#148BAF"/>
              </svg>
            </div>
            <p className="loader-text" data-name="loading-message">finding your match...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <svg className="error-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 26C22.9 26 22 25.1 22 24V16C22 14.9 22.9 14 24 14C25.1 14 26 14.9 26 16V24C26 25.1 25.1 26 24 26ZM26 34H22V30H26V34Z" fill="#ff4d4d"/>
            </svg>
            <p className="error-message">{error}</p>
            <div className="button-group">
              <button className="retry-button" onClick={fetchPractitioners}>Try Again</button>
              {error && error.includes('required columns are missing') && (
                <button 
                  className="update-schema-button"
                  onClick={() => {
                    alert('To update the practitioners table schema, please run the update-practitioners-schema.js script on the server with the proper credentials.');
                    // In a production environment, you could have an endpoint to trigger this
                    // For example:
                    // fetch('/api/update-practitioners-schema')
                    //   .then(response => response.json())
                    //   .then(data => {
                    //     if (data.success) {
                    //       alert('Schema updated successfully! Refreshing data...');
                    //       fetchPractitioners();
                    //     }
                    //   });
                  }}
                >
                  Update Schema
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2 className="therapist-section-title">Our Therapists</h2>
            <div className="Frame17" data-testid="therapist-grid" role="region" aria-label="Therapist listings">
              {/* Render therapist cards in a 2-column grid */}
              {therapists.length > 0 ? (
              therapists.map((t, i) => (
                <div 
                  key={i} 
                  className="therapist-card" 
                  onClick={() => handleTherapistClick(t.id)}
                  data-testid={`therapist-card-${i}`}
                  data-name={`therapist-${t.id}`}
                  role="button"
                  aria-label={`View details for ${t.name}`}
                  tabIndex={0}
                >
                  <img
                    className="Frame44"
                    src={t.image}
                    alt={`Profile photo of ${t.name}`}
                    data-testid={`therapist-image-${i}`}
                    data-name="therapist-photo"
                  />
                  <div 
                    className="AndrewSchulz" 
                    data-testid={`therapist-name-${i}`}
                    data-name="therapist-name"
                    aria-label="Therapist name"
                  >
                    {t.name}
                  </div>
                  <div 
                    className="YearsOfExpereince" 
                    data-testid={`therapist-experience-${i}`}
                    data-name="therapist-experience"
                    aria-label="Experience"
                  >
                    {t.experience}
                  </div>
                  <div 
                    className="Frame5" 
                    data-testid={`therapist-price-${i}`}
                    data-name="therapist-price-container"
                    aria-label="Pricing information"
                  >
                    <span className="Vector" aria-hidden="true">
                      <Vector type="meet" width={14} height={13} />
                      <Vector type="video" width={16} height={9} />
                    </span>
                    <span 
                      className="900Session"
                      data-name="price-value"
                    >
                      {t.price}
                    </span>
                  </div>
                  <div 
                    className="Frame72"
                    data-testid={`therapist-specialization-${i}`}
                    data-name="therapist-specialization"
                    aria-label="Specialization"
                  >
                    <Vector type="expertise" width={15} height={13} color="#148BAF" aria-hidden="true" />
                    <span 
                      className="DepressionAnxietyEmotional" 
                      title={t.specialisation} 
                      ref={el => specialisationRefs.current[i] = el}
                      data-name="specialization-value"
                    >
                      {t.specialisation}
                    </span>
                  </div>
                  <div 
                    className="Frame73"
                    data-testid={`therapist-languages-${i}`}
                    data-name="therapist-languages"
                    aria-label="Languages spoken"
                  >
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9.68556 1.21975C9.54488 1.07464 9.49118 0.866017 9.54445 0.670903C9.59783 0.475892 9.7501 0.323543 9.94502 0.270243C10.1399 0.216944 10.3486 0.270563 10.4936 0.411421C11.132 1.04995 11.5911 1.84553 11.8248 2.71793C12.0584 3.59042 12.0584 4.50898 11.8248 5.38147C11.5911 6.25385 11.132 7.04942 10.4936 7.68806C10.3487 7.82945 10.1397 7.8835 9.94447 7.8303C9.74914 7.777 9.59655 7.62434 9.54339 7.42902C9.49012 7.23358 9.54424 7.02452 9.68556 6.87952C10.4357 6.12905 10.857 5.11112 10.857 4.04976C10.857 2.98832 10.4357 1.97041 9.68556 1.21975ZM8.06949 6.07092C8.17657 6.17816 8.32192 6.23848 8.47346 6.23848C8.62499 6.23848 8.77034 6.17826 8.87743 6.07102C9.41261 5.53451 9.71311 4.80755 9.71311 4.04964C9.71311 3.29184 9.41261 2.56488 8.87743 2.02837C8.73228 1.88815 8.52398 1.83485 8.32937 1.88825C8.13478 1.94166 7.98273 2.0938 7.92935 2.28848C7.87608 2.48317 7.92924 2.69159 8.0695 2.83681C8.39041 3.15873 8.57065 3.59493 8.57065 4.04963C8.57065 4.50432 8.39041 4.94052 8.0695 5.26245C7.96231 5.36969 7.90202 5.51501 7.90202 5.66673C7.90202 5.81833 7.96241 5.96366 8.06949 6.07092ZM3.99984 6.53275C4.75758 6.53275 5.48438 6.23155 6.02021 5.69548C6.55604 5.1594 6.85706 4.43222 6.85706 3.67409C6.85706 2.91586 6.55601 2.18881 6.02021 1.65271C5.4844 1.11661 4.75758 0.815441 3.99984 0.815441C3.24199 0.815441 2.5153 1.11664 1.97947 1.65271C1.44364 2.18879 1.14262 2.91586 1.14262 3.67409C1.14262 4.43222 1.44367 5.15938 1.97947 5.69548C2.51528 6.23158 3.24199 6.53275 3.99984 6.53275ZM0.571264 12.25H7.42869C7.58021 12.25 7.72557 12.1897 7.83277 12.0824C7.93985 11.9752 8.00014 11.8299 8.00014 11.6782V11.1064C8.00014 10.4999 7.75929 9.91829 7.33065 9.48933C6.9019 9.06048 6.32058 8.8195 5.71436 8.8195H2.28578C1.67955 8.8195 1.09812 9.06048 0.669491 9.48933C0.240858 9.91829 0 10.4999 0 11.1064V11.6782C0 11.8299 0.0601847 11.9752 0.16737 12.0824C0.274556 12.1897 0.419729 12.25 0.571264 12.25Z" fill="#148BAF"/>
                    </svg>
                    <span 
                      className="EnglishHindiMarathi" 
                      ref={el => languageRefs.current[i] = el}
                      data-name="languages-value"
                    >
                      {t.languages}
                    </span>
                  </div>
                  <div 
                    className="Frame6" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent's onClick
                      handleBookNowClick(e, t.id);
                    }}
                    data-testid={`book-now-button-${i}`}
                    data-name="book-now-button"
                    role="button"
                    tabIndex={0}
                    aria-label={`Book a session with ${t.name}`}
                  >
                    <span className="BookNow">book now</span>
                    {bookingInProgress === t.id && (
                      <div 
                        className="booking-spinner"
                        data-testid="booking-spinner"
                        aria-label="Booking in progress"
                        role="status"
                        aria-live="assertive"
                      >
                        <div className="spinner-circle"></div>
                        <div className="spinner-line-mask">
                          <div className="spinner-line"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div 
                className="no-therapists-message"
                data-testid="no-results-container"
                data-name="empty-state"
                role="status"
                aria-live="polite"
              >
                <svg className="no-results-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 29C21.79 29 20 27.21 20 25C20 22.79 21.79 21 24 21C26.21 21 28 22.79 28 25C28 27.21 26.21 29 24 29ZM14 15C14 12.24 18.69 10 24 10C29.31 10 34 12.24 34 15V17C34 19.76 29.31 22 24 22C18.69 22 14 19.76 14 17V15Z" fill="#148BAF" opacity="0.7"/>
                </svg>
                <p 
                  className="no-results-text"
                  data-testid="no-results-message"
                  data-name="empty-state-message"
                >
                  No therapists found matching your criteria. Please adjust your filters and try again.
                </p>
                <button 
                  className="reset-filters-button"
                  onClick={() => setFilters({
                    priceMin: 0,
                    priceMax: 1000,
                    specialty: '',
                    location: '',
                    language: ''
                  })}
                  data-testid="reset-filters-button"
                  data-name="reset-filters"
                  aria-label="Reset all filters"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          </>
        )}
      </div>
      <div className="page-bottom-spacer" data-name="page-bottom-spacer" aria-hidden="true" />
    </div>
  );
};

export default TherapistListing_New;
