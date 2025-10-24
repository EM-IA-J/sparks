import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotifWindow, NotificationTime, Cadence } from '../types';
import { getHourForWindow, getTomorrowAtHour } from '../utils/time';
import { COPY } from '../copy';
import { logger } from '../utils/logger';

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
   * Clean up past notifications (already fired)
   * This helps keep the notification queue clean
   */
  async cleanupPastNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    const now = new Date();
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of allNotifications) {
      if (notification.trigger && 'date' in notification.trigger) {
        const triggerDate = new Date(notification.trigger.date);

        // Cancel if notification is in the past
        if (triggerDate < now) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          logger.log('🗑️ Cleaned up past notification:', notification.identifier);
        }
      }
    }
  },

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
        projectId: '197a85c4-64b1-438f-bc1b-888857bba20d',
      });
      return token.data;
    } catch (error) {
      logger.error('Error getting push token:', error);
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
   * Uses exact date calculations for reliability
   */
  async scheduleDailyNotificationWithTime(
    notificationTime: NotificationTime,
    cadence: Cadence = 'daily'
  ): Promise<void> {
    if (Platform.OS === 'web') {
      return; // Skip for web
    }

    logger.log('📅 Scheduling notifications with exact dates:', { notificationTime, cadence });

    // Clean up any past notifications first
    await this.cleanupPastNotifications();

    // Cancel existing daily notifications
    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allNotifications) {
      if (notification.content.data?.type === 'daily_spark') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

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
    const now = new Date();

    // Calculate the first notification time
    let nextDate = new Date();
    nextDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

    // If the time has already passed today, start from tomorrow
    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    // Schedule the next 30 occurrences
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

      if (i < 3) { // Log first 3 for debugging
        logger.log(`✅ Notification ${i + 1} scheduled for:`, notificationDate.toLocaleString());
      }
    }

    // Debug: List all scheduled notifications
    const allNotificationsAfter = await Notifications.getAllScheduledNotificationsAsync();
    const dailySparks = allNotificationsAfter.filter(n => n.content.data?.type === 'daily_spark');
    logger.log('📋 Total daily spark notifications scheduled:', dailySparks.length);
  },

  /**
   * Schedule gentle nudge notification (4 hours after daily notification)
   * Only if user hasn't started their spark
   * Uses exact dates for reliability and respects user's cadence
   */
  async scheduleGentleNudge(notificationTime: NotificationTime, cadence: Cadence = 'daily'): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Cancel any existing gentle nudge
    await this.cancelGentleNudge();

    const now = new Date();

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

    // Calculate the first nudge time (4 hours after daily notification)
    let nextDate = new Date();
    nextDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);
    nextDate.setHours(nextDate.getHours() + 4); // Add 4 hours

    // If the time has already passed today, start from tomorrow
    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + interval);
    }

    // Schedule the next 30 gentle nudges respecting cadence
    for (let i = 0; i < 30; i++) {
      const notificationDate = new Date(nextDate);
      notificationDate.setDate(nextDate.getDate() + (i * interval));

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.gentleNudgeTitle,
          body: COPY.notifications.gentleNudgeBody,
          sound: true,
          data: { type: 'gentle_nudge', iteration: i },
        },
        trigger: {
          date: notificationDate,
        },
      });

      if (i < 3) { // Log first 3 for debugging
        logger.log(`✅ Gentle nudge ${i + 1} scheduled for:`, notificationDate.toLocaleString());
      }
    }

    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const nudges = allNotifications.filter(n => n.content.data?.type === 'gentle_nudge');
    logger.log('📋 Total gentle nudges scheduled:', nudges.length);
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
        logger.log('🗑️ Cancelled gentle nudge:', notification.identifier);
      }
    }
  },

  /**
   * Schedule streak at risk notification (9pm daily)
   * Only if user has streak >= 3 days
   * Uses exact dates for reliability
   */
  async scheduleStreakAtRisk(streak: number): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Cancel any existing streak at risk notification
    await this.cancelStreakAtRisk();

    // Only schedule if streak is 3 or more days
    if (streak < 3) {
      logger.log('⏭️ Skipping streak at risk notification (streak < 3)');
      return;
    }

    const now = new Date();

    // Calculate the first notification time (9:00 PM)
    let nextDate = new Date();
    nextDate.setHours(21, 0, 0, 0); // 9:00 PM

    // If 9pm has already passed today, start from tomorrow
    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    // Schedule the next 30 streak at risk notifications (one per day)
    for (let i = 0; i < 30; i++) {
      const notificationDate = new Date(nextDate);
      notificationDate.setDate(nextDate.getDate() + i);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.streakAtRiskTitle,
          body: COPY.notifications.streakAtRiskBody,
          sound: true,
          data: { type: 'streak_at_risk', streak, iteration: i },
        },
        trigger: {
          date: notificationDate,
        },
      });

      if (i < 3) { // Log first 3 for debugging
        logger.log(`✅ Streak at risk ${i + 1} scheduled for:`, notificationDate.toLocaleString());
      }
    }

    const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const streakNotifs = allNotifications.filter(n => n.content.data?.type === 'streak_at_risk');
    logger.log(`📋 Total streak at risk notifications scheduled: ${streakNotifs.length} (${streak}-day streak)`);
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
        logger.log('🗑️ Cancelled streak at risk:', notification.identifier);
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
