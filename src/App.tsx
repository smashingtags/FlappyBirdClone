import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import GameScreen from './screens/GameScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GameScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
