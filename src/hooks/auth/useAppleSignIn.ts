import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useMutation } from "@tanstack/react-query";

const ANON_USER_KEY = "anon_user_id";

const useAppleSignIn = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useMutation({
    mutationFn: async () => {
      const redirectTo = window.location.origin;

      // If we're currently anonymous, remember who we were on THIS device
      if (user?.is_anonymous) {
        try {
          localStorage.setItem(ANON_USER_KEY, user.id);
        } catch {
          // non-fatal, merge just won't happen
        }
      }

      // 🔑 Normal Apple OAuth — let Supabase decide whether to reuse or create
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo,
          // no should_link_identity, no linkIdentity here
        },
      });

      if (error) throw error;
      // redirect happens, nothing after this matters in practice
      return { started: true };
    },
  });
};

export default useAppleSignIn;