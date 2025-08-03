#!/bin/bash

# iOS Build Script for React Native
# This script builds the iOS IPA for release

set -e

echo "🚀 Starting iOS build..."

# Check if we're running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS builds require macOS. Current OS: $OSTYPE"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if ios directory exists
if [ ! -d "ios" ]; then
    echo "❌ Error: ios directory not found. Please ensure React Native project is properly initialized."
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode command line tools not found. Please install Xcode."
    exit 1
fi

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "❌ Error: CocoaPods not found. Installing..."
    sudo gem install cocoapods
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm ci
fi

# Navigate to ios directory and install pods
echo "📦 Installing iOS dependencies..."
cd ios
pod install --repo-update
cd ..

# Create build artifacts directory
mkdir -p build-artifacts

# Navigate to ios directory
cd ios

# Clean previous builds
echo "🧹 Cleaning previous builds..."
xcodebuild clean -workspace FlappyBirdClone.xcworkspace -scheme FlappyBirdClone

# Create archive
echo "🔨 Creating iOS archive..."
xcodebuild archive \
    -workspace FlappyBirdClone.xcworkspace \
    -scheme FlappyBirdClone \
    -configuration Release \
    -archivePath build/FlappyBirdClone.xcarchive \
    -allowProvisioningUpdates

# Check if archive was created successfully
if [ -d "build/FlappyBirdClone.xcarchive" ]; then
    echo "✅ iOS archive created successfully!"
    
    # Create export options plist if it doesn't exist
    if [ ! -f "exportOptions.plist" ]; then
        echo "📝 Creating export options plist..."
        cat > exportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>compileBitcode</key>
    <false/>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
EOF
    fi
    
    # Export IPA
    echo "📦 Exporting IPA..."
    xcodebuild -exportArchive \
        -archivePath build/FlappyBirdClone.xcarchive \
        -exportPath build \
        -exportOptionsPlist exportOptions.plist
    
    # Check if IPA was created
    if [ -f "build/FlappyBirdClone.ipa" ]; then
        echo "✅ iOS IPA build completed successfully!"
        echo "📱 IPA location: ios/build/FlappyBirdClone.ipa"
        
        # Copy IPA to build artifacts
        cp build/FlappyBirdClone.ipa ../build-artifacts/
        
        # Get IPA size
        IPA_SIZE=$(du -h build/FlappyBirdClone.ipa | cut -f1)
        echo "📊 IPA size: $IPA_SIZE"
        
    else
        echo "❌ IPA export failed!"
        exit 1
    fi
    
else
    echo "❌ iOS archive creation failed!"
    exit 1
fi

echo "🎉 iOS build process completed!"