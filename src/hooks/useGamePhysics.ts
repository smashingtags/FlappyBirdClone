import { useState, useEffect, useRef, useCallback } from 'react';
import { BirdState, PipeState, GameState } from '../types';
import { 
  PHYSICS_CONFIG, 
  SCREEN_DIMENSIONS, 
  calculateBirdRotation, 
  generateRandomPipeHeight,
  isOffScreen,
  shouldGenerateNewPipe 
} from '../utils/physics';
import {
  checkBirdPipeCollision,
  checkBirdGroundCollision,
  checkBirdCeilingCollision,
  checkBirdPassedPipe
} from '../utils/collision';
import { getHighScore, updateHighScore } from '../utils/storage';

export const useGamePhysics = () => {
  const [bird, setBird] = useState<BirdState>({
    x: SCREEN_DIMENSIONS.WIDTH * 0.2,
    y: SCREEN_DIMENSIONS.HEIGHT * 0.5,
    velocity: 0,
    rotation: 0,
  });

  const [pipes, setPipes] = useState<PipeState[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('START');
  
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const frameCountRef = useRef(0);

  // Load high score on component mount
  useEffect(() => {
    const loadHighScore = async () => {
      const savedHighScore = await getHighScore();
      setHighScore(savedHighScore);
    };
    loadHighScore();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(() => {
        frameCountRef.current += 1;
        updateBird();
        updatePipes();
        checkCollisions();
        updateScore();
      }, 16); // ~60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState]);

  const updateBird = useCallback(() => {
    setBird(prevBird => {
      let newVelocity = prevBird.velocity + PHYSICS_CONFIG.GRAVITY;
      newVelocity = Math.min(newVelocity, PHYSICS_CONFIG.TERMINAL_VELOCITY);
      
      const newY = prevBird.y + newVelocity;
      const newRotation = calculateBirdRotation(newVelocity);

      return {
        ...prevBird,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation,
      };
    });
  }, []);

  const updatePipes = useCallback(() => {
    setPipes(prevPipes => {
      // Move existing pipes
      let updatedPipes = prevPipes.map(pipe => ({
        ...pipe,
        x: pipe.x - PHYSICS_CONFIG.PIPE_SPEED,
      }));

      // Remove pipes that are off-screen
      updatedPipes = updatedPipes.filter(pipe => !isOffScreen(pipe.x));

      // Add new pipes
      const lastPipe = updatedPipes[updatedPipes.length - 1];
      if (!lastPipe || shouldGenerateNewPipe(lastPipe.x)) {
        const { topHeight, bottomHeight } = generateRandomPipeHeight();
        const newPipe: PipeState = {
          id: `pipe_${Date.now()}_${Math.random()}`,
          x: SCREEN_DIMENSIONS.WIDTH,
          topHeight,
          bottomHeight,
          passed: false,
        };
        updatedPipes.push(newPipe);
      }

      return updatedPipes;
    });
  }, []);

  const checkCollisions = useCallback(() => {
    setBird(currentBird => {
      // Ground collision
      if (checkBirdGroundCollision(currentBird)) {
        setGameState('GAME_OVER');
        return currentBird;
      }

      // Ceiling collision
      if (checkBirdCeilingCollision(currentBird)) {
        setGameState('GAME_OVER');
        return currentBird;
      }

      // Pipe collision
      setPipes(currentPipes => {
        const hasCollision = currentPipes.some(pipe => 
          checkBirdPipeCollision(currentBird, pipe)
        );

        if (hasCollision) {
          setGameState('GAME_OVER');
        }

        return currentPipes;
      });

      return currentBird;
    });
  }, []);

  const updateScore = useCallback(() => {
    setPipes(prevPipes => {
      let newScore = score;
      const updatedPipes = prevPipes.map(pipe => {
        if (checkBirdPassedPipe(bird, pipe)) {
          pipe.passed = true;
          newScore += 1;
        }
        return pipe;
      });

      if (newScore !== score) {
        setScore(newScore);
      }

      return updatedPipes;
    });
  }, [bird, score]);

  const jump = useCallback(() => {
    if (gameState === 'PLAYING') {
      setBird(prevBird => ({
        ...prevBird,
        velocity: PHYSICS_CONFIG.JUMP_VELOCITY,
        rotation: -20,
      }));
    }
  }, [gameState]);

  const startGame = useCallback(() => {
    setGameState('PLAYING');
    // Generate first pipe
    const { topHeight, bottomHeight } = generateRandomPipeHeight();
    const firstPipe: PipeState = {
      id: `pipe_start_${Date.now()}`,
      x: SCREEN_DIMENSIONS.WIDTH + 200,
      topHeight,
      bottomHeight,
      passed: false,
    };
    setPipes([firstPipe]);
  }, []);

  const resetGame = useCallback(async () => {
    // Update high score if needed
    if (score > highScore) {
      const newHighScore = await updateHighScore(score);
      setHighScore(newHighScore);
    }

    // Reset game state
    setBird({
      x: SCREEN_DIMENSIONS.WIDTH * 0.2,
      y: SCREEN_DIMENSIONS.HEIGHT * 0.5,
      velocity: 0,
      rotation: 0,
    });
    setPipes([]);
    setScore(0);
    setGameState('START');
    frameCountRef.current = 0;
  }, [score, highScore]);

  const pauseGame = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, [gameState]);

  return {
    bird,
    pipes,
    score,
    highScore,
    gameState,
    jump,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
  };
};