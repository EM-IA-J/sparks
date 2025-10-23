import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types';
import { theme } from '../theme';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: number; // Optional progress for partially completed achievements
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  progress,
}) => {
  const progressPercent = progress !== undefined ? Math.min((progress / achievement.requirement) * 100, 100) : 0;

  return (
    <View style={[styles.container, !unlocked && styles.locked]}>
      {/* Icon */}
      <View style={[styles.iconContainer, !unlocked && styles.lockedIcon]}>
        <Text style={styles.icon}>{unlocked ? achievement.icon : '🔒'}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, !unlocked && styles.lockedText]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, !unlocked && styles.lockedText]}>
          {achievement.description}
        </Text>

        {/* Progress bar for locked achievements */}
        {!unlocked && progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress}/{achievement.requirement}
            </Text>
          </View>
        )}

        {/* Unlocked date */}
        {unlocked && achievement.unlockedAt && (
          <Text style={styles.unlockedDate}>
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  locked: {
    borderColor: theme.colors.border,
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  lockedIcon: {
    backgroundColor: theme.colors.borderLight,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  lockedText: {
    color: theme.colors.textMuted,
  },
  progressContainer: {
    marginTop: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  unlockedDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
