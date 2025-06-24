import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PracticeProvider } from "./context/PracticeContext"; // Import the new provider
import { AchievementProvider } from "./context/AchievementContext"; // Import the achievement provider
import { ProfileProvider } from "./context/ProfileContext"; // Import the profile provider
import { SidebarProvider } from "./context/SidebarContext"; // Import the sidebar provider
import { useEffect, useState, lazy, Suspense } from "react";
import { checkUserProfileTables } from "./scripts/profileUtils";
import { ensureDatabaseTables } from "./scripts/ensureDatabaseTables";
import { createSQLFunctions } from "./scripts/createSQLFunctions";
import { ToastProvider, ToastViewport, Toaster } from "./components/ui/toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ForgotPassword } from "./components/auth/ForgotPassword"; // Import ForgotPassword
import { ResetPassword } from "./components/auth/ResetPassword"; // Import ResetPassword
import AppLayout from "./components/layout/AppLayout";
import ResponsiveHome from "./pages/ResponsiveHome"; // Import the new responsive home component
import Practices from "./pages/Practices";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Appointments from "./pages/Appointments";
import TherapistListing from "./pages/TherapistListing_New";
import PractitionerListing from "./pages/PractitionerListing"; // Import our new PractitionerListing page
import TherapyBooking from "./pages/TherapyBooking";
import Booking from "./pages/Booking"; // Import the Booking page
import Community from "./pages/Community"; // Import the Community page for fitness groups
import FitnessGroups from "./pages/FitnessGroups"; // Import the FitnessGroups page
import SocialFeed from "./pages/SocialFeed"; // Import the new SocialFeed UI
import PractitionerDetail from "./pages/PractitionerDetail"; // Import the new PractitionerDetail page
import TherapistRegistration from "./pages/TherapistRegistration";
// Import lazy loaded versions of Fitness Groups
const FitnessGroupsNew = lazy(() => import("./pages/FitnessGroups.new"));
const FitnessGroupsUpdated = lazy(() => import("./pages/FitnessGroups.updated"));
// Ensure we load the correct FocusTimer with explicit path
import FocusTimer from "./pages/FocusTimer";
import PractitionerOnboarding from "./pages/PractitionerOnboarding"; // Import PractitionerOnboarding
import PractitionerEditProfile from "./pages/PractitionerEditProfile"; // Import PractitionerEditProfile
import { Home as Learn } from "./pages/Learn"; // Import Learn using named import
import TestPage from "./pages/TestPage"; // Import TestPage for debugging
import LandingPage from "./pages/LandingPage"; // Import the new LandingPage
import FlashScreen from "./pages/FlashScreen";
import './App.css';
import './styles/TherapistsCardsFix.css'; // Import therapist cards margin fix
import React from "react"; // Make sure React is imported

// Simple Favicon component directly in App.tsx to avoid import errors
function Favicon() {
  React.useEffect(() => {
    // Look for existing favicon link
    const existingLink = document.querySelector('link[rel="icon"]');
    
    if (existingLink) {
      // Update existing link
      existingLink.setAttribute('href', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌵</text></svg>');
    } else {
      // Create new link element
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌵</text></svg>';
      document.head.appendChild(link);
    }
  }, []);
  return null;
}

// Set document title
document.title = "Caktus Coco | Your Wellness Companion";

// Create a new query client with error handling for React Query v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1
    }
  }
});

// Add global error handler for React Query
queryClient.setDefaultOptions({
  queries: {
    retry: 1,
  },
  mutations: {
    onError: (error: unknown) => {
      console.error('Mutation error:', error);
    }
  }
});

