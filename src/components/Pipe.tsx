import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PipeState } from '../types';
import { SCREEN_DIMENSIONS } from '../utils/physics';

interface PipeProps {
  pipe: PipeState;
}

const Pipe: React.FC<PipeProps> = ({ pipe }) => {
  return (
    <View style={[styles.pipeContainer, { left: pipe.x }]}>
      {/* Top Pipe */}
      <View style={[styles.pipe, styles.topPipe, { height: pipe.topHeight }]}>
        <View style={styles.pipeBody} />
        <View style={styles.pipeCapTop} />
      </View>
      
      {/* Bottom Pipe */}
      <View 
        style={[
          styles.pipe, 
          styles.bottomPipe, 
          { 
            height: pipe.bottomHeight,
            bottom: SCREEN_DIMENSIONS.GROUND_HEIGHT 
          }
        ]}
      >
        <View style={styles.pipeCapBottom} />
        <View style={styles.pipeBody} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pipeContainer: {
    position: 'absolute',
    width: 52,
    height: '100%',
    zIndex: 5,
  },
  pipe: {
    position: 'absolute',
    width: 52,
  },
  topPipe: {
    top: 0,
  },
  bottomPipe: {
    position: 'absolute',
  },
  pipeBody: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#2E7D32',
  },
  pipeCapTop: {
    position: 'absolute',
    bottom: 0,
    width: 56,
    height: 24,
    left: -2,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 4,
  },
  pipeCapBottom: {
    position: 'absolute',
    top: 0,
    width: 56,
    height: 24,
    left: -2,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 4,
  },
});

export default Pipe;