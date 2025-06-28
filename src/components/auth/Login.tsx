import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GithubIcon, Mail } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { signIn, signInWithProvider, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from state or default to dashboard
  const from = (location.state as { from?: string })?.from || '/';

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Attempt sign in with extended session duration
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      
      // If rememberMe is false, we could set a shorter session expiry
      // But we're keeping the extended session by default for better UX
      
      // Navigate to the redirect path or dashboard
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    }
  };

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    try {
      await signInWithProvider(provider);
      // The redirect will be handled by the OAuth provider
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FCFD] px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-happy-monkey text-[#06C4D5] lowercase">Welcome to Caktus Coco</h2>
          <p className="text-gray-600 mt-2">Sign in to continue your wellbeing journey</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-[#06C4D5] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-[#06C4D5] focus:ring-[#06C4D5] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white py-2.5"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </Button>
          </form>
          
          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleProviderSignIn('google')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
        </div>
        
        {/* Registration Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#06C4D5] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}