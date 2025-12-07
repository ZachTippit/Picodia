import { useSupabase } from "@/SupabaseProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoseLife = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("lose_life");
      if (error) throw error;
      return data;
    },
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: ["currentPuzzleAttempt"] });
    },
  });

  return {
    loseLife: mutation.mutateAsync,
    isLosingLife: mutation.isPending,
  };
};
