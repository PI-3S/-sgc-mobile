import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO (Pessoa 2): implementar tela de login completa — branch feature/login
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SGC Mobile</Text>
      <Text style={styles.subtitle}>Tela de Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
