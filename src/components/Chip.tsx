import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import { Area } from '../types';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  area?: Area;
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress, area }) => {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const backgroundColor = selected
    ? area
      ? theme.colors.areas[area]
      : theme.colors.primary
    : theme.colors.borderLight;

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor }]}
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  textSelected: {
    color: '#FFFFFF',
    fontWeight: theme.fontWeight.semibold,
  },
});
