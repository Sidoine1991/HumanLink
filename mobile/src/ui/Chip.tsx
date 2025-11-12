import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from './theme';

export default function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: active ? colors.text : colors.border,
      backgroundColor: active ? '#EEF4FF' : '#FFF',
      marginRight: spacing.xs,
    }}>
      <Text style={{ color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}


