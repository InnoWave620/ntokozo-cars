import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Vehicle } from '@/types/vehicle';

import { useState } from 'react';
import { FavoriteButton } from './favorite-button';
import { VehicleVideoModal } from './vehicle-video-modal';

interface VehicleCardProps {
  vehicle: Vehicle;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
  compact?: boolean;
}

export function VehicleCard({
  vehicle,
  onFavoriteToggle,
  isFavorite = false,
  compact = false,
}: VehicleCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const formatPrice = (price: number) => `R ${price.toLocaleString('en-ZA')}`;
  const formatMileage = (km: number) => `${km.toLocaleString('en-ZA')} km`;
  const isInstallment = vehicle.listingType === 'Installment Takeover';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Pressable
        onPress={() => router.push(`/vehicle/${vehicle.id}` as any)}
        accessibilityRole="button"
        accessibilityLabel={`View ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
      >
        {/* Image */}
        <View style={[styles.imageContainer, compact && styles.imageCompact]}>
          <Image
            source={{ uri: vehicle.photos[0] }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          {/* Badge */}
          <View style={styles.badgeColumn}>
            <View
              style={[
                styles.badge,
                isInstallment ? styles.badgeInstallment : styles.badgeStandard,
              ]}
            >
              <ThemedText style={styles.badgeText}>
                {isInstallment ? 'Takeover' : 'For Sale'}
              </ThemedText>
            </View>
          </View>

          {/* Video Play Button pinned inside photo container */}
          {vehicle.videoUrl && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                setShowVideoModal(true);
              }}
              style={styles.videoPlayBtn}
              accessibilityRole="button"
              accessibilityLabel="Play vehicle video"
            >
              <ThemedText style={styles.videoPlayBtnText}>Watch Video</ThemedText>
            </Pressable>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={styles.brandModel} numberOfLines={1}>
            {vehicle.brand} {vehicle.model}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.year}>
            {vehicle.year} • {vehicle.colour}
          </ThemedText>

          <View style={styles.specs}>
            <SpecPill label={formatMileage(vehicle.mileage)} />
            <SpecPill label={vehicle.transmission} />
            <SpecPill label={vehicle.fuelType} />
          </View>

          <View style={styles.priceRow}>
            <View>
              <ThemedText style={styles.price}>{formatPrice(vehicle.price)}</ThemedText>
              {isInstallment && vehicle.installment && (
                <ThemedText style={styles.installmentText}>
                  R {vehicle.installment.monthlyInstallment.toLocaleString('en-ZA')}/mo
                </ThemedText>
              )}
            </View>
            <View style={styles.provinceTag}>
              <ThemedText themeColor="textSecondary" style={styles.provinceText}>
                {vehicle.province}
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Favourite Button (Outside Pressable to prevent nested buttons HTML crash) */}
      {onFavoriteToggle && (
        <View style={styles.favoriteBtn}>
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={() => onFavoriteToggle(vehicle.id)}
          />
        </View>
      )}

      {/* Video Modal Player */}
      <VehicleVideoModal
        visible={showVideoModal}
        vehicle={vehicle}
        onClose={() => setShowVideoModal(false)}
      />
    </View>
  );
}

function SpecPill({
  label,
  isHighlight = false,
}: {
  label: string;
  isHighlight?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.pill,
        isHighlight
          ? { backgroundColor: Brand.gold + '22', borderWidth: 1, borderColor: Brand.gold + '66' }
          : { backgroundColor: theme.backgroundElement },
      ]}
    >
      <ThemedText
        style={[
          styles.pillText,
          isHighlight ? { color: Brand.gold, fontWeight: '700' } : { color: theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.card,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  imageCompact: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeColumn: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    gap: Spacing.one,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.small,
    alignSelf: 'flex-start',
  },
  badgeInstallment: {
    backgroundColor: Brand.gold,
  },
  badgeStandard: {
    backgroundColor: '#111111CC',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  videoPlayBtn: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    backgroundColor: '#000000CC',
    borderWidth: 1,
    borderColor: Brand.gold,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  videoPlayBtnText: {
    color: Brand.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  favoriteBtn: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  brandModel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  year: {
    fontSize: 13,
    fontWeight: '500',
  },
  specs: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  pill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.two,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Brand.gold,
  },
  installmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.gold,
    opacity: 0.8,
  },
  provinceTag: {
    alignItems: 'flex-end',
  },
  provinceText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
