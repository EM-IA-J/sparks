import { create } from 'zustand';
import { User, Area, Cadence, NotifWindow, UserAchievement, NotificationTime } from '../types';
import { getTodayString } from '../utils/time';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  completeOnboarding: (areas: Area[], cadence: Cadence, window: NotifWindow, socialOptIn: boolean, notificationTime?: NotificationTime) => void;
  reset: () => void;
}

const createDefaultUser = (): User => ({
  id: Math.random().toString(36).substring(7),
  areas: [],
  cadence: 'daily',
  notifWindow: '8am',
  socialOptIn: false,
  streak: 0,
  createdAt: Date.now(),
  onboardingCompleted: false,
  achievements: [],
  isPremium: false,
  breathingPreference: 'enabled',
  isFirstBreathing: true,
});

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (partial) => set((state) => ({
    user: state.user ? { ...state.user, ...partial } : null,
  })),

  incrementStreak: () => set((state) => {
    if (!state.user) return state;
    const today = getTodayString();
    if (state.user.lastCompletedDate === today) {
      return state; // Already completed today
    }
    return {
      user: {
        ...state.user,
        streak: state.user.streak + 1,
        lastCompletedDate: today,
      },
    };
  }),

  resetStreak: () => set((state) => ({
    user: state.user ? { ...state.user, streak: 0 } : null,
  })),

  unlockAchievement: (achievementId) => set((state) => {
    if (!state.user) return state;

    // Initialize achievements array if it doesn't exist
    const achievements = state.user.achievements || [];

    // Check if already unlocked
    if (achievements.some(a => a.achievementId === achievementId)) {
      return state;
    }

    const newAchievement: UserAchievement = {
      achievementId,
      unlockedAt: Date.now(),
    };

    return {
      user: {
        ...state.user,
        achievements: [...achievements, newAchievement],
      },
    };
  }),

  completeOnboarding: (areas, cadence, window, socialOptIn, notificationTime) => set((state) => {
    const user = state.user || createDefaultUser();
    return {
      user: {
        ...user,
        areas,
        cadence,
        notifWindow: window,
        notificationTime,
        socialOptIn,
        onboardingCompleted: true,
      },
    };
  }),

  reset: () => set({ user: createDefaultUser() }),
}));
