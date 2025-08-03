import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  score: number;
  highScore?: number;
  showHighScore?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  highScore = 0,
  showHighScore = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>{score}</Text>
      {showHighScore && (
        <Text style={styles.highScoreText}>Best: {highScore}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    fontFamily: 'monospace',
  },
  highScoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginTop: 4,
    fontFamily: 'monospace',
  },
});

export default ScoreDisplay;
