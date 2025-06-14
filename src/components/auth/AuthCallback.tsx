import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthCallback() {
  const navigate = useNavigate();
  const { setAuthLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Processing your login...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Set loading state in auth context
        setAuthLoading(true);
        
        // Extract the hash or query params
        const hashParams = window.location.hash;
        const queryParams = window.location.search;

        console.log('Auth callback triggered');
        setStatus("Establishing secure session...");

        // Get the session from URL params (needed for OAuth)
        if (hashParams || queryParams) {
          const { data: { session }, error: sessionError } = 
            await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            setStatus("Session confirmed! Redirecting...");
            console.log('Session established in callback');
            
            // Wait a moment for the session to be fully processed
            setTimeout(() => navigate('/', { replace: true }), 1000);
          } else {
            throw new Error('No session found in auth callback');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(`Authentication error: ${(err as Error).message}`);
        setStatus("Authentication failed");
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setAuthLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, setAuthLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FCFD]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {error ? (
          <div className="text-center">
            <h2 className="text-xl text-red-600 font-happy-monkey">Authentication Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting you to login...</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl text-[#06C4D5] font-happy-monkey">Completing Login</h2>
            <div className="mt-4 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
            <p className="mt-4 text-sm text-gray-700">{status}</p>
            <p className="mt-2 text-xs text-gray-500">This will only take a moment</p>
          </div>
        )}
      </div>
    </div>
  );
}