import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '../../src/store/useUserStore';
import { useAssignmentStore } from '../../src/store/useAssignmentStore';
import { Button, Card, TimerRing, Chip, BreathingExercise, UserProfile } from '../../src/components';
import { AssignerService } from '../../src/services/assigner';
import { NotificationService } from '../../src/services/notifications';
import { StorageService } from '../../src/services/storage';
import { AchievementService } from '../../src/services/achievements';
import { ACHIEVEMENTS } from '../../src/data/achievements.seed';
import { theme } from '../../src/theme';
import { COPY } from '../../src/copy';
import { FeedbackType } from '../../src/types';
import { shouldShowBreathing, getStepNumber, getCompletedChallengesCount } from '../../src/utils/progression';

const DEFAULT_TIMER = 20 * 60; // 20 minutes default

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const incrementStreak = useUserStore((state) => state.incrementStreak);
  const unlockAchievement = useUserStore((state) => state.unlockAchievement);

  const {
    currentAssignment,
    history,
    setCurrentAssignment,
    startChallenge,
    completeChallenge,
    swapChallenge,
    addToHistory,
  } = useAssignmentStore();

  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_TIMER);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const currentTemplate = currentAssignment
    ? AssignerService.getTemplate(currentAssignment.templateId)
    : null;

  const altTemplate = currentAssignment?.altTemplateId
    ? AssignerService.getTemplate(currentAssignment.altTemplateId)
    : null;

  // Load or assign challenge on mount
  useEffect(() => {
    // Check user is ready AND has valid areas array
    if (!user || !user.onboardingCompleted || !user.areas || user.areas.length === 0) {
      console.log('User not ready:', user);
      return;
    }

    // If no current assignment or it's completed, assign new one
    if (!currentAssignment || currentAssignment.status === 'completed' || currentAssignment.status === 'expired') {
      console.log('Assigning new challenge for user:', user);
      try {
        const newAssignment = AssignerService.assignDailyChallenge(user, history);
        console.log('New assignment created:', newAssignment);
        setCurrentAssignment(newAssignment);
      } catch (error) {
        console.error('Error assigning challenge:', error);
      }
    }
  }, [user, currentAssignment]);

  // Sync remaining seconds with current template duration when not running
  useEffect(() => {
    if (!timerRunning && currentAssignment?.status === 'assigned' && currentTemplate) {
      const templateSeconds = currentTemplate.durationMin ? currentTemplate.durationMin * 60 : DEFAULT_TIMER;
      setRemainingSeconds(templateSeconds);
    }
  }, [currentTemplate, currentAssignment?.status, timerRunning]);

  // Restore timer state on mount
  useEffect(() => {
    const restoreTimer = async () => {
      if (currentAssignment?.status !== 'started') return;

      const timerState = await StorageService.getTimerState();
      if (timerState) {
        const { startTime, totalSeconds } = timerState;
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = totalSeconds - elapsedSeconds;

        if (remaining > 0) {
          setRemainingSeconds(remaining);
          setTimerRunning(true);
        } else {
          // Timer already finished
          handleTimerComplete();
        }
      }
    };

    restoreTimer();
  }, [currentAssignment?.status]);

  // Handle app state changes (background/foreground) to keep timer accurate
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // When app comes to foreground from background
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Recalculate timer based on stored start time
        if (timerRunning || currentAssignment?.status === 'started') {
          const timerState = await StorageService.getTimerState();
          if (timerState) {
            const { startTime, totalSeconds } = timerState;
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const remaining = totalSeconds - elapsedSeconds;

            if (remaining > 0) {
              setRemainingSeconds(remaining);
              if (!timerRunning) {
                setTimerRunning(true);
              }
            } else {
              // Timer finished while in background
              handleTimerComplete();
            }
          }
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [timerRunning, currentAssignment?.status]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerRunning]);

  const handleTimerComplete = async () => {
    setTimerRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Clear timer state from storage
    await StorageService.clearTimerState();

    // Check if there's follow-up content to show
    if (currentTemplate?.followUp && currentTemplate.followUp.length > 0) {
      setShowFollowUp(true);
    } else {
      setShowFeedback(true);
    }
  };

  const handleStart = async () => {
    startChallenge();

    // Cancel gentle nudge since user started the challenge
    await NotificationService.cancelGentleNudge();

    // Check if breathing should be shown:
    // 1. User has not opted out (breathingPreference !== 'never')
    // 2. User has completed at least 2 challenges (stepNumber >= 3)
    const canShowBreathing = user?.breathingPreference !== 'never' && shouldShowBreathing(history);

    if (!canShowBreathing) {
      // Skip breathing, go straight to timer
      setTimerRunning(true);
      const totalSeconds = currentTemplate?.durationMin ? currentTemplate.durationMin * 60 : DEFAULT_TIMER;
      await StorageService.saveTimerState(Date.now(), totalSeconds);
    } else {
      setShowBreathing(true);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Handlers for breathing exercise Back/Skip
  const handleBreathingBack = () => {
    // Go back to the pre-challenge state (cancel the start)
    setShowBreathing(false);
    // Reset challenge status back to assigned
    if (currentAssignment) {
      useAssignmentStore.getState().updateAssignment({ status: 'assigned', startedAt: undefined });
    }
  };

  const handleBreathingSkip = async () => {
    // Skip breathing and go straight to challenge timer
    setShowBreathing(false);
    setTimerRunning(true);
    const totalSeconds = currentTemplate?.durationMin ? currentTemplate.durationMin * 60 : DEFAULT_TIMER;
    await StorageService.saveTimerState(Date.now(), totalSeconds);
  };

  const handleBreathingComplete = async (feeling?: string) => {
    // Handle breathing preference updates
    if (feeling === 'never') {
      updateUser({ breathingPreference: 'never', isFirstBreathing: false });
    } else if (feeling) {
      // User selected a feeling (calm, happy, energized, neutral)
      // Mark as no longer first time
      if (user?.isFirstBreathing) {
        updateUser({ isFirstBreathing: false });
      }
      // Could log the feeling for analytics here
    } else {
      // User skipped - still mark as no longer first time
      if (user?.isFirstBreathing) {
        updateUser({ isFirstBreathing: false });
      }
    }

    setShowBreathing(false);
    setTimerRunning(true);

    // Save timer start time for persistence
    const totalSeconds = currentTemplate?.durationMin ? currentTemplate.durationMin * 60 : DEFAULT_TIMER;
    await StorageService.saveTimerState(Date.now(), totalSeconds);
  };

  const handleComplete = async () => {
    setTimerRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Clear timer state from storage
    await StorageService.clearTimerState();

    // Check if there's follow-up content to show
    if (currentTemplate?.followUp && currentTemplate.followUp.length > 0) {
      setShowFollowUp(true);
    } else {
      setShowFeedback(true);
    }
  };

  // Handler to proceed from follow-up to feedback
  const handleFollowUpComplete = () => {
    setShowFollowUp(false);
    setShowFeedback(true);
  };

  const handleFeedback = async (feedback: FeedbackType, wouldRepeat: boolean) => {
    completeChallenge(feedback, wouldRepeat);
    incrementStreak();
    setShowFeedback(false);

    // Update streak at risk notification with new streak
    if (user) {
      const newStreak = user.streak + 1; // Streak just incremented
      await NotificationService.scheduleStreakAtRisk(newStreak);
    }

    // Check for newly unlocked achievements
    // Include the just-completed challenge in the history for accurate counting
    if (user && currentAssignment) {
      const updatedAssignment = {
        ...currentAssignment,
        status: 'completed' as const,
        completedAt: Date.now(),
        feedback,
        wouldRepeat,
      };
      const historyWithCurrent = [...history, updatedAssignment];

      const newlyUnlocked = AchievementService.checkAchievements(user, historyWithCurrent);

      // Unlock achievements and show alert if any were unlocked
      newlyUnlocked.forEach((achievementId) => {
        unlockAchievement(achievementId);
      });

      if (newlyUnlocked.length > 0) {
        const achievementTitles = newlyUnlocked
          .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.title)
          .filter(Boolean)
          .join(', ');

        Alert.alert(
          '🎉 Achievement Unlocked!',
          `You unlocked: ${achievementTitles}`,
          [
            { text: 'View Achievements', onPress: () => router.push('/(tabs)/social') },
            { text: 'Close', style: 'cancel' }
          ]
        );
      }
    }

    // Assign new challenge after completion
    if (user) {
      const newAssignment = AssignerService.assignDailyChallenge(user, history);
      setCurrentAssignment(newAssignment);
      // Note: remainingSeconds will be synced by useEffect based on new template
    }
  };

  const handleSwap = () => {
    if (!currentAssignment || currentAssignment.hasSwapped || !currentAssignment.altTemplateId) {
      Alert.alert('Cannot swap', 'You can only swap once per challenge');
      return;
    }

    // Mark the old challenge as skipped and add to history
    const skippedAssignment = {
      ...currentAssignment,
      status: 'skipped' as const,
    };
    addToHistory(skippedAssignment);

    swapChallenge();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset timer states when swapping
    setTimerRunning(false);
    setShowBreathing(false);
    // Note: remainingSeconds will be synced by useEffect based on new template

    // Create a new assignment with the swapped challenge
    if (user) {
      const newAssignment = {
        id: `assignment_${Date.now()}`,
        userId: user.id,
        templateId: currentAssignment.altTemplateId,
        altTemplateId: currentTemplate?.id,
        dueAt: currentAssignment.dueAt,
        createdAt: Date.now(),
        status: 'assigned' as const,
        hasSwapped: true,
        hasSnoozed: false,
      };

      setCurrentAssignment(newAssignment);
    }
  };

  // Loading state - also check if user has valid areas array
  if (!user || !user.onboardingCompleted || !user.areas || user.areas.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loading}>Complete onboarding to get started!</Text>
          <Text style={styles.debug}>Please reset the app data in Settings or reinstall.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentTemplate) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loading}>Loading your challenge...</Text>
          <Text style={styles.debug}>User areas: {user.areas?.join(', ') || 'none'}</Text>
          <Text style={styles.debug}>Has assignment: {currentAssignment ? 'yes' : 'no'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Full screen breathing exercise modal
  if (showBreathing) {
    return (
      <Modal visible={true} animationType="fade">
        <View style={styles.breathingModal}>
          <BreathingExercise
            onComplete={handleBreathingComplete}
            onBack={handleBreathingBack}
            onSkip={handleBreathingSkip}
            isFirstTime={user?.isFirstBreathing ?? true}
          />
        </View>
      </Modal>
    );
  }

  // Follow-up screen - shown after challenge completion if followUp content exists
  if (showFollowUp && currentTemplate?.followUp && currentTemplate.followUp.length > 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.followUpCard}>
          <Text style={styles.followUpTitle}>Reflection</Text>
          <Text style={styles.followUpSubtitle}>Take a moment to think about:</Text>
          {currentTemplate.followUp.map((question, index) => (
            <View key={index} style={styles.followUpItem}>
              <Text style={styles.followUpNumber}>{index + 1}.</Text>
              <Text style={styles.followUpText}>{question}</Text>
            </View>
          ))}
          <Button
            title="Continue"
            onPress={handleFollowUpComplete}
            size="lg"
            style={styles.followUpButton}
          />
        </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (showFeedback) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{COPY.home.howWasIt}</Text>
          <View style={styles.feedbackRow}>
            <Button title="💩" onPress={() => handleFeedback('bad', false)} size="lg" style={styles.feedbackBtn} />
            <Button title="😐" onPress={() => handleFeedback('meh', false)} size="lg" style={styles.feedbackBtn} />
            <Button title="🙂" onPress={() => handleFeedback('good', true)} size="lg" style={styles.feedbackBtn} />
            <Button title="🔥" onPress={() => handleFeedback('fire', true)} size="lg" style={styles.feedbackBtn} />
          </View>
        </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Determine if this is the first challenge
  const isFirstSpark = history.length === 0;
  const greetingText = isFirstSpark ? COPY.home.firstSpark : COPY.home.nextSpark;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>{greetingText}</Text>
          <UserProfile />
        </View>

      {user && (
        <Text style={styles.streak}>🔥 {user.streak} day streak</Text>
      )}

      {/* Show explainer text only when challenge is not started */}
      {currentAssignment?.status === 'assigned' && (
        <Text style={styles.explainer}>{COPY.home.startExplainer}</Text>
      )}

      {/* Show challenge details only after starting */}
      {currentAssignment?.status === 'started' && (
        <>
          <Card style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.title}>{currentTemplate.title}</Text>
              <Text style={styles.short}>{currentTemplate.short}</Text>
            </View>

            {currentTemplate.steps && currentTemplate.steps.length > 0 && (
              <View style={styles.steps}>
                {currentTemplate.steps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.tags}>
              {currentTemplate.areaTags.map((tag) => (
                <Chip key={tag} label={tag} area={tag} selected />
              ))}
            </View>
          </Card>

          {/* Alternative challenge shown during active challenge for premium users */}
          {altTemplate && !currentAssignment?.hasSwapped && (
            <Card style={styles.altCard}>
              <Text style={styles.altLabel}>Alternative:</Text>
              {user?.isPremium ? (
                <>
                  <Text style={styles.altTitle}>{altTemplate.title}</Text>
                  <Button
                    title={COPY.home.swap}
                    onPress={handleSwap}
                    variant="outline"
                    size="sm"
                  />
                </>
              ) : (
                <Text style={styles.premiumText}>Only available for premium users</Text>
              )}
            </Card>
          )}

          <View style={styles.timerSection}>
            <TimerRing
              totalSeconds={currentTemplate?.durationMin ? currentTemplate.durationMin * 60 : DEFAULT_TIMER}
              remainingSeconds={remainingSeconds}
              size={90}
            />
          </View>
        </>
      )}

      <View style={styles.actions}>
        {currentAssignment?.status === 'assigned' && (
          <Button title={COPY.home.start} onPress={handleStart} size="md" />
        )}

        {currentAssignment?.status === 'started' && (
          <View style={styles.buttonRow}>
            <Button
              title={COPY.home.completed}
              onPress={handleComplete}
              size="md"
              style={styles.halfButton}
            />
            <Button
              title={COPY.home.giveUp}
              onPress={handleComplete}
              variant="outline"
              size="md"
              style={styles.halfButton}
            />
          </View>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  loading: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
  debug: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  greeting: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  streak: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  explainer: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  challengeCard: {
    marginBottom: theme.spacing.md,
  },
  challengeHeader: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  short: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
  },
  steps: {
    marginBottom: theme.spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  stepNumber: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  altCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.borderLight,
  },
  altLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  altTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  premiumText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  breathingSection: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  timerSection: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  actions: {
    gap: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  feedbackCard: {
    marginTop: theme.spacing.xxl,
  },
  feedbackTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  feedbackBtn: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  breathingModal: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  skipButton: {
    marginTop: theme.spacing.xxl,
    minWidth: 120,
  },
  // Follow-up screen styles
  followUpCard: {
    marginTop: theme.spacing.xl,
  },
  followUpTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  followUpSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  followUpItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  followUpNumber: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  followUpText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    lineHeight: 24,
  },
  followUpButton: {
    marginTop: theme.spacing.lg,
  },
});
