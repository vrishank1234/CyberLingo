/**
 * User Store (Zustand)
 * Manages client user state, gamification stats, progress, preferences,
 * and lazy heart regeneration calculations.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_HEARTS = 5;
const REGEN_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

/**
 * Computes current hearts lazily based on elapsed time since heartsUpdatedAt.
 * @param {number} storedHearts
 * @param {number} heartsUpdatedAt
 * @returns {{ currentHearts: number, nextHeartAt: number | null }}
 */
export function computeLazyHearts(storedHearts, heartsUpdatedAt) {
  if (storedHearts >= MAX_HEARTS) {
    return { currentHearts: MAX_HEARTS, nextHeartAt: null };
  }

  const now = Date.now();
  const elapsed = Math.max(0, now - (heartsUpdatedAt || now));
  const recovered = Math.floor(elapsed / REGEN_INTERVAL_MS);
  const currentHearts = Math.min(MAX_HEARTS, storedHearts + recovered);

  let nextHeartAt = null;
  if (currentHearts < MAX_HEARTS) {
    const remainder = elapsed % REGEN_INTERVAL_MS;
    nextHeartAt = now + (REGEN_INTERVAL_MS - remainder);
  }

  return { currentHearts, nextHeartAt };
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Authentication & Profile
      user: null, // { uid, displayName, email, photoURL, isAnonymous }
      isOnboarded: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',

      // Onboarding Selections
      goal: 'protect',
      level: 1,
      dailyGoalXp: 20,

      // Track & Lesson Progress
      currentTrackId: 'security-fundamentals',
      completedLessons: [], // Array of completed lesson IDs e.g. ['u1-l1']
      currentLessonId: 'u1-l1',

      // Gamification Stats
      xpTotal: 0,
      xpToday: 0,
      xpWeek: 0,
      gems: 150, // Starting gem balance for new cadets
      hearts: 5,
      heartsUpdatedAt: Date.now(),
      streak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakFreezes: 0,
      leagueId: 'bronze-league-01',
      leagueTier: 'Bronze',

      // Settings
      soundEnabled: true,
      hapticsEnabled: true,
      reducedMotion: false,

      // Actions
      setUser: (user) => set({ user }),

      setOnboardingData: ({ goal, level, dailyGoalXp }) =>
        set((state) => ({
          goal: goal || state.goal,
          level: level || state.level,
          dailyGoalXp: dailyGoalXp || state.dailyGoalXp,
          isOnboarded: true
        })),

      getEffectiveHearts: () => {
        const { hearts, heartsUpdatedAt } = get();
        return computeLazyHearts(hearts, heartsUpdatedAt);
      },

      deductHeart: () => {
        const { currentHearts } = get().getEffectiveHearts();
        if (currentHearts <= 0) return 0;
        const newHearts = Math.max(0, currentHearts - 1);
        const newUpdatedAt = Date.now();
        set({ hearts: newHearts, heartsUpdatedAt: newUpdatedAt });
        return newHearts;
      },

      refillHearts: () =>
        set({
          hearts: MAX_HEARTS,
          heartsUpdatedAt: Date.now()
        }),

      addGems: (amount) =>
        set((state) => ({ gems: Math.max(0, state.gems + amount) })),

      spendGems: (amount) => {
        const { gems } = get();
        if (gems < amount) return false;
        set({ gems: gems - amount });
        return true;
      },

      addXp: (amount) =>
        set((state) => ({
          xpTotal: state.xpTotal + amount,
          xpToday: state.xpToday + amount,
          xpWeek: state.xpWeek + amount
        })),

      markLessonCompleted: (lessonId, nextLessonId) =>
        set((state) => {
          const completedSet = new Set(state.completedLessons);
          completedSet.add(lessonId);
          return {
            completedLessons: Array.from(completedSet),
            currentLessonId: nextLessonId || state.currentLessonId
          };
        }),

      setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),

      syncFromFirestore: (docData) => {
        if (!docData) return;
        set((state) => ({
          ...state,
          displayName: docData.displayName || state.user?.displayName,
          xpTotal: docData.xpTotal ?? state.xpTotal,
          xpToday: docData.xpToday ?? state.xpToday,
          xpWeek: docData.xpWeek ?? state.xpWeek,
          gems: docData.gems ?? state.gems,
          hearts: docData.hearts ?? state.hearts,
          heartsUpdatedAt: docData.heartsUpdatedAt?.toMillis?.() || docData.heartsUpdatedAt || state.heartsUpdatedAt,
          streak: docData.streak ?? state.streak,
          longestStreak: docData.longestStreak ?? state.longestStreak,
          dailyGoalXp: docData.dailyGoalXp ?? state.dailyGoalXp,
          currentTrackId: docData.currentTrackId ?? state.currentTrackId,
          leagueTier: docData.leagueTier ?? state.leagueTier,
          streakFreezes: docData.streakFreezes ?? state.streakFreezes
        }));
      },

      resetUserSession: () =>
        set({
          user: null,
          isOnboarded: false,
          completedLessons: [],
          currentLessonId: 'u1-l1',
          xpTotal: 0,
          xpToday: 0,
          gems: 150,
          hearts: 5,
          heartsUpdatedAt: Date.now(),
          streak: 1
        })
    }),
    {
      name: 'cyberlingo-user-storage',
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
        goal: state.goal,
        level: state.level,
        dailyGoalXp: state.dailyGoalXp,
        completedLessons: state.completedLessons,
        currentLessonId: state.currentLessonId,
        xpTotal: state.xpTotal,
        xpToday: state.xpToday,
        gems: state.gems,
        hearts: state.hearts,
        heartsUpdatedAt: state.heartsUpdatedAt,
        streak: state.streak,
        longestStreak: state.longestStreak,
        soundEnabled: state.soundEnabled,
        reducedMotion: state.reducedMotion
      })
    }
  )
);

