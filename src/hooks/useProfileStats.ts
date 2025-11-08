import { useQuery } from "@tanstack/react-query";
import { useSupabase, useSupabaseAuth } from "../SupabaseProvider";
import { PostgrestError } from "@supabase/supabase-js";

export interface ProfileStats {
  user_id: string;
  games_played: number;
  wins: number;
  losses: number;
  current_streak: number;
  longest_streak: number;
  total_completed_games: number;
  total_completed_time_seconds: number;
  total_completed_lives: number;
  win_rate: number;
  completion_rate: number;
  updated_at: string;
}

export const useProfileStats = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  const userId = user?.id || null;

  return useQuery<ProfileStats | null, PostgrestError>({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profile_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
  });
};