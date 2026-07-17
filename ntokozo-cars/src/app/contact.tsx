import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { MOCK_COMMUNITY_PROJECTS } from '@/data/community';
import { NavigationLayout } from '@/components/navigation-layout';
import { GoldButton } from '@/components/gold-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CONTACT_OPTIONS = [
  {
    id: 'whatsapp',
    icon: '💬',
    label: 'WhatsApp Us',
    sublabel: 'Chat with us directly',
    href: 'https://wa.me/27000000000',
    variant: 'gold' as const,
  },
  {
    id: 'call',
    icon: '📞',
    label: 'Call Us',
    sublabel: '+27 00 000 0000',
    href: 'tel:+27000000000',
    variant: 'outline' as const,
  },
  {
    id: 'email',
    icon: '✉️',
    label: 'Email Us',
    sublabel: 'info@ntokozo-cars.co.za',
    href: 'mailto:info@ntokozo-cars.co.za',
    variant: 'outline' as const,
  },
];

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const paddingTop = Platform.OS === 'web' ? 80 : insets.top + Spacing.three;

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom: insets.bottom + 100 }}
      >
        <View style={[styles.inner, { maxWidth: MaxContentWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Contact Us</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              We're here to help you find your perfect vehicle
            </ThemedText>
          </View>

          {/* Contact Cards */}
          {CONTACT_OPTIONS.map((opt) => (
            <View
              key={opt.id}
              style={[
                styles.contactCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <ThemedText style={styles.contactIcon}>{opt.icon}</ThemedText>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>{opt.label}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.contactSublabel}>
                  {opt.sublabel}
                </ThemedText>
              </View>
              <GoldButton
                label="Open"
                variant={opt.variant}
                onPress={() => Linking.openURL(opt.href)}
              />
            </View>
          ))}

          {/* Location */}
          <View
            style={[
              styles.locationCard,
              { backgroundColor: Brand.dark },
            ]}
          >
            <ThemedText style={styles.locationTitle}>📍 Our Location</ThemedText>
            <ThemedText style={styles.locationAddress}>
              Ntokozo Cars{'\n'}
              Johannesburg, Gauteng{'\n'}
              South Africa
            </ThemedText>
            <ThemedText style={styles.locationHours}>
              🕐 Mon – Sat: 08:00 – 18:00{'\n'}
              Sunday: By Appointment
            </ThemedText>
          </View>

          {/* About */}
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <ThemedText style={styles.aboutTitle}>About Ntokozo Cars</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.aboutText}>
              Ntokozo Cars is South Africa's trusted platform for pre-owned luxury and quality vehicles.
              We specialise in both outright sales and installment takeover deals, making premium driving accessible to all.{'\n\n'}
              Every vehicle on our platform is verified and inspected to ensure you drive with confidence.
            </ThemedText>
          </View>

          {/* Community Projects */}
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <ThemedText style={styles.aboutTitle}>🤝 Our Community & Charity Projects</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.aboutText}>
              At Ntokozo Cars, we believe success is measured by the impact we make in the lives of others.
              We are dedicated to upliftment and regularly fund projects to support less fortunate and vulnerable families.
            </ThemedText>

            <View style={styles.communityList}>
              {MOCK_COMMUNITY_PROJECTS.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.communityItem,
                    { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
                  ]}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.projectImage}
                    contentFit="cover"
                  />
                  <View style={styles.projectContent}>
                    {item.impactMetric && (
                      <View style={styles.metricBadge}>
                        <ThemedText style={styles.metricText}>{item.impactMetric}</ThemedText>
                      </View>
                    )}
                    <ThemedText style={styles.projectTitle}>{item.title}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.projectDesc}>
                      {item.description}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
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
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: 1,
  },
  contactIcon: {
    fontSize: 28,
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactSublabel: {
    fontSize: 13,
  },
  locationCard: {
    borderRadius: Radius.large,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  locationTitle: {
    color: Brand.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  locationAddress: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 22,
  },
  locationHours: {
    color: '#AAAAAA',
    fontSize: 13,
    lineHeight: 20,
  },
  aboutCard: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  communityList: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  communityItem: {
    borderRadius: Radius.medium,
    borderWidth: 1,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 140,
  },
  projectContent: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  metricBadge: {
    backgroundColor: Brand.gold + '15',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: Brand.gold + '40',
    marginBottom: 2,
  },
  metricText: {
    color: Brand.gold,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  projectDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
