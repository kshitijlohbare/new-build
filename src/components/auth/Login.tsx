import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    console.log('Login component - User state changed:', user);
    if (user) {
      const from = location.state?.from || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt for email:', email);
    
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        let errorMessage = "Failed to sign in. Please try again.";
        
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          errorMessage = "Your email address has not been confirmed. Please check your inbox for the confirmation link.";
        }
        
        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      console.log('Login successful');
      toast({
        title: "Success",
        description: "You have been signed in successfully"
      });
      
      // Navigation is handled by useEffect
    } catch (error: any) {
      console.error('Unexpected login error:', error);
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
        <h2 className="text-3xl font-happy-monkey text-center text-[#148BAF] mb-8">Login</h2>
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
              autoComplete="current-password"
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className="text-center space-y-2">
            <Button
              variant="link"
              onClick={() => navigate('/forgot-password')}
              className="text-[#148BAF] font-happy-monkey text-sm"
              disabled={loading}
              type="button"
            >
              Forgot Password?
            </Button>
            <Button
              variant="link"
              onClick={() => navigate('/register')}
              className="text-[#148BAF] font-happy-monkey"
              disabled={loading}
              type="button"
            >
              Don't have an account? Register
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};