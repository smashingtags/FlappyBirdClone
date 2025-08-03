#!/bin/bash

# Android Build Script for React Native
# This script builds the Android APK for release

set -e

echo "🚀 Starting Android APK build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "❌ Error: android directory not found. Please ensure React Native project is properly initialized."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm ci
fi

# Navigate to android directory
cd android

# Make gradlew executable
chmod +x ./gradlew

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release APK
echo "🔨 Building release APK..."
./gradlew assembleRelease

# Check if build was successful
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Android APK build completed successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    
    # Create build artifacts directory
    mkdir -p ../build-artifacts
    
    # Copy APK to build artifacts
    cp app/build/outputs/apk/release/app-release.apk ../build-artifacts/
    
    # Get APK size
    APK_SIZE=$(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "📊 APK size: $APK_SIZE"
    
else
    echo "❌ Android APK build failed!"
    exit 1
fi

echo "🎉 Android build process completed!"