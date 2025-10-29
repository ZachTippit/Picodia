import { ReactNode, createContext, useContext, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type SupabaseContextValue = SupabaseClient;

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const { getToken } = useAuth();

  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL');
  }

  if (!supabaseKey) {
    throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  }

  const client = useMemo(() => {
    return createClient(supabaseUrl, supabaseKey, {
      accessToken: async () => getToken() ?? null,
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (url, options = {} as any) => {
          const token = await getToken({ template: 'supabase' });
          const headers = new Headers(options?.headers || {});

          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          } else {
            headers.delete('Authorization');
          }

          return fetch(url, { ...options, headers });
        },
      },
    });
  }, [getToken, supabaseUrl, supabaseKey]);

  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
  const client = useContext(SupabaseContext);

  if (!client) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return client;
};
