import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useMutation } from "@tanstack/react-query";

const useAppleSignIn = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useMutation({
    mutationFn: async () => {
      // If user is logged in anonymously, link Google to existing account
      if (user && user.is_anonymous) {
        const { data, error } = await supabase.auth.linkIdentity({
          provider: "apple",
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        // Mark in DB
        const { error: rpcError } = await supabase.rpc("upgrade_anonymous_user");
        if (rpcError) throw rpcError;

        return { linked: true, upgraded: true, data };
      }

      // If user is logged out or already registered, perform normal sign-in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { linked: false };
    },
  });
};

export default useAppleSignIn;
