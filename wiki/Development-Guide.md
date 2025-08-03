# Development Guide

This guide outlines the coding standards, development workflow, and contribution guidelines for Sky Dash. Following these practices ensures code quality, maintainability, and smooth collaboration.

## 📋 Table of Contents

- [Development Environment](#-development-environment)
- [Coding Standards](#-coding-standards)
- [Project Structure Guidelines](#-project-structure-guidelines)
- [Git Workflow](#-git-workflow)
- [Code Review Process](#-code-review-process)
- [Testing Requirements](#-testing-requirements)
- [Performance Guidelines](#-performance-guidelines)
- [Documentation Standards](#-documentation-standards)

## 🛠️ Development Environment

### Required Tools

```bash
# Core tools
Node.js >= 16.0
npm >= 8.0
React Native CLI
TypeScript 4.8+

# Development tools
ESLint
Prettier
Git

# Platform tools
Android Studio (for Android)
Xcode (for iOS, macOS only)
```

### IDE Configuration

**Recommended: Visual Studio Code**

Essential extensions:
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native"
  ]
}
```

**Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📝 Coding Standards

### TypeScript Guidelines

#### 1. Type Safety
```typescript
// ✅ Good: Explicit types
interface BirdProps {
  bird: BirdState;
  onJump?: () => void;
}

// ❌ Bad: Any types
const handleInput = (data: any) => { ... }

// ✅ Good: Proper typing
const handleInput = (data: TouchEvent) => { ... }
```

#### 2. Interface Naming
```typescript
// ✅ Good: Descriptive interface names
interface GameStateInterface { ... }
interface BirdState { ... }
interface PhysicsConfig { ... }

// ❌ Bad: Generic names
interface Data { ... }
interface Props { ... }
```

#### 3. Function Types
```typescript
// ✅ Good: Explicit return types for public functions
export const calculateBirdRotation = (velocity: number): number => {
  return Math.min(Math.max(velocity * 3, -20), 45);
};

// ✅ Good: Callback types
type GameEventHandler = () => void;
type ScoreUpdateHandler = (score: number) => void;
```

### React/React Native Guidelines

#### 1. Component Structure
```typescript
// ✅ Good: Functional component with proper typing
interface BirdProps {
  bird: BirdState;
}

const Bird: React.FC<BirdProps> = ({ bird }) => {
  // Component logic here
  
  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      {/* JSX content */}
    </Animated.View>
  );
};

export default Bird;
```

#### 2. Hook Usage
```typescript
// ✅ Good: Custom hooks with clear naming
export const useGamePhysics = () => {
  const [bird, setBird] = useState<BirdState>(initialBirdState);
  
  const jump = useCallback(() => {
    // Jump logic
  }, [gameState]);
  
  return { bird, jump };
};

// ✅ Good: Dependency arrays
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]);
```

#### 3. State Management
```typescript
// ✅ Good: Immutable state updates
setBird(prevBird => ({
  ...prevBird,
  velocity: PHYSICS_CONFIG.JUMP_VELOCITY,
  rotation: -20
}));

// ❌ Bad: Direct mutation
bird.velocity = PHYSICS_CONFIG.JUMP_VELOCITY;
setBird(bird);
```

### Styling Guidelines

#### 1. StyleSheet Usage
```typescript
// ✅ Good: Organized styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  bird: {
    position: 'absolute',
    width: 32,
    height: 24,
    zIndex: 10,
  },
  // Group related styles
  birdBody: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
  },
});
```

#### 2. Style Organization
```typescript
// ✅ Good: Logical grouping
const styles = StyleSheet.create({
  // Layout styles
  container: { ... },
  gameArea: { ... },
  
  // Component styles
  bird: { ... },
  pipe: { ... },
  
  // Text styles
  titleText: { ... },
  scoreText: { ... },
});
```

### Naming Conventions

#### Files and Directories
```
✅ Good:
src/components/Bird.tsx
src/hooks/useGamePhysics.ts
src/utils/collision.ts

❌ Bad:
src/Components/bird.tsx
src/Hooks/game-physics.ts
src/Utils/Collision.ts
```

#### Variables and Functions
```typescript
// ✅ Good: Descriptive names
const calculateBirdRotation = (velocity: number) => { ... };
const checkBirdPipeCollision = (bird: BirdState, pipe: PipeState) => { ... };

