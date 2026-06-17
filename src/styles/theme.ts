// Tema do SGC Mobile — baseado no sistema web
// Importe este arquivo em vez de usar cores hardcoded

export const colors = {
  // Cores principais
  primary: '#1a1a2e',       // azul escuro — cor principal
  secondary: '#16213e',     // azul médio — fundos de cards
  accent: '#0f3460',        // azul destaque — botões primários
  accentGreen: '#4ade80',   // verde — aprovado / sucesso

  // Backgrounds
  background: '#0f0f1a',    // fundo geral das telas
  card: '#1a1a2e',          // fundo de cards
  surface: '#16213e',       // superfície elevada

  // Textos
  textPrimary: '#f1f5f9',   // texto principal (claro)
  textSecondary: '#94a3b8', // texto secundário (cinza)
  textMuted: '#64748b',     // texto apagado

  // Status — consistente com o web
  success: '#4ade80',       // aprovado
  successBg: '#14532d',
  error: '#f87171',         // reprovado
  errorBg: '#7f1d1d',
  warning: '#fbbf24',       // pendente / correção
  warningBg: '#78350f',

  // Bordas
  border: '#2d2d4e',
  borderLight: '#3d3d5e',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
};

// Badge de status — use no lugar de cores inline
export function getStatusStyle(status: string) {
  switch (status) {
    case 'aprovado':
      return { backgroundColor: colors.successBg, color: colors.success };
    case 'reprovado':
      return { backgroundColor: colors.errorBg, color: colors.error };
    case 'pendente':
    case 'correcao':
    case 'correção':
      return { backgroundColor: colors.warningBg, color: colors.warning };
    default:
      return { backgroundColor: colors.secondary, color: colors.textSecondary };
  }
}
