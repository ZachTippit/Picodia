import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';

/**
 * Fetches today's puzzle automatically based on the configured launch date
 * inside the SQL function (no arguments required).
 */
export const useDailyPuzzle = () => {
  const supabase = useSupabase();

  return useQuery<Puzzle | null>({
    queryKey: ['todayPuzzle'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_today_puzzle');

      if (error) {
        console.error('Error fetching today’s puzzle:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('No puzzle found for today.');
        return null;
      }

      return data[0] as Puzzle;
    },
  });
};
