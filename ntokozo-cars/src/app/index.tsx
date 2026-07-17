import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationLayout } from '@/components/navigation-layout';
import { GoldButton } from '@/components/gold-button';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { VehicleCard } from '@/components/vehicle-card';
import { Brand, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { getFeaturedVehicles, MOCK_VEHICLES } from '@/data/vehicles';
import { MOCK_COMMUNITY_PROJECTS } from '@/data/community';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { Vehicle } from '@/types/vehicle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(280, SCREEN_WIDTH * 0.72);

const STATS = [
  { value: '50+', label: 'Vehicles\nIn Stock' },
  { value: '12+', label: 'Premium\nBrands' },
  { value: '100%', label: 'Verified\nListings' },
];

const QUICK_ACTIONS = [
  { label: 'Browse All Cars', href: '/browse', icon: '🚗', variant: 'gold' as const },
  { label: 'Installment Takeovers', href: '/browse?type=Installment+Takeover', icon: '💳', variant: 'outline' as const },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const featured = getFeaturedVehicles();
  const recent = MOCK_VEHICLES.slice(0, 6);

  const renderFeaturedCard = useCallback(
    ({ item }: { item: Vehicle }) => (
      <View style={{ width: CARD_WIDTH, marginLeft: Spacing.three }}>
        <VehicleCard
          vehicle={item}
          isFavorite={isFavorite(item.id)}
          onFavoriteToggle={toggleFavorite}
        />
      </View>
    ),
    [isFavorite, toggleFavorite],
  );

  const renderCommunityCard = useCallback(
    ({ item }: { item: typeof MOCK_COMMUNITY_PROJECTS[0] }) => (
      <View style={{ width: 300, marginLeft: Spacing.three, backgroundColor: theme.card, borderRadius: Radius.large, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' }}>
        <Image source={{ uri: item.image }} style={{ width: '100%', height: 130 }} contentFit="cover" />
        <View style={{ padding: Spacing.three, gap: Spacing.one }}>
          {item.impactMetric && (
            <View style={{ backgroundColor: Brand.gold + '15', alignSelf: 'flex-start', paddingHorizontal: Spacing.two, paddingVertical: 2, borderRadius: Radius.small, borderWidth: 1, borderColor: Brand.gold + '40', marginBottom: 2 }}>
              <ThemedText style={{ color: Brand.gold, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                {item.impactMetric}
              </ThemedText>
            </View>
          )}
          <ThemedText style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>
            {item.title}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={{ fontSize: 12, lineHeight: 17 }}>
            {item.description}
          </ThemedText>
        </View>
      </View>
    ),
    [theme],
  );

  const paddingTop = Platform.OS === 'web' ? 80 : insets.top;

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={styles.inner}>
          {/* ── Hero ── */}
          <View style={[styles.hero, { backgroundColor: Brand.dark }]}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <ThemedText style={styles.heroBadgeText}>🏆 Ntokozo Cars</ThemedText>
              </View>
              <ThemedText style={styles.heroTitle}>
                Drive Premium.{'\n'}
                <ThemedText style={[styles.heroTitle, { color: Brand.gold }]}>
                  Own Confidently.
                </ThemedText>
              </ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                South Africa's trusted marketplace for pre-owned luxury vehicles and installment takeover deals.
              </ThemedText>

              <View style={styles.heroActions}>
                {QUICK_ACTIONS.map((action) => (
                  <GoldButton
                    key={action.label}
                    label={action.label}
                    icon={action.icon}
                    variant={action.variant}
                    onPress={() => router.push(action.href as any)}
                  />
                ))}
              </View>
            </View>

            {/* Stats bar */}
            <View style={[styles.statsBar, { backgroundColor: '#1A1A1A' }]}>
              {STATS.map((stat, i) => (
                <View key={stat.value} style={[styles.statItem, i < STATS.length - 1 && styles.statDivider]}>
                  <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                  <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* ── Featured Vehicles ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Featured Vehicles"
              subtitle="Hand-picked for you"
              seeAllHref="/browse"
              seeAllLabel="Browse All"
            />
            <FlatList
              data={featured}
              renderItem={renderFeaturedCard}
              keyExtractor={(v) => v.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: Spacing.three }}
              snapToInterval={CARD_WIDTH + Spacing.three}
              decelerationRate="fast"
            />
          </View>

          {/* ── Installment Takeover Banner ── */}
          <View style={styles.section}>
            <Pressable
              style={[styles.banner, { backgroundColor: Brand.gold }]}
              onPress={() => router.push('/browse' as any)}
              accessibilityRole="button"
              accessibilityLabel="Browse installment takeover deals"
            >
              <View style={styles.bannerContent}>
                <ThemedText style={styles.bannerTag}>SPECIAL DEALS</ThemedText>
                <ThemedText style={styles.bannerTitle}>
                  💳 Installment Takeovers
                </ThemedText>
                <ThemedText style={styles.bannerDesc}>
                  Take over someone's existing vehicle finance — drive a premium car from as little as R 6 850/month.
                </ThemedText>
                <View style={[styles.bannerButton, { backgroundColor: '#111' }]}>
                  <ThemedText style={styles.bannerButtonText}>Explore Deals →</ThemedText>
                </View>
              </View>
            </Pressable>
          </View>

          {/* ── Latest Listings ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Latest Listings"
              subtitle={`${MOCK_VEHICLES.length} vehicles available`}
              seeAllHref="/browse"
            />
            <View style={styles.gridContainer}>
              {recent.map((vehicle) => (
                <View key={vehicle.id} style={styles.gridItem}>
                  <VehicleCard
                    vehicle={vehicle}
                    isFavorite={isFavorite(vehicle.id)}
                    onFavoriteToggle={toggleFavorite}
                    compact
                  />
                </View>
              ))}
            </View>
          </View>

          {/* ── Community Impact ── */}
          <View style={styles.section}>
            <SectionHeader
              title="Community & Charity"
              subtitle="Giving back & supporting unfortunate families"
              seeAllHref="/contact"
              seeAllLabel="Learn More"
            />
            <FlatList
              data={MOCK_COMMUNITY_PROJECTS}
              renderItem={renderCommunityCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: Spacing.three }}
              snapToInterval={300 + Spacing.three}
              decelerationRate="fast"
            />
          </View>

          {/* ── Contact Strip ── */}
          <View style={styles.section}>
            <View style={[styles.contactStrip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText style={styles.contactTitle}>Need Help Finding Your Car?</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.contactDesc}>
                Our team is ready to assist you find the perfect vehicle at the right price.
              </ThemedText>
              <GoldButton
                label="Contact Us"
                icon="📞"
                onPress={() => router.push('/contact' as any)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </NavigationLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
  },
  hero: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: Radius.large,
    borderBottomRightRadius: Radius.large,
    marginBottom: Spacing.five,
  },
  heroContent: {
    padding: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.three,
  },
  heroBadge: {
    backgroundColor: '#ffffff18',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#ffffff22',
  },
  heroBadgeText: {
    color: Brand.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: '#AAAAAA',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  statsBar: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  statValue: {
    color: Brand.gold,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
  section: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    marginBottom: Spacing.five,
    gap: Spacing.three,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  gridItem: {
    flex: 1,
    minWidth: 280,
  },
  banner: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  bannerContent: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  bannerTag: {
    color: '#111111AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  bannerTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bannerDesc: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 21,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    marginTop: Spacing.one,
  },
  bannerButtonText: {
    color: Brand.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  contactStrip: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.large,
    padding: Spacing.four,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  contactDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
