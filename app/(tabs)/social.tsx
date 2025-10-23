import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useUserStore } from '../../src/store/useUserStore';
import { useAssignmentStore } from '../../src/store/useAssignmentStore';
import { Button, Card, AchievementBadge } from '../../src/components';
import { theme } from '../../src/theme';
import { COPY } from '../../src/copy';
import { ACHIEVEMENTS } from '../../src/data/achievements.seed';
import { AchievementService } from '../../src/services/achievements';

export default function SocialScreen() {
  const user = useUserStore((state) => state.user);
  const friends = useSettingsStore((state) => state.friends);
  const nudgeFriend = useSettingsStore((state) => state.nudgeFriend);
  const history = useAssignmentStore((state) => state.history);

  const handleNudge = (friendId: string, friendName: string) => {
    nudgeFriend(friendId);
    Alert.alert('Nudge sent!', `You nudged ${friendName}`);
  };

  const handleInvite = async () => {
    try {
      const completedCount = history.filter((a) => a.status === 'completed').length;

      const message = `⚡️ Join me on Sparks!\n\n✨ Activate your life with daily micro-challenges\n🔥 Build consistency and grow together\n💪 ${completedCount > 0 ? `I've already completed ${completedCount} sparks` : 'Start your journey today'}\n\nOne spark at a time. Let's grow! ⚡️`;

      await Share.share({
        message,
        title: 'Join me on Sparks!',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to share invitation');
    }
  };

  // Sort friends by streak
  const sortedFriends = [...friends].sort((a, b) => b.streak - a.streak);

  // Get achievements with unlock status and progress
  const achievementsWithStatus = ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = user?.achievements?.some(
      (a) => a.achievementId === achievement.id
    ) ?? false;

    const progress = user
      ? AchievementService.getAchievementProgress(achievement.id, user, history)
      : 0;

    const unlockedAt = user?.achievements?.find(
      (a) => a.achievementId === achievement.id
    )?.unlockedAt;

    return {
      ...achievement,
      unlockedAt,
      unlocked: isUnlocked,
      progress,
    };
  });

  // Sort: unlocked first (by unlock date), then locked (by progress)
  const sortedAchievements = achievementsWithStatus.sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (a.unlocked && b.unlocked) {
      return (b.unlockedAt ?? 0) - (a.unlockedAt ?? 0);
    }
    return b.progress - a.progress;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{COPY.social.title}</Text>

      {user && (
        <Card style={styles.userCard}>
          <View style={styles.rankRow}>
            <Text style={styles.rankEmoji}>👑</Text>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>You</Text>
              <Text style={styles.rankStat}>
                {user.streak} day streak · {user.streak * 3} sparks
              </Text>
            </View>
          </View>
        </Card>
      )}

      <Text style={styles.sectionTitle}>{COPY.social.leaderboard}</Text>

      {sortedFriends.map((friend, index) => (
        <Card key={friend.id} style={styles.friendCard}>
          <View style={styles.friendRow}>
            <Text style={styles.friendRank}>#{index + 2}</Text>
            <Text style={styles.friendAvatar}>{friend.avatar}</Text>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendStat}>
                {friend.streak} day streak · {friend.completedCount} sparks
              </Text>
            </View>
            {friend.status === 'accepted' && (
              <Button
                title={COPY.social.nudge}
                onPress={() => handleNudge(friend.id, friend.name)}
                variant="outline"
                size="sm"
              />
            )}
          </View>
        </Card>
      ))}

      {friends.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>{COPY.social.noFriendsYet}</Text>
        </Card>
      )}

      <Button
        title={COPY.social.invite}
        onPress={handleInvite}
        size="md"
        style={styles.inviteButton}
      />

      <Text style={styles.sectionTitle}>Achievements</Text>

      {sortedAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          unlocked={achievement.unlocked}
          progress={achievement.progress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  userCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  rankStat: {
    fontSize: theme.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  friendCard: {
    marginBottom: theme.spacing.sm,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendRank: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.sm,
    width: 32,
  },
  friendAvatar: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  friendStat: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  inviteButton: {
    marginTop: theme.spacing.xl,
  },
});
