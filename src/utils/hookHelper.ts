import { useSupabase } from "../SupabaseProvider";

export const getCurrentUserId = async (supabase: ReturnType<typeof useSupabase>) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user?.id ?? null;
};