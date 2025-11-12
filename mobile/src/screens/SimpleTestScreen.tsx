import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SimpleTestScreen() {
  console.log('✅ SimpleTestScreen rendu');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ TEST RÉUSSI</Text>
      <Text style={styles.text}>Si vous voyez ceci, React Native Web fonctionne !</Text>
      <Text style={styles.text}>L'application devrait maintenant s'afficher correctement.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
});

