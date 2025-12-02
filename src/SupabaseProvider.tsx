import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User, createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextValue {
  client: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL');
  }

  if (!supabaseKey) {
    throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  }

  const client = useMemo(() => {
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }, [supabaseUrl, supabaseKey]);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  const init = async () => {
    const { data: initial } = await client.auth.getSession();
    const existingSession = initial.session;

    if (!isMounted) return;

    if (!existingSession) {
      // 👇 Perform anonymous sign-in
      const { data: anonData, error: anonError } = await client.auth.signInAnonymously();

      if (anonError) {
        console.error("Anonymous sign-in failed:", anonError);
      } else {
        setSession(anonData.session);
        setUser(anonData.session?.user ?? null);
      }
    } else {
      setSession(existingSession);
      setUser(existingSession.user ?? null);
    }

    setLoading(false);
  };

  void init();

  const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    setLoading(false);
  });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, [client]);


  const value = useMemo<SupabaseContextValue>(
    () => ({
      client,
      session,
      user,
      loading,
    }),
    [client, session, user, loading]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return context.client;
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return {
    user: context.user,
    session: context.session,
    loading: context.loading,
  };
};
