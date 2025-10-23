import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Button } from './Button';
import { theme } from '../theme';

interface BreathingExerciseProps {
  onComplete: (feeling?: string) => void;
  isFirstTime: boolean;
}

type Phase = 'inhale' | 'hold' | 'exhale';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete, isFirstTime }) => {
  const [showOptions, setShowOptions] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [remainingSeconds, setRemainingSeconds] = useState(4);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showFeeling, setShowFeeling] = useState(false);

  const title = isFirstTime
    ? "I invite you to do a short breathing exercise to get grounded and present."
    : "Welcome to today's breathing exercise.";

  const description =
    "After pressing the button, you can close your eyes and inhale for 4 seconds, hold your breath for 4 seconds and exhale for 4 seconds. While doing this, focus on counting. The alarm will sound once the time is up.";

  // Handle duration selection
  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes);
    setShowOptions(false);
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleNeverShow = () => {
    onComplete('never');
  };

  // Breathing timer logic
  useEffect(() => {
    if (!selectedDuration || showOptions || showFeeling) return;

    const timer = setInterval(() => {
      setTotalElapsed((prev) => prev + 1);
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
          } else {
            // Completed one cycle (inhale -> hold -> exhale = 12 seconds)
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, selectedDuration, showOptions, showFeeling]);

  // Play peaceful alarm sound
  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' }, // Peaceful bell sound
        { shouldPlay: true, volume: 0.7 }
      );

      // Unload sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      // Add haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Error playing alarm sound:', error);
      // Fallback to haptic only
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Check if breathing session is complete
  useEffect(() => {
    if (selectedDuration && totalElapsed >= selectedDuration * 60) {
      playAlarmSound();
      setShowFeeling(true);
    }
  }, [totalElapsed, selectedDuration]);

  // Animate circle based on phase
  useEffect(() => {
    if (showOptions || showFeeling) return;

    let targetValue = 0.8;
    let duration = 4000;

    if (phase === 'inhale') {
      targetValue = 1.3;
      duration = 4000;
    } else if (phase === 'hold') {
      targetValue = 1.3;
      duration = 4000;
    } else if (phase === 'exhale') {
      targetValue = 0.8;
      duration = 4000;
    }

    Animated.timing(scaleAnim, {
      toValue: targetValue,
      duration,
      useNativeDriver: true,
    }).start();
  }, [phase, showOptions, showFeeling]);

  const handleFeelingSelect = (feeling: string) => {
    onComplete(feeling);
  };

  // Show feeling selection after breathing
  if (showFeeling) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>How do you feel?</Text>
        <View style={styles.feelingRow}>
          <Button title="💩" onPress={() => handleFeelingSelect('bad')} size="lg" style={styles.feelingBtn} />
          <Button title="😐" onPress={() => handleFeelingSelect('meh')} size="lg" style={styles.feelingBtn} />
          <Button title="🙂" onPress={() => handleFeelingSelect('good')} size="lg" style={styles.feelingBtn} />
          <Button title="🔥" onPress={() => handleFeelingSelect('fire')} size="lg" style={styles.feelingBtn} />
        </View>
      </View>
    );
  }

  // Show duration options
  if (showOptions) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.durationLabel}>Choose how many minutes you want the exercise to last:</Text>

        <View style={styles.durationGrid}>
          <Button title="1 MIN" onPress={() => handleDurationSelect(1)} size="md" style={styles.durationBtn} />
          <Button title="2 MIN" onPress={() => handleDurationSelect(2)} size="md" style={styles.durationBtn} />
          <Button title="3 MIN" onPress={() => handleDurationSelect(3)} size="md" style={styles.durationBtn} />
          <Button title="4 MIN" onPress={() => handleDurationSelect(4)} size="md" style={styles.durationBtn} />
          <Button title="5 MIN" onPress={() => handleDurationSelect(5)} size="md" style={styles.durationBtn} />
        </View>

        <Button
          title="SKIP THIS TIME"
          onPress={handleSkip}
          variant="outline"
          size="md"
          style={styles.skipBtn}
        />
        <Button
          title="DO NOT SHOW THIS SUGGESTION AGAIN"
          onPress={handleNeverShow}
          variant="outline"
          size="sm"
          style={styles.neverBtn}
        />
      </View>
    );
  }

  // Show breathing exercise
  const phaseText = phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out';
  const phaseColor =
    phase === 'inhale' ? theme.colors.primary : phase === 'hold' ? '#FBBC04' : theme.colors.secondary;

  const progressPercent = ((totalElapsed / (selectedDuration! * 60)) * 100).toFixed(0);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {Math.floor(totalElapsed / 60)}:{(totalElapsed % 60).toString().padStart(2, '0')} / {selectedDuration}:00
      </Text>
      <Text style={styles.progressText}>{progressPercent}% complete</Text>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: phaseColor,
            },
          ]}
        />
      </View>

      <Text style={styles.phase}>{phaseText}</Text>
      <Text style={styles.timer}>{remainingSeconds}</Text>
      <Text style={styles.instruction}>Focus on counting</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.bg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.sm,
  },
  durationLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  durationBtn: {
    minWidth: 90,
  },
  skipBtn: {
    marginTop: theme.spacing.lg,
    minWidth: 220,
  },
  neverBtn: {
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  progressText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
  },
  circleContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.xxl,
    position: 'relative',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  phase: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  timer: {
    fontSize: 72,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    letterSpacing: 4,
  },
  instruction: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  feelingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl,
  },
  feelingBtn: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
});
