import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Alert } from 'react-native';
import { useApi } from '../api';
import { setToken as storageSetToken } from '../utils/storage';
import { colors, spacing, radius, typography, shadows } from '../ui/theme';
import Button from '../components/Button';
import Card from '../components/Card';

interface VerifyEmailScreenProps {
  navigation: any;
  route: any;
}

export default function VerifyEmailScreen({ navigation, route }: VerifyEmailScreenProps) {
  const { client, setToken } = useApi();
  const email = route?.params?.email || '';
  const password = route?.params?.password || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    console.log('VerifyEmailScreen - Email reçu:', email);
    if (!email) {
      Alert.alert(
        'Email manquant',
        'Aucun email trouvé. Veuillez vous inscrire à nouveau.',
        [{ text: 'OK', onPress: () => navigation.navigate('Register') }]
      );
      return;
    }
    // Focus automatique sur le premier champ après un court délai
    // pour s'assurer que l'écran est complètement monté
    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    
    return () => clearTimeout(focusTimer);
  }, [email, navigation]);

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      const digits = numericText.slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code complet à 6 chiffres');
      return;
    }

    if (!email) {
      Alert.alert('Erreur', 'Email manquant. Veuillez vous inscrire à nouveau.');
      navigation.navigate('Register');
      return;
    }

    setLoading(true);
    try {
      console.log('📡 Vérification du code pour:', email);
      console.log('🔐 Code saisi:', verificationCode);
      const verifyResponse = await client.post('/auth/verify-email', {
        email,
        code: verificationCode,
      });
      console.log('✅ Email vérifié avec succès:', verifyResponse.data);
      
      if (password) {
        try {
          console.log('🔐 Connexion automatique après vérification...');
          const body = new URLSearchParams();
          body.set('username', email);
          body.set('password', password);
          body.set('grant_type', 'password');
          
          const { data } = await client.post('/auth/token', body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          
          console.log('✅ Token reçu, sauvegarde...');
          await storageSetToken(data.access_token);
          setToken(data.access_token);
          console.log('✅ Token sauvegardé, navigation automatique vers Home...');
          
          // La navigation sera gérée automatiquement par App.tsx via useEffect
          // qui détecte le changement de token
        } catch (loginError: any) {
          console.error('❌ Erreur lors de la connexion automatique:', loginError);
          Alert.alert(
            'Email vérifié',
            'Votre compte a été vérifié. Veuillez vous connecter.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        }
      } else {
        Alert.alert(
          'Email vérifié',
          'Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.',
          [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.detail || 'Code invalide';
      Alert.alert('Erreur', errorMessage);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Email manquant. Veuillez vous inscrire à nouveau.');
      navigation.navigate('Register');
      return;
    }

    setResending(true);
    try {
      console.log('Renvoyer le code pour:', email);
      await client.post('/auth/resend-verification', { email });
      Alert.alert('Succès', 'Un nouveau code de vérification a été envoyé à votre email');
    } catch (e: any) {
      console.error('Erreur lors de l\'envoi du code:', e);
      const errorMessage = e?.response?.data?.detail || 'Erreur lors de l\'envoi';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setResending(false);
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
            <Text style={styles.iconEmoji}>📬</Text>
          </View>
          <Text style={styles.title}>Vérifiez votre email</Text>
          {email ? (
            <Text style={styles.subtitle}>
              Nous avons envoyé un code à 6 chiffres à{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Veuillez entrer le code de vérification reçu par email
            </Text>
          )}
        </View>

        <Card style={styles.card} elevated>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Button
            title="Vérifier"
            onPress={handleVerify}
            loading={loading}
            disabled={code.join('').length !== 6}
            fullWidth
            size="large"
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Vous n'avez pas reçu le code ?</Text>
            <Button
              title="Renvoyer le code"
              onPress={handleResend}
              loading={resending}
              variant="ghost"
              size="small"
            />
          </View>
        </Card>

        <Button
          title="Retour à la connexion"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
          fullWidth
        />
      </ScrollView>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  codeInput: {
    width: 50,
    height: 64,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  verifyButton: {
    marginTop: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  resendText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
