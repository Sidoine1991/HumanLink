import React from 'react';
import { View } from 'react-native';
import { colors, radius } from './theme';

export function Line({ width = '100%', height = 14, style }: { width?: number | string; height?: number; style?: any }) {
  return <View style={[{ width, height, backgroundColor: '#F0F2F5', borderRadius: radius.sm, marginVertical: 6 }, style]} />;
}

export function CardLines() {
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' }}>
      <Line width="70%" />
      <Line width="40%" />
    </View>
  );
}


