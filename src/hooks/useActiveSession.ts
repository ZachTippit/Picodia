import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useSupabase } from "../SupabaseProvider";
import { PuzzleAttempt } from "./useProfile";
import { getCurrentUserId } from "@utils/hookHelper";

export interface ActiveSession {
  user_id: string;
  current_attempt_id: string | null;
  active_puzzle_id: string | null;
  started_at: string;
  updated_at: string;
  puzzle_attempts: PuzzleAttempt | null;
}

export const useActiveSession = () => {
  const supabase = useSupabase();

  return useQuery<ActiveSession | null, PostgrestError>({
    queryKey: ["active-session"],
    queryFn: async () => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profile_sessions')
        .select('*, puzzle_attempts(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
  });
};
