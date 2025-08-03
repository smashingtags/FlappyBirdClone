# Troubleshooting

This guide provides solutions to common issues you might encounter while developing, building, or running Sky Dash. Issues are organized by category for easy navigation.

## 📋 Table of Contents

- [Development Environment Issues](#-development-environment-issues)
- [Build Issues](#-build-issues)
- [Runtime Issues](#-runtime-issues)
- [Performance Issues](#-performance-issues)
- [Platform-Specific Issues](#-platform-specific-issues)
- [Docker Issues](#-docker-issues)
- [CI/CD Issues](#-cicd-issues)
- [Game-Specific Issues](#-game-specific-issues)

## 🛠️ Development Environment Issues

### Metro Bundler Issues

#### Metro Won't Start
**Problem:** Metro bundler fails to start or crashes immediately.

**Solutions:**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear npm cache
npm start -- --reset-cache

# Clear watchman cache (macOS/Linux)
watchman watch-del-all

# Reset Metro completely
rm -rf node_modules/
npm install
npx react-native start --reset-cache
```

#### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::8081`

**Solutions:**
```bash
# Kill process using port 8081
lsof -ti:8081 | xargs kill -9

# Or use a different port
npx react-native start --port 8082

# On Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

#### Module Resolution Issues
**Problem:** `Unable to resolve module` errors.

**Solutions:**
```bash
# Clear all caches
rm -rf node_modules/
rm package-lock.json
npm install

# Reset Metro cache
npx react-native start --reset-cache

# Check import paths are correct
# Ensure all dependencies are installed
npm install
```

### TypeScript Issues

#### Type Errors
**Problem:** TypeScript compilation errors.

**Solutions:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm install --save-dev @types/react @types/react-native

# Clear TypeScript cache
rm -rf node_modules/.cache/
```

#### Missing Type Definitions
**Problem:** `Could not find a declaration file for module`

**Solutions:**
```bash
# Install missing types
npm install --save-dev @types/react-native-sound

# Or create custom type definitions
# Create types/react-native-sound.d.ts
declare module 'react-native-sound' {
  // Type definitions here
}
```

## 🔨 Build Issues

### Android Build Issues

#### Gradle Build Failures
**Problem:** Android build fails with Gradle errors.

**Solutions:**
```bash
# Clean Gradle build
cd android
./gradlew clean
cd ..

# Clear Gradle cache
rm -rf ~/.gradle/caches/

# Rebuild
npm run android

# If still failing, check Java version
java -version  # Should be Java 11
```

#### SDK/NDK Issues
**Problem:** `SDK location not found` or NDK errors.

**Solutions:**
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Create local.properties file
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Install required SDK components in Android Studio
# Tools → SDK Manager → Install missing components
```

#### Memory Issues
**Problem:** `OutOfMemoryError` during Android build.

**Solutions:**
```bash
# Increase Gradle memory
echo "org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m" >> android/gradle.properties

# Increase daemon heap size
echo "org.gradle.daemon=true" >> android/gradle.properties
echo "org.gradle.configureondemand=true" >> android/gradle.properties
```

#### Signing Issues
**Problem:** Release build fails due to signing configuration.

**Solutions:**
```bash
# Verify keystore exists
ls -la android/app/my-release-key.keystore

# Check gradle.properties
cat android/gradle.properties

# Verify keystore contents
keytool -list -v -keystore android/app/my-release-key.keystore

# Regenerate keystore if needed
keytool -genkeypair -v -keystore my-release-key.keystore \
        -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### iOS Build Issues (macOS only)

#### CocoaPods Issues
**Problem:** `pod install` fails or pods are outdated.

**Solutions:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean and reinstall pods
cd ios
rm -rf Pods/
rm Podfile.lock
pod install --repo-update
cd ..

# If still failing, try
pod repo update
pod install --verbose
```

#### Xcode Build Errors
**Problem:** Build fails in Xcode with various errors.

**Solutions:**
```bash
# Clean build folder
rm -rf ios/build/
rm -rf ~/Library/Developer/Xcode/DerivedData/

# In Xcode: Product → Clean Build Folder

# Reset iOS Simulator
xcrun simctl erase all

# Check Xcode version compatibility
xcode-select --print-path
```

#### Signing and Provisioning
**Problem:** Code signing or provisioning profile errors.

**Solutions:**
1. **Check Apple Developer Account**
   - Ensure account is active
   - Verify certificates are valid
   - Check provisioning profiles

2. **In Xcode:**
   - Project Settings → Signing & Capabilities
   - Select correct team
   - Enable "Automatically manage signing"

3. **Manual Certificate Management:**
   ```bash
   # List available certificates
   security find-identity -v -p codesigning
   
   # Import certificate if needed
   security import certificate.p12 -k ~/Library/Keychains/login.keychain
   ```

## 🏃‍♂️ Runtime Issues

### App Crashes

#### JavaScript Errors
**Problem:** App crashes with JavaScript errors.

**Solutions:**
```bash
# Enable debugging
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs

# Check Metro bundler console for errors
# Use React Native Debugger
# Add error boundaries in React components
```

#### Native Crashes
**Problem:** App crashes without JavaScript errors.

**Solutions:**
```bash
# Android: Check native logs
adb logcat | grep -E "(AndroidRuntime|DEBUG)"

# iOS: Check device logs in Xcode
# Window → Devices and Simulators → View Device Logs

# Check for memory issues
# Profile app with Xcode Instruments (iOS)
# Use Android Studio Profiler (Android)
```

### Performance Issues

#### Low Frame Rate
**Problem:** Game runs below 60 FPS.

**Solutions:**
```typescript
// Enable performance monitoring
import { performance } from 'perf_hooks';

// Check game loop timing
const gameLoop = () => {
  const start = performance.now();
  
  // Game logic here
  
  const end = performance.now();
  if (end - start > 16) {
    console.warn(`Frame took ${end - start}ms (should be <16ms)`);
  }
};

// Optimize animations to use native driver
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Important!
}).start();
```

#### Memory Leaks
**Problem:** App memory usage increases over time.

**Solutions:**
```typescript
// Clean up intervals and timeouts
useEffect(() => {
  const interval = setInterval(() => {
    // Game logic
  }, 16);
  
  return () => clearInterval(interval); // Cleanup!
}, []);

// Remove event listeners
useEffect(() => {
  const handlePress = () => { /* ... */ };
  
  // Add listener
  someEmitter.addListener('event', handlePress);
  
  return () => {
    // Remove listener
    someEmitter.removeListener('event', handlePress);
  };
}, []);
```

### Storage Issues

#### AsyncStorage Errors
**Problem:** High score not saving or loading.

**Solutions:**
```typescript
// Add error handling
export const getHighScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0; // Return default value
  }
};

// Check storage permissions (Android)
// Ensure AsyncStorage is properly installed
npm install @react-native-async-storage/async-storage
```

## 📱 Platform-Specific Issues

### Android-Specific

#### Emulator Issues
**Problem:** Android emulator won't start or is slow.

**Solutions:**
```bash
# Enable hardware acceleration
# In Android Studio: Tools → AVD Manager → Edit AVD → Advanced Settings
# Graphics: Hardware - GLES 2.0

# Increase emulator RAM
# AVD Manager → Edit → Advanced → RAM: 4096 MB

# Use x86_64 system images for better performance

# Cold boot emulator
emulator -avd <AVD_NAME> -cold-boot
```

#### Device Connection Issues
**Problem:** Physical device not detected.

**Solutions:**
```bash
# Check device connection
adb devices

# Enable USB debugging on device
# Settings → Developer Options → USB Debugging

# Install USB drivers (Windows)
# Use manufacturer-specific drivers

# Restart ADB server
adb kill-server
adb start-server
```

### iOS-Specific

#### Simulator Issues
**Problem:** iOS Simulator not working properly.

**Solutions:**
```bash
# Reset simulator
xcrun simctl erase all

# Boot specific simulator
xcrun simctl boot "iPhone 14"

# List available simulators
xcrun simctl list devices

# Reset simulator settings
# Simulator → Device → Erase All Content and Settings
```

#### Device Provisioning
**Problem:** Can't install on physical iOS device.

**Solutions:**
1. **Check provisioning profile:**
   - Xcode → Preferences → Accounts
   - Select team → Manage Certificates
   - Download provisioning profiles

2. **Trust developer certificate:**
   - Device: Settings → General → VPN & Device Management
   - Trust your developer certificate

3. **Check bundle identifier:**
   - Ensure it matches provisioning profile
   - Xcode → Project → Signing & Capabilities

## 🐳 Docker Issues

### Container Build Issues

#### Docker Build Failures
**Problem:** Docker containers fail to build.

**Solutions:**
```bash
# Build without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -t test-build .

# View build logs
docker-compose build --progress=plain

# Check available disk space
docker system df
docker system prune  # Clean up if needed
```

#### Volume Mount Issues
**Problem:** Files not appearing in container or permission errors.

**Solutions:**
```bash
# Check volume mounts
docker-compose config

# Fix file permissions (Linux/macOS)
sudo chown -R $USER:$USER ./android/app/build/

# On Windows, ensure Docker Desktop has access to drive
# Docker Desktop → Settings → Resources → File Sharing
```

### Container Runtime Issues

#### Container Crashes
**Problem:** Containers exit unexpectedly.

**Solutions:**
```bash
# Check container logs
docker-compose logs android-build

# Run container interactively for debugging
docker-compose run --rm android-build bash

# Check container resource usage
docker stats

# Increase container memory if needed
# docker-compose.yml:
services:
  android-build:
    mem_limit: 4g
```

## 🔄 CI/CD Issues

### GitHub Actions Failures

#### Build Failures
**Problem:** CI/CD pipeline fails to build.

**Solutions:**
1. **Check workflow logs:**
   - Go to Actions tab in GitHub
   - Click on failed workflow
   - Examine step-by-step logs

2. **Common fixes:**
   ```yaml
   # Ensure Node.js version matches local
   - name: Setup Node.js
     uses: actions/setup-node@v3
     with:
       node-version: '18'  # Match your local version
   
   # Cache dependencies for faster builds
   - name: Cache dependencies
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

#### Secret Configuration Issues
**Problem:** Build fails due to missing or incorrect secrets.

**Solutions:**
1. **Verify secrets in GitHub:**
   - Repository → Settings → Secrets and variables → Actions
   - Ensure all required secrets are set

2. **Test secrets locally:**
   ```bash
   # Decode base64 secrets to verify content
   echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > test.keystore
   keytool -list -v -keystore test.keystore
   ```

### Artifact Issues

#### Upload Failures
**Problem:** Build artifacts not uploading.

**Solutions:**
```yaml
# Check artifact paths
- name: Upload APK
  uses: actions/upload-artifact@v3
  with:
    name: android-apk
    path: android/app/build/outputs/apk/release/app-release.apk
    if-no-files-found: error  # Fail if file not found

# Verify file exists before upload
- name: Check APK exists
  run: ls -la android/app/build/outputs/apk/release/
```

## 🎮 Game-Specific Issues

### Physics Issues

#### Bird Movement Problems
**Problem:** Bird doesn't respond to taps or moves incorrectly.

**Solutions:**
```typescript
// Check game state
const jump = useCallback(() => {
  console.log('Jump called, gameState:', gameState);
  if (gameState === 'PLAYING') {
    setBird(prevBird => ({
      ...prevBird,
      velocity: PHYSICS_CONFIG.JUMP_VELOCITY,
      rotation: -20,
    }));
  }
}, [gameState]);

// Verify physics constants
console.log('Physics config:', PHYSICS_CONFIG);

// Check touch handling
const handleScreenPress = () => {
  console.log('Screen pressed, gameState:', gameState);
  if (gameState === 'PLAYING') {
    jump();
  }
};
```

#### Collision Detection Issues
**Problem:** Collisions not detected properly or false positives.

**Solutions:**
```typescript
// Debug collision boxes
const debugCollision = (bird: BirdState, pipe: PipeState) => {
  const birdBox = getBirdCollisionBox(bird);
  const pipeBoxes = getPipeCollisionBoxes(pipe);
  
  console.log('Bird box:', birdBox);
  console.log('Pipe boxes:', pipeBoxes);
  
  const collision = checkBirdPipeCollision(bird, pipe);
  console.log('Collision detected:', collision);
  
  return collision;
};

// Visualize collision boxes (development only)
const renderDebugBoxes = () => (
  <>
    <View style={{
      position: 'absolute',
      left: birdBox.x,
      top: birdBox.y,
      width: birdBox.width,
      height: birdBox.height,
      borderWidth: 2,
      borderColor: 'red',
    }} />
  </>
);
```

### Performance Issues

#### Frame Rate Drops
**Problem:** Game stutters or runs slowly.

**Solutions:**
```typescript
// Monitor frame timing
let lastFrameTime = Date.now();

const gameLoop = useCallback(() => {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastFrameTime;
  
  if (deltaTime > 20) { // More than 20ms = less than 50 FPS
    console.warn(`Slow frame: ${deltaTime}ms`);
  }
  
  lastFrameTime = currentTime;
  
  // Game logic here
}, []);

// Optimize state updates
const updateBird = useCallback(() => {
  setBird(prevBird => {
    // Calculate new state
    const newState = { ...prevBird, /* updates */ };
    
    // Only update if state actually changed
    if (newState.y === prevBird.y && newState.velocity === prevBird.velocity) {
      return prevBird; // Prevent unnecessary re-renders
    }
    
    return newState;
  });
}, []);
```

## 🆘 Getting Help

### Debug Information to Collect

When reporting issues, include:

```bash
# System information
node --version
npm --version
npx react-native --version

# Platform information
# Android:
adb shell getprop ro.build.version.release
adb shell getprop ro.product.model

# iOS:
xcrun simctl list devices
system_profiler SPSoftwareDataType
```

### Log Collection

```bash
# Collect comprehensive logs
# Android
adb logcat > android_logs.txt

# iOS
xcrun simctl spawn booted log collect --output ios_logs.logarchive

# Metro bundler
npx react-native start > metro_logs.txt 2>&1

# React Native logs
npx react-native log-android > rn_android_logs.txt
npx react-native log-ios > rn_ios_logs.txt
```

### Useful Commands for Debugging

```bash
# Check React Native environment
npx react-native doctor

# Analyze bundle size
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output bundle.js --analyze

# Profile app performance
# Use Flipper for React Native debugging
npx react-native run-android --variant=debug
```

---

**Still having issues?** 
- Check the [Getting Started](Getting-Started) guide for setup issues
- Review [Development Guide](Development-Guide) for coding problems  
- Consult [Build and Deployment](Build-and-Deployment) for build issues
- Open an issue in the repository with detailed information