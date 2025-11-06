import { useCallback } from 'react';
import { useSupabaseAuth } from '../SupabaseProvider';
import { useGetPuzzles } from './useGetPuzzle';
import { AttemptMetadata, useActiveSession, useSaveProgress } from './useProfile';

export interface PuzzleProgressInput {
  progress: unknown;
  completed?: boolean;
  lives?: number | null;
  elapsedSeconds?: number | null;
}

export interface StoredAnonProgress {
  puzzleId: string;
  puzzleDate: string;
  progress: unknown;
  lives: number | null;
  elapsedSeconds: number | null;
  shouldSync: boolean;
  completed: boolean;
  updatedAt: string;
}

const LOCAL_PROGRESS_STORAGE_KEY = 'anonProgress';

const todayKey = () => new Date().toISOString().split('T')[0];

const sanitizeProgress = (progress: unknown) => {
  if (progress === null || progress === undefined) {
    return null;
  }

  try {
    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to serialize puzzle progress for storage.', error);
    return null;
  }
};

export interface AnonProgressSnapshotInput {
  puzzleId: string;
  puzzleDate?: string;
  progress: unknown;
  lives?: number | null;
  elapsedSeconds?: number | null;
  completed?: boolean;
  shouldSync?: boolean;
}

export const getStoredAnonProgress = (): StoredAnonProgress | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(LOCAL_PROGRESS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAnonProgress;
    if (!parsed?.puzzleId || !parsed?.puzzleDate) {
      window.localStorage.removeItem(LOCAL_PROGRESS_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    window.localStorage.removeItem(LOCAL_PROGRESS_STORAGE_KEY);
    return null;
  }
};

export const clearStoredAnonProgress = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(LOCAL_PROGRESS_STORAGE_KEY);
};

export const writeAnonProgressSnapshot = ({
  puzzleId,
  puzzleDate,
  progress,
  lives = null,
  elapsedSeconds = null,
  completed = false,
  shouldSync = true,
}: AnonProgressSnapshotInput) => {
  if (typeof window === 'undefined' || !puzzleId) {
    return;
  }

  if (completed) {
    clearStoredAnonProgress();
    return;
  }

  const entry: StoredAnonProgress = {
    puzzleId,
    puzzleDate: puzzleDate ?? todayKey(),
    progress: sanitizeProgress(progress),
    lives: typeof lives === 'number' ? lives : lives ?? null,
    elapsedSeconds:
      typeof elapsedSeconds === 'number' ? elapsedSeconds : elapsedSeconds ?? null,
    shouldSync,
    completed: Boolean(completed),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(LOCAL_PROGRESS_STORAGE_KEY, JSON.stringify(entry));
};

export const useSavePuzzleProgress = (overridePuzzleId?: string | null) => {
  const { user } = useSupabaseAuth();
  const { data: puzzleData } = useGetPuzzles();
  const puzzleId = overridePuzzleId ?? (puzzleData ? puzzleData[0]?.id ?? null : null);
  const { data: activeSession } = useActiveSession();
  const saveProgress = useSaveProgress();

  type MutationOptions = Parameters<typeof saveProgress.mutate>[1];

  const persistLocalProgress = useCallback(
    (progressData: PuzzleProgressInput) => {
      if (typeof window === 'undefined' || !puzzleId) {
        return;
      }

      writeAnonProgressSnapshot({
        puzzleId,
        progress: progressData.progress,
        lives: progressData?.lives ?? null,
        elapsedSeconds: progressData?.elapsedSeconds ?? null,
        completed: progressData?.completed ?? false,
        shouldSync: !user,
      });
    },
    [puzzleId, user]
  );

  const mutate = (progressData: PuzzleProgressInput, options?: MutationOptions) => {
    persistLocalProgress(progressData);

    if (!user) {
      return;
    }

    const attemptId = activeSession?.current_attempt_id ?? null;
    if (!attemptId) {
      return;
    }

    const metadata: AttemptMetadata = {
      puzzleId: puzzleId ?? null,
      progress: sanitizeProgress(progressData.progress),
      lives: progressData?.lives ?? null,
      elapsedSeconds: progressData?.elapsedSeconds ?? null,
      completed: progressData?.completed ?? false,
      updatedAt: new Date().toISOString(),
    };

    saveProgress.mutate({ attemptId, progress: metadata }, options);
  };

  const mutateAsync = (progressData: PuzzleProgressInput, options?: MutationOptions) => {
    persistLocalProgress(progressData);

    if (!user) {
      return Promise.reject(
        new Error('Unable to save progress without an authenticated user and puzzle.')
      );
    }

    const attemptId = activeSession?.current_attempt_id ?? null;
    if (!attemptId) {
      return Promise.reject(new Error('Unable to locate an active puzzle attempt to update.'));
    }

    const metadata: AttemptMetadata = {
      puzzleId: puzzleId ?? null,
      progress: sanitizeProgress(progressData.progress),
      lives: progressData?.lives ?? null,
      elapsedSeconds: progressData?.elapsedSeconds ?? null,
      completed: progressData?.completed ?? false,
      updatedAt: new Date().toISOString(),
    };

    return saveProgress.mutateAsync({ attemptId, progress: metadata }, options);
  };

  return {
    ...saveProgress,
    mutate,
    mutateAsync,
  };
};
