# Performance Optimization

This guide covers performance optimization techniques for Sky Dash, including React Native best practices, game-specific optimizations, and monitoring tools. Maintaining 60 FPS gameplay is crucial for a smooth user experience.

## 📋 Table of Contents

- [Performance Overview](#-performance-overview)
- [React Native Optimizations](#-react-native-optimizations)
- [Game Loop Optimization](#-game-loop-optimization)
- [Memory Management](#-memory-management)
- [Rendering Optimizations](#-rendering-optimizations)
- [Asset Optimization](#-asset-optimization)
- [Platform-Specific Optimizations](#-platform-specific-optimizations)
- [Performance Monitoring](#-performance-monitoring)
- [Debugging Performance Issues](#-debugging-performance-issues)

## 🎯 Performance Overview

### Target Performance Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| **Frame Rate** | 60 FPS | > 50 FPS |
| **Memory Usage** | < 100MB | < 150MB |
| **App Launch Time** | < 3s | < 5s |
| **Game Loop Timing** | 16ms/frame | < 20ms/frame |
| **Bundle Size** | < 10MB | < 15MB |

### Performance Bottlenecks

Common performance issues in Sky Dash:

1. **JavaScript Thread Blocking**: Heavy calculations in game loop
2. **Excessive Re-renders**: Unnecessary component updates
3. **Memory Leaks**: Unreleased intervals, listeners, or objects
4. **Large Asset Loading**: Unoptimized images or audio
5. **Bridge Communication**: Frequent JS-Native communication

## ⚛️ React Native Optimizations

### Component Optimization

#### 1. React.memo for Pure Components

```typescript
// Optimize Bird component to prevent unnecessary re-renders
const Bird = React.memo<BirdProps>(({ bird }) => {
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
}, (prevProps, nextProps) => {
  // Custom comparison for better control
  return (
    prevProps.bird.x === nextProps.bird.x &&
    prevProps.bird.y === nextProps.bird.y &&
    prevProps.bird.rotation === nextProps.bird.rotation
  );
});
```

#### 2. useCallback for Stable References

```typescript
// Memoize callback functions to prevent child re-renders
const useGamePhysics = () => {
  const [bird, setBird] = useState<BirdState>(initialBirdState);
  
  // Stable callback reference
  const jump = useCallback(() => {
    if (gameState === 'PLAYING') {
      setBird(prevBird => ({
        ...prevBird,
        velocity: PHYSICS_CONFIG.JUMP_VELOCITY,
        rotation: -20,
      }));
    }
  }, [gameState]); // Only recreate when gameState changes
  
  const updateBird = useCallback(() => {
    setBird(prevBird => {
      const newVelocity = Math.min(
        prevBird.velocity + PHYSICS_CONFIG.GRAVITY,
        PHYSICS_CONFIG.TERMINAL_VELOCITY
      );
      
      const newY = prevBird.y + newVelocity;
      const newRotation = calculateBirdRotation(newVelocity);
      
      // Avoid unnecessary updates
      if (newY === prevBird.y && newVelocity === prevBird.velocity) {
        return prevBird;
      }
      
      return {
        ...prevBird,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation,
      };
    });
  }, []); // No dependencies - stable reference
  
  return { bird, jump, updateBird };
};
```

#### 3. useMemo for Expensive Calculations

```typescript
// Memoize expensive calculations
const GameScreen: React.FC = () => {
  const { bird, pipes, score } = useGamePhysics();
  
  // Memoize pipe rendering to avoid recalculation
  const renderedPipes = useMemo(() => {
    return pipes.map(pipe => (
      <Pipe key={pipe.id} pipe={pipe} />
    ));
  }, [pipes]);
  
  // Memoize collision boxes for debugging
  const debugCollisionBoxes = useMemo(() => {
    if (!__DEV__) return null;
    
    return pipes.map(pipe => {
      const boxes = getPipeCollisionBoxes(pipe);
      return boxes.map((box, index) => (
        <View
          key={`${pipe.id}-${index}`}
          style={[styles.debugBox, {
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
          }]}
        />
      ));
    });
  }, [pipes]);
  
  return (
    <View style={styles.container}>
      <Bird bird={bird} />
      {renderedPipes}
      {debugCollisionBoxes}
    </View>
  );
};
```

### State Management Optimization

#### 1. Batch State Updates

```typescript
// Batch multiple state updates to reduce re-renders
const updateGameState = useCallback(() => {
  // Use functional updates to batch changes
  setBird(prevBird => {
    const newBird = updateBirdPhysics(prevBird);
    
    // Update pipes in the same render cycle
    setPipes(prevPipes => {
      const newPipes = updatePipePositions(prevPipes);
      
      // Update score if needed
      const passedPipes = newPipes.filter(pipe => 
        checkBirdPassedPipe(newBird, pipe) && !pipe.passed
      );
      
      if (passedPipes.length > 0) {
        setScore(prevScore => prevScore + passedPipes.length);
        passedPipes.forEach(pipe => pipe.passed = true);
      }
      
      return newPipes;
    });
    
    return newBird;
  });
}, []);
```

#### 2. Reduce State Granularity

```typescript
// Instead of separate state for each bird property
// ❌ Bad: Multiple state variables
const [birdX, setBirdX] = useState(100);
const [birdY, setBirdY] = useState(200);
const [birdVelocity, setBirdVelocity] = useState(0);
const [birdRotation, setBirdRotation] = useState(0);

// ✅ Good: Single state object
const [bird, setBird] = useState<BirdState>({
  x: 100,
  y: 200,
  velocity: 0,
  rotation: 0,
});
```

## 🎮 Game Loop Optimization

### Efficient Game Loop

```typescript
// Optimized game loop with performance monitoring
const useGamePhysics = () => {
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const performanceMetrics = useRef({
    averageFrameTime: 16,
    droppedFrames: 0,
    totalFrames: 0,
  });

  const gameLoop = useCallback(() => {
    const startTime = performance.now();
    
    // Update game objects
    updateBird();
    updatePipes();
    checkCollisions();
    updateScore();
    
    // Performance monitoring
    const endTime = performance.now();
    const frameTime = endTime - startTime;
    
    // Track performance metrics
    performanceMetrics.current.totalFrames++;
    performanceMetrics.current.averageFrameTime = 
      (performanceMetrics.current.averageFrameTime * 0.9) + (frameTime * 0.1);
    
    if (frameTime > 20) { // Frame took longer than 20ms
      performanceMetrics.current.droppedFrames++;
      
      if (__DEV__) {
        console.warn(`Slow frame: ${frameTime.toFixed(2)}ms`);
      }
    }
    
    frameCountRef.current++;
  }, [updateBird, updatePipes, checkCollisions, updateScore]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(gameLoop, 16); // 60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);
};
```

### Optimized Physics Calculations

```typescript
// Pre-calculate constants to avoid repeated calculations
const PHYSICS_CONSTANTS = {
  GRAVITY: 0.5,
  JUMP_VELOCITY: -8,
  TERMINAL_VELOCITY: 10,
  PIPE_SPEED: 2,
  ROTATION_MULTIPLIER: 3,
  MAX_ROTATION_UP: -20,
  MAX_ROTATION_DOWN: 45,
};

// Optimized bird physics update
const updateBirdPhysics = (prevBird: BirdState): BirdState => {
  // Apply gravity
  let newVelocity = prevBird.velocity + PHYSICS_CONSTANTS.GRAVITY;
  
  // Clamp to terminal velocity (faster than Math.min)
  if (newVelocity > PHYSICS_CONSTANTS.TERMINAL_VELOCITY) {
    newVelocity = PHYSICS_CONSTANTS.TERMINAL_VELOCITY;
  }
  
  // Update position
  const newY = prevBird.y + newVelocity;
  
  // Calculate rotation (optimized)
  let newRotation = newVelocity * PHYSICS_CONSTANTS.ROTATION_MULTIPLIER;
  if (newRotation < PHYSICS_CONSTANTS.MAX_ROTATION_UP) {
    newRotation = PHYSICS_CONSTANTS.MAX_ROTATION_UP;
  } else if (newRotation > PHYSICS_CONSTANTS.MAX_ROTATION_DOWN) {
    newRotation = PHYSICS_CONSTANTS.MAX_ROTATION_DOWN;
  }
  
  return {
    ...prevBird,
    y: newY,
    velocity: newVelocity,
    rotation: newRotation,
  };
};
```

### Object Pooling for Pipes

```typescript
// Object pool to reduce garbage collection
class PipePool {
  private pool: PipeState[] = [];
  private activeCount = 0;

  getPipe(): PipeState {
    if (this.pool.length > this.activeCount) {
      // Reuse existing pipe object
      const pipe = this.pool[this.activeCount];
      this.activeCount++;
      return pipe;
    } else {
      // Create new pipe object
      const pipe: PipeState = {
        id: `pipe_${Date.now()}_${Math.random()}`,
        x: 0,
        topHeight: 0,
        bottomHeight: 0,
        passed: false,
      };
      this.pool.push(pipe);
      this.activeCount++;
      return pipe;
    }
  }

  releasePipe(pipe: PipeState) {
    // Reset pipe properties for reuse
    pipe.passed = false;
    pipe.x = 0;
    pipe.topHeight = 0;
    pipe.bottomHeight = 0;
    
    // Move to end of pool for reuse
    const index = this.pool.indexOf(pipe);
    if (index !== -1 && index < this.activeCount) {
      this.pool[index] = this.pool[this.activeCount - 1];
      this.pool[this.activeCount - 1] = pipe;
      this.activeCount--;
    }
  }

  reset() {
    this.activeCount = 0;
  }
}

const pipePool = new PipePool();

// Use object pool in pipe generation
const generateNewPipe = (): PipeState => {
  const pipe = pipePool.getPipe();
  const { topHeight, bottomHeight } = generateRandomPipeHeight();
  
  pipe.id = `pipe_${Date.now()}_${Math.random()}`;
  pipe.x = SCREEN_DIMENSIONS.WIDTH;
  pipe.topHeight = topHeight;
  pipe.bottomHeight = bottomHeight;
  pipe.passed = false;
  
  return pipe;
};
```

## 🧠 Memory Management

### Preventing Memory Leaks

#### 1. Cleanup Intervals and Timeouts

```typescript
// Proper cleanup of intervals
const useGamePhysics = () => {
  const gameLoopRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(() => {
        // Game logic
      }, 16);
    }

    // Cleanup function
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, [gameState]);
};
```

#### 2. Event Listener Cleanup

```typescript
// Proper event listener management
const useInputHandler = () => {
  useEffect(() => {
    const handlePress = () => {
      // Handle input
    };

    // Add listener
    const subscription = DeviceEventEmitter.addListener('hardwareBackPress', handlePress);

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);
};
```

#### 3. Animation Cleanup

```typescript
// Cleanup animations to prevent memory leaks
const useAnimations = () => {
  const animationRef = useRef<Animated.CompositeAnimation>();

  const startAnimation = () => {
    animationRef.current = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    
    animationRef.current.start();
  };

  useEffect(() => {
    return () => {
      // Stop animation on cleanup
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);
};
```

### Memory Monitoring

```typescript
// Memory usage monitoring (development only)
const MemoryMonitor = () => {
  useEffect(() => {
    if (!__DEV__) return;

    const interval = setInterval(() => {
      // @ts-ignore - React Native specific
      if (global.performance && global.performance.memory) {
        const memory = global.performance.memory;
        console.log('Memory Usage:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
};
```

## 🎨 Rendering Optimizations

### Native Driver Animations

```typescript
// Always use native driver when possible
const BirdAnimation: React.FC<{ bird: BirdState }> = ({ bird }) => {
  const translateX = useRef(new Animated.Value(bird.x)).current;
  const translateY = useRef(new Animated.Value(bird.y)).current;
  const rotation = useRef(new Animated.Value(bird.rotation)).current;

  useEffect(() => {
    // Update animations with native driver
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: bird.x,
        duration: 0, // Immediate update
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: bird.y,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: bird.rotation,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bird.x, bird.y, bird.rotation]);

  return (
    <Animated.View
      style={[
        styles.bird,
        {
          transform: [
            { translateX },
            { translateY },
            { rotate: rotation.interpolate({
              inputRange: [-20, 45],
              outputRange: ['-20deg', '45deg'],
            }) },
          ],
        },
      ]}
    >
      {/* Bird content */}
    </Animated.View>
  );
};
```

### Efficient List Rendering

```typescript
// Optimize pipe rendering with keys and memoization
const PipeList: React.FC<{ pipes: PipeState[] }> = ({ pipes }) => {
  return (
    <>
      {pipes.map(pipe => (
        <MemoizedPipe key={pipe.id} pipe={pipe} />
      ))}
    </>
  );
};

const MemoizedPipe = React.memo<{ pipe: PipeState }>(({ pipe }) => {
  return <Pipe pipe={pipe} />;
}, (prevProps, nextProps) => {
  // Only re-render if pipe position changed significantly
  return Math.abs(prevProps.pipe.x - nextProps.pipe.x) < 1;
});
```

### Conditional Rendering

```typescript
// Only render visible elements
const GameScreen: React.FC = () => {
  const { bird, pipes } = useGamePhysics();
  
  // Only render pipes that are visible on screen
  const visiblePipes = useMemo(() => {
    return pipes.filter(pipe => 
      pipe.x > -PHYSICS_CONFIG.PIPE_WIDTH && 
      pipe.x < SCREEN_DIMENSIONS.WIDTH + PHYSICS_CONFIG.PIPE_WIDTH
    );
  }, [pipes]);

  return (
    <View style={styles.container}>
      <Bird bird={bird} />
      {visiblePipes.map(pipe => (
        <Pipe key={pipe.id} pipe={pipe} />
      ))}
    </View>
  );
};
```

## 📦 Asset Optimization

### Image Optimization

```typescript
// Optimized image loading
const OptimizedImage: React.FC<{
  source: any;
  style: any;
}> = ({ source, style }) => {
  return (
    <Image
      source={source}
      style={style}
      resizeMode="contain"
      fadeDuration={0}        // Disable fade animation
      cache="force-cache"     // Aggressive caching
      defaultSource={require('../assets/images/placeholder.png')} // Fallback
    />
  );
};

// Preload critical images
const preloadImages = async () => {
  const criticalImages = [
    require('../assets/images/bird.png'),
    require('../assets/images/pipe.png'),
    require('../assets/images/ground.png'),
  ];

  await Promise.all(
    criticalImages.map(image => 
      Image.prefetch(Image.resolveAssetSource(image).uri)
    )
  );
};
```

### Bundle Size Optimization

```typescript
// Lazy load non-critical assets
const LazyBackground = React.lazy(() => import('../components/Background'));

// Use dynamic imports for themes
const loadTheme = async (themeName: string) => {
  switch (themeName) {
    case 'night':
      return await import('../themes/NightTheme');
    case 'winter':
      return await import('../themes/WinterTheme');
    default:
      return await import('../themes/DefaultTheme');
  }
};
```

## 📱 Platform-Specific Optimizations

### iOS Optimizations

```typescript
// iOS-specific optimizations
import { Platform } from 'react-native';

const IOSOptimizations = {
  // Use CADisplayLink for smoother animations on iOS
  setupDisplayLink: () => {
    if (Platform.OS === 'ios') {
      // Native module for CADisplayLink integration
      // This would require a native iOS module
    }
  },

  // Optimize for iOS memory management
  optimizeMemory: () => {
    if (Platform.OS === 'ios') {
      // Trigger garbage collection hint
      if (global.gc) {
        global.gc();
      }
    }
  },
};
```

### Android Optimizations

```typescript
// Android-specific optimizations
const AndroidOptimizations = {
  // Optimize for Android's garbage collector
  setupGC: () => {
    if (Platform.OS === 'android') {
      // Reduce object allocations
      // Use object pools more aggressively
    }
  },

  // Handle Android back button efficiently
  setupBackHandler: () => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // Handle back press without creating new functions
        return true;
      });

      return () => backHandler.remove();
    }
  },
};
```

## 📊 Performance Monitoring

### FPS Monitoring

```typescript
// FPS counter for development
const FPSMonitor: React.FC = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    if (!__DEV__) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTime.current;
      const currentFps = Math.round((frameCount.current * 1000) / delta);
      
      setFps(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const incrementFrame = () => {
      frameCount.current++;
      requestAnimationFrame(incrementFrame);
    };
    
    requestAnimationFrame(incrementFrame);
  }, []);

  if (!__DEV__) return null;

  return (
    <View style={styles.fpsMonitor}>
      <Text style={styles.fpsText}>FPS: {fps}</Text>
    </View>
  );
};
```

### Performance Profiler

```typescript
// Performance profiler for game operations
class GameProfiler {
  private metrics: { [key: string]: number[] } = {};

  startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics[operation]) {
        this.metrics[operation] = [];
      }
      
      this.metrics[operation].push(duration);
      
      // Keep only last 100 measurements
      if (this.metrics[operation].length > 100) {
        this.metrics[operation].shift();
      }
    };
  }

  getAverageTime(operation: string): number {
    const times = this.metrics[operation];
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getReport(): { [key: string]: { avg: number; max: number; min: number } } {
    const report: any = {};
    
    for (const [operation, times] of Object.entries(this.metrics)) {
      if (times.length > 0) {
        report[operation] = {
          avg: this.getAverageTime(operation),
          max: Math.max(...times),
          min: Math.min(...times),
        };
      }
    }
    
    return report;
  }
}

const gameProfiler = new GameProfiler();

// Usage in game loop
const updateBird = useCallback(() => {
  const endTiming = gameProfiler.startTiming('updateBird');
  
  setBird(prevBird => {
    // Bird update logic
    return newBird;
  });
  
  endTiming();
}, []);
```

## 🐛 Debugging Performance Issues

### Performance Debugging Tools

```typescript
// Performance debugging utilities
const PerformanceDebugger = {
  // Log slow operations
  logSlowOperation: (operation: string, duration: number, threshold = 16) => {
    if (duration > threshold) {
      console.warn(`Slow ${operation}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
  },

  // Memory leak detector
  detectMemoryLeaks: () => {
    if (!__DEV__) return;

    let lastMemory = 0;
    const interval = setInterval(() => {
      // @ts-ignore
      if (global.performance?.memory) {
        // @ts-ignore
        const currentMemory = global.performance.memory.usedJSHeapSize;
        const diff = currentMemory - lastMemory;
        
        if (diff > 1024 * 1024) { // 1MB increase
          console.warn(`Memory increased by ${(diff / 1024 / 1024).toFixed(2)}MB`);
        }
        
        lastMemory = currentMemory;
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  // Component render tracker
  trackRenders: (componentName: string) => {
    if (!__DEV__) return () => {};

    const renderCount = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
      renderCount.current++;
      const now = Date.now();
      const timeSinceLastRender = now - lastRenderTime.current;
      
      console.log(`${componentName} render #${renderCount.current} (${timeSinceLastRender}ms since last)`);
      lastRenderTime.current = now;
    });

    return () => {
      console.log(`${componentName} total renders: ${renderCount.current}`);
    };
  },
};
```

### Performance Testing

```typescript
// Performance test suite
const PerformanceTests = {
  // Test game loop performance
  testGameLoop: async (duration = 5000) => {
    console.log('Starting game loop performance test...');
    
    const startTime = Date.now();
    let frameCount = 0;
    const frameTimes: number[] = [];

    const testLoop = () => {
      const frameStart = performance.now();
      
      // Simulate game loop operations
      updateBird();
      updatePipes();
      checkCollisions();
      updateScore();
      
      const frameEnd = performance.now();
      const frameTime = frameEnd - frameStart;
      
      frameTimes.push(frameTime);
      frameCount++;
      
      if (Date.now() - startTime < duration) {
        setTimeout(testLoop, 16); // 60 FPS
      } else {
        // Report results
        const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
        const maxFrameTime = Math.max(...frameTimes);
        const droppedFrames = frameTimes.filter(time => time > 20).length;
        
        console.log('Game Loop Performance Test Results:', {
          totalFrames: frameCount,
          avgFrameTime: `${avgFrameTime.toFixed(2)}ms`,
          maxFrameTime: `${maxFrameTime.toFixed(2)}ms`,
          droppedFrames,
          droppedFramePercentage: `${((droppedFrames / frameCount) * 100).toFixed(2)}%`,
        });
      }
    };

    testLoop();
  },

  // Test memory usage over time
  testMemoryUsage: (duration = 30000) => {
    console.log('Starting memory usage test...');
    
    const memorySnapshots: number[] = [];
    const interval = setInterval(() => {
      // @ts-ignore
      if (global.performance?.memory) {
        // @ts-ignore
        memorySnapshots.push(global.performance.memory.usedJSHeapSize);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      
      const initialMemory = memorySnapshots[0];
      const finalMemory = memorySnapshots[memorySnapshots.length - 1];
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log('Memory Usage Test Results:', {
        initialMemory: `${(initialMemory / 1024 / 1024).toFixed(2)}MB`,
        finalMemory: `${(finalMemory / 1024 / 1024).toFixed(2)}MB`,
        memoryIncrease: `${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`,
        averageMemory: `${(memorySnapshots.reduce((sum, mem) => sum + mem, 0) / memorySnapshots.length / 1024 / 1024).toFixed(2)}MB`,
      });
    }, duration);
  },
};
```

---

**Performance optimized?** Check out the [Testing](Testing) guide to ensure your optimizations work correctly, or review the [Troubleshooting](Troubleshooting) guide if you encounter performance issues.