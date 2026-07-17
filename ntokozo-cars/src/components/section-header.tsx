import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel = 'See All',
}: SectionHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.accentBar} />
        <View>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle && (
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {seeAllHref && (
        <Pressable
          onPress={() => router.push(seeAllHref as any)}
          style={styles.seeAllBtn}
          accessibilityRole="link"
          accessibilityLabel={seeAllLabel}
        >
          <ThemedText style={[styles.seeAll, { color: Brand.gold }]}>
            {seeAllLabel} →
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  accentBar: {
    width: 3,
    height: 22,
    backgroundColor: Brand.gold,
    borderRadius: Radius.pill,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  seeAllBtn: {
    padding: 4,
  },
});
