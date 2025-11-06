import { useMemo } from 'react';
import { useProfileStats } from '../../hooks/useProfile';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { cn } from '../../lib/cn';

const QuickStats = () => {
  const { user } = useSupabaseAuth();
  const {
    data: stats,
    isPending,
    isFetching,
  } = useProfileStats();

  if (!user) {
    return null;
  }

  const loading = isPending || isFetching;

  const entries = useMemo(
    () => [
      { label: 'Games Played', value: stats?.games_played ?? 0 },
      { label: 'Wins', value: stats?.wins ?? 0 },
      { label: 'Current Streak', value: stats?.current_streak ?? 0 },
      { label: 'Longest Streak', value: stats?.longest_streak ?? 0 },
    ],
    [stats?.current_streak, stats?.games_played, stats?.longest_streak, stats?.wins]
  );

  return (
    <div className="w-full mt-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        Quick Stats
      </h3>
      <div
        className={cn(
          'mt-2 grid w-full grid-cols-2 gap-2 text-left text-sm',
          'rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-sm'
        )}
      >
        {loading ? (
          <div className="col-span-2 flex justify-center py-2 text-xs text-gray-500">
            Loading…
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.label} className="flex flex-col">
              <span className="text-[11px] uppercase tracking-tight text-gray-500">
                {entry.label}
              </span>
              <span className="text-base font-semibold text-gray-800">{entry.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickStats;
