# Assets and Customization

This guide covers how to customize Sky Dash's visual and audio assets, create themes, and modify the game's appearance. Learn how to replace graphics, add sounds, and create your own unique version of the game.

## 📋 Table of Contents

- [Asset Structure](#-asset-structure)
- [Graphics Assets](#-graphics-assets)
- [Audio Assets](#-audio-assets)
- [Customizing Visual Elements](#-customizing-visual-elements)
- [Creating Themes](#-creating-themes)
- [Asset Optimization](#-asset-optimization)
- [Platform Considerations](#-platform-considerations)
- [Advanced Customization](#-advanced-customization)

## 📁 Asset Structure

### Current Asset Organization

```
src/assets/
├── images/                 # Visual assets
│   ├── bird/              # Bird sprites and animations
│   ├── pipes/             # Pipe textures and variations
│   ├── backgrounds/       # Background images and parallax layers
│   ├── ui/                # UI elements and icons
│   └── effects/           # Particle effects and animations
└── sounds/                # Audio assets
    ├── sfx/               # Sound effects
    ├── music/             # Background music
    └── voice/             # Voice clips (optional)
```

### Asset Naming Conventions

```
# Images
bird_idle.png              # Static sprites
bird_flap_01.png          # Animation frames
pipe_green_top.png        # Component variations
bg_sky_day.png            # Background layers
ui_button_play.png        # UI elements

# Sounds
sfx_jump.mp3              # Sound effects
sfx_score.wav             # Short audio clips
music_background.mp3      # Background music
```

## 🎨 Graphics Assets

### Bird Sprites

#### Current Bird Design
The bird is rendered using styled React Native components:

```typescript
// Current implementation in Bird.tsx
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
    backgroundColor: '#FFD700',  // Gold
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA500',      // Orange border
  },
  birdWing: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: 16,
    height: 12,
    backgroundColor: '#FF8C00',   // Dark orange
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6347',      // Tomato border
  },
  birdEye: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    backgroundColor: '#000',     // Black
    borderRadius: 3,
  },
});
```

#### Replacing with Image Sprites

To use custom bird images:

```typescript
// Modified Bird.tsx with image support
import { Image } from 'react-native';

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
      <Image 
        source={require('../assets/images/bird/bird_idle.png')}
        style={styles.birdImage}
        resizeMode="contain"
      />
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
  birdImage: {
    width: '100%',
    height: '100%',
  },
});
```

#### Bird Animation System

For animated bird sprites:

```typescript
// Animated bird with multiple frames
const BIRD_FRAMES = [
  require('../assets/images/bird/bird_flap_01.png'),
  require('../assets/images/bird/bird_flap_02.png'),
  require('../assets/images/bird/bird_flap_03.png'),
];

const AnimatedBird: React.FC<BirdProps> = ({ bird }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % BIRD_FRAMES.length);
    }, 100); // Change frame every 100ms
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      <Image 
        source={BIRD_FRAMES[frameIndex]}
        style={styles.birdImage}
      />
    </Animated.View>
  );
};
```

### Pipe Graphics

#### Current Pipe Design

```typescript
// Current pipe styling
const styles = StyleSheet.create({
  pipe: {
    position: 'absolute',
    width: 52,
    backgroundColor: '#4CAF50',    // Green
    borderWidth: 2,
    borderColor: '#2E7D32',       // Dark green
    borderRadius: 4,
  },
});
```

#### Custom Pipe Images

```typescript
// Image-based pipes
const Pipe: React.FC<PipeProps> = ({ pipe }) => {
  return (
    <>
      {/* Top pipe */}
      <Image
        source={require('../assets/images/pipes/pipe_top.png')}
        style={[styles.pipeImage, {
          height: pipe.topHeight,
          left: pipe.x,
          top: 0,
        }]}
        resizeMode="stretch"
      />
      
      {/* Bottom pipe */}
      <Image
        source={require('../assets/images/pipes/pipe_bottom.png')}
        style={[styles.pipeImage, {
          height: pipe.bottomHeight,
          left: pipe.x,
          bottom: GROUND_HEIGHT,
        }]}
        resizeMode="stretch"
      />
    </>
  );
};
```

### Background Graphics

#### Adding Background Images

```typescript
// Background component with images
const Background: React.FC = () => {
  return (
    <View style={styles.background}>
      {/* Sky layer */}
      <Image
        source={require('../assets/images/backgrounds/sky.png')}
        style={styles.skyImage}
        resizeMode="cover"
      />
      
      {/* Cloud layer */}
      <Image
        source={require('../assets/images/backgrounds/clouds.png')}
        style={styles.cloudsImage}
        resizeMode="repeat"
      />
      
      {/* Distant mountains (optional) */}
      <Image
        source={require('../assets/images/backgrounds/mountains.png')}
        style={styles.mountainsImage}
        resizeMode="cover"
      />
    </View>
  );
};
```

#### Parallax Scrolling

```typescript
// Parallax background effect
const ParallaxBackground: React.FC = () => {
  const [scrollX, setScrollX] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollX(prev => prev - 0.5); // Slow background scroll
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.background}>
      <Animated.Image
        source={require('../assets/images/backgrounds/clouds.png')}
        style={[
          styles.cloudsImage,
          { transform: [{ translateX: scrollX }] }
        ]}
      />
    </View>
  );
};
```

### Ground Graphics

```typescript
// Custom ground texture
const Ground: React.FC = () => {
  return (
    <Image
      source={require('../assets/images/ground/grass.png')}
      style={styles.groundImage}
      resizeMode="repeat"
    />
  );
};

const styles = StyleSheet.create({
  groundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
});
```

## 🔊 Audio Assets

### Sound Integration

#### Setting Up React Native Sound

```bash
# Install react-native-sound
npm install react-native-sound

# iOS setup (if not using auto-linking)
cd ios && pod install
```

#### Audio Manager

```typescript
// AudioManager.ts
import Sound from 'react-native-sound';

class AudioManager {
  private sounds: { [key: string]: Sound } = {};
  private musicVolume = 1.0;
  private sfxVolume = 1.0;
  private enabled = true;

  constructor() {
    Sound.setCategory('Playback');
    this.loadSounds();
  }

  private loadSounds() {
    // Load sound effects
    this.sounds.jump = new Sound('sfx_jump.mp3', Sound.MAIN_BUNDLE);
    this.sounds.score = new Sound('sfx_score.mp3', Sound.MAIN_BUNDLE);
    this.sounds.gameOver = new Sound('sfx_gameover.mp3', Sound.MAIN_BUNDLE);
    
    // Load background music
    this.sounds.backgroundMusic = new Sound('music_background.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (!error) {
        this.sounds.backgroundMusic.setNumberOfLoops(-1); // Loop indefinitely
      }
    });
  }

  playSound(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.setVolume(this.sfxVolume);
      sound.play();
    }
  }

  playMusic() {
    if (!this.enabled) return;
    
    const music = this.sounds.backgroundMusic;
    if (music) {
      music.setVolume(this.musicVolume);
      music.play();
    }
  }

  stopMusic() {
    const music = this.sounds.backgroundMusic;
    if (music) {
      music.stop();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.sounds.backgroundMusic) {
      this.sounds.backgroundMusic.setVolume(this.musicVolume);
    }
  }
}

export const audioManager = new AudioManager();
```

#### Integrating Audio with Game Events

```typescript
// In useGamePhysics.ts
import { audioManager } from '../utils/AudioManager';

const jump = useCallback(() => {
  if (gameState === 'PLAYING') {
    setBird(prevBird => ({
      ...prevBird,
      velocity: PHYSICS_CONFIG.JUMP_VELOCITY,
      rotation: -20,
    }));
    
    // Play jump sound
    audioManager.playSound('jump');
  }
}, [gameState]);

const updateScore = useCallback(() => {
  setPipes(prevPipes => {
    let newScore = score;
    const updatedPipes = prevPipes.map(pipe => {
      if (checkBirdPassedPipe(bird, pipe)) {
        pipe.passed = true;
        newScore += 1;
        
        // Play score sound
        audioManager.playSound('score');
      }
      return pipe;
    });

    if (newScore !== score) {
      setScore(newScore);
    }

    return updatedPipes;
  });
}, [bird, score]);

// Game over sound
const checkCollisions = useCallback(() => {
  // ... collision detection logic
  
  if (hasCollision) {
    setGameState('GAME_OVER');
    audioManager.playSound('gameOver');
    audioManager.stopMusic();
  }
}, []);
```

### Audio Asset Guidelines

#### File Formats
- **iOS**: MP3, AAC, WAV
- **Android**: MP3, OGG, WAV
- **Recommended**: MP3 for compatibility

#### File Sizes
- **Sound Effects**: < 100KB each
- **Background Music**: < 5MB
- **Total Audio**: < 20MB for mobile apps

#### Audio Specifications
```
Sound Effects:
- Sample Rate: 44.1 kHz
- Bit Rate: 128 kbps
- Duration: < 2 seconds
- Format: MP3

Background Music:
- Sample Rate: 44.1 kHz
- Bit Rate: 128-192 kbps
- Duration: 1-3 minutes (looped)
- Format: MP3
```

## 🎨 Customizing Visual Elements

### Color Themes

#### Theme System

```typescript
// Theme.ts
export interface GameTheme {
  name: string;
  colors: {
    sky: string;
    bird: {
      body: string;
      wing: string;
      eye: string;
    };
    pipes: {
      primary: string;
      secondary: string;
    };
    ground: string;
    ui: {
      text: string;
      score: string;
      background: string;
    };
  };
  images?: {
    bird?: any;
    pipes?: any;
    background?: any;
  };
}

export const DEFAULT_THEME: GameTheme = {
  name: 'Classic',
  colors: {
    sky: '#87CEEB',
    bird: {
      body: '#FFD700',
      wing: '#FF8C00',
      eye: '#000000',
    },
    pipes: {
      primary: '#4CAF50',
      secondary: '#2E7D32',
    },
    ground: '#8B4513',
    ui: {
      text: '#FFFFFF',
      score: '#FFD700',
      background: 'rgba(0, 0, 0, 0.7)',
    },
  },
};

export const NIGHT_THEME: GameTheme = {
  name: 'Night',
  colors: {
    sky: '#1a1a2e',
    bird: {
      body: '#ffd700',
      wing: '#ff6b6b',
      eye: '#ffffff',
    },
    pipes: {
      primary: '#16213e',
      secondary: '#0f3460',
    },
    ground: '#0f0f23',
    ui: {
      text: '#ffffff',
      score: '#ffd700',
      background: 'rgba(0, 0, 0, 0.8)',
    },
  },
};
```

#### Theme Context

```typescript
// ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  currentTheme: GameTheme;
  setTheme: (theme: GameTheme) => void;
  availableThemes: GameTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  
  const availableThemes = [DEFAULT_THEME, NIGHT_THEME];
  
  const setTheme = (theme: GameTheme) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

#### Applying Themes

```typescript
// Themed Bird component
const Bird: React.FC<BirdProps> = ({ bird }) => {
  const { currentTheme } = useTheme();
  
  const themedStyles = StyleSheet.create({
    birdBody: {
      ...styles.birdBody,
      backgroundColor: currentTheme.colors.bird.body,
    },
    birdWing: {
      ...styles.birdWing,
      backgroundColor: currentTheme.colors.bird.wing,
    },
    birdEye: {
      ...styles.birdEye,
      backgroundColor: currentTheme.colors.bird.eye,
    },
  });

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      <View style={themedStyles.birdBody} />
      <View style={themedStyles.birdWing} />
      <View style={themedStyles.birdEye} />
    </Animated.View>
  );
};
```

### UI Customization

#### Custom Fonts

```typescript
// Add custom fonts to assets
// android/app/src/main/assets/fonts/CustomFont.ttf
// ios/FlappyBirdClone/Fonts/CustomFont.ttf

const styles = StyleSheet.create({
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'CustomFont', // Use custom font
    color: '#FFD700',
  },
  scoreText: {
    fontSize: 32,
    fontFamily: 'CustomFont-Bold',
    color: '#FFFFFF',
  },
});
```

#### Custom UI Elements

```typescript
// Custom button component
const GameButton: React.FC<{
  title: string;
  onPress: () => void;
  theme?: 'primary' | 'secondary';
}> = ({ title, onPress, theme = 'primary' }) => {
  const { currentTheme } = useTheme();
  
  const buttonStyle = {
    backgroundColor: theme === 'primary' 
      ? currentTheme.colors.ui.background 
      : 'transparent',
    borderColor: currentTheme.colors.ui.text,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  };
  
  const textStyle = {
    color: currentTheme.colors.ui.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center' as const,
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## 🎭 Creating Themes

### Theme Creation Workflow

1. **Design Phase**
   - Choose color palette
   - Design visual elements
   - Create asset mockups

2. **Asset Creation**
   - Create graphics at correct sizes
   - Optimize for mobile performance
   - Test on different screen sizes

3. **Implementation**
   - Add theme to theme system
   - Update components to use theme
   - Test theme switching

4. **Testing**
   - Test on iOS and Android
   - Verify performance impact
   - Check accessibility

### Seasonal Themes

```typescript
// Seasonal theme examples
export const WINTER_THEME: GameTheme = {
  name: 'Winter',
  colors: {
    sky: '#B0E0E6',
    bird: {
      body: '#FF6B6B',
      wing: '#FF4757',
      eye: '#000000',
    },
    pipes: {
      primary: '#FFFFFF',
      secondary: '#E6E6FA',
    },
    ground: '#FFFFFF',
    ui: {
      text: '#2C3E50',
      score: '#E74C3C',
      background: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

export const SUNSET_THEME: GameTheme = {
  name: 'Sunset',
  colors: {
    sky: '#FF7F50',
    bird: {
      body: '#FFD700',
      wing: '#FF6347',
      eye: '#000000',
    },
    pipes: {
      primary: '#8B4513',
      secondary: '#A0522D',
    },
    ground: '#654321',
    ui: {
      text: '#FFFFFF',
      score: '#FFD700',
      background: 'rgba(139, 69, 19, 0.8)',
    },
  },
};
```

## ⚡ Asset Optimization

### Image Optimization

#### Size Guidelines
```
Bird sprites: 32x24px (1x), 64x48px (2x), 96x72px (3x)
Pipe textures: 52px width, variable height
Background: Screen resolution dependent
UI elements: 24x24px to 48x48px for icons
```

#### Optimization Tools
```bash
# ImageOptim (macOS)
# TinyPNG (web service)
# OptiPNG (command line)
optipng -o7 *.png

# JPEG optimization
jpegoptim --max=85 *.jpg
```

#### React Native Image Optimization

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
      fadeDuration={0}        // Disable fade for performance
      cache="force-cache"     // Cache images
    />
  );
};
```

### Audio Optimization

#### Compression Settings
```bash
# MP3 compression with FFmpeg
ffmpeg -i input.wav -codec:a libmp3lame -b:a 128k output.mp3

# OGG compression for Android
ffmpeg -i input.wav -codec:a libvorbis -q:a 4 output.ogg
```

#### Preloading Audio

```typescript
// Preload critical sounds
const preloadAudio = () => {
  const criticalSounds = ['jump', 'score', 'gameOver'];
  
  criticalSounds.forEach(soundName => {
    const sound = audioManager.sounds[soundName];
    if (sound) {
      sound.prepare(); // Preload for faster playback
    }
  });
};
```

## 📱 Platform Considerations

### iOS Specific

#### App Icons
```
ios/FlappyBirdClone/Images.xcassets/AppIcon.appiconset/
├── icon-20@2x.png     (40x40)
├── icon-20@3x.png     (60x60)
├── icon-29@2x.png     (58x58)
├── icon-29@3x.png     (87x87)
├── icon-40@2x.png     (80x80)
├── icon-40@3x.png     (120x120)
├── icon-60@2x.png     (120x120)
├── icon-60@3x.png     (180x180)
└── icon-1024.png      (1024x1024)
```

#### Launch Screen
```typescript
// LaunchScreen.storyboard customization
// Use Xcode Interface Builder to modify
// ios/FlappyBirdClone/LaunchScreen.storyboard
```

### Android Specific

#### App Icons
```
android/app/src/main/res/
├── mipmap-hdpi/       (72x72)
├── mipmap-mdpi/       (48x48)
├── mipmap-xhdpi/      (96x96)
├── mipmap-xxhdpi/     (144x144)
└── mipmap-xxxhdpi/    (192x192)
```

#### Splash Screen
```xml
<!-- android/app/src/main/res/drawable/launch_screen.xml -->
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/primary_dark" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/launch_icon" />
    </item>
</layer-list>
```

## 🚀 Advanced Customization

### Particle Effects

```typescript
// Simple particle system for effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const ParticleSystem: React.FC<{
  particles: Particle[];
}> = ({ particles }) => {
  return (
    <View style={styles.particleContainer}>
      {particles.map((particle, index) => (
        <View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life,
            },
          ]}
        />
      ))}
    </View>
  );
};
```

### Dynamic Asset Loading

```typescript
// Load assets based on theme or user preference
const AssetLoader = {
  loadThemeAssets: async (theme: GameTheme) => {
    const assets = {
      bird: null,
      pipes: null,
      background: null,
    };

    if (theme.images?.bird) {
      assets.bird = theme.images.bird;
    }

    return assets;
  },

  preloadImages: (imageList: any[]) => {
    return Promise.all(
      imageList.map(image => 
        Image.prefetch(Image.resolveAssetSource(image).uri)
      )
    );
  },
};
```

### Custom Animations

```typescript
// Advanced bird animation with multiple states
const AdvancedBird: React.FC<BirdProps> = ({ bird }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = {
    transform: [
      { translateX: bird.x },
      { translateY: bird.y },
      { rotate: `${bird.rotation}deg` },
      { scale: scaleAnim },
    ],
  };

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      {/* Bird content */}
    </Animated.View>
  );
};
```

---

**Ready to customize?** Start with simple color changes in the [Game Design](Game-Design) guide, then explore the [Performance Optimization](Performance-Optimization) guide to ensure your customizations run smoothly.