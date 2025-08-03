# Getting Started

This guide will help you set up the Sky Dash development environment and get the game running on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 16.0+ | JavaScript runtime |
| **npm** | 8.0+ | Package manager |
| **Git** | Latest | Version control |
| **React Native CLI** | Latest | React Native toolchain |

### Platform-Specific Requirements

#### Android Development
- **Android Studio** (latest stable version)
- **Android SDK** (API level 21 or higher)
- **Java Development Kit (JDK)** 11 or higher
- **Android Virtual Device (AVD)** or physical Android device

#### iOS Development (macOS only)
- **Xcode** (latest stable version)
- **iOS Simulator** or physical iOS device
- **CocoaPods** for dependency management

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FlappyBirdClone
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install React Native CLI globally (if not already installed)
npm install -g react-native-cli
```

### 3. Platform Setup

#### Android Setup

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Follow the installation wizard
   - Install Android SDK and build tools

2. **Configure Environment Variables**
   ```bash
   # Add to your ~/.bashrc, ~/.zshrc, or equivalent
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Create Virtual Device**
   - Open Android Studio
   - Go to Tools → AVD Manager
   - Create a new virtual device (recommended: Pixel 4, API 30+)

#### iOS Setup (macOS only)

1. **Install Xcode**
   - Download from Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **Install iOS Dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## 🏃‍♂️ Running the App

### Development Mode

#### Android
```bash
# Start Metro bundler (in one terminal)
npm start

# Run on Android (in another terminal)
npm run android

# Alternative: Run both commands together
npm run android
```

#### iOS (macOS only)
```bash
# Start Metro bundler (in one terminal)
npm start

# Run on iOS (in another terminal)
npm run ios

# Alternative: Run both commands together
npm run ios
```

### Using Docker (Alternative)

If you prefer containerized development:

```bash
# Start development server
docker-compose up dev

# Build Android APK
docker-compose run --rm android-build

# Run tests
docker-compose run --rm test
```

## 🔧 Development Scripts

The project includes several npm scripts for development:

```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Run ESLint
npm run lint

# Run tests
npm test

# Build Android release APK
npm run build:android

# Build iOS release (macOS only)
npm run build:ios
```

## 🎮 First Run

After successful setup, you should see:

1. **Metro bundler** running in terminal
2. **App launching** on your device/emulator
3. **Sky Dash title screen** with "Tap to Start"

### Game Controls
- **Tap anywhere** on the screen to make the bird jump
- **Avoid pipes** and ground
- **Score points** by passing through pipe gaps

## 🐛 Common Setup Issues

### Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear npm cache
npm start -- --reset-cache
```

### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

### iOS Build Issues
```bash
# Clean iOS build
cd ios
xcodebuild clean
cd ..

# Reinstall pods
cd ios
pod deintegrate
pod install
cd ..
```

### Permission Issues (Android)
If you get permission errors:
```bash
# Make gradlew executable
chmod +x android/gradlew
```

## 📱 Device Testing

### Android Physical Device
1. Enable **Developer Options** on your device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run `npm run android`

### iOS Physical Device (macOS only)
1. Connect device via USB
2. Trust the computer on your device
3. Open `ios/FlappyBirdClone.xcworkspace` in Xcode
4. Select your device and run

## 🔍 Verification

To verify your setup is working correctly:

1. **Check Metro bundler** is running without errors
2. **App launches** successfully on device/emulator
3. **Game responds** to tap inputs
4. **No console errors** in Metro bundler output

## 📚 Next Steps

Once you have the app running:

1. **Explore the code**: Check out [Game Architecture](Game-Architecture)
2. **Make changes**: Follow the [Development Guide](Development-Guide)
3. **Understand game mechanics**: Read [Game Design](Game-Design)
4. **Build for production**: See [Build and Deployment](Build-and-Deployment)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](Troubleshooting) guide
2. Verify all prerequisites are installed correctly
3. Ensure environment variables are set properly
4. Try clearing caches and rebuilding
5. Open an issue in the repository with:
   - Your operating system
   - Node.js and npm versions
   - Complete error messages
   - Steps to reproduce the issue

## 🔗 Useful Resources

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Setup Guide](https://developer.android.com/studio/install)
- [Xcode Setup Guide](https://developer.apple.com/xcode/)
- [Troubleshooting React Native](https://reactnative.dev/docs/troubleshooting)

---

**Ready to develop?** Head to [Game Architecture](Game-Architecture) to understand the codebase structure.