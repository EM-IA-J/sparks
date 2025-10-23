import { User, ChallengeAssignment, Area } from '../types';
import { ACHIEVEMENTS } from '../data/achievements.seed';
import { AssignerService } from './assigner';

export const AchievementService = {
  /**
   * Check and return newly unlocked achievements after completing a challenge
   */
  checkAchievements(
    user: User,
    history: ChallengeAssignment[]
  ): string[] {
    const newlyUnlocked: string[] = [];
    const unlockedIds = new Set((user.achievements || []).map(a => a.achievementId));

    const completedHistory = history.filter(h => h.status === 'completed');
    const totalCompleted = completedHistory.length;

    // Check each achievement
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.id) {
        // Streak achievements
        case 'streak_3':
          shouldUnlock = user.streak >= 3;
          break;
        case 'streak_7':
          shouldUnlock = user.streak >= 7;
          break;
        case 'streak_30':
          shouldUnlock = user.streak >= 30;
          break;
        case 'streak_100':
          shouldUnlock = user.streak >= 100;
          break;

        // Total completion achievements
        case 'total_1':
          shouldUnlock = totalCompleted >= 1;
          break;
        case 'total_10':
          shouldUnlock = totalCompleted >= 10;
          break;
        case 'total_42':
          shouldUnlock = totalCompleted >= 42;
          break;
        case 'total_100':
          shouldUnlock = totalCompleted >= 100;
          break;
        case 'total_365':
          shouldUnlock = totalCompleted >= 365;
          break;

        // Timing achievements
        case 'morning_routine': {
          const morningCount = completedHistory.filter(h => {
            const hour = new Date(h.completedAt!).getHours();
            return hour >= 6 && hour < 12;
          }).length;
          shouldUnlock = morningCount >= 7;
          break;
        }
        case 'night_owl': {
          const eveningCount = completedHistory.filter(h => {
            const hour = new Date(h.completedAt!).getHours();
            return hour >= 18 && hour < 24;
          }).length;
          shouldUnlock = eveningCount >= 7;
          break;
        }

        // Area-specific achievements
        case 'health_master':
          shouldUnlock = this.countAreaChallenges(history, 'health') >= 20;
          break;
        case 'creative_genius':
          shouldUnlock = this.countAreaChallenges(history, 'creativity') >= 20;
          break;
        case 'social_butterfly':
          shouldUnlock = this.countAreaChallenges(history, 'social') >= 20;
          break;
        case 'nature_lover':
          shouldUnlock = this.countAreaChallenges(history, 'nature') >= 20;
          break;
        case 'focus_master':
          shouldUnlock = this.countAreaChallenges(history, 'focus') >= 20;
          break;

        // Special achievements
        case 'no_swap': {
          const noSwapCount = completedHistory.filter(h => !h.hasSwapped).length;
          shouldUnlock = noSwapCount >= 10;
          break;
        }
        case 'speed_demon': {
          // Challenges completed before timer ended (would need to track this)
          // For now, simplified version
          const earlyCount = completedHistory.filter(h => {
            // Placeholder logic
            return true;
          }).length;
          shouldUnlock = earlyCount >= 5;
          break;
        }
        case 'all_areas': {
          const uniqueAreas = this.getUniqueAreas(history);
          shouldUnlock = uniqueAreas.size >= 8;
          break;
        }
        case 'feedback_fire': {
          const fireCount = completedHistory.filter(h => h.feedback === 'fire').length;
          shouldUnlock = fireCount >= 10;
          break;
        }
      }

      if (shouldUnlock) {
        newlyUnlocked.push(achievement.id);
      }
    }

    return newlyUnlocked;
  },

  /**
   * Get progress for a specific achievement
   */
  getAchievementProgress(
    achievementId: string,
    user: User,
    history: ChallengeAssignment[]
  ): number {
    const completedHistory = history.filter(h => h.status === 'completed');
    const totalCompleted = completedHistory.length;

    switch (achievementId) {
      case 'streak_3':
      case 'streak_7':
      case 'streak_30':
      case 'streak_100':
        return user.streak;

      case 'total_1':
      case 'total_10':
      case 'total_42':
      case 'total_100':
      case 'total_365':
        return totalCompleted;

      case 'morning_routine':
        return completedHistory.filter(h => {
          const hour = new Date(h.completedAt!).getHours();
          return hour >= 6 && hour < 12;
        }).length;

      case 'night_owl':
        return completedHistory.filter(h => {
          const hour = new Date(h.completedAt!).getHours();
          return hour >= 18 && hour < 24;
        }).length;

      case 'health_master':
        return this.countAreaChallenges(history, 'health');
      case 'creative_genius':
        return this.countAreaChallenges(history, 'creativity');
      case 'social_butterfly':
        return this.countAreaChallenges(history, 'social');
      case 'nature_lover':
        return this.countAreaChallenges(history, 'nature');
      case 'focus_master':
        return this.countAreaChallenges(history, 'focus');

      case 'no_swap':
        return completedHistory.filter(h => !h.hasSwapped).length;

      case 'all_areas':
        return this.getUniqueAreas(history).size;

      case 'feedback_fire':
        return completedHistory.filter(h => h.feedback === 'fire').length;

      default:
        return 0;
    }
  },

  /**
   * Helper: Count challenges by area
   */
  countAreaChallenges(history: ChallengeAssignment[], area: Area): number {
    return history.filter(h => {
      if (h.status !== 'completed') return false;
      const template = AssignerService.getTemplate(h.templateId);
      return template?.areaTags.includes(area);
    }).length;
  },

  /**
   * Helper: Get unique areas from history
   */
  getUniqueAreas(history: ChallengeAssignment[]): Set<Area> {
    const areas = new Set<Area>();
    history
      .filter(h => h.status === 'completed')
      .forEach(h => {
        const template = AssignerService.getTemplate(h.templateId);
        if (template) {
          template.areaTags.forEach(tag => areas.add(tag));
        }
      });
    return areas;
  },
};
