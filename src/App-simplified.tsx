import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { ToastProvider, Toaster } from "./components/ui/toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import PractitionerOnboarding from "./pages/PractitionerOnboarding";
import SplashScreen from './components/ui/SplashScreen';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Skip database initialization for now to identify the issue
  console.log('App component rendering...');

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
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Practitioner Routes */}
                <Route path="/practitioner-onboarding" element={<PractitionerOnboarding />} />
                
                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Index />} />
                </Route>
                
                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
