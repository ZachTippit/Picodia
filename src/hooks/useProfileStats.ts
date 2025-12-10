import { useQuery } from '@tanstack/react-query';
import { useSupabase, useSupabaseAuth } from '../SupabaseProvider';

export interface ProfileStats {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  games_played: number;
  wins: number;
  losses: number;
  current_streak: number;
  longest_streak: number;
  total_completed_games: number;
  total_completed_time_seconds: number;
  total_completed_lives: number;
  win_rate: number | null;
  completion_rate: number | null;
  updated_at: string | null; // timestamptz -> ISO string
}

interface UseProfileStatsOptions {
  /**
   * If provided, the RPC will fetch stats for this user.
   * If omitted, it will default to auth.uid() on the server.
   */
  userId?: string;
}

/**
 * Fetches profile stats via the `get_profile_stats` RPC.
 * - If `userId` is provided, it will be passed as `target_user`.
 * - Otherwise the RPC will use `auth.uid()` internally.
 */
export const useProfileStats = (options: UseProfileStatsOptions = {}) => {
  const { userId } = options;
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useQuery<ProfileStats | null>({
    queryKey: ['profileStats', userId ?? user?.id],
    enabled: !!(userId || user),
    queryFn: async () => {
      // If no user is available and no explicit userId is passed, bail out.
      if (!userId && !user) return null;

      const { data, error } = await supabase.rpc('get_profile_stats', {
        // Only send target_user when explicitly requested;
        // otherwise the function will use auth.uid() internally.
        ...(userId ? { target_user: userId } : {}),
      });

      if (error) {
        // Let React Query handle the error state
        throw error;
      }

      // RPC returns a jsonb object or null
      return (data as ProfileStats | null) ?? null;
    },
  });
};
