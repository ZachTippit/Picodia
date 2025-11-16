import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';
import { useSupabaseAuth } from '../SupabaseProvider';

/**
 * Ensures the user has today's attempt reserved.
 * Does NOT mark it as 'in_progress' until gameplay starts.
 */
export const useCurrentPuzzleAttempt = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useQuery<PuzzleAttempt | null>({
    queryKey: ['currentPuzzleAttempt', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;

      // Step 1️⃣ — Fetch today's puzzle
      const { data: puzzleData, error: puzzleError } = await supabase.rpc('get_today_puzzle');
      if (puzzleError) throw puzzleError;
      const todayPuzzle = puzzleData?.[0] as Puzzle | undefined;
      if (!todayPuzzle) {
        console.warn('No puzzle found for today.');
        return null;
      }

      const todayStr = new Date().toISOString().slice(0, 10);

      // Step 2️⃣ — Check for existing attempt
      const { data: existingAttempts, error: existingError } = await supabase
        .from('puzzle_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('puzzle_id', Number(todayPuzzle.id))
        .eq('attempt_date', todayStr)
        .order('started_at', { ascending: false })
        .limit(1);

      if (existingError) throw existingError;

      const existing = existingAttempts?.[0];

      // Step 3️⃣ — Reuse any non-voided attempt
      if (existing && existing.status !== 'voided') {
        await supabase.from('profile_sessions').upsert({
          user_id: user.id,
          current_attempt_id: existing.id,
          active_puzzle_id: Number(todayPuzzle.id),
          updated_at: new Date().toISOString(),
        });
        return existing as PuzzleAttempt;
      }

      // Step 4️⃣ — Create a new 'pending' attempt (not yet in_progress)
      const { data: upserted, error: upsertError } = await supabase
        .from('puzzle_attempts')
        .upsert(
          {
            user_id: user.id,
            puzzle_id: Number(todayPuzzle.id),
            attempt_date: todayStr,
            status: 'pending', // 👈 NEW default
            progress: {},
            metadata: {},
            lives_remaining: 3,
            elapsed_seconds: 0,
            mistakes_made: 0,
            was_successful: null,
          },
          {
            onConflict: 'user_id,puzzle_id,attempt_date',
            ignoreDuplicates: false,
          }
        )
        .select('*')
        .single();

      if (upsertError) throw upsertError;

      // Step 5️⃣ — Sync profile session
      const { error: sessionUpsertError } = await supabase.from('profile_sessions').upsert({
        user_id: user.id,
        current_attempt_id: upserted.id,
        active_puzzle_id: Number(todayPuzzle.id),
        updated_at: new Date().toISOString(),
      });

      if (sessionUpsertError) throw sessionUpsertError;

      return upserted as PuzzleAttempt;
    },
  });
};