// ErrorBoundary component to catch rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <h2 className="text-xl text-red-600 font-bold mb-4">Something went wrong</h2>
          <div className="bg-red-50 border border-red-200 p-4 rounded-md max-w-lg mb-4 overflow-auto">
            <pre className="text-xs text-red-700">{String(this.state.error)}</pre>
          </div>
          <button 
            onClick={() => { 
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  // Flash screen state - disabled by default (for testing only)
  const [showFlash] = useState(false); // Flash screen disabled
  const [initError, setInitError] = useState<string | null>(null);

  // Flash screen disabled - no need for the timer effect
  /* 
  useEffect(() => {
    console.log('App mounted - showing flash screen');
    // Show flash screen then main content
    const flashTimer = setTimeout(() => {
      console.log('Flash screen timer expired - hiding flash screen');
      setShowFlash(false);
    }, 2000); // Flash screen duration
    
    return () => clearTimeout(flashTimer);
  }, []);
  */

  // Initialize necessary tables when app loads
  useEffect(() => {
    const initTables = async () => {
      try {
        console.log("Starting database initialization...");
        
        // First check and create the necessary SQL functions
        try {
          await createSQLFunctions();
          console.log("SQL functions created successfully");
        } catch (functionError) {
          console.warn("Could not create SQL functions, continuing with table checks:", functionError);
        }
        
        // Now ensure all database tables exist
        try {
          const tablesResult = await ensureDatabaseTables();
          if (tablesResult) {
            console.log("Database tables verified/created successfully");
          } else {
            console.warn("Some database tables may not have been created properly");
          }
        } catch (tablesError) {
          console.warn("Error ensuring database tables, continuing with profile check:", tablesError);
        }
        
        // Finally check user profile tables
        const profileResult = await checkUserProfileTables();
        if (profileResult) {
          console.log("User profile tables verification complete");
        } else {
          console.warn("User profile tables check failed");
        }
      } catch (error) {
        console.error("Error initializing database tables:", error);
        setInitError(String(error));
      }
    };
    initTables();
  }, []);

  // Show initialization error if one occurred
  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F9FCFD]">
        <h2 className="text-xl text-red-600 font-bold mb-4">Initialization Error</h2>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md max-w-lg mb-4">
          <p className="text-sm text-red-700">{initError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#06C4D5] text-white rounded-md"
        >
          Reload Application
        </button>
      </div>
    );
  }
  
  // Flash screen disabled, but code kept for reference 
  if (showFlash) {
    console.log('Rendering FlashScreen component');
    return <FlashScreen />;
  }

  // Always render main app content
  console.log('Rendering main app content');
  return (
    <ErrorBoundary>
      <Favicon />
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Toaster />
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <PracticeProvider> {/* Wrap with PracticeProvider */}
                  <AchievementProvider> {/* Wrap with AchievementProvider */}
                    <ProfileProvider> {/* Wrap with ProfileProvider */}
                      <SidebarProvider> {/* Wrap with SidebarProvider */}
                      <Routes>
                        {/* Landing page for non-logged-in users */}
                        <Route path="/welcome" element={<LandingPage />} />
                        
                        {/* Auth routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route for ForgotPassword */}
                        <Route path="/reset-password" element={<ResetPassword />} /> {/* Add route for ResetPassword */}
                        
                        {/* Protected routes */}
                        <Route path="/" element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }>
                          <Route index element={<ResponsiveHome />} />
                          <Route path="dashboard" element={<Navigate to="/" replace />} />
                          <Route path="practices" element={<Practices />} />
                          <Route path="progress" element={<Progress />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="appointments" element={<Appointments />} />
                          <Route path="therapist-listing" element={<TherapistListing />} />
                          <Route path="practitioner-listing" element={<PractitionerListing />} /> {/* New practitioners listing page */}
                          <Route path="practitioner/:id" element={<PractitionerDetail />} /> {/* New detailed practitioner page */}
                          <Route path="therapy-booking" element={<TherapyBooking />} />
                          <Route path="therapy-booking/:id" element={<TherapyBooking />} />
                          <Route path="booking" element={<Booking />} /> {/* Add the new booking route */}
                          <Route path="therapist-registration" element={<TherapistRegistration />} />
                          <Route path="focus-timer" element={<FocusTimer />} />
                          <Route path="practitioner-onboarding" element={<PractitionerOnboarding />} />
                          <Route path="practitioner-edit-profile" element={<PractitionerEditProfile />} />
                          <Route path="learn" element={<Learn />} /> {/* Add the learn page route */}
                          <Route path="fitness-groups" element={<Community />} /> {/* Add the fitness groups route */}
                          <Route path="fitness" element={<FitnessGroups />} /> {/* Direct access to Fitness Groups page */}
                          <Route path="social" element={<SocialFeed />} /> {/* New social feed UI based on the image */}
                          <Route path="fitness-new" element={
                            <ProtectedRoute>
                              {/* Special route to see the updated fitness groups implementation */}
                              <div style={{height: '100%', width: '100%'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                  <FitnessGroupsNew />
                                </Suspense>
                              </div>
                            </ProtectedRoute>
                          } /> {/* Access to new version of Fitness Groups */}
                          <Route path="fitness-updated" element={
                            <ProtectedRoute>
                              {/* Special route to see the updated fitness groups implementation */}
                              <div style={{height: '100%', width: '100%'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                  <FitnessGroupsUpdated />
                                </Suspense>
                              </div>
                            </ProtectedRoute>
                          } /> {/* Access to updated version of Fitness Groups */}
                          <Route path="test" element={<TestPage />} /> {/* Add the test page route for debugging */}
                          <Route path="flash" element={<FlashScreen />} /> {/* Route kept for testing purposes only */}
                        </Route>
                        
                        {/* Redirect root for non-authenticated users to landing page */}
                        <Route path="*" element={<Navigate to="/welcome" replace />} />
                      </Routes>
                      </SidebarProvider>
                    </ProfileProvider>
                  </AchievementProvider>
                </PracticeProvider>
              </BrowserRouter>
            </QueryClientProvider>
            <ToastViewport />
          </ToastProvider>
          <style>{`
            /* Hide scrollbars for all browsers */
            html, body, * {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE and Edge */
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}</style>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
