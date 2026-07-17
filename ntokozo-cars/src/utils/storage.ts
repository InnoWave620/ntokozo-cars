/**
 * Cross-platform storage utility.
 * Uses localStorage on web, falls back to in-memory Map on other platforms
 * where AsyncStorage is not available during bundling.
 */

import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return memoryStore.get(key) ?? null;
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        memoryStore.set(key, value);
      }
      return;
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
};
