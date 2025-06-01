import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PracticeProvider } from "./context/PracticeContext"; // Import the new provider
import { AchievementProvider } from "./context/AchievementContext"; // Import the achievement provider
import { ProfileProvider } from "./context/ProfileContext"; // Import the profile provider
import { useEffect, useState } from "react";
import { checkCommunityDelightsTable } from "./scripts/checkCommunityDelights";
import { checkUserProfileTables } from "./scripts/profileUtils";
import { ToastProvider, ToastViewport, Toaster } from "./components/ui/toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ForgotPassword } from "./components/auth/ForgotPassword"; // Import ForgotPassword
import { ResetPassword } from "./components/auth/ResetPassword"; // Import ResetPassword
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Practices from "./pages/Practices";
import Progress from "./pages/Progress";
import Meditation from "./pages/Meditation";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Appointments from "./pages/Appointments";
import TherapistListing from "./pages/TherapistListing";
import TherapyBooking from "./pages/TherapyBooking";
import Booking from "./pages/Booking"; // Import the Booking page
import PractitionerDetail from "./pages/PractitionerDetail"; // Import the new PractitionerDetail page
import TherapistRegistration from "./pages/TherapistRegistration";
import FocusTimer from "./pages/FocusTimer";
import PractitionerOnboarding from "./pages/PractitionerOnboarding"; // Import PractitionerOnboarding
import PractitionerEditProfile from "./pages/PractitionerEditProfile"; // Import PractitionerEditProfile
import Community from "./pages/Community"; // Import Community
import Learn from "./pages/Learn"; // Import Learn
import TestPage from "./pages/TestPage"; // Import TestPage for debugging
import SplashScreen from './components/ui/SplashScreen';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Always call all hooks at the top level, before any conditional return
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize necessary tables when app loads
  useEffect(() => {
    const initTables = async () => {
      try {
        // Check community delights table
        const communityResult = await checkCommunityDelightsTable();
        if (communityResult) {
          console.log("Community delights table verification complete");
        }
        // Check user profile tables
        const profileResult = await checkUserProfileTables();
        if (profileResult) {
          console.log("User profile tables verification complete");
        }
      } catch (error) {
        console.error("Error initializing database tables:", error);
      }
    };
    initTables();
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <PracticeProvider> {/* Wrap with PracticeProvider */}
                <AchievementProvider> {/* Wrap with AchievementProvider */}
                <ProfileProvider> {/* Wrap with ProfileProvider */}
                <Routes>
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
                    <Route index element={<Index />} />
                    <Route path="dashboard" element={<Navigate to="/" replace />} />
                    <Route path="practices" element={<Practices />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="meditation" element={<Meditation />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="therapist-listing" element={<TherapistListing />} />
                    <Route path="practitioner/:id" element={<PractitionerDetail />} /> {/* New detailed practitioner page */}
                    <Route path="therapy-booking" element={<TherapyBooking />} />
                    <Route path="therapy-booking/:id" element={<TherapyBooking />} />
                    <Route path="booking" element={<Booking />} /> {/* Add the new booking route */}
                    <Route path="therapist-registration" element={<TherapistRegistration />} />
                    <Route path="focus-timer" element={<FocusTimer />} />
                    <Route path="practitioner-onboarding" element={<PractitionerOnboarding />} />
                    <Route path="practitioner-edit-profile" element={<PractitionerEditProfile />} />
                    <Route path="community" element={<Community />} /> {/* Add the new community route */}
                    <Route path="learn" element={<Learn />} /> {/* Add the learn page route */}
                    <Route path="test" element={<TestPage />} /> {/* Add the test page route for debugging */}
                  </Route>

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
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
  );
};

export default App;
