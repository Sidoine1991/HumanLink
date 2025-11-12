import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../api';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Button from '../components/Button';
import BottomTabNavigator from '../components/BottomTabNavigator';
import Input from '../components/Input';
import Card from '../components/Card';

export default function MoodScreen() {
  const { client } = useApi();
  const navigation = useNavigation<any>();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire votre humeur');
      return;
    }

    setLoading(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          console.log('📍 Localisation obtenue:', { lat, lng });
        } else {
          console.warn('⚠️ Permission de localisation refusée');
        }
      } catch (locationError) {
        console.warn('⚠️ Erreur lors de la récupération de la localisation:', locationError);
        // Continuer sans localisation
      }
      
      console.log('📡 Envoi de l\'humeur...', { text, lat, lng });
      const { data } = await client.post('/mood/', { text, lat, lng });
      console.log('✅ Humeur partagée:', data);
      Alert.alert(
        'Succès', 
        `Votre humeur "${data.mood_label}" a été partagée !\nScore: ${(data.mood_score * 100).toFixed(0)}%`, 
        [
          { text: 'Voir les suggestions', onPress: () => navigation.navigate('Suggestions') },
          { text: 'Retour à l\'accueil', onPress: () => navigation.navigate('Home') },
        ]
      );
    } catch (e: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'humeur:', e);
      const errorMessage = e?.response?.data?.detail || e?.message || 'Une erreur est survenue';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>😊</Text>
          </View>
          <Text style={styles.title}>Comment te sens-tu ?</Text>
          <Text style={styles.subtitle}>
            Partagez votre humeur actuelle et découvrez des personnes avec des émotions similaires
          </Text>
        </View>

        <Card style={styles.card} elevated>
          <Input
            label="Décrivez votre humeur"
            placeholder="Ex: Je me sens joyeux et énergique aujourd'hui..."
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            leftIcon={<Text style={styles.icon}>💭</Text>}
            helperText={`${text.length} caractères • Décrivez librement votre état d'esprit`}
          />

          <View style={styles.moodExamples}>
            <Text style={styles.examplesTitle}>Exemples d'humeurs :</Text>
            <View style={styles.examplesGrid}>
              {['😊 Joyeux', '😌 Calme', '⚡ Énergique', '😴 Fatigué', '😰 Stressé'].map((mood) => (
                <View key={mood} style={styles.moodChip}>
                  <Text style={styles.moodChipText}>{mood}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            title="Partager mon humeur"
            onPress={submit}
            loading={loading}
            fullWidth
            size="large"
            style={styles.submitButton}
          />

          <Button
            title="Retour à l'accueil"
            onPress={() => navigation.navigate('Home')}
            variant="ghost"
            fullWidth
          />
        </Card>
      </ScrollView>
      <BottomTabNavigator />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.emotion.joy + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  iconEmoji: {
    fontSize: 50,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 20,
  },
  moodExamples: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  examplesTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSecondary,
  },
  moodChipText: {
    ...typography.caption,
    color: colors.text,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
