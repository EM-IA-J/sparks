import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function TestBreathing() {
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animate circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: '#4285F4',
            }
          ]}
        />
      </View>
      <Text style={styles.text}>Should be breathing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  circleContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.8,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});
