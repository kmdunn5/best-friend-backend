// Spirit Island sub-theme colors — nature/mystical palette
// Distinct from Super Bowl's party/game-show aesthetic

export const SI_COLORS = {
  // Primary palette — deep forest tones
  forestDark: '#1b3a2d',
  forestMid: '#2d5a3f',
  forestLight: '#3d7a56',

  // Accent — mystical gold/amber
  gold: '#c5a44e',
  goldLight: '#dbc278',
  goldDark: '#9a7d2e',

  // Spirit purple — ethereal accents
  spiritPurple: '#6b4c8a',
  spiritPurpleLight: '#8e6fb0',

  // Elemental highlights
  fireDim: '#d32f2f22',
  waterDim: '#1565c022',
  earthDim: '#6d4c4122',
  plantDim: '#2e7d3222',

  // Backgrounds
  parchment: '#f5f0e8',
  parchmentDark: '#e8e0d0',
  cardBg: '#faf8f3',
  darkOverlay: 'rgba(27, 58, 45, 0.92)',

  // Text
  textPrimary: '#2c2c2c',
  textSecondary: '#5a5a5a',
  textOnDark: '#f0ead6',
  textMuted: '#8a8a7a',
};

// Gradient presets
export const SI_GRADIENTS = {
  header: `linear-gradient(135deg, ${SI_COLORS.forestDark} 0%, ${SI_COLORS.forestMid} 50%, ${SI_COLORS.spiritPurple} 100%)`,
  card: `linear-gradient(180deg, ${SI_COLORS.cardBg} 0%, ${SI_COLORS.parchment} 100%)`,
  goldAccent: `linear-gradient(135deg, ${SI_COLORS.goldDark} 0%, ${SI_COLORS.gold} 50%, ${SI_COLORS.goldLight} 100%)`,
  statBar: `linear-gradient(90deg, ${SI_COLORS.forestLight} 0%, ${SI_COLORS.forestMid} 100%)`,
};
