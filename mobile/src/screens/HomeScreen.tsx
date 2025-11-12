import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useApi } from '../api';
import { setToken as storageSetToken } from '../utils/storage';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import BottomTabNavigator from '../components/BottomTabNavigator';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { client, setToken } = useApi();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ connections: 0, moods: 0, messages: 0 });
  const [recentMoods, setRecentMoods] = useState<any[]>([]);

  console.log('🎨 HomeScreen rendu, loading:', loading, 'user:', user ? 'présent' : 'absent');

  useEffect(() => {
    loadUserInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Recharger à chaque fois que l'écran revient au focus
      loadUserInfo();
      return () => {};
    }, [])
  );

  const loadUserInfo = async () => {
    try {
      console.log('📡 Chargement des informations utilisateur...');
      const { data } = await client.get('/auth/me');
      console.log('✅ Utilisateur chargé:', data);
      setUser(data);
      
      // Charger les statistiques
      try {
        const { data: moods = [] } = await client.get('/mood/').catch(() => ({ data: [] }));
        setStats({
          connections: 0,
          moods: moods.length,
          messages: 0,
        });
        // Garder les 5 dernières humeurs
        const sorted = Array.isArray(moods)
          ? [...moods].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : [];
        setRecentMoods(sorted.slice(0, 5));
      } catch (statsError) {
        console.warn('⚠️ Erreur chargement statistiques:', statsError);
      }
    } catch (e: any) {
      console.error('❌ Erreur chargement utilisateur:', e);
      if (e?.response?.status === 401) {
        // Token invalide, rediriger vers login
        await storageSetToken(null);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await storageSetToken(null);
            setToken(null);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const quickActions = [
    {
      id: 'mood',
      emoji: '😊',
      title: 'Partager mon humeur',
      description: "Exprimez votre état d'esprit et connectez-vous avec des personnes similaires",
      color: colors.emotion.joy,
      bgColor: '#FFF9E6',
      onPress: () => navigation.navigate('Mood'),
    },
    {
      id: 'suggestions',
      emoji: '👥',
      title: 'Personnes compatibles',
      description: 'Découvrez des personnes proches avec des humeurs similaires',
      color: colors.primary,
      bgColor: colors.primaryLight,
      onPress: () => navigation.navigate('Suggestions'),
    },
    {
      id: 'places',
      emoji: '📍',
      title: 'Lieux recommandés',
      description: 'Trouvez des endroits adaptés à votre humeur actuelle',
      color: colors.secondary,
      bgColor: colors.secondaryLight,
      onPress: () => navigation.navigate('Place'),
    },
    {
      id: 'feed',
      emoji: '📰',
      title: 'Actualités',
      description: 'Découvrez les dernières nouvelles et publications de la communauté',
      color: colors.accent,
      bgColor: colors.accentLight,
      onPress: () => navigation.navigate('Feed'),
    },
    {
      id: 'chat',
      emoji: '💬',
      title: 'Messagerie',
      description: 'Communiquez avec les membres de la communauté',
      color: colors.info,
      bgColor: colors.infoLight,
      onPress: () => navigation.navigate('Chat'),
    },
    {
      id: 'profile',
      emoji: '👤',
      title: 'Mon profil',
      description: 'Gérez vos informations et préférences',
      color: colors.textSecondary,
      bgColor: colors.bgSecondary,
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  console.log('🎨 HomeScreen - Rendu du contenu, user:', user?.display_name || 'chargement...');
  
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        <Image 
          source={require('../../assets/images/home/acceuil.jpeg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>HumanLink</Text>
          <Text style={styles.heroSubtitle}>Connectons les cœurs, unifions les esprits</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>{user?.display_name || 'Utilisateur'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tagline}>Connectons les cœurs, unifions les esprits</Text>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard} elevated>
          <Text style={styles.statEmoji}>🤝</Text>
          <Text style={styles.statNumber}>{stats.connections}</Text>
          <Text style={styles.statLabel}>Connexions</Text>
        </Card>
        <Card style={styles.statCard} elevated>
          <Text style={styles.statEmoji}>😊</Text>
          <Text style={styles.statNumber}>{stats.moods}</Text>
          <Text style={styles.statLabel}>Humeurs</Text>
        </Card>
        <Card style={styles.statCard} elevated>
          <Text style={styles.statEmoji}>💬</Text>
          <Text style={styles.statNumber}>{stats.messages}</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </Card>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: action.bgColor }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.actionEmoji}>{action.emoji}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription} numberOfLines={2}>
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dernières humeurs */}
      {!!recentMoods.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dernières humeurs</Text>
          {recentMoods.map((m) => (
            <Card key={m.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...typography.captionBold, color: colors.text }}>{m.mood_label}</Text>
                <Text style={{ ...typography.small, color: colors.textSecondary }}>
                  {new Date(m.created_at).toLocaleString()}
                </Text>
              </View>
              {!!m.text && (
                <Text style={{ ...typography.body, color: colors.text, marginTop: spacing.xs }} numberOfLines={2}>
                  {m.text}
                </Text>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* À propos */}
      <Card style={styles.aboutCard} elevated>
        <View style={styles.aboutHeader}>
          <Text style={styles.aboutEmoji}>💙</Text>
          <Text style={styles.aboutTitle}>À propos de HumanLink</Text>
        </View>
        <Text style={styles.aboutText}>
          HumanLink est une plateforme solidaire qui connecte les personnes pour lutter contre la solitude,
          la dépression et créer un réseau d'entraide mutuelle. Ensemble, nous construisons une communauté
          bienveillante et solidaire.
        </Text>
      </Card>
      </ScrollView>
      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    width: '100%',
    minHeight: '100%',
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  heroSection: {
    width: '100%',
    height: 200,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: spacing.lg,
  },
  heroTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  heroSubtitle: {
    ...typography.body,
    color: '#FFFFFF',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h1,
    color: colors.text,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  logoutIcon: {
    fontSize: 20,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statNumber: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  aboutCard: {
    marginBottom: spacing.xl,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aboutEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  aboutTitle: {
    ...typography.h4,
    color: colors.text,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
