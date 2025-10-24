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

    console.log('📅 Scheduling notifications:', { notificationTime, cadence });

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
        default:
          return 1;
      }
    };

    const interval = getDayInterval(cadence);

    // For daily cadence, use CalendarTrigger with repeats
    if (interval === 1) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.dailyTitle,
          body: COPY.notifications.dailyBody,
          sound: true,
          data: { type: 'daily_spark' },
        },
        trigger: {
          hour: notificationTime.hour,
          minute: notificationTime.minute,
          repeats: true,
        },
      });

      console.log('✅ Daily notification scheduled:', notificationId, 'at', `${notificationTime.hour}:${notificationTime.minute}`);
    } else {
      // For other cadences, schedule next 30 notifications individually
      const now = new Date();
      let nextDate = new Date();

      // Find the next occurrence
      nextDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      for (let i = 0; i < 30; i++) {
        const notificationDate = new Date(nextDate);
        notificationDate.setDate(nextDate.getDate() + (i * interval));

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: COPY.notifications.dailyTitle,
            body: COPY.notifications.dailyBody,
            sound: true,
            data: { type: 'daily_spark', iteration: i },
          },
          trigger: {
            date: notificationDate,
          },
        });

        console.log(`✅ Notification ${i + 1}/30 scheduled for:`, notificationDate.toLocaleString());
      }
    }

    // Debug: List all scheduled notifications
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('📋 Total scheduled notifications:', allNotifications.length);
  },

  /**
   * Schedule gentle nudge notification (4 hours after daily notification)
   * Only if user hasn't started their spark
   */
  async scheduleGentleNudge(notificationTime: NotificationTime): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Cancel any existing gentle nudge
    await this.cancelGentleNudge();

    // Calculate 4 hours after the daily notification time
    const nudgeDate = new Date();
    nudgeDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);
    nudgeDate.setHours(nudgeDate.getHours() + 4);

    // If the nudge time is in the past today, schedule for tomorrow
    const now = new Date();
    if (nudgeDate <= now) {
      nudgeDate.setDate(nudgeDate.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.gentleNudgeTitle,
        body: COPY.notifications.gentleNudgeBody,
        sound: true,
        data: { type: 'gentle_nudge' },
      },
      trigger: {
        hour: nudgeDate.getHours(),
        minute: nudgeDate.getMinutes(),
        repeats: true,
      },
    });

    console.log('✅ Gentle nudge scheduled:', notificationId, 'at', `${nudgeDate.getHours()}:${nudgeDate.getMinutes()}`);
  },

  /**
   * Cancel gentle nudge (called when user starts their spark)
   */
  async cancelGentleNudge(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Get all scheduled notifications and cancel those with type 'gentle_nudge'
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allNotifications) {
      if (notification.content.data?.type === 'gentle_nudge') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log('🗑️ Cancelled gentle nudge:', notification.identifier);
      }
    }
  },

  /**
   * Schedule streak at risk notification (9pm daily)
   * Only if user has streak >= 3 days
   */
  async scheduleStreakAtRisk(streak: number): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Cancel any existing streak at risk notification
    await this.cancelStreakAtRisk();

    // Only schedule if streak is 3 or more days
    if (streak < 3) {
      console.log('⏭️ Skipping streak at risk notification (streak < 3)');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.streakAtRiskTitle,
        body: COPY.notifications.streakAtRiskBody.replace('{X}', streak.toString()),
        sound: true,
        data: { type: 'streak_at_risk', streak },
      },
      trigger: {
        hour: 21, // 9:00 PM
        minute: 0,
        repeats: true,
      },
    });

    console.log('✅ Streak at risk notification scheduled:', notificationId, `(${streak}-day streak)`);
  },

  /**
   * Cancel streak at risk notification
   */
  async cancelStreakAtRisk(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allNotifications) {
      if (notification.content.data?.type === 'streak_at_risk') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log('🗑️ Cancelled streak at risk:', notification.identifier);
      }
    }
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
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    if (Platform.OS === 'web') {
      return [];
    }
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};
