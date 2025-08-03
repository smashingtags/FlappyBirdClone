# Sky Dash - Flappy Bird Clone Wiki

Welcome to the comprehensive documentation for **Sky Dash**, a cross-platform Flappy Bird clone built with React Native and TypeScript. This wiki provides everything you need to understand, develop, build, and deploy the game.

## 🎮 About the Project

Sky Dash is a physics-based mobile game that recreates the classic Flappy Bird experience with modern development practices. The project features:

- **Cross-Platform**: Runs on both iOS and Android
- **TypeScript**: Fully typed codebase for better development experience
- **Modern Architecture**: Component-based design with custom hooks
- **Professional CI/CD**: Docker-based build pipeline with GitHub Actions
- **60 FPS Gameplay**: Smooth physics engine with realistic bird movement
- **Local Persistence**: High score tracking with AsyncStorage

## 📚 Documentation Navigation

### Getting Started
- **[Getting Started](Getting-Started)** - Installation, setup, and running the app
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

### Development
- **[Game Architecture](Game-Architecture)** - Code structure and design patterns
- **[API Reference](API-Reference)** - Components, hooks, and utilities documentation
- **[Development Guide](Development-Guide)** - Coding standards and contribution guidelines
- **[Testing](Testing)** - Unit tests and debugging strategies

### Game Design
- **[Game Design](Game-Design)** - Physics, mechanics, and gameplay systems
- **[Assets and Customization](Assets-and-Customization)** - Graphics, sounds, and theming
- **[Performance Optimization](Performance-Optimization)** - Best practices and monitoring

### Deployment
- **[Build and Deployment](Build-and-Deployment)** - Docker, CI/CD, and release processes

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd FlappyBirdClone

# Install dependencies
npm install

# iOS setup (Mac only)
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🏗️ Project Structure

```
FlappyBirdClone/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   └── assets/             # Game assets
├── android/                # Android platform files
├── ios/                   # iOS platform files
├── scripts/               # Build scripts
└── .github/workflows/     # CI/CD pipeline
```

## 🎯 Key Features

### Game Mechanics
- **Physics-Based Movement**: Realistic gravity (0.5px/frame) and jump velocity (-8px/frame)
- **Collision Detection**: AABB collision system with forgiving hitboxes
- **Score System**: Points for passing pipes with persistent high scores
- **Game States**: START → PLAYING → GAME_OVER → RESTART cycle

### Technical Features
- **60 FPS Game Loop**: Smooth gameplay with 16ms intervals
- **Component Architecture**: Modular design with [`Bird.tsx`](../src/components/Bird.tsx), [`Pipe.tsx`](../src/components/Pipe.tsx), [`Ground.tsx`](../src/components/Ground.tsx)
- **Custom Physics Engine**: [`useGamePhysics.ts`](../src/hooks/useGamePhysics.ts) hook managing game state
- **Cross-Platform Builds**: Docker-based CI/CD for iOS and Android

### Development Tools
- **TypeScript**: Full type safety with interfaces for game state
- **ESLint & Prettier**: Code quality and formatting
- **Docker**: Containerized build environment
- **GitHub Actions**: Automated testing and deployment

## 🛠️ Development Workflow

1. **Setup**: Follow the [Getting Started](Getting-Started) guide
2. **Architecture**: Understand the [Game Architecture](Game-Architecture)
3. **Development**: Read the [Development Guide](Development-Guide)
4. **Testing**: Use the [Testing](Testing) strategies
5. **Deployment**: Follow [Build and Deployment](Build-and-Deployment)

## 📱 Supported Platforms

| Platform | Status | Requirements |
|----------|--------|--------------|
| **Android** | ✅ Supported | Android SDK 21+ |
| **iOS** | ✅ Supported | iOS 11.0+ |
| **Web** | ❌ Not supported | React Native focused |

## 🤝 Contributing

We welcome contributions! Please read our [Development Guide](Development-Guide) for:
- Code style guidelines
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is for educational purposes. See the main repository for license details.

## 🔗 External Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

---

**Need help?** Check the [Troubleshooting](Troubleshooting) page or open an issue in the repository.

**Ready to start?** Head to [Getting Started](Getting-Started) to set up your development environment.