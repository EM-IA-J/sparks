// Core types for Sparks app
export type Area = 'health' | 'creativity' | 'social' | 'nature' | 'focus' | 'money' | 'romance' | 'selflove';
export type Cadence = 'daily' | 'every2days' | 'every3days' | 'weekly';
export type NotifWindow = '6am' | '7am' | '8am' | '9am' | '12pm' | '1pm' | '5pm' | '6pm' | '7pm' | '8pm';
export type ChallengeTone = 'serious' | 'playful';
export type ChallengeStatus = 'assigned' | 'started' | 'completed' | 'skipped' | 'expired';
export type FeedbackType = 'fire' | 'good' | 'meh' | 'bad';
export type SocialStatus = 'invited' | 'accepted' | 'snoozed' | 'chicken';

export interface NotificationTime {
  hour: number; // 0-23
  minute: number; // 0-59
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  areas: Area[];
  cadence: Cadence;
  notifWindow: NotifWindow; // Legacy support
  notificationTime?: NotificationTime; // New flexible time
  socialOptIn: boolean;
  pushToken?: string;
  streak: number;
  createdAt: number;
  lastAssignmentAt?: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  onboardingCompleted: boolean;
  achievements: UserAchievement[];
  isPremium?: boolean;
  breathingPreference?: 'enabled' | 'disabled' | 'never';
  isFirstBreathing?: boolean;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  short: string;
  areaTags: Area[];
  tone: ChallengeTone;
  durationMin?: number;
  steps?: string[];
  altId?: string; // paired A/B alternative
  followUp?: string[]; // Follow-up questions/reflections after challenge completion
}

export interface ChallengeAssignment {
  id: string;
  userId: string;
  templateId: string;
  altTemplateId?: string;
  dueAt: number;
  createdAt: number;
  status: ChallengeStatus;
  startedAt?: number;
  completedAt?: number;
  feedback?: FeedbackType;
  wouldRepeat?: boolean;
  withFriends?: string;
  photoUri?: string;
  hasSwapped: boolean;
  hasSnoozed: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: SocialStatus;
  streak: number;
  completedCount: number;
}

export interface TelemetryEvent {
  type: 'assignment_assigned' | 'challenge_started' | 'challenge_completed' | 'challenge_swapped' | 'challenge_snoozed' | 'feedback_submitted';
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ProgressStats {
  totalCompleted: number;
  byArea: Record<Area, number>;
  currentStreak: number;
  longestStreak: number;
  topMoments: ChallengeAssignment[];
}

export type AchievementCategory = 'streak' | 'total' | 'timing' | 'area' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number;
  unlockedAt?: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: number;
}
