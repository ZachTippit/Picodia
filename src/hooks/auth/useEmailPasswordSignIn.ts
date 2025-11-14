import { useSupabase } from "@/SupabaseProvider";
import { useMutation } from "@tanstack/react-query";

interface EmailCredentials {
  email: string;
  password: string;
}

const useEmailPasswordSignIn = () => {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ email, password }: EmailCredentials) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return true;
    },
  });
};

export default useEmailPasswordSignIn;
