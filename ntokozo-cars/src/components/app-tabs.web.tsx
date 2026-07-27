import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { AppLogo } from './app-logo';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Brand, Colors, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';

export default function AppTabs() {
  const { favorites } = useFavorites();

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <WebNavBar favorites={favorites.length}>
          <TabTrigger name="home" href="/" asChild>
            <NavButton>Home</NavButton>
          </TabTrigger>
          <TabTrigger name="browse" href="/browse" asChild>
            <NavButton>Browse</NavButton>
          </TabTrigger>
          <TabTrigger name="favorites" href="/favorites" asChild>
            <NavButton badge={favorites.length > 0 ? favorites.length : undefined}>
              Saved
            </NavButton>
          </TabTrigger>
          <TabTrigger name="contact" href="/contact" asChild>
            <NavButton>Contact</NavButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <NavButton>More</NavButton>
          </TabTrigger>
        </WebNavBar>
      </TabList>
    </Tabs>
  );
}

export function NavButton({
  children,
  isFocused,
  badge,
  ...props
}: TabTriggerSlotProps & { badge?: number }) {
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={styles.navBtnWrapper}>
        <ThemedView
          type={isFocused ? 'backgroundSelected' : undefined}
          style={[
            styles.navBtn,
            isFocused && { backgroundColor: Brand.gold + '22', borderColor: Brand.gold + '55', borderWidth: 1 },
          ]}
        >
          <ThemedText
            style={[
              styles.navBtnText,
              { color: isFocused ? Brand.gold : colors.textSecondary },
            ]}
          >
            {children}
          </ThemedText>
        </ThemedView>
        {badge !== undefined && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function WebNavBar({
  children,
  favorites,
  ...props
}: TabListProps & { favorites: number }) {
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <View
      {...props}
      style={[
        styles.navbarOuter,
        { backgroundColor: colors.background + 'F5', borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.navbarInner}>
        {/* Brand */}
        <View style={styles.brand}>
          <AppLogo variant="medium" />
        </View>

        {/* Nav Links */}
        <View style={styles.navLinks}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    // Web-only backdrop blur fallback via CSS class
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: Brand.gold,
  },
  navLinks: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignItems: 'center',
  },
  navBtnWrapper: {
    position: 'relative',
  },
  navBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.medium,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Brand.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.7,
  },
});
