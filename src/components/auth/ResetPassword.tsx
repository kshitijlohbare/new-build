import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecoveryEvent, setIsRecoveryEvent] = useState(false);
  const { updatePassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this is a password recovery flow on component mount
  useEffect(() => {
    // Supabase automatically handles the session from the URL fragment
    // when onAuthStateChange triggers with PASSWORD_RECOVERY
    // We just need to confirm we are in that state before allowing password update
    const handleAuthChange = (event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryEvent(true);
      }
    };

    // Listen for the specific event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      handleAuthChange(event);
    });

    // Initial check in case the event fired before the listener was attached
    // (This part might need adjustment based on exact Supabase client behavior)
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session?.user?.recovery_sent_at) { // Check if recovery was initiated
    //     setIsRecoveryEvent(true);
    //   }
    // });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRecoveryEvent) {
      toast({
        title: "Error",
        description: "Invalid password reset session. Please request a new reset link.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await updatePassword(password);

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update password. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Your password has been updated successfully. Please log in."
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Unexpected password update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading && !isRecoveryEvent) {
    // Show loading while verifying the auth state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authLoading && !isRecoveryEvent) {
    // If not loading and not a recovery event, redirect
    // This can happen if the user navigates directly to /reset-password
    navigate('/login');
    return null; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#49DAEA] to-[rgba(196,254,255,0.2)]">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-happy-monkey text-center text-[#148BAF] mb-8">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-happy-monkey text-[#148BAF]">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
              placeholder="Enter your new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-happy-monkey text-[#148BAF]">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
              placeholder="Confirm your new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#148BAF] text-white font-happy-monkey flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// Need to import supabase client for the useEffect listener
import { supabase } from '@/lib/supabase';