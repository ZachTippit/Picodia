import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';

export interface Puzzle {
  id: string;
  // add other column fields here
}

export const useGetPuzzles = () => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['puzzles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('puzzles').select('*');

      if (error) {
        throw error;
      }

      return (data ?? []) as Puzzle[];
    },
  });
};
