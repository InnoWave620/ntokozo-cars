import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationLayout } from '@/components/navigation-layout';
import { GoldButton } from '@/components/gold-button';
import { ThemedText } from '@/components/themed-text';
import { VehicleCard } from '@/components/vehicle-card';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_VEHICLES } from '@/data/vehicles';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const favoriteVehicles = MOCK_VEHICLES.filter((v) => favorites.includes(v.id));

  const paddingTop = Platform.OS === 'web' ? 80 : insets.top + Spacing.three;

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop, paddingBottom: insets.bottom + 100 },
          favoriteVehicles.length === 0 && styles.contentEmpty,
        ]}
      >
        <View style={[styles.inner, { maxWidth: MaxContentWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Saved Vehicles</ThemedText>
            {favoriteVehicles.length > 0 && (
              <View style={[styles.countBadge, { backgroundColor: Brand.accent }]}>
                <ThemedText style={styles.countText}>{favoriteVehicles.length}</ThemedText>
              </View>
            )}
          </View>

          {favoriteVehicles.length === 0 ? (
            <View style={styles.empty}>
              <ThemedText style={styles.emptyIcon}>♡</ThemedText>
              <ThemedText style={styles.emptyTitle}>No saved vehicles yet</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyDesc}>
                Tap the heart icon on any vehicle to save it here for later.
              </ThemedText>
              <GoldButton
                label="Browse Vehicles"
                icon="🚗"
                onPress={() => router.push('/browse' as any)}
              />
            </View>
          ) : (
            <View style={styles.grid}>
              {favoriteVehicles.map((vehicle) => (
                <View key={vehicle.id} style={styles.card}>
                  <VehicleCard
                    vehicle={vehicle}
                    isFavorite={isFavorite(vehicle.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </NavigationLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  contentEmpty: {
    flexGrow: 1,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  countBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 100,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  grid: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 280,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  emptyIcon: {
    fontSize: 64,
    color: Brand.accent,
    lineHeight: 72,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
