import { useEffect } from "react";
import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";

const ANON_USER_KEY = "anon_user_id";

export const useMergeAnonymousUser = () => {
  const supabase = useSupabase();
  const { user, loading } = useSupabaseAuth();

  useEffect(() => {
    if (loading) return;

    const runMerge = async () => {
      const anonUserId = localStorage.getItem(ANON_USER_KEY);
      
      const realUserId = user?.id;

      if (!anonUserId || !realUserId || anonUserId === realUserId) return;

      const { error } = await supabase.rpc("merge_anonymous_user", {
        p_anon_user_id: anonUserId,
      });

      if (error) {
        console.error("Failed to merge anonymous user:", error);
        return;
      }

      localStorage.removeItem(ANON_USER_KEY);

      // Optionally, refetch bootstrap here (if you're using React Query for it)
      // queryClient.invalidateQueries(['clientBootstrap']);
    };

    void runMerge();
  }, [loading, user, supabase]);
};
