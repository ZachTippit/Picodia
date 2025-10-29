import { useEffect } from 'react';
import { useSupabase } from '../SupabaseProvider';

export const ProfileProbe = () => {
  const supabase = useSupabase();

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) {
        console.error('Supabase error', error);
      } else {
        console.log('Supabase data', data);
      }
    };

    void load();
  }, [supabase]);

  return null;
};
