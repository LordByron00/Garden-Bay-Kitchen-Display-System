import { Dimensions, Platform, ScaledSize, StyleSheet } from 'react-native';

// Get screen dimensions with fallback
const { width, height }: ScaledSize = Dimensions.get('window');

// Base reference width (12" KDS landscape)
const BASE_WIDTH = 2560;
const scale: number = width > 0 ? width / BASE_WIDTH : 1;

// Kitchen Display System Touch Standards
interface KDSTouch {
  minWidth: number;
  minHeight: number;
  padding: number;
  hitSlop: { top: number; bottom: number; left: number; right: number };
}

export const KDS_TOUCH: KDSTouch = {
  minWidth: Math.round(120 * scale),
  minHeight: Math.round(80 * scale),
  padding: Math.round(16 * scale),
  hitSlop: {
    top: Math.round(20 * scale),
    bottom: Math.round(20 * scale),
    left: Math.round(15 * scale),
    right: Math.round(15 * scale)
  }
};

// Screen dimensions reference
export const KDS_SCREEN = {
  width,
  height,
  scale,
  isLandscape: width > height
};

// Font scaling
export function kdsFontSize(baseSize: number): number {
  const scaledSize = baseSize * scale;
  return Platform.select<number>({
    android: Math.max(scaledSize, 20),
    ios: Math.max(scaledSize, 18),
    default: Math.max(scaledSize, 16)
  });
}

// Standard KDS Styles
export const KDS_STYLES = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: KDS_TOUCH.padding
  },
  urgentCard: {
    borderWidth: 2,
    borderColor: '#e74c3c'
  }
});