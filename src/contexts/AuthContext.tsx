import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'staff' | 'guest';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: { message: string } | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<Profile>,
  ) => Promise<{ error: { message: string } | null }>;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.warn('Profile not found for user:', userId);
        } else {
          console.error('Error fetching profile:', profileError);
        }
      } else if (profileData) {
        console.log('Profile loaded:', profileData.full_name);
        setProfile(profileData as unknown as Profile);
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        if (roleError.code === 'PGRST116') {
          console.warn('No role found for user, defaulting to guest:', userId);
          // CRITICAL: Always set a role, even if query fails
          setUserRole('guest');
        } else {
          console.error('Error fetching role:', roleError);
          // CRITICAL: Set guest role on error to unblock UI
          setUserRole('guest');
        }
      } else if (roleData) {
        console.log('User role:', roleData.role);
        setUserRole(roleData.role as UserRole);
      } else {
        console.warn('Role data is null, defaulting to guest');
        // CRITICAL: Fallback to guest if data is unexpectedly null
        setUserRole('guest');
      }
    } catch (error) {
      console.error('Exception in fetchProfile:', error);
      // CRITICAL: Always set a role to prevent infinite loading
      setUserRole('guest');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check initial session FIRST, then set up listener
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        console.log(
          'Initial session check:',
          session?.user?.email || 'No user',
        );
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log(
        'Auth state changed:',
        event,
        session?.user?.email || 'No user',
      );

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setUserRole(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? { message: error.message } : null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error ? { message: error.message } : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('user_id', user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    return { error: error ? { message: error.message } : null };
  };

  const hasRole = (role: UserRole): boolean => userRole === role;

  const value: AuthContextType = {
    user,
    profile,
    userRole,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasRole,
    isAdmin: hasRole('admin'),
    isStaff: hasRole('staff'),
    isGuest: hasRole('guest'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
