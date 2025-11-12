import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
}: ButtonProps) {
  const sizeStyles = {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, minHeight: 36 },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, minHeight: 48 },
    large: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 56 },
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: colors.primary,
        ...shadows.sm,
      },
      text: { color: colors.textInverse },
    },
    secondary: {
      container: {
        backgroundColor: colors.secondary,
        ...shadows.sm,
      },
      text: { color: colors.textInverse },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      },
      text: { color: colors.primary },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: { color: colors.primary },
    },
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? colors.textInverse : colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, variantStyles[variant].text]}>
          {icon && <>{icon} </>}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
    textAlign: 'center',
  },
});

