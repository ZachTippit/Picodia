import { useQuery } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { useSupabase } from '../SupabaseProvider';
import { getCurrentUserId } from '../utils/hookHelper';

export const useProfile = () => {
  const supabase = useSupabase();

  return useQuery<Profile | null, PostgrestError>({
    queryKey: ["profile"],
    queryFn: async () => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });
};