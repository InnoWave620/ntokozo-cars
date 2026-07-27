import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AppLogoProps {
  height?: number;
  width?: number;
  variant?: 'small' | 'medium' | 'large';
}

export function AppLogo({ height, width, variant = 'medium' }: AppLogoProps) {
  const defaultDimensions = {
    small: { h: 100, w: 320 },
    medium: { h: 140, w: 420 },
    large: { h: 200, w: 580 },
  }[variant];

  const logoHeight = height ?? defaultDimensions.h;
  const logoWidth = width ?? defaultDimensions.w;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo/ntokozo-cars-logo.png')}
        style={{ height: logoHeight, width: logoWidth }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
