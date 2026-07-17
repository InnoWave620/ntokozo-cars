import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationLayout } from '@/components/navigation-layout';
import { GoldButton } from '@/components/gold-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';

const MENU_ITEMS = [
  { icon: '🚗', label: 'Browse Vehicles', href: '/browse' },
  { icon: '♡', label: 'My Saved Vehicles', href: '/favorites' },
  { icon: '📊', label: 'Dealership Dashboard', href: '/dashboard' },
  { icon: '📞', label: 'Contact Us', href: '/contact' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { favorites } = useFavorites();
  const paddingTop = Platform.OS === 'web' ? 80 : insets.top + Spacing.three;

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom: insets.bottom + 100 }}
      >
        <View style={[styles.inner, { maxWidth: MaxContentWidth }]}>
          {/* Profile Header */}
          <View style={[styles.profileCard, { backgroundColor: Brand.dark }]}>
            <View style={[styles.avatar, { backgroundColor: Brand.gold }]}>
              <ThemedText style={styles.avatarText}>NC</ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={[styles.profileName, { color: '#fff' }]}>
                Welcome to Ntokozo Cars
              </ThemedText>
              <ThemedText style={styles.profileTagline}>Premium Automotive Marketplace</ThemedText>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View
              style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            >
              <ThemedText style={[styles.statValue, { color: Brand.accent }]}>
                {favorites.length}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Saved
              </ThemedText>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            >
              <ThemedText style={[styles.statValue, { color: Brand.gold }]}>50+</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Vehicles
              </ThemedText>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            >
              <ThemedText style={[styles.statValue, { color: Brand.gold }]}>12+</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Brands
              </ThemedText>
            </View>
          </View>

          {/* Quick Menu */}
          <View style={[styles.menu, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            {MENU_ITEMS.map((item) => (
              <GoldButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                variant="ghost"
                onPress={() => router.push(item.href as any)}
                fullWidth
              />
            ))}
          </View>

          {/* Installment CTA */}
          <View style={[styles.installmentCard, { backgroundColor: Brand.gold + '18', borderColor: Brand.gold + '44' }]}>
            <ThemedText style={[styles.installmentTitle, { color: Brand.gold }]}>
              💳 Interested in an Installment Takeover?
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.installmentDesc}>
              Take over an existing vehicle finance deal and drive a premium car for less. Browse our takeover listings today.
            </ThemedText>
            <GoldButton
              label="View Takeover Deals"
              onPress={() => router.push('/browse' as any)}
            />
          </View>

          {/* App Info */}
          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary" style={styles.footerText}>
              Ntokozo Cars v1.0.0{'\n'}
              © 2025 Ntokozo Cars. All rights reserved.{'\n'}
              Johannesburg, South Africa 🇿🇦
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </NavigationLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  inner: {
    alignSelf: 'center',
    width: '100%',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  profileCard: {
    borderRadius: Radius.large,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#111',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileTagline: {
    color: Brand.gold,
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: 1,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  menu: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  installmentCard: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  installmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  installmentDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});
