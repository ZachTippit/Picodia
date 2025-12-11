import { useSupabaseAuth } from "@/SupabaseProvider";
import { overlayVariants, panelVariants } from "@/animations";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useUI } from "@/providers/UIProvider";
import { cn } from "@/utils/cn";
import { GameStatus, PuzzleOutcome } from "@/types/enums";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Flame, Sparkles, Trophy, User as UserIcon } from "lucide-react";

const ProfileModal = () => {
  const { showProfile, toggleProfile } = useUI();
  const { user } = useSupabaseAuth();

  const { data: profile } = useProfile();
  const { data: stats, isPending: statsPending } = useProfileStats();
  const { data: recentActivity, isPending: activityPending } = useRecentActivity({ limit: 8 });

  if (!user || user.is_anonymous) {
    return null;
  }

  const displayName =
    profile?.display_name ||
    (user.user_metadata as Record<string, string | undefined>)?.full_name ||
    user.email ||
    "Player";

  const avatarUrl =
    profile?.avatar_url ||
    (user.user_metadata as Record<string, string | undefined>)?.avatar_url ||
    (user.user_metadata as Record<string, string | undefined>)?.picture ||
    null;

  const memberSince = profile?.created_at || user.created_at;

  const statHighlights = [
    {
      label: "Current Streak",
      value: stats?.current_streak ?? "—",
      icon: Flame,
      accent: "bg-orange-50 text-orange-800 border-orange-200",
    },
    {
      label: "Best Streak",
      value: stats?.longest_streak ?? "—",
      icon: Sparkles,
      accent: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      label: "Leaderboard",
      value: stats?.leaderboard_rank ? `#${stats.leaderboard_rank}` : "—",
      icon: Trophy,
      accent: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const renderAvatar = () => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={`${displayName} avatar`}
          className="h-full w-full rounded-full object-cover"
        />
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
        {displayName.slice(0, 1).toUpperCase()}
      </div>
    );
  };

  const renderActivityBadge = (outcome: PuzzleOutcome | null, status: GameStatus) => {
    if (outcome === PuzzleOutcome.Win) {
      return (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Won
        </span>
      );
    }

    if (outcome === PuzzleOutcome.Loss) {
      return (
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-700">
          Lost
        </span>
      );
    }

    if (status === GameStatus.InProgress) {
      return (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
          In Progress
        </span>
      );
    }

    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
        Pending
      </span>
    );
  };

  const renderActivityFeed = () => {
    if (activityPending) {
      return <div className="text-sm text-gray-500">Loading activity…</div>;
    }

    if (!recentActivity || recentActivity.length === 0) {
      return <div className="text-sm text-gray-500">No recent activity yet.</div>;
    }

    return (
      <div className="max-h-[46vh] space-y-3 overflow-y-auto pr-1">
        {recentActivity.map((attempt) => {
          const timestamp =
            attempt.updated_at || attempt.completed_at || attempt.started_at || attempt.attempt_date;
          const relativeTime = timestamp
            ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
            : "just now";
          const puzzleLabel = attempt.puzzle_id ? `Puzzle #${attempt.puzzle_id}` : "Puzzle";
          const detail =
            attempt.outcome === PuzzleOutcome.Win
              ? "Finished strong"
              : attempt.outcome === PuzzleOutcome.Loss
              ? "Tough break"
              : "Making progress";

          return (
            <div
              key={attempt.id}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left"
            >
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-inner">
                <Activity size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{puzzleLabel}</p>
                  {renderActivityBadge(attempt.outcome, attempt.status)}
                  <span className="text-xs text-gray-500">{relativeTime}</span>
                </div>
                <p className="text-xs text-gray-600">{detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {showProfile && (
        <div className="fixed inset-0 z-40 flex items-end justify-center px-4 py-6 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-neutral-950/30"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            onClick={toggleProfile}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            className="relative z-10 flex w-full max-w-2xl flex-col gap-5 overflow-hidden rounded-3xl border border-gray-300 bg-white px-6 py-6 text-gray-900 shadow-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full border border-gray-200 bg-gray-100">
                  {renderAvatar()}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 id="profile-modal-title" className="text-lg font-semibold leading-tight">
                      {displayName}
                    </h2>
                    <UserIcon size={16} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {memberSince && (
                    <p className="text-xs text-gray-500">
                      Playing for {formatDistanceToNow(new Date(memberSince), { addSuffix: true })}
                    </p>
                  )}
                  {profile?.bio && <p className="text-xs text-gray-600">{profile.bio}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleProfile}
                className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {statsPending
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-2xl border border-dashed border-gray-200 bg-gray-50"
                    />
                  ))
                : statHighlights.map((stat) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "flex h-24 flex-col justify-between rounded-2xl border px-4 py-3 text-left",
                        stat.accent
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                          {stat.label}
                        </span>
                        <stat.icon size={16} className="text-gray-700" />
                      </div>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                  ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Recent Activity</p>
                  <p className="text-xs text-gray-500">Your latest puzzle runs and outcomes</p>
                </div>
              </div>
              <div className="mt-4">{renderActivityFeed()}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
