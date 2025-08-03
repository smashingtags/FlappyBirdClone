import { CollisionBox, BirdState, PipeState } from '../types';
import { PHYSICS_CONFIG, SCREEN_DIMENSIONS } from './physics';

export const createCollisionBox = (
  x: number,
  y: number,
  width: number,
  height: number
): CollisionBox => ({
  x,
  y,
  width,
  height,
});

export const checkAABBCollision = (
  box1: CollisionBox,
  box2: CollisionBox
): boolean => {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
};

export const getBirdCollisionBox = (bird: BirdState): CollisionBox => {
  // Make the collision box slightly smaller than the bird sprite for better gameplay
  const padding = 2;
  return createCollisionBox(
    bird.x + padding,
    bird.y + padding,
    PHYSICS_CONFIG.BIRD_SIZE.width - padding * 2,
    PHYSICS_CONFIG.BIRD_SIZE.height - padding * 2
  );
};

export const getPipeCollisionBoxes = (pipe: PipeState): CollisionBox[] => {
  const topPipe = createCollisionBox(
    pipe.x,
    0,
    PHYSICS_CONFIG.PIPE_WIDTH,
    pipe.topHeight
  );

  const bottomPipe = createCollisionBox(
    pipe.x,
    SCREEN_DIMENSIONS.HEIGHT -
      pipe.bottomHeight -
      SCREEN_DIMENSIONS.GROUND_HEIGHT,
    PHYSICS_CONFIG.PIPE_WIDTH,
    pipe.bottomHeight
  );

  return [topPipe, bottomPipe];
};

export const checkBirdPipeCollision = (
  bird: BirdState,
  pipe: PipeState
): boolean => {
  const birdBox = getBirdCollisionBox(bird);
  const pipeBoxes = getPipeCollisionBoxes(pipe);

  return pipeBoxes.some((pipeBox) => checkAABBCollision(birdBox, pipeBox));
};

export const checkBirdGroundCollision = (bird: BirdState): boolean => {
  return (
    bird.y + PHYSICS_CONFIG.BIRD_SIZE.height >
    SCREEN_DIMENSIONS.HEIGHT - SCREEN_DIMENSIONS.GROUND_HEIGHT
  );
};

export const checkBirdCeilingCollision = (bird: BirdState): boolean => {
  return bird.y < 0;
};

export const checkBirdPassedPipe = (
  bird: BirdState,
  pipe: PipeState
): boolean => {
  return !pipe.passed && bird.x > pipe.x + PHYSICS_CONFIG.PIPE_WIDTH;
};
