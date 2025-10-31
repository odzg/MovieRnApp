/**
 * @fileoverview Tamagui configuration wrapper to keep the app entry lean.
 */
import { createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

/**
 * Tamagui allows tree-shaking unused themes and components. Creating the config
 * here makes it trivial to customise tokens later without touching the entry point.
 */
export const tamaguiConfig = createTamagui(defaultConfig);
