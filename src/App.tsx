import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PracticeProvider } from "./context/PracticeContext"; // Import the new provider
import { ToastProvider, ToastViewport } from "./components/ui/toast";
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
import TherapistRegistration from "./pages/TherapistRegistration";
import FocusTimer from "./pages/FocusTimer";
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <PracticeProvider> {/* Wrap with PracticeProvider */}
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
                  <Route path="therapy-booking" element={<TherapyBooking />} />
                  <Route path="therapy-booking/:id" element={<TherapyBooking />} />
                  <Route path="therapist-registration" element={<TherapistRegistration />} />
                  <Route path="focus-timer" element={<FocusTimer />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PracticeProvider>
          </BrowserRouter>
        </QueryClientProvider>
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
