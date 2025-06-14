import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await resetPassword(email);
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send password reset email. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Password reset email sent! Please check your inbox."
        });
        navigate('/login'); // Optionally redirect back to login
      }
    } catch (error: any) {
      console.error('Unexpected password reset error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#49DAEA] to-[rgba(196,254,255,0.2)]">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-happy-monkey text-center text-[#148BAF] mb-8">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6 font-happy-monkey lowercase">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-happy-monkey text-[#148BAF]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
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
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="text-[#148BAF] font-happy-monkey"
              disabled={loading}
              type="button"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};