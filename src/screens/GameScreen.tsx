import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useGamePhysics } from '../hooks/useGamePhysics';
import Bird from '../components/Bird';
import Pipe from '../components/Pipe';
import Ground from '../components/Ground';
import ScoreDisplay from '../components/ScoreDisplay';

const GameScreen: React.FC = () => {
  const {
    bird,
    pipes,
    score,
    highScore,
    gameState,
    jump,
    startGame,
    resetGame,
  } = useGamePhysics();

  const handleScreenPress = () => {
    if (gameState === 'START') {
      startGame();
    } else if (gameState === 'PLAYING') {
      jump();
    } else if (gameState === 'GAME_OVER') {
      resetGame();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableOpacity
        style={styles.gameArea}
        onPress={handleScreenPress}
        activeOpacity={1}
      >
        {/* Background */}
        <View style={styles.background}>
          <View style={styles.sky} />
          <View style={styles.clouds} />
        </View>

        {/* Game Objects */}
        <Bird bird={bird} />

        {pipes.map((pipe) => (
          <Pipe key={pipe.id} pipe={pipe} />
        ))}

        <Ground />

        {/* Score Display */}
        {gameState === 'PLAYING' && (
          <View style={styles.scoreContainer}>
            <ScoreDisplay score={score} />
          </View>
        )}

        {/* Game State Overlays */}
        {gameState === 'START' && (
          <View style={styles.overlay}>
            <Text style={styles.titleText}>Sky Dash</Text>
            <Text style={styles.instructionText}>Tap to Start</Text>
            <ScoreDisplay
              score={0}
              highScore={highScore}
              showHighScore={true}
            />
          </View>
        )}

        {gameState === 'GAME_OVER' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <View style={styles.finalScoreContainer}>
              <Text style={styles.finalScoreLabel}>Score</Text>
              <Text style={styles.finalScoreValue}>{score}</Text>
              {score > 0 && score === highScore && (
                <Text style={styles.newRecordText}>New Record!</Text>
              )}
              <Text style={styles.bestScoreText}>Best: {highScore}</Text>
            </View>
            <Text style={styles.restartText}>Tap to Play Again</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameArea: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sky: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  clouds: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
  scoreContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 25,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  instructionText: {
    fontSize: 24,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  finalScoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  finalScoreLabel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  finalScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    fontFamily: 'monospace',
  },
  newRecordText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'monospace',
  },
  bestScoreText: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    opacity: 0.8,
    fontFamily: 'monospace',
  },
  restartText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    fontFamily: 'monospace',
  },
});

export default GameScreen;
