import { Dimensions } from 'react-native';
import { PhysicsConfig } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const PHYSICS_CONFIG: PhysicsConfig = {
  GRAVITY: 0.5,
  JUMP_VELOCITY: -8,
  TERMINAL_VELOCITY: 10,
  PIPE_SPEED: 2,
  PIPE_GAP: 200,
  BIRD_SIZE: { width: 32, height: 24 },
  PIPE_WIDTH: 52,
};

export const SCREEN_DIMENSIONS = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
  GROUND_HEIGHT: 100,
};

export const calculateBirdRotation = (velocity: number): number => {
  return Math.min(Math.max(velocity * 3, -20), 45);
};

export const generateRandomPipeHeight = (): { topHeight: number; bottomHeight: number } => {
  const minGapY = SCREEN_HEIGHT * 0.2;
  const maxGapY = SCREEN_HEIGHT * 0.8;
  const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
  
  return {
    topHeight: gapY - PHYSICS_CONFIG.PIPE_GAP / 2,
    bottomHeight: SCREEN_HEIGHT - gapY - PHYSICS_CONFIG.PIPE_GAP / 2 - SCREEN_DIMENSIONS.GROUND_HEIGHT,
  };
};

export const isOffScreen = (x: number): boolean => {
  return x < -PHYSICS_CONFIG.PIPE_WIDTH;
};

export const shouldGenerateNewPipe = (lastPipeX: number): boolean => {
  return lastPipeX < SCREEN_WIDTH - 180;
};