import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotifWindow, NotificationTime, Cadence } from '../types';
import { getHourForWindow } from '../utils/time';
import { COPY } from '../copy';
import { logger } from '../utils/logger';

// --- GLOBAL HANDLER ---
console.log('🟢 NOTIFICATION SERVICE LOADED - v4.0 🟢');
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- INIT CHANNEL (ANDROID) ---
async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

export const NotificationService = {
  /**
   * Request permissions (iOS)
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      await ensureAndroidChannel();
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });
        finalStatus = status;
      }

      logger.log('📱 Notification permissions:', finalStatus);
      return finalStatus === 'granted';
    } catch (err) {
      logger.error('Error requesting notification permissions:', err);
      return false;
    }
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
   * Schedule a daily reminder at chosen window/hour
   */
  async scheduleDaily(window: NotifWindow): Promise<void> {
    if (Platform.OS === 'web') return;

    await ensureAndroidChannel();
    const hour = getHourForWindow(window);

    // Cancel previous daily notifications
    await this.cancelByType('daily_spark');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.dailyTitle,
        body: COPY.notifications.dailyBody,
        sound: true,
        data: { type: 'daily_spark' },
      },
      trigger: {
        hour,
        minute: 0,
        repeats: true, // ✅ correct recurrent trigger for iOS
      },
    });

    logger.log(`✅ Scheduled daily reminder at ${hour}:00`);
  },

  /**
   * Schedule notification - SIMPLE APPROACH
   * Uses the recommended Expo DAILY trigger type for daily cadence
   * For other cadences, uses Date trigger (single notification)
   */
  async scheduleDailyNotificationWithTime(
    notificationTime: NotificationTime,
    cadence: Cadence = 'daily'
  ): Promise<void> {
    if (Platform.OS === 'web') return;
    await ensureAndroidChannel();

    await this.cancelByType('daily_spark');
    logger.log(`📅 Scheduling ${cadence} notification at ${notificationTime.hour}:${notificationTime.minute}`);

    if (cadence === 'daily') {
      // For daily: Use the DAILY trigger type (recommended by Expo docs)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.dailyTitle,
          body: COPY.notifications.dailyBody,
          sound: true,
          data: { type: 'daily_spark' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: notificationTime.hour,
          minute: notificationTime.minute,
        },
      });

      logger.log(`✅ Scheduled DAILY notification at ${notificationTime.hour}:${String(notificationTime.minute).padStart(2, '0')}`);
      return;
    }

    // For other cadences: Schedule next occurrence with Date trigger
    const intervalDays = cadence === 'every2days' ? 2 : cadence === 'every3days' ? 3 : 7;
    const now = new Date();
    const nextDate = new Date();
    nextDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

    // If time has passed today, add interval days
    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + intervalDays);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.dailyTitle,
        body: COPY.notifications.dailyBody,
        sound: true,
        data: { type: 'daily_spark', cadence },
      },
      trigger: {
        date: nextDate,
      },
    });

    logger.log(`✅ Scheduled ${cadence} notification for ${nextDate.toLocaleString()}`);
  },

  /**
   * Schedule gentle nudge (4h after daily)
   */
  async scheduleGentleNudge(notificationTime: NotificationTime, cadence: Cadence = 'daily'): Promise<void> {
    if (Platform.OS === 'web') return;
    await ensureAndroidChannel();

    await this.cancelByType('gentle_nudge');
    const intervalMap = { daily: 1, every2days: 2, every3days: 3, weekly: 7 };
    const interval = intervalMap[cadence] ?? 1;

    const now = new Date();
    let next = new Date();
    next.setHours(notificationTime.hour + 4, notificationTime.minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + interval);

    for (let i = 0; i < 7; i++) {
      const d = new Date(next);
      d.setDate(next.getDate() + i * interval);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: COPY.notifications.gentleNudgeTitle,
          body: COPY.notifications.gentleNudgeBody,
          sound: true,
          data: { type: 'gentle_nudge', iteration: i + 1 },
        },
        trigger: { date: d },
      });

      if (i < 3) logger.log(`✅ Gentle nudge ${i + 1} for ${d.toLocaleString()}`);
    }
  },

  /**
   * Cancel gentle nudge (called when user starts their spark)
   */
  async cancelGentleNudge(): Promise<void> {
    await this.cancelByType('gentle_nudge');
  },

  /**
   * Schedule streak-at-risk (21:00 daily if streak >=3)
   */
  async scheduleStreakAtRisk(streak: number): Promise<void> {
    if (Platform.OS === 'web') return;
    if (streak < 3) {
      logger.log('⏭️ Skipping streak at risk (streak < 3)');
      return;
    }

    await ensureAndroidChannel();
    await this.cancelByType('streak_at_risk');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.streakAtRiskTitle,
        body: COPY.notifications.streakAtRiskBody,
        sound: true,
        data: { type: 'streak_at_risk', streak },
      },
      trigger: {
        hour: 21,
        minute: 0,
        repeats: true,
      },
    });

    logger.log('✅ Scheduled streak-at-risk notification daily at 21:00');
  },

  /**
   * Cancel streak at risk notification
   */
  async cancelStreakAtRisk(): Promise<void> {
    await this.cancelByType('streak_at_risk');
  },

  /**
   * Schedule the next challenge notification based on cadence
   * This is called after completing a challenge to schedule the next one
   */
  async scheduleNextChallengeNotification(
    notificationTime: NotificationTime,
    cadence: Cadence
  ): Promise<void> {
    if (Platform.OS === 'web') return;
    await ensureAndroidChannel();

    // Cancel any existing daily challenge notifications
    await this.cancelByType('daily_spark');

    // Calculate interval days based on cadence
    const intervalMap = { daily: 1, every2days: 2, every3days: 3, weekly: 7 };
    const intervalDays = intervalMap[cadence] ?? 1;

    // Calculate next notification date
    // IMPORTANT: Since we just completed a challenge, we ALWAYS schedule for a future day (not today)
    const now = new Date();
    const nextDate = new Date();
    nextDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

    logger.log(`⏰ Current time: ${now.toLocaleString()}`);
    logger.log(`⏰ Base notification time: ${nextDate.toLocaleString()}`);

    // Always add at least 1 day (tomorrow minimum), then add additional days for other cadences
    nextDate.setDate(nextDate.getDate() + intervalDays);

    logger.log(`⏰ Final scheduled time (after +${intervalDays} days): ${nextDate.toLocaleString()}`);

    const hoursUntil = (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    logger.log(`⏰ Hours until notification: ${hoursUntil.toFixed(1)} hours`);

    // Schedule the notification with proper timestamp trigger
    const trigger = nextDate.getTime(); // Convert to timestamp (milliseconds since epoch)

    logger.log(`🔔 Scheduling with timestamp: ${trigger}`);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: COPY.notifications.dailyTitle,
        body: COPY.notifications.dailyBody,
        sound: true,
        data: { type: 'daily_spark', cadence },
      },
      trigger, // Use timestamp directly
    });

    logger.log(`✅ Scheduled next ${cadence} challenge for ${nextDate.toLocaleString()}`);
    logger.log(`📍 Notification ID: ${notificationId}`);
  },

  /**
   * Cancel notifications selectively by data.type
   */
  async cancelByType(type: string): Promise<void> {
    if (Platform.OS === 'web') return;

    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if (n.content.data?.type === type) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
        logger.log(`🗑️ Cancelled ${type}: ${n.identifier}`);
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

  /**
   * Debug: list all scheduled notifications
   */
  async listAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    const all = await Notifications.getAllScheduledNotificationsAsync();
    logger.log('📋 Currently scheduled notifications:', all.length);
    all.forEach((n, i) =>
      logger.log(`${i + 1}. ${n.content.title} [${n.content.data?.type}]`)
    );
  },
};
