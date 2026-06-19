import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, loading, disabled, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, (loading || disabled) && styles.disabled, style]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  label: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
});
