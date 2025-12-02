import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';

export const useGetPuzzles = () => {
  const supabase = useSupabase();

  return useQuery<Puzzle[]>({
    queryKey: ['puzzles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('puzzles').select('*').order('day', { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []) as Puzzle[];
    },
  });
};
