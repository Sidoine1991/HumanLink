import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../api';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import BottomTabNavigator from '../components/BottomTabNavigator';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { client } = useApi();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await client.get('/auth/me');
      setUser(data);
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
    } catch (e: any) {
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const payload = {
      display_name: displayName.trim(),
      bio: bio.trim(),
    };

    setSaving(true);
    try {
      const { data } = await client.put('/auth/me', payload);
      setUser(data);
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
      Alert.alert('Succès', 'Profil mis à jour');
      setEditing(false);
    } catch (e: any) {
      const message = e?.response?.data?.detail || 'Impossible de mettre à jour le profil';
      Alert.alert('Erreur', message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header avec photo de profil */}
      <Card style={styles.profileHeader} elevated>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editPhotoButton}>
            <Text style={styles.editPhotoIcon}>📷</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{user?.display_name || 'Utilisateur'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </Card>

      {/* Informations personnelles */}
      <Card style={styles.section} elevated>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editButton}>{editing ? 'Annuler' : 'Modifier'}</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Nom complet"
          value={displayName}
          onChangeText={setDisplayName}
          editable={editing}
          leftIcon={<Text style={styles.icon}>👤</Text>}
        />

        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          editable={editing}
          multiline
          numberOfLines={4}
          placeholder="Parlez-nous de vous..."
          leftIcon={<Text style={styles.icon}>📝</Text>}
        />

        {editing && (
          <Button
            title="Enregistrer"
            onPress={handleSave}
            loading={saving}
            fullWidth
            style={styles.saveButton}
          />
        )}
      </Card>

      {/* Paramètres */}
      <Card style={styles.section} elevated>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>🔔</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Gérer vos notifications</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>🔒</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Confidentialité</Text>
            <Text style={styles.settingDescription}>Contrôlez votre visibilité</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>🌍</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Langue</Text>
            <Text style={styles.settingDescription}>Français</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </Card>

      {/* Aide et support */}
      <Card style={styles.section} elevated>
        <Text style={styles.sectionTitle}>Aide et support</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>❓</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Centre d'aide</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>📧</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Nous contacter</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>📄</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Conditions d'utilisation</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </Card>
      <BottomTabNavigator />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.textInverse,
    fontSize: 40,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  editPhotoIcon: {
    fontSize: 18,
  },
  profileName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  editButton: {
    ...typography.captionBold,
    color: colors.primary,
  },
  icon: {
    fontSize: 20,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingArrow: {
    ...typography.h3,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});