// ✅ Good: Boolean naming
const isOffScreen = (x: number) => { ... };
const shouldGenerateNewPipe = (lastPipeX: number) => { ... };

// ✅ Good: Event handlers
const handleScreenPress = () => { ... };
const handleGameStart = () => { ... };
```

#### Constants
```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
export const PHYSICS_CONFIG = {
  GRAVITY: 0.5,
  JUMP_VELOCITY: -8,
  TERMINAL_VELOCITY: 10,
};

export const SCREEN_DIMENSIONS = {
  WIDTH: screenWidth,
  HEIGHT: screenHeight,
};
```

## 🏗️ Project Structure Guidelines

### Directory Organization
```
src/
├── components/          # Reusable UI components
│   ├── Bird.tsx        # One component per file
│   ├── Pipe.tsx
│   └── index.ts        # Barrel exports
├── screens/            # Screen-level components
├── hooks/              # Custom React hooks
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### File Organization Rules

1. **One component per file**
2. **Index files for barrel exports**
3. **Co-locate related files**
4. **Separate concerns clearly**

### Import/Export Guidelines

```typescript
// ✅ Good: Barrel exports in index.ts
export { default as Bird } from './Bird';
export { default as Pipe } from './Pipe';
export { default as Ground } from './Ground';

// ✅ Good: Named exports for utilities
export const calculateBirdRotation = (velocity: number) => { ... };
export const checkCollision = (box1: CollisionBox, box2: CollisionBox) => { ... };

// ✅ Good: Import organization
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useGamePhysics } from '../hooks/useGamePhysics';
import { Bird, Pipe, Ground } from '../components';
import { PHYSICS_CONFIG } from '../utils/physics';
```

## 🔄 Git Workflow

### Branch Strategy

```bash
main                    # Production-ready code
├── develop            # Integration branch
├── feature/bird-animation    # Feature branches
├── feature/sound-effects
├── bugfix/collision-detection
└── hotfix/critical-bug
```

### Commit Message Format

```bash
# Format: type(scope): description

feat(physics): add bird rotation based on velocity
fix(collision): resolve pipe collision detection bug
docs(readme): update installation instructions
style(components): format Bird component code
refactor(hooks): extract collision logic to separate function
test(physics): add unit tests for gravity calculations
chore(deps): update React Native to 0.72.6
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code restructuring (no feature changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Guidelines

#### PR Title Format
```
feat(physics): Add realistic bird rotation animation
fix(collision): Resolve false positive pipe collisions
docs(wiki): Add comprehensive API documentation
```

#### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots/Videos
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🔍 Code Review Process

### Review Checklist

#### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] No performance regressions
- [ ] Game mechanics feel smooth

#### Code Quality
- [ ] TypeScript types are correct
- [ ] No ESLint warnings
- [ ] Code is readable and maintainable
- [ ] Proper error handling

#### React Native Specific
- [ ] Components are performant
- [ ] No memory leaks
- [ ] Proper use of hooks
- [ ] Animations use native driver when possible

#### Testing
- [ ] Unit tests included for new features
- [ ] Manual testing completed
- [ ] No console errors or warnings

### Review Guidelines

#### For Reviewers
1. **Be constructive** - Suggest improvements, don't just point out problems
2. **Explain reasoning** - Help the author understand why changes are needed
3. **Test the changes** - Pull the branch and test functionality
4. **Check performance** - Ensure changes don't impact game performance

#### For Authors
1. **Self-review first** - Review your own code before requesting review
2. **Provide context** - Explain complex changes in PR description
3. **Respond promptly** - Address feedback quickly
4. **Test thoroughly** - Ensure changes work on both iOS and Android

## 🧪 Testing Requirements

### Unit Testing

```typescript
// Example: Testing physics calculations
describe('calculateBirdRotation', () => {
  it('should return -20 for negative velocity', () => {
    expect(calculateBirdRotation(-10)).toBe(-20);
  });
  
  it('should return 45 for high positive velocity', () => {
    expect(calculateBirdRotation(20)).toBe(45);
  });
  
  it('should scale velocity correctly', () => {
    expect(calculateBirdRotation(5)).toBe(15);
  });
});
```

### Component Testing

```typescript
// Example: Testing component rendering
describe('Bird', () => {
  const mockBird: BirdState = {
    x: 100,
    y: 200,
    velocity: 0,
    rotation: 0,
  };
  
  it('should render with correct position', () => {
    const { getByTestId } = render(<Bird bird={mockBird} />);
    const birdElement = getByTestId('bird');
    
    expect(birdElement).toHaveStyle({
      transform: [
        { translateX: 100 },
        { translateY: 200 },
        { rotate: '0deg' },
      ],
    });
  });
});
```

### Manual Testing Checklist

#### Core Gameplay
- [ ] Bird responds to tap input
- [ ] Gravity affects bird movement
- [ ] Pipes move smoothly from right to left
- [ ] Collision detection works accurately
- [ ] Score increments when passing pipes
- [ ] Game over triggers on collision
- [ ] High score persists between sessions

#### Performance
- [ ] Game runs at 60 FPS
- [ ] No frame drops during gameplay
- [ ] Memory usage remains stable
- [ ] No memory leaks after multiple games

#### Cross-Platform
- [ ] Works on Android devices
- [ ] Works on iOS devices
- [ ] Consistent behavior across platforms
- [ ] Proper scaling on different screen sizes

## ⚡ Performance Guidelines

### React Native Performance

#### 1. Use Native Driver
```typescript
// ✅ Good: Native driver for animations
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Enable native driver
}).start();
```

#### 2. Optimize Re-renders
```typescript
// ✅ Good: Memoized components
const Bird = React.memo<BirdProps>(({ bird }) => {
  // Component logic
});

