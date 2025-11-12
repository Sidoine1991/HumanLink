import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../api';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function FeedbackScreen() {
  const { client } = useApi();
  const navigation = useNavigation<any>();
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [note, setNote] = useState('');

  const submit = async () => {
    try {
      console.log('📡 Envoi du feedback...', { sentiment, note });
      const { data } = await client.post('/feedback/', { sentiment, note });
      console.log('✅ Feedback enregistré:', data);
      Alert.alert('Merci !', 'Votre retour a été enregistré.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (e: any) {
      console.error('❌ Erreur envoi feedback:', e);
      Alert.alert('Erreur', e?.response?.data?.detail ?? 'Une erreur est survenue');
    }
  };

  const sentiments = [
    { value: 'positive' as const, label: 'Positive', emoji: '😊', color: colors.success },
    { value: 'neutral' as const, label: 'Neutre', emoji: '😐', color: colors.warning },
    { value: 'negative' as const, label: 'Négative', emoji: '😔', color: colors.error },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconEmoji}>💭</Text>
        </View>
        <Text style={styles.title}>Comment s'est passée la rencontre ?</Text>
        <Text style={styles.subtitle}>
          Votre avis nous aide à améliorer l'expérience de tous
        </Text>
      </View>

      <Card style={styles.card} elevated>
        <Text style={styles.sectionTitle}>Sentiment général</Text>
        <View style={styles.sentimentsContainer}>
          {sentiments.map((sent) => (
            <TouchableOpacity
              key={sent.value}
              style={[
                styles.sentimentButton,
                sentiment === sent.value && {
                  backgroundColor: sent.color + '20',
                  borderColor: sent.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSentiment(sent.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.sentimentEmoji}>{sent.emoji}</Text>
              <Text
                style={[
                  styles.sentimentLabel,
                  sentiment === sent.value && { color: sent.color, fontWeight: '600' },
                ]}
              >
                {sent.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Commentaire (optionnel)"
          placeholder="Dites-nous en plus sur votre expérience..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          leftIcon={<Text style={styles.icon}>📝</Text>}
        />

        <Button
          title="Envoyer mon retour"
          onPress={submit}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
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
    backgroundColor: colors.infoLight,
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
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sentimentsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sentimentButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sentimentEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  sentimentLabel: {
    ...typography.caption,
    color: colors.text,
  },
  icon: {
    fontSize: 20,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
