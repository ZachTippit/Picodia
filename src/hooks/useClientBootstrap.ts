import { useSupabase, useSupabaseAuth } from "@/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";

export const useClientBootstrap = () => {
  const supabase = useSupabase();
  const { user, loading } = useSupabaseAuth();

  return useQuery({
    queryKey: ['client_bootstrap'],
    enabled: !!user && !loading,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_client_bootstrap');
      if (error) throw error;
      return data;
    },
  });
};
