import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Share, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserStore } from '../src/store/useUserStore';
import { useAssignmentStore } from '../src/store/useAssignmentStore';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { Button, Card, Chip } from '../src/components';
import { theme } from '../src/theme';
import { COPY } from '../src/copy';
import { Area, Cadence, NotifWindow, NotificationTime } from '../src/types';
import { StorageService } from '../src/services/storage';
import { NotificationService } from '../src/services/notifications';

const AREA_OPTIONS: { value: Area; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'social', label: 'Social' },
  { value: 'nature', label: 'Nature' },
  { value: 'focus', label: 'Focus' },
  { value: 'money', label: 'Money' },
  { value: 'romance', label: 'Romance' },
  { value: 'selflove', label: 'Self-love' },
];

const CADENCE_OPTIONS: { value: Cadence; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'every2days', label: 'Every Other Day' },
  { value: 'every3days', label: 'Every 3 Days' },
  { value: 'weekly', label: 'Weekly' },
];

export default function SettingsScreen() {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const resetUser = useUserStore((state) => state.reset);
  const resetAssignments = useAssignmentStore((state) => state.reset);
  const resetSettings = useSettingsStore((state) => state.reset);

  // Change to single area selection like onboarding
  const [selectedArea, setSelectedArea] = useState<Area | null>(
    user?.areas && user.areas.length > 0 ? user.areas[0] : null
  );
  const [cadence, setCadence] = useState<Cadence>(user?.cadence || 'daily');
  const [notifWindow, setNotifWindow] = useState<NotifWindow>(user?.notifWindow || '8am');

  // Initialize selectedTime from user's notificationTime or default to 8:00 AM
  const initialDate = new Date();
  if (user?.notificationTime) {
    initialDate.setHours(user.notificationTime.hour, user.notificationTime.minute, 0, 0);
  } else {
    initialDate.setHours(8, 0, 0, 0);
  }
  const [selectedTime, setSelectedTime] = useState<Date>(initialDate);
  const [socialOptIn, setSocialOptIn] = useState(user?.socialOptIn || false);

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const toggleArea = (area: Area) => {
    setSelectedArea(area);
  };

  const handleSave = async () => {
    if (!selectedArea) {
      Alert.alert('Error', 'Please select an area to focus on');
      return;
    }

    const notificationTime: NotificationTime = {
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
    };

    try {
      // Update notification schedule with new time and cadence
      await NotificationService.scheduleDailyNotificationWithTime(notificationTime, cadence);

      // Update gentle nudge (4 hours after daily notification)
      await NotificationService.scheduleGentleNudge(notificationTime, cadence);

      // Update streak at risk notification based on current streak
      if (user?.streak) {
        await NotificationService.scheduleStreakAtRisk(user.streak);
      }

      // Update user settings
      updateUser({
        areas: [selectedArea], // Save as single-item array
        cadence,
        notifWindow,
        notificationTime,
        socialOptIn,
      });

      Alert.alert('Saved', 'Your settings have been updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert(
        'Error',
        'Could not update notifications. Please try again.',
        [
          {
            text: 'OK',
          }
        ]
      );
    }
  };

  const handleShareProgress = async () => {
    if (!user) return;

    try {
      const completedCount = useAssignmentStore.getState().history.filter(
        (a) => a.status === 'completed'
      ).length;

      const message = `🔥 I'm on a ${user.streak}-day streak with Sparks!\n\n✨ ${completedCount} challenges completed\n💪 Growing in: ${user.areas.join(', ')}\n\nJoin me in activating your life, one spark at a time! ⚡️`;

      await Share.share({
        message,
        title: 'My Sparks Progress',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to share progress');
    }
  };

  const handleReset = () => {
    Alert.alert(
      COPY.settings.resetAll,
      COPY.settings.resetConfirm,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await StorageService.clearAll();
            resetUser();
            resetAssignments();
            resetSettings();
            Alert.alert('Reset complete', 'All data has been cleared');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{COPY.settings.title}</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{COPY.settings.areas}</Text>
        <Text style={styles.helper}>Pick one area to focus on</Text>
        <View style={styles.chipContainer}>
          {AREA_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={selectedArea === option.value}
              onPress={() => toggleArea(option.value)}
              area={option.value}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{COPY.settings.cadence}</Text>
        <View style={styles.chipContainer}>
          {CADENCE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={cadence === option.value}
              onPress={() => setCadence(option.value)}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{COPY.settings.window}</Text>
        <Text style={styles.timeDisplay}>
          {selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.timePickerContainer}>
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            style={styles.timePicker}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.toggleRow}>
          <Text style={styles.sectionTitle}>{COPY.settings.socialOptIn}</Text>
          <Switch
            value={socialOptIn}
            onValueChange={setSocialOptIn}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </Card>

      <Button
        title="Save changes"
        onPress={handleSave}
        size="md"
        style={styles.saveButton}
      />

      <Button
        title="⚡️ Share My Progress"
        onPress={handleShareProgress}
        variant="outline"
        size="md"
        style={styles.shareButton}
      />

      <Card style={[styles.section, styles.dangerZone]}>
        <Text style={styles.dangerTitle}>{COPY.settings.dangerZone}</Text>
        <Button
          title={COPY.settings.resetAll}
          onPress={handleReset}
          variant="danger"
          size="md"
        />
      </Card>
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
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  helper: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  shareButton: {
    marginBottom: theme.spacing.xl,
  },
  dangerZone: {
    borderColor: theme.colors.error,
    borderWidth: 2,
    marginTop: theme.spacing.xl,
  },
  dangerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  timeDisplay: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  timePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  timePicker: {
    width: '100%',
    height: 200,
  },
});
