import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-simple';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/useToast';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (data.session) {
          toast({
            title: "Success",
            description: "Email verified successfully. You can now log in."
          });
          navigate('/login');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#49DAEA] to-[rgba(196,254,255,0.2)]">
      <div className="text-center">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto relative">
            <button
              onClick={() => navigate('/login')}
              className="absolute right-3 top-3 p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 active:scale-95"
              aria-label="Close and go to login"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-red-600 font-happy-monkey mb-4 pr-8">
              <h3 className="text-lg mb-2">Authentication Error</h3>
              <p>{error}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#148BAF] text-white px-4 py-2 rounded font-happy-monkey hover:bg-[#1079A0] transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-[#148BAF] px-4 py-2 border border-[#148BAF] rounded font-happy-monkey hover:bg-[#148BAF] hover:text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[#148BAF] font-happy-monkey">Verifying your account...</p>
          </>
        )}
      </div>
    </div>
  );
};