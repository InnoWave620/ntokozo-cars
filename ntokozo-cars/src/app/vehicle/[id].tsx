import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FavoriteButton } from '@/components/favorite-button';
import { GoldButton } from '@/components/gold-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { getVehicleById } from '@/data/vehicles';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMG_HEIGHT = Math.min(320, SCREEN_WIDTH * 0.65);
const NTOKOZO_WHATSAPP = 'https://wa.me/27000000000'; // Replace with real number
const NTOKOZO_PHONE = 'tel:+27000000000';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activePhoto, setActivePhoto] = useState(0);

  const vehicle = getVehicleById(id ?? '');

  if (!vehicle) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.background }]}>
        <ThemedText style={styles.notFoundText}>Vehicle not found.</ThemedText>
        <GoldButton label="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const isInstallment = vehicle.listingType === 'Installment Takeover';
  const paddingTop = Platform.OS === 'web' ? 80 : insets.top;

  const handleWhatsApp = () => Linking.openURL(NTOKOZO_WHATSAPP);
  const handleCall = () => Linking.openURL(NTOKOZO_PHONE);

  const specs: { label: string; value: string }[] = [
    { label: 'Year', value: String(vehicle.year) },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString('en-ZA')} km` },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Colour', value: vehicle.colour },
    { label: 'Province', value: vehicle.province },
    ...(vehicle.vin ? [{ label: 'VIN', value: vehicle.vin }] : []),
  ];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
    >
      {/* Back button overlay */}
      <View style={[styles.topBar, { paddingTop: paddingTop + Spacing.two }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.backgroundElement + 'DD' }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </Pressable>
        <FavoriteButton
          isFavorite={isFavorite(vehicle.id)}
          onPress={() => toggleFavorite(vehicle.id)}
          size={40}
        />
      </View>

      {/* Image Gallery */}
      <View style={[styles.galleryContainer, { height: IMG_HEIGHT }]}>
        <FlatList
          data={vehicle.photos}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActivePhoto(index);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={[styles.galleryImage, { width: SCREEN_WIDTH }]}
              contentFit="cover"
              transition={200}
            />
          )}
        />
        {/* Dots */}
        {vehicle.photos.length > 1 && (
          <View style={styles.dots}>
            {vehicle.photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activePhoto ? styles.dotActive : { backgroundColor: '#ffffff66' },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={[styles.content, { maxWidth: MaxContentWidth, alignSelf: 'center', width: '100%' }]}>
        {/* Header */}
        <View style={styles.vehicleHeader}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: isInstallment ? Brand.gold : '#333' }]}>
              <ThemedText style={[styles.badgeText, { color: isInstallment ? '#111' : '#fff' }]}>
                {vehicle.listingType}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.vehicleName}>
            {vehicle.brand} {vehicle.model}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.vehicleYear}>
            {vehicle.year} • {vehicle.colour} • {vehicle.province}
          </ThemedText>

          {/* Price */}
          <View style={styles.priceBlock}>
            <ThemedText style={styles.price}>
              R {vehicle.price.toLocaleString('en-ZA')}
            </ThemedText>
            {isInstallment && vehicle.installment && (
              <ThemedText style={styles.monthlyPrice}>
                or R {vehicle.installment.monthlyInstallment.toLocaleString('en-ZA')}/month
              </ThemedText>
            )}
          </View>
        </View>

        {/* Specs Grid */}
        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.cardTitle}>Vehicle Specifications</ThemedText>
          <View style={styles.specsGrid}>
            {specs.map((spec, i) => (
              <View
                key={spec.label}
                style={[
                  styles.specRow,
                  i < specs.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <ThemedText themeColor="textSecondary" style={styles.specLabel}>
                  {spec.label}
                </ThemedText>
                <ThemedText style={styles.specValue}>{spec.value}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Installment Details */}
        {isInstallment && vehicle.installment && (
          <View style={[styles.card, { backgroundColor: Brand.gold + '18', borderColor: Brand.gold + '44' }]}>
            <ThemedText style={[styles.cardTitle, { color: Brand.gold }]}>
              💳 Installment Takeover Details
            </ThemedText>
            <View style={styles.specsGrid}>
              {[
                { label: 'Monthly Installment', value: `R ${vehicle.installment.monthlyInstallment.toLocaleString('en-ZA')}` },
                { label: 'Remaining Term', value: `${vehicle.installment.remainingTerm} months` },
                { label: 'Required Deposit', value: `R ${vehicle.installment.deposit.toLocaleString('en-ZA')}` },
                { label: 'Finance Institution', value: vehicle.installment.financeInstitution },
                { label: 'Settlement Amount', value: `R ${vehicle.installment.settlementAmount.toLocaleString('en-ZA')}` },
                ...(vehicle.installment.balloonPayment ? [{ label: 'Balloon Payment', value: `R ${vehicle.installment.balloonPayment.toLocaleString('en-ZA')}` }] : []),
                { label: 'Finance Approval', value: vehicle.installment.financeApprovalRequired ? 'Required' : 'Not Required' },
              ].map((row, i, arr) => (
                <View
                  key={row.label}
                  style={[
                    styles.specRow,
                    i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: Brand.gold + '33' },
                  ]}
                >
                  <ThemedText style={[styles.specLabel, { color: '#A07B10' }]}>
                    {row.label}
                  </ThemedText>
                  <ThemedText style={[styles.specValue, { color: Brand.gold }]}>
                    {row.value}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.cardTitle}>Description</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {vehicle.description}
          </ThemedText>
        </View>

        {/* Features */}
        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText style={styles.cardTitle}>Features & Extras</ThemedText>
          <View style={styles.featuresGrid}>
            {vehicle.features.map((f) => (
              <View key={f} style={[styles.featureChip, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText style={styles.featureText}>✓ {f}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <GoldButton
            label="WhatsApp Us"
            icon="💬"
            onPress={handleWhatsApp}
            variant="gold"
            fullWidth
          />
          <GoldButton
            label="Call Now"
            icon="📞"
            onPress={handleCall}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  backBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  galleryContainer: {
    position: 'relative',
    backgroundColor: '#111',
  },
  galleryImage: {
    height: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: Spacing.two,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Brand.gold,
    width: 18,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  vehicleHeader: {
    gap: Spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.small,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vehicleName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: Spacing.one,
  },
  vehicleYear: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceBlock: {
    marginTop: Spacing.two,
    gap: 2,
  },
  price: {
    fontSize: 30,
    fontWeight: '800',
    color: Brand.gold,
    letterSpacing: -1,
  },
  monthlyPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.gold,
    opacity: 0.75,
  },
  card: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  specsGrid: {
    gap: 0,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  featureChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cta: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
