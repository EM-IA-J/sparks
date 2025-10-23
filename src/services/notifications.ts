import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotifWindow, NotificationTime, Cadence } from '../types';
import { getHourForWindow, getTomorrowAtHour } from '../utils/time';
import { COPY } from '../copy';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false; // Web doesn't support push notifications via expo-notifications
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  /**
   * Get push token for device
   */
  async getPushToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with actual project ID
      });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  },

  /**
   * Schedule daily notification at user's preferred time
   */
  async scheduleDailyNotification(window: NotifWindow): Promise<void> {
    if (Platform.OS === 'web') {
      return; // Skip for web
    }

    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hour = getHourForWindow(window);
    const tomorrow = getTomorrowAtHour(hour);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.dailyTitle,
        body: COPY.notifications.dailyBody,
        sound: true,
      },
      trigger: {
        date: tomorrow,
        repeats: true,
      },
    });
  },

  /**
   * Schedule notifications at user's preferred time respecting their cadence
   */
  async scheduleDailyNotificationWithTime(
    notificationTime: NotificationTime,
    cadence: Cadence = 'daily'
  ): Promise<void> {
    if (Platform.OS === 'web') {
      return; // Skip for web
    }

    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Calculate interval based on cadence
    const getDayInterval = (cad: Cadence): number => {
      switch (cad) {
        case 'daily':
          return 1;
        case 'every2days':
          return 2;
        case 'every3days':
          return 3;
        case 'weekly':
          return 7;
        case 'recommended':
          return 1; // fallback to daily
        default:
          return 1;
      }
    };

    const interval = getDayInterval(cadence);

    // For daily cadence, use repeating notification
    if (interval === 1) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.dailyTitle,
          body: COPY.notifications.dailyBody,
          sound: true,
        },
        trigger: {
          date: tomorrow,
          repeats: true,
        },
      });
    } else {
      // For other cadences, schedule next 30 notifications individually
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + interval);
      baseDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

      for (let i = 0; i < 30; i++) {
        const notificationDate = new Date(baseDate);
        notificationDate.setDate(baseDate.getDate() + (i * interval));

        await Notifications.scheduleNotificationAsync({
          content: {
            title: COPY.notifications.dailyTitle,
            body: COPY.notifications.dailyBody,
            sound: true,
          },
          trigger: {
            date: notificationDate,
          },
        });
      }
    }
  },

  /**
   * Schedule "time's up" notification for in-progress challenge
   */
  async scheduleTimerNotification(durationMin: number): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.timerUpTitle,
        body: COPY.notifications.timerUpBody,
        sound: true,
      },
      trigger: {
        seconds: durationMin * 60,
      },
    });

    return notificationId;
  },

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  /**
   * Cancel all scheduled notifications
   */
  async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * Send immediate notification when spark starts
   */
  async sendSparkStartNotification(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.sparkStartTitle,
        body: COPY.notifications.sparkStartBody,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  },

  /**
   * Send immediate notification when spark completes
   */
  async sendSparkCompleteNotification(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.sparkCompleteTitle,
        body: COPY.notifications.sparkCompleteBody,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  },

  /**
   * Send immediate notification after user provides feedback
   */
  async sendFeedbackCompleteNotification(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.feedbackCompleteTitle,
        body: COPY.notifications.feedbackCompleteBody,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  },
};
