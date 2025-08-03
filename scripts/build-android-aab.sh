#!/bin/bash

# Android AAB Build Script for React Native
# This script builds the Android App Bundle (AAB) for Google Play Store

set -e

echo "🚀 Starting Android AAB build..."

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

# Build release AAB
echo "🔨 Building release AAB..."
./gradlew bundleRelease

# Check if build was successful
if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ Android AAB build completed successfully!"
    echo "📱 AAB location: android/app/build/outputs/bundle/release/app-release.aab"
    
    # Create build artifacts directory
    mkdir -p ../build-artifacts
    
    # Copy AAB to build artifacts
    cp app/build/outputs/bundle/release/app-release.aab ../build-artifacts/
    
    # Get AAB size
    AAB_SIZE=$(du -h app/build/outputs/bundle/release/app-release.aab | cut -f1)
    echo "📊 AAB size: $AAB_SIZE"
    
    echo "📝 Note: AAB files are optimized for Google Play Store and will be converted to APKs by Google Play."
    
else
    echo "❌ Android AAB build failed!"
    exit 1
fi

echo "🎉 Android AAB build process completed!"