/**
 * @fileoverview Shared MMKV storage helpers.
 */
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

/**
 * Serialises an arbitrary value into JSON before persisting it.
 */
export const setJSON = (key: string, value: unknown) => {
  storage.set(key, JSON.stringify(value));
};

/**
 * Reads a previously persisted JSON payload. When the value is missing a
 * fallback is returned.
 */
export const getJSON = <T>(key: string, fallback: T): T => {
  const value = storage.getString(key);

  if (value === undefined) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to parse MMKV value for "${key}":`, error);
    }
    return fallback;
  }
};

/**
 * Deletes a persisted value from storage.
 */
export const removeValue = (key: string) => {
  storage.remove(key);
};
