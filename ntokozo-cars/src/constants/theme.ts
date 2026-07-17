/**
 * Ntokozo Cars — Design System
 * Brand: Luxury Dark Automotive
 * Primary: #111111 | Gold: #C9A227 | Accent: #E63946
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  gold: '#C9A227',
  goldLight: '#E8C252',
  goldDark: '#A07B10',
  accent: '#E63946',
  dark: '#111111',
  surface: '#1A1A1A',
  surfaceLight: '#F5F5F0',
  surfaceDark: '#0D0D0D',
} as const;

export const Colors = {
  light: {
    text: '#111111',
    background: '#FFFFFF',
    backgroundElement: '#F5F5F0',
    backgroundSelected: '#EAE9E3',
    textSecondary: '#666666',
    border: '#E0E0DA',
    card: '#FFFFFF',
    gold: Brand.gold,
    accent: Brand.accent,
  },
  dark: {
    text: '#F5F5F0',
    background: '#111111',
    backgroundElement: '#1A1A1A',
    backgroundSelected: '#252525',
    textSecondary: '#999999',
    border: '#2A2A2A',
    card: '#1A1A1A',
    gold: Brand.gold,
    accent: Brand.accent,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 6,
  medium: 12,
  large: 20,
  pill: 100,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1200;
