import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SCREEN_DIMENSIONS } from '../utils/physics';

const Ground: React.FC = () => {
  return (
    <View style={styles.ground}>
      <View style={styles.groundPattern} />
    </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_DIMENSIONS.GROUND_HEIGHT,
    backgroundColor: '#8B4513',
    zIndex: 15,
  },
  groundPattern: {
    flex: 1,
    backgroundColor: '#654321',
    borderTopWidth: 4,
    borderTopColor: '#A0522D',
  },
});

export default Ground;