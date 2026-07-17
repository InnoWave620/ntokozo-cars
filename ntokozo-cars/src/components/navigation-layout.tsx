import { useRouter, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Brand, Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isWeb = Platform.OS === 'web';

  const navItems = [
    { label: 'Home', route: '/', icon: '🏠' },
    { label: 'Browse', route: '/browse', icon: '🚗' },
    { label: 'Sell', route: '/sell', icon: '🏷️' },
    { label: 'Saved', route: '/favorites', icon: '♡' },
    { label: 'Contact', route: '/contact', icon: '📞' },
    { label: 'More', route: '/profile', icon: '👤' },
  ];

  if (isWeb) {
    // ── Web Layout: Top Navigation Bar ──
    return (
      <View style={styles.webContainer}>
        <View style={[styles.navbarOuter, { borderBottomColor: '#222' }]}>
          <View style={styles.navbarInner}>
            <Pressable onPress={() => router.push('/')} style={styles.brand}>
              <View style={[styles.brandDot, { backgroundColor: Brand.gold }]} />
              <ThemedText style={styles.brandName}>NTOKOZO CARS</ThemedText>
            </Pressable>

            <View style={styles.navLinks}>
              {navItems.map((item) => {
                const isActive = pathname === item.route || (item.route !== '/' && pathname.startsWith(item.route));
                return (
                  <Pressable key={item.route} onPress={() => router.push(item.route as any)}>
                    <View
                      style={[
                        styles.navBtn,
                        isActive && { backgroundColor: Brand.gold + '22', borderColor: Brand.gold + '55', borderWidth: 1 },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.navBtnText,
                          { color: isActive ? Brand.gold : '#999999' },
                        ]}
                      >
                        {item.label}
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.webContent}>{children}</View>
      </View>
    );
  }

  // ── Mobile Layout: Bottom Tabs ──
  return (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileContent}>{children}</View>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: '#111111',
            borderTopColor: '#222',
          },
        ]}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.route || (item.route !== '/' && pathname.startsWith(item.route));
          return (
            <Pressable
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={styles.tabItem}
            >
              <ThemedText style={[styles.tabIcon, { color: isActive ? Brand.gold : '#666' }]}>
                {item.icon}
              </ThemedText>
              <ThemedText
                style={[
                  styles.tabLabel,
                  { color: isActive ? Brand.gold : '#666' },
                ]}
              >
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    flex: 1,
    backgroundColor: '#111111',
  },
  navbarOuter: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#111111F5',
    borderBottomWidth: 1,
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
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
  navBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  webContent: {
    flex: 1,
    paddingTop: 70, // offset for fixed navbar
  },

  // Mobile styles
  mobileContainer: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
});
