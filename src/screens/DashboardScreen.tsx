import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing, radius } from '../styles/theme';
import { apiFetch } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    apiFetch('/api/dashboard/aluno')
      .then(res => res?.metricas && setMetrics(res.metricas))
      .catch(err => Alert.alert('Erro', err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header titulo="Dashboard" />
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.txt, { fontSize: 24, fontWeight: 'bold' }]}>Dashboard</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: spacing.lg }}>Suas horas e submissões</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horas Aprovadas</Text>
          <Text style={{ fontSize: 28, color: colors.accent, fontWeight: 'bold' }}>{metrics?.total_horas_aprovadas}h / {metrics?.carga_horaria_minima}h</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: spacing.lg }}>
          <View style={[styles.badge, { backgroundColor: colors.success }]}><Text style={styles.txtBadge}>Aprovadas: {metrics?.aprovadas}</Text></View>
          <View style={[styles.badge, { backgroundColor: colors.warning }]}><Text style={styles.txtBadge}>Pendentes: {metrics?.pendentes}</Text></View>
          <View style={[styles.badge, { backgroundColor: colors.error }]}><Text style={styles.txtBadge}>Reprovadas: {metrics?.reprovadas}</Text></View>
        </View>

        <Text style={[styles.txt, { fontWeight: 'bold', marginBottom: spacing.sm }]}>Horas por Área</Text>
        {metrics?.horas_por_area?.map((item, i) => (
          <View key={i} style={[styles.card, { marginBottom: spacing.sm, borderLeftWidth: 4, borderLeftColor: colors.accent }]}>
            <Text style={[styles.txt, { fontWeight: '600' }]}>{item.area}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.horas}h de {item.limite}h limite</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.md },
  cardTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  txt: { color: colors.textPrimary },
  badge: { flex: 1, padding: 8, borderRadius: radius.sm, alignItems: 'center' },
  txtBadge: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});