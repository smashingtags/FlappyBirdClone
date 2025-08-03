// Note: AsyncStorage import will be added once React Native is properly set up
// import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@FlappyBirdClone:highScore';

export const getHighScore = async (): Promise<number> => {
  try {
    // Temporary implementation - will be replaced with AsyncStorage
    const storedScore = localStorage.getItem(HIGH_SCORE_KEY);
    return storedScore ? parseInt(storedScore, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};

export const setHighScore = async (score: number): Promise<void> => {
  try {
    // Temporary implementation - will be replaced with AsyncStorage
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error setting high score:', error);
  }
};

export const updateHighScore = async (
  currentScore: number
): Promise<number> => {
  try {
    const highScore = await getHighScore();
    if (currentScore > highScore) {
      await setHighScore(currentScore);
      return currentScore;
    }
    return highScore;
  } catch (error) {
    console.error('Error updating high score:', error);
    return 0;
  }
};

// This will be the actual implementation once AsyncStorage is available:
/*
export const getHighScore = async (): Promise<number> => {
  try {
    const storedScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return storedScore ? parseInt(storedScore, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};

export const setHighScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error setting high score:', error);
  }
};
*/
