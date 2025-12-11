import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";

interface UseRecentActivityOptions {
  limit?: number;
}

export const useRecentActivity = (options: UseRecentActivityOptions = {}) => {
  const { limit = 8 } = options;
  const supabase = useSupabase();
  const { user, loading } = useSupabaseAuth();

  return useQuery<PuzzleAttempt[]>({
    queryKey: ["recent-activity", user?.id, limit],
    enabled: !!user && !user.is_anonymous && !loading,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("puzzle_attempts")
        .select(
          "id, puzzle_id, status, outcome, attempt_date, started_at, completed_at, updated_at, was_successful, lives_remaining, elapsed_seconds"
        )
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data ?? []) as PuzzleAttempt[];
    },
  });
};
