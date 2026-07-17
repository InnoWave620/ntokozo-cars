import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationLayout } from '@/components/navigation-layout';
import { FilterChips } from '@/components/filter-chips';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { VehicleCard } from '@/components/vehicle-card';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { BRANDS, MOCK_VEHICLES, PROVINCES } from '@/data/vehicles';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { useVehicles } from '@/hooks/use-vehicles';
import { ListingType, SearchFilters, TransmissionType } from '@/types/vehicle';
import { Vehicle } from '@/types/vehicle';

const LISTING_TYPES = [
  { label: 'Standard Sale', value: 'Standard Sale' },
  { label: 'Takeover', value: 'Installment Takeover' },
];

const TRANSMISSIONS = [
  { label: 'Automatic', value: 'Automatic' },
  { label: 'Manual', value: 'Manual' },
];

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const params = useLocalSearchParams<{ type?: string }>();

  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState<string>(
    params.type ?? '',
  );
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filters: SearchFilters = {
    query: query || undefined,
    brand: selectedBrand || undefined,
    listingType: (selectedType as ListingType) || undefined,
    transmission: (selectedTransmission as TransmissionType) || undefined,
  };

  const vehicles = useVehicles(filters);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const paddingTop = Platform.OS === 'web' ? 72 : insets.top + Spacing.three;

  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, { paddingTop }]}>
        {/* Title */}
        <View style={styles.titleRow}>
          <ThemedText style={styles.pageTitle}>Browse Vehicles</ThemedText>
          <View style={[styles.countBadge, { backgroundColor: Brand.gold }]}>
            <ThemedText style={styles.countText}>{vehicles.length}</ThemedText>
          </View>
        </View>

        {/* Search */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />

        {/* Filters */}
        <View style={styles.filters}>
          <FilterChips
            label="Listing Type"
            options={LISTING_TYPES}
            selected={selectedType}
            onSelect={setSelectedType}
          />
          <FilterChips
            label="Brand"
            options={BRANDS.map((b) => ({ label: b, value: b }))}
            selected={selectedBrand}
            onSelect={setSelectedBrand}
            allLabel="All Brands"
          />
          <FilterChips
            label="Transmission"
            options={TRANSMISSIONS}
            selected={selectedTransmission}
            onSelect={setSelectedTransmission}
          />
        </View>
      </View>
    ),
    [paddingTop, query, selectedType, selectedBrand, selectedTransmission, vehicles.length],
  );

  const renderVehicle = useCallback(
    ({ item }: { item: Vehicle }) => (
      <View style={styles.cardWrapper}>
        <VehicleCard
          vehicle={item}
          isFavorite={isFavorite(item.id)}
          onFavoriteToggle={toggleFavorite}
        />
      </View>
    ),
    [isFavorite, toggleFavorite],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <ThemedText style={styles.emptyIcon}>🔍</ThemedText>
        <ThemedText style={styles.emptyTitle}>No vehicles found</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.emptyDesc}>
          Try adjusting your search or filters
        </ThemedText>
      </View>
    ),
    [],
  );

  return (
    <NavigationLayout>
      <FlatList
        style={[styles.list, { backgroundColor: theme.background }]}
        data={vehicles}
        keyExtractor={(v) => v.id}
        renderItem={renderVehicle}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
          vehicles.length === 0 && styles.contentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Brand.gold}
            colors={[Brand.gold]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </NavigationLayout>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 100,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  pageTitle: {
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
    color: '#111',
    fontSize: 13,
    fontWeight: '800',
  },
  filters: {
    gap: Spacing.two,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.two,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
});
