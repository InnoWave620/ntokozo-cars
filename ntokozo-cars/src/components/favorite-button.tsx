import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onPress, size = 36 }: FavoriteButtonProps) {
  const theme = useTheme();

  const bgColor = isFavorite ? Brand.accent : theme.backgroundElement + 'CC';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <View style={styles.inner}>
        <Text
          style={[
            styles.heart,
            { fontSize: size * 0.44, lineHeight: size * 0.6 },
          ]}
        >
          {isFavorite ? '♥' : '♡'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
