import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Registration Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Registration Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp(email, password);

      if (error) {
        console.error('Registration error:', error);
        let errorMessage = error.message || "Failed to create account. Please try again.";
        // Check for specific Supabase error for existing user (this might vary slightly based on Supabase version/config)
        if (error.message?.toLowerCase().includes('user already registered')) {
          errorMessage = "An account with this email already exists. Please log in or reset your password.";
        }
        toast({
          title: "Registration Error",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Registration successful! Please check your email to verify your account."
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FCFD] px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-happy-monkey text-[#06C4D5] lowercase">Join Caktus Coco</h2>
          <p className="text-gray-600 mt-2">Create an account to start your wellbeing journey</p>
        </div>
        
        {/* Register Form */}
        <Card className="w-full max-w-md p-8">
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
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-happy-monkey text-[#148BAF]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-happy-monkey text-[#148BAF]">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
                placeholder="Confirm your password"
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="text-[#148BAF] font-happy-monkey"
                disabled={loading}
              >
                Already have an account? Login
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};