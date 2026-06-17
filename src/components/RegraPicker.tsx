import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

export interface Regra {
  id: string;
  area: string;
  limite_horas: number;
}

interface Props {
  regras: Regra[];
  selecionada: Regra | null;
  onSelect: (regra: Regra) => void;
}

export default function RegraPicker({ regras, selecionada, onSelect }: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.trigger} onPress={() => setAberto(!aberto)}>
        <Text style={selecionada ? styles.textoSelecionado : styles.placeholder}>
          {selecionada
            ? `${selecionada.area} (até ${selecionada.limite_horas}h)`
            : 'Selecionar área...'}
        </Text>
        <Text style={styles.icone}>{aberto ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.lista}>
          {regras.map(r => (
            <TouchableOpacity
              key={r.id}
              style={[styles.item, selecionada?.id === r.id && styles.itemAtivo]}
              onPress={() => {
                onSelect(r);
                setAberto(false);
              }}
            >
              <Text style={styles.itemTexto}>{r.area}</Text>
              <Text style={styles.itemLimite}>Limite: {r.limite_horas}h</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  trigger: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoSelecionado: { color: colors.textPrimary, fontSize: fontSize.md, flex: 1 },
  placeholder: { color: colors.textMuted, fontSize: fontSize.md, flex: 1 },
  icone: { color: colors.textSecondary, marginLeft: spacing.sm },

  lista: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  item: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemAtivo: { backgroundColor: colors.accent },
  itemTexto: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' },
  itemLimite: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
});
