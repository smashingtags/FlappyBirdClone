import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { BirdState } from '../types';

interface BirdProps {
  bird: BirdState;
}

const Bird: React.FC<BirdProps> = ({ bird }) => {
  const animatedStyle = {
    transform: [
      { translateX: bird.x },
      { translateY: bird.y },
      { rotate: `${bird.rotation}deg` },
    ],
  };

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      <View style={styles.birdBody} />
      <View style={styles.birdWing} />
      <View style={styles.birdEye} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bird: {
    position: 'absolute',
    width: 32,
    height: 24,
    zIndex: 10,
  },
  birdBody: {
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  birdWing: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: 16,
    height: 12,
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  birdEye: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});

export default Bird;
