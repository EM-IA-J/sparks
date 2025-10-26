import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Area, Cadence, NotifWindow, NotificationTime } from '../src/types';
import { useUserStore } from '../src/store/useUserStore';
import { Button, Chip, Card } from '../src/components';
import { theme } from '../src/theme';
import { COPY } from '../src/copy';
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

const WINDOW_OPTIONS: { value: NotifWindow; label: string }[] = [
  { value: '6am', label: '6:00 AM' },
  { value: '7am', label: '7:00 AM' },
  { value: '8am', label: '8:00 AM' },
  { value: '9am', label: '9:00 AM' },
  { value: '12pm', label: '12:00 PM' },
  { value: '1pm', label: '1:00 PM' },
  { value: '5pm', label: '5:00 PM' },
  { value: '6pm', label: '6:00 PM' },
  { value: '7pm', label: '7:00 PM' },
  { value: '8pm', label: '8:00 PM' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [cadence, setCadence] = useState<Cadence>('daily');
  const [notifWindow, setNotifWindow] = useState<NotifWindow>('8am');

  // Initialize with 8:00 AM
  const initialDate = new Date();
  initialDate.setHours(8, 0, 0, 0);
  const [selectedTime, setSelectedTime] = useState<Date>(initialDate);
  const [socialOptIn, setSocialOptIn] = useState(false);

  const toggleArea = (area: Area) => {
    setSelectedArea(area);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleComplete = async () => {
    if (!selectedArea) {
      Alert.alert('Hold up!', 'Please select one area to focus on');
      return;
    }

    // Haptic feedback + confetti effect (simplified)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Extract hour and minute from selectedTime
    const notificationTime: NotificationTime = {
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
    };

    try {
      // Request notification permissions
      const permissionsGranted = await NotificationService.requestPermissions();

      if (!permissionsGranted) {
        // User denied permissions - explain and continue
        Alert.alert(
          'Notifications Disabled',
          'To receive daily reminders, please enable notifications in your device Settings → Sparks → Notifications.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Complete onboarding even without notifications
                completeOnboarding([selectedArea], cadence, notifWindow, socialOptIn, notificationTime);
                router.replace('/(tabs)');
              }
            }
          ]
        );
        return;
      }

      // Permissions granted - schedule notification
      await NotificationService.scheduleDailyNotificationWithTime(notificationTime, cadence);

      // Complete onboarding
      completeOnboarding([selectedArea], cadence, notifWindow, socialOptIn, notificationTime);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error setting up notifications:', error);
      Alert.alert(
        'Warning',
        'Could not set up notifications. You can try again in Settings.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Still complete onboarding even if notifications fail
              completeOnboarding([selectedArea], cadence, notifWindow, socialOptIn, notificationTime);
              router.replace('/(tabs)');
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{COPY.onboarding.welcome}</Text>
        <Text style={styles.subtitle}>{COPY.onboarding.subtitle}</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{COPY.onboarding.pickAreas}</Text>
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
        <Text style={styles.sectionTitle}>{COPY.onboarding.pickCadence}</Text>
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
        <Text style={styles.sectionTitle}>{COPY.onboarding.pickWindow}</Text>
        <Text style={styles.helper}>
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
          <Text style={styles.sectionTitle}>{COPY.onboarding.socialToggle}</Text>
          <Switch
            value={socialOptIn}
            onValueChange={setSocialOptIn}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </Card>

      <Button
        title={COPY.onboarding.cta}
        onPress={handleComplete}
        size="lg"
        style={styles.ctaButton}
      />
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
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: theme.spacing.lg,
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
  counter: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    marginTop: theme.spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaButton: {
    marginTop: theme.spacing.lg,
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
