import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../ui/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showEmoji?: boolean;
}

export default function Logo({ size = 'medium', showEmoji = true }: LogoProps) {
  const sizes = {
    small: { fontSize: 20, emojiSize: 20 },
    medium: { fontSize: 32, emojiSize: 32 },
    large: { fontSize: 48, emojiSize: 40 },
  };

  const { fontSize, emojiSize } = sizes[size];

  return (
    <View style={styles.container}>
      {showEmoji && (
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>🤝</Text>
      )}
      <Text style={[styles.text, { fontSize }]}>HumanLink</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emoji: {
    marginRight: spacing.xs,
  },
  text: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: -1,
  },
});

