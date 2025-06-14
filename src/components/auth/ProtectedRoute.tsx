import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, setAuthLoading } = useAuth();
  const location = useLocation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Helper functions
  const getSessionFromLocalStorage = () => {
    try {
      const storageKey = 'caktus_coco.auth.token';
      const localData = localStorage.getItem(storageKey);
      if (!localData) return null;
      
      const parsedData = JSON.parse(localData);
      return parsedData;
    } catch (error) {
      console.error('Error retrieving session from localStorage:', error);
      return null;
    }
  };

  const isTokenValid = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return !error && !!data?.session?.access_token;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  };

  // Quick check for existing session in localStorage
  const localSession = getSessionFromLocalStorage();
  const hasLocalSession = Boolean(localSession?.currentSession?.user);

  useEffect(() => {
    // Only run validation if we don't have a user yet
    if (!user) {
      const validateToken = async () => {
        try {
          setIsCheckingToken(true);
          console.log('ProtectedRoute - Validating token...');
          
          // Try to refresh the session
          try {
            await supabase.auth.refreshSession();
          } catch (e) {
            console.error('Error refreshing token:', e);
          }
          
          // Check if token is valid
          const valid = await isTokenValid();
          setHasValidToken(valid);
          
          if (valid) {
            console.log('ProtectedRoute - Valid token confirmed');
          } else {
            console.log('ProtectedRoute - Token validation failed, will redirect to login');
          }
        } catch (error) {
          console.error('ProtectedRoute - Error validating token:', error);
          setHasValidToken(false);
        } finally {
          setIsCheckingToken(false);
        }
      };
      
      validateToken();
    } else {
      // If we already have a user, no need to check token
      setIsCheckingToken(false);
      setHasValidToken(true);
    }
  }, [user, setAuthLoading]);

  // Show loading state during initial load or token checking
  if (loading || isCheckingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FCFD]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#06C4D5] font-happy-monkey animate-pulse">
          {hasLocalSession ? "Verifying your session..." : "Loading..."}
        </p>
      </div>
    );
  }

  // Redirect if no valid token or user
  if (!user && !hasValidToken) {
    console.log('ProtectedRoute - Redirecting to welcome page from:', location.pathname);
    return <Navigate to="/welcome" state={{ from: location.pathname }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};