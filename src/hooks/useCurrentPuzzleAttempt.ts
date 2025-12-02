import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";

export const useCurrentPuzzleAttempt = () => {
  const supabase = useSupabase();
  const { user, loading } = useSupabaseAuth();

  return useQuery({
    queryKey: ['currentPuzzleAttempt', user?.id],
    enabled: !!user && !loading,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_current_puzzle_attempt');
      if (error) throw error;
      return data ?? null;
    }
  });
};
