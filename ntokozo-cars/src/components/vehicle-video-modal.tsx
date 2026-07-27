import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Vehicle } from '@/types/vehicle';

interface VehicleVideoModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleVideoModal({
  visible,
  vehicle,
  onClose,
}: VehicleVideoModalProps) {
  const theme = useTheme();
  const videoUrl = vehicle?.videoUrl || '';

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    if (visible && videoUrl && player) {
      player.play();
    } else if (player) {
      player.pause();
    }
  }, [visible, videoUrl, player]);

  if (!vehicle || !videoUrl) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: '#0D0D0D', borderColor: Brand.gold + '44' },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.videoBadge}>
                <ThemedText style={styles.videoBadgeText}>VIDEO WALKTHROUGH</ThemedText>
              </View>
              <ThemedText style={styles.vehicleTitle} numberOfLines={1}>
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </ThemedText>
            </View>
            <Pressable
              onPress={() => {
                if (player) player.pause();
                onClose();
              }}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close video"
            >
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </Pressable>
          </View>

          {/* Video Player */}
          <View style={styles.videoWrapper}>
            {Platform.OS === 'web' ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                  borderRadius: 12,
                }}
              />
            ) : (
              <VideoView
                player={player}
                style={styles.videoView}
                nativeControls
              />
            )}
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <View style={styles.infoCol}>
              <ThemedText style={styles.priceText}>
                R {vehicle.price.toLocaleString('en-ZA')}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.specsText}>
                {vehicle.mileage.toLocaleString('en-ZA')} km • {vehicle.transmission} • {vehicle.province}
              </ThemedText>
            </View>
            <Pressable
              onPress={() => {
                if (player) player.pause();
                onClose();
              }}
              style={styles.doneBtn}
            >
              <ThemedText style={styles.doneBtnText}>Close Player</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  container: {
    width: '100%',
    maxWidth: 720,
    borderRadius: Radius.large,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitleContainer: {
    flex: 1,
    gap: 4,
  },
  videoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Brand.gold + '22',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: Brand.gold + '66',
  },
  videoBadgeText: {
    color: Brand.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  videoWrapper: {
    width: '100%',
    height: 360,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoView: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#111',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  priceText: {
    color: Brand.gold,
    fontSize: 18,
    fontWeight: '800',
  },
  specsText: {
    fontSize: 12,
    color: '#999',
  },
  doneBtn: {
    backgroundColor: Brand.gold,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
  },
  doneBtnText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 13,
  },
});
