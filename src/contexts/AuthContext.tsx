import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type UserRole = 'admin' | 'staff' | 'guest';

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
    updates: ProfileUpdate,
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        // Profile doesn't exist, create it
        const { data: user } = await supabase.auth.getUser();
        const fullName = user.user?.user_metadata?.full_name || null;
        const insertData: ProfileInsert = {
          user_id: userId,
          full_name: fullName,
        };
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(insertData as any)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          setProfile(newProfile);
        }
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching role:', roleError);
        setUserRole('guest'); // Default to guest if no role found
      } else if (roleData) {
        setUserRole(roleData as UserRole);
      } else {
        setUserRole('guest'); // Default to guest if no role data
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      options: {
        data: {
          full_name: fullName,
        },
      },
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

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = hasRole('admin');
  const isStaff = hasRole('staff');
  const isGuest = hasRole('guest');

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
    isAdmin,
    isStaff,
    isGuest,
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
