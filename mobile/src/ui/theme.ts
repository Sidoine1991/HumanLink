// HumanLink Design System
// Style chaleureux, solidaire et accessible

import { Platform } from 'react-native';

let designTokens: any = null;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	designTokens = require('./tokens.generated.json');
} catch {}
const vars = designTokens?.variables as Record<string, string> | undefined;
const pick = (k: string, fallback: string) => (vars && typeof vars[k] === 'string' ? vars[k] : fallback);

export const colors = {
  // Couleurs principales - Chaleureuses et solidaires
  primary: pick('primary', '#4A90E2'), // Bleu confiance
  primaryDark: '#357ABD',
  primaryLight: '#E8F4FD',
  
  secondary: pick('secondary', '#50C878'), // Vert espoir
  secondaryDark: '#3BA85C',
  secondaryLight: '#E8F8F0',
  
  accent: pick('accent', '#FF6B6B'), // Rouge attention/care
  accentLight: '#FFE8E8',
  
  // Couleurs de fond
  bg: pick('background', '#FAFBFC'),
  bgSecondary: '#F5F7FA',
  card: pick('card', '#FFFFFF'),
  cardElevated: pick('card', '#FFFFFF'),
  
  // Texte
  text: pick('foreground', '#1A1A1A'),
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // États
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Séparateurs
  border: pick('border', '#E5E7EB'),
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Émotions (pour les humeurs)
  emotion: {
    joy: '#FFD93D',
    calm: '#6BCB77',
    energy: '#FF6B6B',
    fatigue: '#95A5A6',
    stress: '#E74C3C',
    neutral: '#BDC3C7',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
  round: 50,
};

export const typography = {
  // Titres
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  // Corps
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  // Petits textes
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  // Très petits
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};

// Helper function to convert React Native shadow to CSS boxShadow for web
const convertShadowToBoxShadow = (shadow: {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
}) => {
  if (Platform.OS === 'web') {
    const { width, height } = shadow.shadowOffset;
    const opacity = shadow.shadowOpacity;
    const radius = shadow.shadowRadius;
    const color = shadow.shadowColor;
    // Convert hex color to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    // On web, return only boxShadow and elevation (no shadow* properties to avoid warnings)
    const webShadow: any = {
      boxShadow: `${width}px ${height}px ${radius}px ${hexToRgba(color, opacity)}`,
    };
    if (shadow.elevation !== undefined) {
      webShadow.elevation = shadow.elevation;
    }
    return webShadow;
  }
  // On native, return shadow* properties and elevation (no boxShadow)
  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  };
};

const shadowBase = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Export shadows with web compatibility
// On web, only boxShadow is used (shadow* properties are excluded)
// On native, only shadow* properties are used (boxShadow is excluded)
export const shadows = {
  sm: convertShadowToBoxShadow(shadowBase.sm),
  md: convertShadowToBoxShadow(shadowBase.md),
  lg: convertShadowToBoxShadow(shadowBase.lg),
  xl: convertShadowToBoxShadow(shadowBase.xl),
};

// Logo HumanLink - Représentation textuelle
export const logo = {
  text: 'HumanLink',
  emoji: '🤝',
  description: 'Deux mains qui se serrent dans un cercle, symbolisant la connexion humaine',
};
