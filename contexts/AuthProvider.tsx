import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getSessionAndInformation = async () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setIsReady(true);
      });

      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('firstName, lastName')
          .eq('uid', session.user.id)
          .single();
        console.log(data)

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    };
    getSessionAndInformation();
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }
  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isAuthenticated: !!session?.user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
