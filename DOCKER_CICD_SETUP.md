# Docker CI/CD Setup for React Native Mobile Apps

This document provides comprehensive instructions for setting up and using the Docker-based CI/CD pipeline for building React Native mobile applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Containers](#docker-containers)
- [Build Scripts](#build-scripts)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Environment Variables](#environment-variables)
- [Signing Configuration](#signing-configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## 🎯 Overview

This CI/CD pipeline provides:

- **Consistent Build Environment**: Docker containers ensure reproducible builds
- **Multi-Platform Support**: Builds for both Android and iOS
- **Automated Testing**: Linting and unit tests before builds
- **Artifact Management**: Automatic upload of APK, AAB, and IPA files
- **Release Automation**: Automatic release creation with build artifacts

## 📋 Prerequisites

### Local Development

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### CI/CD Pipeline

- GitHub repository
- GitHub Actions enabled
- Secrets configured (see [Environment Variables](#environment-variables))

### Mobile Development (Optional for local builds)

- **Android**: Android Studio, Android SDK
- **iOS**: macOS, Xcode, CocoaPods

## 🚀 Quick Start

### 1. Initialize React Native Project

First, ensure your React Native project has the platform folders:

```bash
# If you haven't initialized the React Native project yet
npx @react-native-community/cli init YourAppName --template react-native-template-typescript
```

### 2. Local Development with Docker

```bash
# Start development server
docker-compose up dev

# Run tests
docker-compose run --rm test

# Run linter
docker-compose run --rm lint
```

### 3. Build Mobile Apps

```bash
# Build Android APK
docker-compose run --rm android-build

# Build Android AAB
docker-compose run --rm android-aab-build

# Build iOS (macOS only)
docker-compose run --rm ios-build
```

### 4. Using Build Scripts Directly

```bash
# Make scripts executable (Linux/macOS)
chmod +x scripts/*.sh

# Build Android APK
./scripts/build-android.sh

# Build Android AAB
./scripts/build-android-aab.sh

# Build iOS IPA (macOS only)
./scripts/build-ios.sh
```

## 🐳 Docker Containers

### Base Container (`Dockerfile.base`)

- Node.js 18 environment
- React Native CLI
- Common build tools
- Fastlane for automation

### Android Container (`Dockerfile.android`)

- Extends base container
- Android SDK and build tools
- Java 11
- Gradle build system

### iOS Container (`Dockerfile.ios`)

- Node.js environment
- CocoaPods
- Xcode command line tools (for macOS runners)

## 📜 Build Scripts

### Android Scripts

#### `scripts/build-android.sh`

- Builds release APK
- Performs clean build
- Copies artifacts to `build-artifacts/`
- Reports build size

#### `scripts/build-android-aab.sh`

- Builds Android App Bundle (AAB)
- Optimized for Google Play Store
- Smaller download size for users

### iOS Script

#### `scripts/build-ios.sh`

- Creates iOS archive
- Exports IPA file
- Handles CocoaPods installation
- Requires macOS environment

## ⚙️ GitHub Actions Workflow

The workflow (`.github/workflows/build-mobile-apps.yml`) includes:

### Jobs

1. **lint-and-test**: Code quality checks
2. **build-android**: Native Android build
3. **build-android-docker**: Docker-based Android build
4. **build-ios**: iOS build on macOS runner
5. **release**: Publishes artifacts on release

### Triggers

- Push to `main` or `develop` branches
- Pull requests to `main`
- Release publication

### Artifacts

- Android APK files
- Android AAB files
- iOS IPA files
- Retained for 30 days

## 🔐 Environment Variables

### GitHub Secrets

Configure these secrets in your GitHub repository:

#### Android Signing

```
ANDROID_KEYSTORE_FILE          # Base64 encoded keystore file
ANDROID_KEY_ALIAS              # Key alias
ANDROID_KEYSTORE_PASSWORD      # Keystore password
ANDROID_KEY_PASSWORD           # Key password
```

#### iOS Signing

```
IOS_TEAM_ID                    # Apple Developer Team ID
IOS_CERTIFICATE_P12            # Base64 encoded certificate
IOS_CERTIFICATE_PASSWORD       # Certificate password
IOS_PROVISIONING_PROFILE       # Base64 encoded provisioning profile
```

#### App Store Connect

```
APP_STORE_CONNECT_API_KEY_ID   # API Key ID
APP_STORE_CONNECT_API_ISSUER_ID # Issuer ID
APP_STORE_CONNECT_API_KEY      # Base64 encoded API key
```

#### Google Play Console

```
GOOGLE_PLAY_SERVICE_ACCOUNT    # Base64 encoded service account JSON
```

### Local Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your values
```

## 🔑 Signing Configuration

### Android Signing

1. **Generate Keystore**:

```bash
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle** (`android/gradle.properties`):

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

3. **Update Build Gradle** (`android/app/build.gradle`):

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### iOS Signing

1. **Apple Developer Account**: Ensure you have a valid Apple Developer account
2. **Certificates**: Create distribution certificates
3. **Provisioning Profiles**: Create app store provisioning profiles
4. **Fastlane Match** (Recommended): Use Fastlane Match for certificate management

## 🔧 Troubleshooting

### Common Issues

#### Docker Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

#### Android Build Fails

```bash
# Clean Android build
cd android && ./gradlew clean

# Check Android SDK installation
echo $ANDROID_HOME
```

#### iOS Build Fails

```bash
# Clean iOS build
cd ios && xcodebuild clean

# Update CocoaPods
pod repo update
pod install
```

#### Permission Denied on Scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Debug Mode

Enable debug logging in build scripts:

```bash
# Add to script
set -x  # Enable debug mode
```

## 🚀 Advanced Usage

### Custom Build Configurations

#### Multiple Environments

Create separate Docker Compose files:

- `docker-compose.dev.yml`
- `docker-compose.staging.yml`
- `docker-compose.prod.yml`

#### Build Variants

Modify build scripts for different variants:

```bash
# Debug build
./gradlew assembleDebug

# Staging build
./gradlew assembleStaging
```

### Optimization

#### Docker Layer Caching

```dockerfile
# Copy package files first for better caching
COPY package*.json ./
RUN npm ci
COPY . .
```

#### Parallel Builds

```yaml
# GitHub Actions
strategy:
  matrix:
    platform: [android, ios]
```

### Integration with External Services

#### Slack Notifications

Add to GitHub Actions:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### App Distribution

```yaml
- name: Upload to Firebase App Distribution
  uses: wzieba/Firebase-Distribution-Github-Action@v1
```

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Android Developer Guide](https://developer.android.com/)
- [iOS Developer Guide](https://developer.apple.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes with the Docker pipeline
4. Submit a pull request

## 📄 License

This CI/CD setup is provided as-is for educational and development purposes.

---

**Happy Building! 🚀**
