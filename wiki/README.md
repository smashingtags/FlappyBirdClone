# Sky Dash Wiki

Welcome to the comprehensive documentation for Sky Dash, a cross-platform Flappy Bird clone built with React Native and TypeScript.

## 📚 Wiki Structure

This wiki is organized into logical sections to help developers at all levels understand, contribute to, and extend the project.

### 🚀 Getting Started
Start here if you're new to the project:

1. **[Home](Home.md)** - Project overview and quick navigation
2. **[Getting Started](Getting-Started.md)** - Installation, setup, and first run
3. **[Troubleshooting](Troubleshooting.md)** - Common issues and solutions

### 🏗️ Development
Core development documentation:

4. **[Game Architecture](Game-Architecture.md)** - Code structure and design patterns
5. **[API Reference](API-Reference.md)** - Components, hooks, and utilities documentation
6. **[Development Guide](Development-Guide.md)** - Coding standards and contribution guidelines
7. **[Testing](Testing.md)** - Unit tests, integration tests, and debugging

### 🎮 Game Design
Understanding the game mechanics:

8. **[Game Design](Game-Design.md)** - Physics, mechanics, and gameplay systems
9. **[Assets and Customization](Assets-and-Customization.md)** - Graphics, sounds, and theming

### 🚀 Deployment
Production and optimization:

10. **[Build and Deployment](Build-and-Deployment.md)** - Docker, CI/CD, and release processes
11. **[Performance Optimization](Performance-Optimization.md)** - Best practices and monitoring

## 🗺️ Navigation Guide

### For New Developers
```
Home → Getting Started → Game Architecture → Development Guide
```

### For Contributors
```
Development Guide → API Reference → Testing → Build and Deployment
```

### For Game Designers
```
Game Design → Assets and Customization → Performance Optimization
```

### For DevOps/Deployment
```
Build and Deployment → Performance Optimization → Troubleshooting
```

## 📋 Page Summaries

| Page | Purpose | Audience | Prerequisites |
|------|---------|----------|---------------|
| **[Home](Home.md)** | Project overview and navigation hub | Everyone | None |
| **[Getting Started](Getting-Started.md)** | Setup and installation guide | New developers | Basic React Native knowledge |
| **[Game Architecture](Game-Architecture.md)** | Code structure and patterns | Developers | React/TypeScript experience |
| **[API Reference](API-Reference.md)** | Detailed API documentation | Developers | Understanding of architecture |
| **[Development Guide](Development-Guide.md)** | Coding standards and workflow | Contributors | Git and development experience |
| **[Testing](Testing.md)** | Testing strategies and examples | Developers | Jest/testing knowledge |
| **[Game Design](Game-Design.md)** | Game mechanics and physics | Game designers | Basic physics understanding |
| **[Assets and Customization](Assets-and-Customization.md)** | Visual and audio customization | Designers/Artists | Asset creation skills |
| **[Build and Deployment](Build-and-Deployment.md)** | Production builds and CI/CD | DevOps/Developers | Docker and CI/CD knowledge |
| **[Performance Optimization](Performance-Optimization.md)** | Optimization techniques | Advanced developers | Performance analysis skills |
| **[Troubleshooting](Troubleshooting.md)** | Problem solving guide | Everyone | Basic debugging skills |

## 🔗 Cross-References

### Common Navigation Paths

**Setup and Development:**
- [Getting Started](Getting-Started.md) → [Game Architecture](Game-Architecture.md) → [Development Guide](Development-Guide.md)

**Understanding the Codebase:**
- [Game Architecture](Game-Architecture.md) → [API Reference](API-Reference.md) → [Game Design](Game-Design.md)

**Contributing Code:**
- [Development Guide](Development-Guide.md) → [Testing](Testing.md) → [Build and Deployment](Build-and-Deployment.md)

**Customization:**
- [Game Design](Game-Design.md) → [Assets and Customization](Assets-and-Customization.md) → [Performance Optimization](Performance-Optimization.md)

**Problem Solving:**
- [Troubleshooting](Troubleshooting.md) → [Performance Optimization](Performance-Optimization.md) → [Testing](Testing.md)

## 📖 How to Use This Wiki

### 1. Choose Your Path
- **New to the project?** Start with [Home](Home.md) and [Getting Started](Getting-Started.md)
- **Want to contribute?** Read [Development Guide](Development-Guide.md) and [Testing](Testing.md)
- **Need to customize?** Check [Game Design](Game-Design.md) and [Assets and Customization](Assets-and-Customization.md)
- **Deploying to production?** Follow [Build and Deployment](Build-and-Deployment.md)

### 2. Follow the Links
Each page contains contextual links to related topics. Follow these to dive deeper into specific areas.

### 3. Use the Search
When looking for specific information:
- **Components:** Check [API Reference](API-Reference.md)
- **Setup Issues:** Check [Getting Started](Getting-Started.md) and [Troubleshooting](Troubleshooting.md)
- **Code Patterns:** Check [Game Architecture](Game-Architecture.md)
- **Performance Issues:** Check [Performance Optimization](Performance-Optimization.md)

## 🎯 Quick Reference

### Essential Commands
```bash
# Setup
npm install
npm run android  # or npm run ios

# Development
npm start
npm run lint
npm test

# Building
npm run build:android
npm run build:ios
```

### Key Files
- [`src/App.tsx`](../src/App.tsx) - Main app component
- [`src/hooks/useGamePhysics.ts`](../src/hooks/useGamePhysics.ts) - Core game logic
- [`src/utils/physics.ts`](../src/utils/physics.ts) - Physics calculations
- [`src/utils/collision.ts`](../src/utils/collision.ts) - Collision detection

### Important Concepts
- **Game Loop:** 60 FPS physics simulation
- **State Management:** React hooks with game state
- **Collision Detection:** AABB with forgiving hitboxes
- **Cross-Platform:** Single codebase for iOS and Android

## 🔄 Wiki Maintenance

### Updating Documentation
When making changes to the codebase:

1. **Update relevant wiki pages** - Keep documentation in sync with code
2. **Check cross-references** - Ensure links still work
3. **Update examples** - Keep code examples current
4. **Test instructions** - Verify setup and build instructions work

### Adding New Pages
When adding new wiki pages:

1. **Follow naming convention** - Use kebab-case (e.g., `New-Feature.md`)
2. **Add to navigation** - Update this README and relevant pages
3. **Include cross-references** - Link to and from related pages
4. **Follow page structure** - Use consistent formatting and sections

### Page Template
```markdown
# Page Title

Brief description of what this page covers.

## 📋 Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1
Content here...

## Section 2
Content here...

---

**Next steps:** Link to [Related Page](Related-Page.md)
```

## 📞 Support

If you can't find what you're looking for:

1. **Check [Troubleshooting](Troubleshooting.md)** for common issues
2. **Search the wiki** for keywords
3. **Review [API Reference](API-Reference.md)** for technical details
4. **Open an issue** in the repository with specific questions

## 🎉 Contributing to the Wiki

Help improve this documentation:

1. **Fix typos and errors** - Submit PRs for corrections
2. **Add missing information** - Fill gaps in documentation
3. **Improve examples** - Add better code examples
4. **Update outdated content** - Keep information current

---

**Ready to start?** Head to the [Home](Home.md) page to begin your journey with Sky Dash!