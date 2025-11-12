// Mock for react-native-reanimated on web
// This prevents warnings from react-native-worklets
// Export all common reanimated functions as no-ops
module.exports = {
  default: {
    Value: () => ({ value: 0 }),
    SpringUtils: {},
    Easing: {},
  },
  Value: () => ({ value: 0 }),
  SpringUtils: {},
  Easing: {},
  useSharedValue: () => ({ value: 0 }),
  useAnimatedStyle: () => ({}),
  withTiming: (value) => value,
  withSpring: (value) => value,
  withRepeat: (value) => value,
  withSequence: (...values) => values[0],
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
};

