import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { useUserStore } from '../store/useUserStore';

export const UserProfile: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  // Generate initials from user ID (mock until we have real names)
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.id.slice(0, 2).toUpperCase();
  };

  // Generate consistent color based on user ID
  const getAvatarColor = () => {
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.areas.health,
      theme.colors.areas.creativity,
      theme.colors.areas.nature,
      theme.colors.areas.focus,
    ];
    const index = user.id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handlePress = () => {
    router.push('/settings');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.greeting}>Hey there!</Text>
        <Text style={styles.streak}>🔥 {user.streak} day streak</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: getAvatarColor() }]}>
        <Text style={styles.initials}>{getInitials()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  info: {
    marginRight: theme.spacing.md,
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  streak: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  initials: {
    fontSize: theme.fontSize.base,
    color: '#FFFFFF',
    fontWeight: theme.fontWeight.bold,
  },
});
