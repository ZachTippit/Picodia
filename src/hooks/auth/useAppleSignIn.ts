import { useSupabase } from "@/SupabaseProvider";
import { useMutation } from "@tanstack/react-query";

const useAppleSignIn = () => {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      return true;
    },
  });
};

export default useAppleSignIn;
