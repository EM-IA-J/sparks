import { create } from 'zustand';
import { Friend } from '../types';

interface SettingsState {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  updateFriend: (id: string, partial: Partial<Friend>) => void;
  getFriendById: (id: string) => Friend | undefined;
  nudgeFriend: (id: string) => void;
  reset: () => void;
}

// Mock friends data
const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Alex', avatar: '🔥', status: 'accepted', streak: 12, completedCount: 45 },
  { id: 'f2', name: 'Jordan', avatar: '⚡', status: 'accepted', streak: 8, completedCount: 32 },
  { id: 'f3', name: 'Sam', avatar: '🌟', status: 'invited', streak: 0, completedCount: 0 },
];

export const useSettingsStore = create<SettingsState>((set, get) => ({
  friends: MOCK_FRIENDS,

  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend],
  })),

  updateFriend: (id, partial) => set((state) => ({
    friends: state.friends.map((f) => (f.id === id ? { ...f, ...partial } : f)),
  })),

  getFriendById: (id) => {
    return get().friends.find((f) => f.id === id);
  },

  nudgeFriend: (id) => {
    // Mock nudge action - in real app would send push notification
    console.log(`Nudged friend ${id}`);
  },

  reset: () => set({ friends: [] }),
}));
