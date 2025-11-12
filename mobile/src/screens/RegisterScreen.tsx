import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useApi } from '../api';
import { colors, spacing, radius } from '../ui/theme';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { client } = useApi();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 RegisterScreen monté');
    console.log('🔗 Client API disponible:', !!client);
    if (client) {
      console.log('🔗 Base URL du client:', (client as any).defaults?.baseURL);
    }
  }, [client]);

  const validateForm = () => {
    console.log('🔍 Validation du formulaire en cours...');
    
    if (!email.trim()) {
      console.log('❌ Erreur: Email vide');
      const errorMsg = 'Veuillez entrer votre email';
      Alert.alert('Erreur', errorMsg);
      console.error('❌', errorMsg);
      return false;
    }
    if (!email.includes('@')) {
      console.log('❌ Erreur: Email invalide (pas de @)');
      const errorMsg = 'Veuillez entrer un email valide';
      Alert.alert('Erreur', errorMsg);
      console.error('❌', errorMsg);
      return false;
    }
    if (!displayName.trim()) {
      console.log('❌ Erreur: Nom vide');
      const errorMsg = 'Veuillez entrer votre nom';
      Alert.alert('Erreur', errorMsg);
      console.error('❌', errorMsg);
      return false;
    }
    if (password.length < 6) {
      console.log(`❌ Erreur: Mot de passe trop court (${password.length} caractères, minimum 6)`);
      const errorMsg = 'Le mot de passe doit contenir au moins 6 caractères';
      Alert.alert('Erreur', errorMsg);
      console.error('❌', errorMsg);
      return false;
    }
    if (password !== confirmPassword) {
      console.log(`❌ Erreur: Mots de passe ne correspondent pas (password: ${password.length} chars, confirm: ${confirmPassword.length} chars)`);
      console.log(`   Password: "${password}"`);
      console.log(`   Confirm:  "${confirmPassword}"`);
      const errorMsg = 'Les mots de passe ne correspondent pas';
      Alert.alert('Erreur', errorMsg);
      console.error('❌', errorMsg);
      return false;
    }
    console.log('✅ Validation réussie !');
    return true;
  };

  const handleRegister = async () => {
    console.log('🔘 Bouton "Créer mon compte" cliqué');
    console.log('📋 État actuel:', {
      email: email,
      displayName: displayName,
      passwordLength: password.length,
      confirmPasswordLength: confirmPassword.length,
      loading,
    });
    
    const isValid = validateForm();
    console.log('✅ Validation du formulaire:', isValid);
    if (!isValid) {
      console.log('❌ Formulaire invalide, arrêt de la fonction');
      return;
    }

    console.log('🔄 Début de la création du compte...');
    setLoading(true);
    console.log('📧 Email:', email.trim());
    console.log('👤 Nom:', displayName.trim());
    console.log('🔗 Client API disponible:', !!client);
    
    try {
      console.log('📡 Envoi de la requête au backend...');
      console.log('📦 Données envoyées:', {
        email: email.trim(),
        display_name: displayName.trim(),
        passwordLength: password.length,
      });
      
      const response = await client.post('/auth/register', {
        email: email.trim(),
        password,
        display_name: displayName.trim(),
      });
      
      console.log('✅ Réponse reçue du serveur:', response.status);
      console.log('✅ Compte créé avec succès:', response.data);
      console.log('🧭 Navigation vers VerifyEmail...');
      
      // Rediriger immédiatement vers la page de vérification
      // L'utilisateur pourra entrer le code de vérification immédiatement
      navigation.navigate('VerifyEmail', { 
        email: email.trim(),
        password: password, // Garder le mot de passe pour connexion auto après vérification
      });
      console.log('✅ Navigation réussie vers VerifyEmail');
    } catch (e: any) {
      console.error('❌ Erreur lors de la création du compte:', e);
      console.error('❌ Type d\'erreur:', e?.constructor?.name);
      console.error('❌ Détails de l\'erreur:', {
        message: e?.message,
        response: e?.response?.data,
        status: e?.response?.status,
        statusText: e?.response?.statusText,
        code: e?.code,
      });
      
      let errorMessage = 'Erreur lors de la création du compte';
      
      // Gestion des différents types d'erreurs
      if (e?.code === 'ECONNABORTED' || e?.message?.includes('timeout')) {
        errorMessage = 'Le serveur ne répond pas (timeout). Vérifiez que le backend est démarré et que les tables existent dans Supabase.';
      } else if (e?.code === 'ERR_NETWORK' || e?.code === 'ECONNREFUSED') {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8000';
      } else if (e?.response?.data?.detail) {
        errorMessage = e.response.data.detail;
        // Message spécial pour les erreurs de base de données
        const errorLower = errorMessage.toLowerCase();
        if (errorLower.includes('table') || errorLower.includes('database') || errorLower.includes('connexion')) {
          errorMessage += '\n\n💡 Les tables n\'existent peut-être pas dans Supabase. Voir VERIFIER_TABLES.md';
        }
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      console.error('❌ Message d\'erreur final:', errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la création du compte');
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
          <Text style={styles.logo}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté HumanLink</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean Dupont"
              placeholderTextColor={colors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
            />
            <Text style={styles.hint}>Au moins 6 caractères</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => {
              console.log('👆 TouchableOpacity onPress déclenché');
              handleRegister();
            }}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

