import { useSupabase } from "@/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";

export const useClientBootstrap = () => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['client_bootstrap'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_client_bootstrap');
      if (error) throw error;
      return data;
    },
  });
};
