import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';

interface TabItem {
  name: string;
  label: string;
  icon: string;
  screen: string;
}

const tabs: TabItem[] = [
  { name: 'Home', label: 'Accueil', icon: '🏠', screen: 'Home' },
  { name: 'Feed', label: 'Actualités', icon: '📰', screen: 'Feed' },
  { name: 'Chat', label: 'Messages', icon: '💬', screen: 'Chat' },
  { name: 'Notifications', label: 'Notifications', icon: '🔔', screen: 'Notifications' },
  { name: 'Profile', label: 'Profil', icon: '👤', screen: 'Profile' },
];

export default function BottomTabNavigator() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.screen;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => navigation.navigate(tab.screen)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    ...shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: spacing.xs / 2,
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    ...typography.smallBold,
    color: colors.primary,
  },
});

