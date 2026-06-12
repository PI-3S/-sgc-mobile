import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

// TODO (Pessoa 3): implementar histórico — branch feature/progresso-historico
export default function HistoricoScreen() {
  return (
    <View style={styles.container}>
      <Header titulo="Histórico" />
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
