import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ChallengeAssignment } from '../types';

const KEYS = {
  USER: '@sparks_user',
  ASSIGNMENTS: '@sparks_assignments',
  CURRENT_ASSIGNMENT: '@sparks_current',
  TIMER_STATE: '@sparks_timer_state',
};

export const StorageService = {
  // User
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // Assignments
  async saveAssignments(assignments: ChallengeAssignment[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  async getAssignments(): Promise<ChallengeAssignment[]> {
    const data = await AsyncStorage.getItem(KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  },

  async saveCurrentAssignment(assignment: ChallengeAssignment | null): Promise<void> {
    if (assignment) {
      await AsyncStorage.setItem(KEYS.CURRENT_ASSIGNMENT, JSON.stringify(assignment));
    } else {
      await AsyncStorage.removeItem(KEYS.CURRENT_ASSIGNMENT);
    }
  },

  async getCurrentAssignment(): Promise<ChallengeAssignment | null> {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_ASSIGNMENT);
    return data ? JSON.parse(data) : null;
  },

  // Timer state
  async saveTimerState(startTime: number, totalSeconds: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.TIMER_STATE, JSON.stringify({ startTime, totalSeconds }));
  },

  async getTimerState(): Promise<{ startTime: number; totalSeconds: number } | null> {
    const data = await AsyncStorage.getItem(KEYS.TIMER_STATE);
    return data ? JSON.parse(data) : null;
  },

  async clearTimerState(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.TIMER_STATE);
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.USER, KEYS.ASSIGNMENTS, KEYS.CURRENT_ASSIGNMENT, KEYS.TIMER_STATE]);
  },
};
