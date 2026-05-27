import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO (Pessoa 4): implementar submissão + upload — branch feature/submissao-upload
export default function SubmissaoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Submissão</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});
