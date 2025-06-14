import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, getSessionFromLocalStorage } from '@/lib/supabase';

// Ensure no imports for getSessionFromLocalStorage, signInWithExtendedSession, etc. here.
// These functions are defined locally or accessed via supabase.auth directly.

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: 'github' | 'google') => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null, data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (updatedPassword: string) => Promise<{ error: AuthError | null }>;
  setAuthLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Using imported getSessionFromLocalStorage from supabase module

  useEffect(() => {
    // Initialize auth session from stored tokens
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log('Initializing authentication state...');
        
        // Try to get session from localStorage first for immediate UI update
        // Using the imported getSessionFromLocalStorage function 
        try {
          const localSession = getSessionFromLocalStorage();
          if (localSession?.currentSession?.user) {
            console.log('Found user session in localStorage');
            setUser(localSession.currentSession.user);
          }
        } catch (e) {
          console.error('Error reading local session:', e);
        }
        
        // Get existing session from Supabase (server verification)
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (currentSession) {
          console.log('Valid session confirmed from Supabase');
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('No active session found');
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.error('Error retrieving session:', err);
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`Auth event: ${event}`);
        
        // Update state based on auth events
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // Cleanup function
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const setAuthLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in with email...');
      
      // Use direct sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      console.log(`Starting OAuth sign-in with ${provider}...`);
      
      // Use direct OAuth sign in
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  // Password reset functions
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (updatedPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: updatedPassword
      });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    setAuthLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);