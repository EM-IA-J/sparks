import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = theme.colors.primary }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderLeftWidth: 3,
    minWidth: 80,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  icon: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.xxs,
  },
  value: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
