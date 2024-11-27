import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session check:', { session, error });
      if (error) {
        console.error('Error getting session:', error.message);
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', { event: _event, session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Starting sign up process in AuthContext...');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      console.log('Sign up response:', { authData, authError });

      if (authError) {
        console.error('Sign up error:', authError);
        throw authError;
      }

      // Wait for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && authData.user) {
        console.log('Creating athlete profile with session:', session);
        // Create athlete profile
        const { error: profileError } = await supabase
          .from('athletes')
          .insert([
            {
              auth_user_id: authData.user.id,
              email,
              name,
              role: 'athlete'
            }
          ])
          .select();

        console.log('Athlete profile creation result:', { profileError });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw the error here, just log it
          console.warn('Failed to create athlete profile, but user account was created');
        }
      } else {
        console.warn('No session available after signup');
      }
    } catch (error) {
      console.error('Sign up process error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Starting sign in process...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign in process error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    console.log('Starting Google sign in process...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }

      console.log('Google sign in successful:', data);
    } catch (error) {
      console.error('Google sign in process error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Starting sign out process...');
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Sign out response:', { error });
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Sign out process error:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
