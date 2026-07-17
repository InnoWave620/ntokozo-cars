import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'gold' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export function GoldButton({
  label,
  onPress,
  variant = 'gold',
  fullWidth = false,
  icon,
  accessibilityLabel,
  disabled = false,
}: GoldButtonProps) {
  const bgColor =
    variant === 'gold' ? (disabled ? '#333333' : Brand.gold) : 'transparent';
  const borderColor = variant === 'outline' ? (disabled ? '#444444' : Brand.gold) : 'transparent';
  const textColor = variant === 'gold' ? (disabled ? '#666666' : '#111111') : (disabled ? '#666666' : Brand.gold);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          alignSelf: fullWidth ? 'stretch' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {icon && <ThemedText style={[styles.icon, { color: textColor }]}>{icon}</ThemedText>}
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 4,
    borderRadius: Radius.pill,
    gap: Spacing.one,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: 16,
  },
});