// ✅ Good: Stable callback references
const jump = useCallback(() => {
  // Jump logic
}, [gameState]);
```

#### 3. Efficient State Updates
```typescript
// ✅ Good: Batch state updates
const updateGameState = useCallback(() => {
  setBird(prevBird => ({ ...prevBird, y: newY }));
  setPipes(prevPipes => updatedPipes);
  setScore(prevScore => prevScore + 1);
}, []);
```

### Game Performance

#### 1. Object Pooling
```typescript
// ✅ Good: Remove off-screen objects
const updatedPipes = prevPipes.filter(pipe => !isOffScreen(pipe.x));
```

#### 2. Efficient Collision Detection
```typescript
// ✅ Good: Early exit on collision
const hasCollision = pipes.some(pipe => 
  checkBirdPipeCollision(bird, pipe)
);
if (hasCollision) {
  setGameState('GAME_OVER');
  return; // Early exit
}
```

## 📚 Documentation Standards

### Code Documentation

#### 1. Function Documentation
```typescript
/**
 * Calculates bird rotation angle based on velocity for realistic movement
 * @param velocity - Current bird velocity (negative = upward, positive = downward)
 * @returns Rotation angle in degrees, clamped between -20° and 45°
 */
export const calculateBirdRotation = (velocity: number): number => {
  return Math.min(Math.max(velocity * 3, -20), 45);
};
```

#### 2. Interface Documentation
```typescript
/**
 * Represents the current state of the bird character
 */
export interface BirdState {
  /** Horizontal position in pixels */
  x: number;
  /** Vertical position in pixels */
  y: number;
  /** Current vertical velocity (negative = upward) */
  velocity: number;
  /** Rotation angle in degrees */
  rotation: number;
}
```

### README Updates

When adding features, update relevant documentation:
- Main README.md
- Wiki pages
- Code comments
- Type definitions

## 🚀 Deployment Guidelines

### Pre-deployment Checklist

#### Code Quality
- [ ] All tests pass
- [ ] No ESLint warnings
- [ ] Code review approved
- [ ] Performance tested

#### Build Verification
- [ ] Android build succeeds
- [ ] iOS build succeeds (if applicable)
- [ ] No build warnings
- [ ] App launches successfully

#### Game Testing
- [ ] Core gameplay works
- [ ] No crashes or errors
- [ ] Performance is acceptable
- [ ] Cross-platform consistency

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Write tests for new features
5. Submit a pull request

### Issue Reporting
When reporting bugs:
- Use the issue template
- Provide reproduction steps
- Include device/platform information
- Attach screenshots/videos if helpful

### Feature Requests
When requesting features:
- Explain the use case
- Describe expected behavior
- Consider implementation complexity
- Discuss with maintainers first

---

**Ready to contribute?** Check out the [Getting Started](Getting-Started) guide and explore the [Game Architecture](Game-Architecture) to understand the codebase structure.