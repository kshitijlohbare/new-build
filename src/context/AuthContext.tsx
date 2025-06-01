import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase-simple';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>; // Added resetPassword
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>; // Added updatePassword
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes including PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      // Set session and user based on event
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle specific events if needed, e.g., PASSWORD_RECOVERY
      if (event === 'PASSWORD_RECOVERY') {
        // This event signifies the user has clicked the reset link
        // The ResetPassword component will handle the actual update
        console.log('Password recovery event detected');
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('SignIn attempt for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('SignIn result:', error ? 'Error occurred' : 'Success');
      
      if (data?.session) {
        console.log('Setting session after successful signin');
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('SignUp attempt for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      console.log('SignUp result:', error ? 'Error occurred' : 'Success');
      
      if (data?.session) {
        console.log('Setting session after successful signup');
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('SignOut attempt');
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      console.log('SignOut successful');
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Password reset attempt for:', email);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      console.log('Password reset result:', error ? 'Error occurred' : 'Success');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    console.log('Attempting to update password');
    setLoading(true);
    try {
      // Supabase client automatically uses the session from the URL fragment
      const { data, error } = await supabase.auth.updateUser({ password });
      console.log('Password update result:', error ? 'Error occurred' : 'Success', data);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    resetPassword, // Expose resetPassword
    updatePassword, // Expose updatePassword
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}