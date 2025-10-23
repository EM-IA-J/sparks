import { ChallengeAssignment, User, ChallengeTemplate, Area } from '../types';
import { CHALLENGE_SEEDS } from '../data/challenges.seed';
import { getTodayString, getDailySeed, getHourForWindow, getTodayAtHour, getTomorrowAtHour } from '../utils/time';

// Deterministic challenge assignment based on user areas and date
export const AssignerService = {
  /**
   * Assigns a new challenge for today based on user's selected areas
   * - Sequential assignment - never repeats until all challenges are used
   * - 70% serious / 30% playful tone
   * - Sets dueAt based on notif window
   */
  assignDailyChallenge(
    user: User,
    recentHistory: ChallengeAssignment[]
  ): ChallengeAssignment {
    const today = getTodayString();
    const seed = getDailySeed(today, user.areas);

    // Filter challenges matching user's areas
    const eligibleChallenges = CHALLENGE_SEEDS.filter((c) =>
      c.areaTags.some((tag) => user.areas.includes(tag))
    );

    // Get ALL challenge IDs from history (to track what's been used)
    const usedIds = new Set(recentHistory.map((a) => a.templateId));

    // Filter out ALL previously used challenges
    let freshChallenges = eligibleChallenges.filter(
      (c) => !usedIds.has(c.id)
    );

    // If we've used all challenges, reset and start over
    if (freshChallenges.length === 0) {
      freshChallenges = eligibleChallenges;
    }

    // Decide tone: 70% serious, 30% playful
    const toneRoll = seed % 100;
    const preferredTone = toneRoll < 70 ? 'serious' : 'playful';

    // Try to find challenge with preferred tone
    let tonedChallenges = freshChallenges.filter((c) => c.tone === preferredTone);
    if (tonedChallenges.length === 0) {
      tonedChallenges = freshChallenges; // Fallback to any
    }

    // Pick the FIRST challenge from the filtered list (sequential, not random)
    const selected = tonedChallenges[0];

    // Find alternative (A/B swap)
    const alt = selected.altId
      ? CHALLENGE_SEEDS.find((c) => c.id === selected.altId)
      : undefined;

    // Calculate dueAt based on notification window
    const hour = getHourForWindow(user.notifWindow);
    const now = new Date();
    const targetTime = getTodayAtHour(hour);
    const dueAt = now.getTime() < targetTime.getTime()
      ? targetTime.getTime()
      : getTomorrowAtHour(hour).getTime();

    return {
      id: `assignment_${Date.now()}`,
      userId: user.id,
      templateId: selected.id,
      altTemplateId: alt?.id,
      dueAt,
      createdAt: Date.now(),
      status: 'assigned',
      hasSwapped: false,
      hasSnoozed: false,
    };
  },

  /**
   * Gets the challenge template by ID
   */
  getTemplate(templateId: string): ChallengeTemplate | undefined {
    return CHALLENGE_SEEDS.find((c) => c.id === templateId);
  },

  /**
   * Swaps to alternative challenge (A/B)
   */
  swapToAlternative(assignment: ChallengeAssignment): string | null {
    if (!assignment.altTemplateId || assignment.hasSwapped) {
      return null;
    }
    return assignment.altTemplateId;
  },
};
