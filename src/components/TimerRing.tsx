import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';
import { formatDuration } from '../utils/time';

interface TimerRingProps {
  totalSeconds: number;
  remainingSeconds: number;
  size?: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  totalSeconds,
  remainingSeconds,
  size = 90,
}) => {
  const progress = remainingSeconds / totalSeconds;
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scaleAnim]);

  const circleSize = size * progress;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Background circle */}
        <View style={[styles.circle, styles.circleBackground, { width: size, height: size, borderRadius: size / 2 }]} />

        {/* Breathing circle */}
        <Animated.View
          style={[
            styles.progressCircle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              opacity: 0.3 + (progress * 0.6),
              transform: [{ scale: scaleAnim }],
            }
          ]}
        />

        {/* Time display */}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{formatDuration(remainingSeconds)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  circleBackground: {
    backgroundColor: theme.colors.borderLight,
  },
  progressCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary,
  },
  timeDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timeText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
});
