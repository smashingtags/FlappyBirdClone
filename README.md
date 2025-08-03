# Sky Dash - Flappy Bird Clone

A cross-platform Flappy Bird clone built with React Native and TypeScript, targeting both iOS and Android app stores.

## 🎮 Game Features

- **Simple Controls**: Tap to fly, avoid pipes
- **Physics-Based Gameplay**: Realistic gravity and momentum
- **Score Tracking**: Local high score persistence
- **Cross-Platform**: Runs on both iOS and Android
- **Smooth Performance**: 60 FPS gameplay
- **Clean UI**: Minimalist design focused on gameplay

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (16 or higher)
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - Mac only)

### Installation

1. **Clone or navigate to the project directory**:

   ```bash
   cd FlappyBirdClone
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install iOS dependencies** (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android

```bash
# Start Metro bundler
npm start

# In a new terminal, run Android app
npm run android
```

#### iOS (Mac only)

```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS app
npm run ios
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Bird.tsx        # Bird sprite and animation
│   ├── Pipe.tsx        # Pipe obstacles
│   ├── Ground.tsx      # Ground/floor component
│   └── ScoreDisplay.tsx # Score UI
├── screens/            # Screen components
│   └── GameScreen.tsx  # Main game screen
├── hooks/              # Custom React hooks
│   └── useGamePhysics.ts # Game logic and physics
├── utils/              # Utility functions
│   ├── physics.ts      # Physics calculations
│   ├── collision.ts    # Collision detection
│   └── storage.ts      # Local storage management
├── types/              # TypeScript type definitions
│   └── index.ts        # Game state interfaces
├── assets/             # Game assets
│   ├── images/         # Sprites and graphics
│   └── sounds/         # Audio files
└── App.tsx             # Main app component
```

## 🎯 Game Mechanics

### Physics

- **Gravity**: 0.5 pixels/frame downward acceleration
- **Jump**: -8 pixels/frame upward velocity on tap
- **Terminal Velocity**: Maximum 10 pixels/frame fall speed
- **Bird Rotation**: Tilts based on velocity for realistic movement

### Collision Detection

- **AABB (Axis-Aligned Bounding Box)** collision detection
- **Slightly smaller hitboxes** than sprites for forgiving gameplay
- **Ground and ceiling** collision detection
- **Pipe collision** with top and bottom segments

### Scoring

- **+1 point** for each pipe successfully passed
- **High score persistence** using AsyncStorage
- **New record notification** when high score is beaten

## 🛠️ Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run build:android` - Build Android release APK
- `npm run build:ios` - Build iOS release

### Adding Features

The game is designed to be easily extensible. Common additions:

1. **Sound Effects**: Add audio files to `src/assets/sounds/`
2. **New Graphics**: Replace placeholder sprites in `src/assets/images/`
3. **Power-ups**: Extend game state in `useGamePhysics.ts`
4. **Animations**: Use React Native's Animated API
5. **Leaderboards**: Integrate with game services

### Performance Optimization

- Uses `useCallback` and `React.memo` for efficient re-renders
- Native driver animations for smooth 60 FPS
- Object pooling for pipe generation
- Efficient collision detection algorithms

## 📱 Building for Production

### Android Release

1. **Generate signing key**:

   ```bash
   keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure gradle.properties**:

   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

3. **Build release APK**:
   ```bash
   npm run build:android
   ```

### iOS Release

1. **Open in Xcode**:

   ```bash
   open ios/FlappyBirdClone.xcworkspace
   ```

2. **Configure signing** in Xcode project settings
3. **Archive and upload** to App Store Connect

## 🎨 Customization

### Changing Game Parameters

Edit `src/utils/physics.ts` to modify:

- Gravity strength
- Jump velocity
- Pipe speed
- Pipe gap size
- Bird size

### Styling

All styles are defined using StyleSheet in each component. Key style files:

- `GameScreen.tsx` - Main game layout and overlays
- `Bird.tsx` - Bird appearance and animation
- `Pipe.tsx` - Pipe colors and dimensions

### Assets

Replace placeholder assets in `src/assets/`:

- Bird sprites (32x24px recommended)
- Pipe textures (52px width)
- Background images
- Sound effects (MP3/WAV format)

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build fails**: Clean with `cd android && ./gradlew clean`
3. **iOS build fails**: Clean build folder in Xcode
4. **TypeScript errors**: Run `npm install` to ensure all types are installed

### Performance Issues

- Check for memory leaks in game loop
- Ensure animations use native driver
- Monitor FPS in development builds
- Test on lower-end devices

## 📄 License

This project is for educational purposes. Ensure you have rights to any assets used in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:

- Check the troubleshooting section
- Review React Native documentation
- Open an issue in the repository

---

**Happy coding! 🚀**
