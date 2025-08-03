// Game state types
export type GameState = 'START' | 'PLAYING' | 'GAME_OVER' | 'PAUSED';

// Main game state interface
export interface GameStateInterface {
  gameState: GameState;
  score: number;
  highScore: number;
  bird: BirdState;
  pipes: PipeState[];
}

// Bird state
export interface BirdState {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

// Pipe state
export interface PipeState {
  id: string;
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

// Physics configuration
export interface PhysicsConfig {
  GRAVITY: number;
  JUMP_VELOCITY: number;
  TERMINAL_VELOCITY: number;
  PIPE_SPEED: number;
  PIPE_GAP: number;
  BIRD_SIZE: {
    width: number;
    height: number;
  };
  PIPE_WIDTH: number;
}

// Collision detection
export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}