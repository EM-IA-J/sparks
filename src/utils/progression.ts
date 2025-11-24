// Progression tracking utilities
// Separates logical progression (stepNumber) from calendar time (daysSinceStart)

import { ChallengeAssignment } from '../types';

/**
 * Calculate the user's current step number based on completed challenges.
 * stepNumber = completedChallengesCount + 1
 *
 * Example: 0 completed = step 1, 2 completed = step 3
 *
 * @param history - Array of challenge assignments
 * @returns The current step number (1-based)
 */
export function getStepNumber(history: ChallengeAssignment[]): number {
  const completedCount = history.filter(a => a.status === 'completed').length;
  return completedCount + 1;
}

/**
 * Get the count of completed challenges.
 *
 * @param history - Array of challenge assignments
 * @returns Number of challenges with status 'completed'
 */
export function getCompletedChallengesCount(history: ChallengeAssignment[]): number {
  return history.filter(a => a.status === 'completed').length;
}

/**
 * Calculate real calendar days since the user started (from createdAt).
 *
 * @param createdAt - Timestamp when user was created
 * @returns Number of real calendar days since start (1-based, today counts as day 1)
 */
export function getDaysSinceStart(createdAt: number): number {
  const now = new Date();
  const created = new Date(createdAt);

  // Reset to start of day for accurate day counting
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((nowDay.getTime() - createdDay.getTime()) / msPerDay);

  // Return 1-based (first day = 1, not 0)
  return daysDiff + 1;
}

/**
 * Check if breathing exercise should be shown.
 * Breathing is shown from step 3 onward (after completing 2 challenges).
 *
 * @param history - Array of challenge assignments
 * @returns true if user has completed at least 2 challenges
 */
export function shouldShowBreathing(history: ChallengeAssignment[]): boolean {
  const completedCount = getCompletedChallengesCount(history);
  return completedCount >= 2;
}
