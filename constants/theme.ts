/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const MoodColors = {
  red: '#FF6B6B',
  yellow: '#FFD93D',
  green: '#6BCF7F',
  gray: '#E0E0E0',
  blue: '#4A90E2',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Mood colors
    moodRed: MoodColors.red,
    moodYellow: MoodColors.yellow,
    moodGreen: MoodColors.green,
    // Activity and UI colors
    activityDot: MoodColors.blue,
    activityDotEmpty: MoodColors.gray,
    inputBorder: '#4A90E2',
    cardBorder: '#E0E0E0',
    cardBorderDashed: '#CCCCCC',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Mood colors
    moodRed: MoodColors.red,
    moodYellow: MoodColors.yellow,
    moodGreen: MoodColors.green,
    // Activity and UI colors
    activityDot: '#6BA3E8',
    activityDotEmpty: '#404040',
    inputBorder: '#6BA3E8',
    cardBorder: '#333333',
    cardBorderDashed: '#555555',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
