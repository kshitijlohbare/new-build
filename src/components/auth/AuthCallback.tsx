import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
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
          <div className="text-red-500 font-happy-monkey mb-4">{error}</div>
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