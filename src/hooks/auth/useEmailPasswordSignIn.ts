import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useMutation } from "@tanstack/react-query";

const useEmailPasswordSignIn = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useMutation({
    mutationFn: async ({ email, password }: EmailCredentials) => {
      // TODO: Need to implement linking email/password to anonymous accounts
      // If user is logged in anonymously, link Google to existing account
      // if (user && user.is_anonymous) {
      //   const { data, error } = await supabase.auth.linkIdentity({
      //     provider: "email",  // for email/password identity linking
      //     email,
      //     password,
      //   });

      //   if (error) throw error;
      //   return { linked: true, data };
      // }

      // If user is logged out or already registered, perform normal sign-in
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
