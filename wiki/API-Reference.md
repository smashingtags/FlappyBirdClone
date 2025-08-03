# API Reference

This document provides comprehensive API documentation for all components, hooks, utilities, and types in Sky Dash.

## 📚 Table of Contents

- [Components](#-components)
- [Hooks](#-hooks)
- [Utilities](#-utilities)
- [Types](#-types)
- [Constants](#-constants)

## 🧩 Components

### Bird

The main player character component with physics-based animation.

**File:** [`src/components/Bird.tsx`](../src/components/Bird.tsx)

```typescript
interface BirdProps {
  bird: BirdState;
}

const Bird: React.FC<BirdProps> = ({ bird }) => { ... }
```

**Props:**
- `bird: BirdState` - Current bird state including position, velocity, and rotation

**Features:**
- Animated transforms for position and rotation
- Visual representation with body, wing, and eye elements
- Responsive to velocity changes for realistic movement

**Styling:**
- `styles.bird` - Main container (32x24px)
- `styles.birdBody` - Golden body with rounded corners
- `styles.birdWing` - Orange wing overlay
- `styles.birdEye` - Black circular eye

---

### Pipe

Obstacle component representing top and bottom pipe segments.

**File:** [`src/components/Pipe.tsx`](../src/components/Pipe.tsx)

```typescript
interface PipeProps {
  pipe: PipeState;
}

const Pipe: React.FC<PipeProps> = ({ pipe }) => { ... }
```

**Props:**
- `pipe: PipeState` - Pipe configuration including position and heights

**Features:**
- Renders both top and bottom pipe segments
- Dynamic height based on random generation
- Positioned absolutely for smooth scrolling

**Styling:**
- `styles.pipe` - Green pipe with gradient and borders
- Dynamic height and positioning based on props

---

### Ground

Static ground/floor component at the bottom of the screen.

**File:** [`src/components/Ground.tsx`](../src/components/Ground.tsx)

```typescript
const Ground: React.FC = () => { ... }
```

**Features:**
- Fixed position at bottom of screen
- Visual ground texture
- Collision boundary for bird

**Styling:**
- `styles.ground` - Brown ground with texture pattern
- Fixed height of 100px

---

### ScoreDisplay

UI component for displaying current score and high score.

**File:** [`src/components/ScoreDisplay.tsx`](../src/components/ScoreDisplay.tsx)

```typescript
interface ScoreDisplayProps {
  score: number;
  highScore?: number;
  showHighScore?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  highScore, 
  showHighScore 
}) => { ... }
```

**Props:**
- `score: number` - Current game score
- `highScore?: number` - Best score achieved (optional)
- `showHighScore?: boolean` - Whether to display high score (optional)

**Features:**
- Large, readable score display
- Optional high score display
- Styled with shadows and monospace font

---

## 🎣 Hooks

### useGamePhysics

Core game logic hook managing all game state and physics.

**File:** [`src/hooks/useGamePhysics.ts`](../src/hooks/useGamePhysics.ts)

```typescript
export const useGamePhysics = () => {
  // Returns game state and control functions
}
```

**Returns:**
```typescript
{
  // Game State
  bird: BirdState;
  pipes: PipeState[];
  score: number;
  highScore: number;
  gameState: GameState;
  
  // Control Functions
  jump: () => void;
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}
```

**State Management:**
- `bird` - Current bird position, velocity, and rotation
- `pipes` - Array of active pipe obstacles
- `score` - Current game score
- `highScore` - Persistent high score from storage
- `gameState` - Current game state ('START' | 'PLAYING' | 'GAME_OVER' | 'PAUSED')

**Control Functions:**

#### `jump()`
Makes the bird jump by applying upward velocity.
- Only works when `gameState === 'PLAYING'`
- Sets velocity to `PHYSICS_CONFIG.JUMP_VELOCITY` (-8)
- Tilts bird upward (rotation: -20°)

#### `startGame()`
Transitions from START to PLAYING state.
- Changes `gameState` to 'PLAYING'
- Generates first pipe obstacle
- Starts game loop

#### `resetGame()`
Resets game to initial state after game over.
- Updates high score if current score is higher
- Resets bird to starting position
- Clears all pipes
- Resets score to 0
- Changes `gameState` to 'START'

#### `pauseGame()` / `resumeGame()`
Pause and resume game functionality.
- Pauses/resumes game loop
- Maintains current game state

**Internal Functions:**

#### `updateBird()`
Updates bird physics each frame:
```typescript
const updateBird = useCallback(() => {
  setBird((prevBird) => {
    let newVelocity = prevBird.velocity + PHYSICS_CONFIG.GRAVITY;
    newVelocity = Math.min(newVelocity, PHYSICS_CONFIG.TERMINAL_VELOCITY);
    
    const newY = prevBird.y + newVelocity;
    const newRotation = calculateBirdRotation(newVelocity);
    
    return { ...prevBird, y: newY, velocity: newVelocity, rotation: newRotation };
  });
}, []);
```

#### `updatePipes()`
Manages pipe movement and generation:
- Moves existing pipes left by `PIPE_SPEED`
- Removes off-screen pipes
- Generates new pipes when needed

#### `checkCollisions()`
Detects collisions and triggers game over:
- Bird vs. ground collision
- Bird vs. ceiling collision  
- Bird vs. pipe collision

#### `updateScore()`
Updates score when bird passes pipes:
- Checks if bird has passed each pipe
- Increments score for newly passed pipes
- Marks pipes as passed to prevent double-counting

---

## 🛠️ Utilities

### Physics Utils

**File:** [`src/utils/physics.ts`](../src/utils/physics.ts)

#### Constants

```typescript
export const PHYSICS_CONFIG: PhysicsConfig = {
  GRAVITY: 0.5,              // Downward acceleration per frame
  JUMP_VELOCITY: -8,         // Upward velocity on jump
  TERMINAL_VELOCITY: 10,     // Maximum fall speed
  PIPE_SPEED: 2,             // Horizontal pipe movement speed
  PIPE_GAP: 200,             // Vertical gap between pipe segments
  BIRD_SIZE: { width: 32, height: 24 },
  PIPE_WIDTH: 52,
};

export const SCREEN_DIMENSIONS = {
  WIDTH: number;             // Screen width
  HEIGHT: number;            // Screen height
  GROUND_HEIGHT: 100;        // Ground component height
};
```

#### Functions

##### `calculateBirdRotation(velocity: number): number`
Calculates bird rotation based on velocity for realistic movement.
- **Parameters:** `velocity` - Current bird velocity
- **Returns:** Rotation angle in degrees (-20° to 45°)
- **Formula:** `Math.min(Math.max(velocity * 3, -20), 45)`

##### `generateRandomPipeHeight(): { topHeight: number; bottomHeight: number }`
Generates random pipe heights with consistent gap.
- **Returns:** Object with top and bottom pipe heights
- **Logic:** Places gap randomly between 20% and 80% of screen height

##### `isOffScreen(x: number): boolean`
Checks if a pipe has moved off the left side of screen.
- **Parameters:** `x` - Pipe x position
- **Returns:** `true` if pipe is off-screen (x < -PIPE_WIDTH)

##### `shouldGenerateNewPipe(lastPipeX: number): boolean`
Determines when to generate a new pipe.
- **Parameters:** `lastPipeX` - X position of the last pipe
- **Returns:** `true` if new pipe should be generated
- **Logic:** Generates when last pipe is 180px from right edge

---

### Collision Utils

**File:** [`src/utils/collision.ts`](../src/utils/collision.ts)

#### Functions

##### `createCollisionBox(x: number, y: number, width: number, height: number): CollisionBox`
Creates a collision box object.
- **Parameters:** Position and dimensions
- **Returns:** `CollisionBox` object

##### `checkAABBCollision(box1: CollisionBox, box2: CollisionBox): boolean`
Axis-Aligned Bounding Box collision detection.
- **Parameters:** Two collision boxes to test
- **Returns:** `true` if boxes overlap
- **Algorithm:** Standard AABB overlap test

##### `getBirdCollisionBox(bird: BirdState): CollisionBox`
Creates collision box for bird with forgiving hitbox.
- **Parameters:** `bird` - Current bird state
- **Returns:** Collision box slightly smaller than sprite (2px padding)
- **Purpose:** Makes gameplay more forgiving

##### `getPipeCollisionBoxes(pipe: PipeState): CollisionBox[]`
Creates collision boxes for top and bottom pipe segments.
- **Parameters:** `pipe` - Pipe state
- **Returns:** Array of two collision boxes [topPipe, bottomPipe]

##### `checkBirdPipeCollision(bird: BirdState, pipe: PipeState): boolean`
Tests collision between bird and pipe.
- **Parameters:** Bird and pipe states
- **Returns:** `true` if collision detected
- **Logic:** Tests bird box against both pipe segments

##### `checkBirdGroundCollision(bird: BirdState): boolean`
Tests if bird has hit the ground.
- **Parameters:** `bird` - Bird state
- **Returns:** `true` if bird bottom touches ground

##### `checkBirdCeilingCollision(bird: BirdState): boolean`
Tests if bird has hit the ceiling.
- **Parameters:** `bird` - Bird state  
- **Returns:** `true` if bird top is above screen

##### `checkBirdPassedPipe(bird: BirdState, pipe: PipeState): boolean`
Tests if bird has passed a pipe for scoring.
- **Parameters:** Bird and pipe states
- **Returns:** `true` if bird has passed pipe and pipe not already marked as passed

---

### Storage Utils

**File:** [`src/utils/storage.ts`](../src/utils/storage.ts)

#### Functions

##### `getHighScore(): Promise<number>`
Retrieves high score from AsyncStorage.
- **Returns:** Promise resolving to high score (0 if none saved)
- **Error Handling:** Returns 0 if storage read fails

##### `updateHighScore(newScore: number): Promise<number>`
Updates high score if new score is higher.
- **Parameters:** `newScore` - Score to potentially save
- **Returns:** Promise resolving to the high score (current or new)
- **Logic:** Only updates if newScore > currentHighScore

---

## 📝 Types

**File:** [`src/types/index.ts`](../src/types/index.ts)

### GameState
```typescript
export type GameState = 'START' | 'PLAYING' | 'GAME_OVER' | 'PAUSED';
```
Represents the current state of the game.

### GameStateInterface
```typescript
export interface GameStateInterface {
  gameState: GameState;
  score: number;
  highScore: number;
  bird: BirdState;
  pipes: PipeState[];
}
```
Complete game state interface.

### BirdState
```typescript
export interface BirdState {
  x: number;        // Horizontal position
  y: number;        // Vertical position
  velocity: number; // Current vertical velocity
  rotation: number; // Rotation angle in degrees
}
```
Represents bird position and physics state.

### PipeState
```typescript
export interface PipeState {
  id: string;           // Unique identifier
  x: number;            // Horizontal position
  topHeight: number;    // Height of top pipe segment
  bottomHeight: number; // Height of bottom pipe segment
  passed: boolean;      // Whether bird has passed this pipe
}
```
Represents pipe obstacle state.

### PhysicsConfig
```typescript
export interface PhysicsConfig {
  GRAVITY: number;
  JUMP_VELOCITY: number;
  TERMINAL_VELOCITY: number;
  PIPE_SPEED: number;
  PIPE_GAP: number;
  BIRD_SIZE: { width: number; height: number };
  PIPE_WIDTH: number;
}
```
Configuration for physics constants.

### CollisionBox
```typescript
export interface CollisionBox {
  x: number;      // Left edge
  y: number;      // Top edge
  width: number;  // Box width
  height: number; // Box height
}
```
Represents a rectangular collision boundary.

---

## 📊 Constants

### Screen Dimensions
- `SCREEN_DIMENSIONS.WIDTH` - Device screen width
- `SCREEN_DIMENSIONS.HEIGHT` - Device screen height
- `SCREEN_DIMENSIONS.GROUND_HEIGHT` - Ground component height (100px)

### Physics Constants
- `PHYSICS_CONFIG.GRAVITY` - Downward acceleration (0.5 px/frame)
- `PHYSICS_CONFIG.JUMP_VELOCITY` - Jump velocity (-8 px/frame)
- `PHYSICS_CONFIG.TERMINAL_VELOCITY` - Max fall speed (10 px/frame)
- `PHYSICS_CONFIG.PIPE_SPEED` - Pipe movement speed (2 px/frame)
- `PHYSICS_CONFIG.PIPE_GAP` - Gap between pipe segments (200px)
- `PHYSICS_CONFIG.BIRD_SIZE` - Bird dimensions (32x24px)
- `PHYSICS_CONFIG.PIPE_WIDTH` - Pipe width (52px)

### Game Loop
- **Frame Rate:** 60 FPS (16ms intervals)
- **Update Order:** Bird → Pipes → Collisions → Score

---

## 🔗 Usage Examples

### Using the Game Hook
```typescript
const GameScreen: React.FC = () => {
  const {
    bird,
    pipes,
    score,
    gameState,
    jump,
    startGame,
    resetGame
  } = useGamePhysics();

  const handlePress = () => {
    if (gameState === 'START') startGame();
    else if (gameState === 'PLAYING') jump();
    else if (gameState === 'GAME_OVER') resetGame();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Bird bird={bird} />
      {pipes.map(pipe => <Pipe key={pipe.id} pipe={pipe} />)}
      <ScoreDisplay score={score} />
    </TouchableOpacity>
  );
};
```

### Custom Physics Configuration
```typescript
// Modify physics for different gameplay
const CUSTOM_PHYSICS = {
  ...PHYSICS_CONFIG,
  GRAVITY: 0.3,        // Lighter gravity
  JUMP_VELOCITY: -10,  // Higher jumps
  PIPE_SPEED: 3,       // Faster pipes
};
```

### Testing Collision Detection
```typescript
import { checkBirdPipeCollision } from '../utils/collision';

const bird: BirdState = { x: 100, y: 200, velocity: 0, rotation: 0 };
const pipe: PipeState = { 
  id: 'test', 
  x: 120, 
  topHeight: 150, 
  bottomHeight: 200, 
  passed: false 
};

const hasCollision = checkBirdPipeCollision(bird, pipe);
```

---

**Need more details?** Check out the [Game Architecture](Game-Architecture) for design patterns and [Game Design](Game-Design) for gameplay mechanics.