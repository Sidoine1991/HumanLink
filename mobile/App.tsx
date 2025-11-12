// react-native-reanimated is imported but not actively used
// On web, it's mocked via webpack alias to avoid worklets warnings
import 'react-native-reanimated';
import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { getToken as storageGetToken } from './src/utils/storage';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import HomeScreen from './src/screens/HomeScreen';
import MoodScreen from './src/screens/MoodScreen';
import SuggestionsScreen from './src/screens/SuggestionsScreen';
import PlaceScreen from './src/screens/PlaceScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import FeedScreen from './src/screens/FeedScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { ApiProvider } from './src/api';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [bootTimeout, setBootTimeout] = useState(false);
  const navigationRef = React.useRef<any>(null);

  useEffect(() => {
    // Bootstrap immédiat avec timeout de sécurité
    const bootstrap = async () => {
      try {
        console.log('🔍 Récupération du token...');
        // Timeout très court pour ne pas bloquer
        const tokenPromise = storageGetToken();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 500));
        
        const t = await Promise.race([tokenPromise, timeoutPromise]) as string | null;
        console.log('✅ Token récupéré:', t ? 'Oui' : 'Non');
        setToken(t);
      } catch (e) {
        console.error('❌ Erreur storageGetToken', e);
        setToken(null);
      } finally {
        console.log('✅ Bootstrap terminé');
        setBootstrapped(true);
      }
    };
    
    bootstrap();
    // Timeout de sécurité absolu - toujours afficher quelque chose après 1 seconde
    const safetyTimeout = setTimeout(() => {
      if (!bootstrapped) {
        console.warn('⚠️ Timeout de sécurité - forcer le bootstrap');
        setBootstrapped(true);
      }
    }, 1000);
    
    return () => clearTimeout(safetyTimeout);
  }, []);

  // Utiliser une clé pour forcer la recréation de la navigation quand le token change
  // Cela garantit que les bons écrans sont disponibles
  const navigationKey = token ? 'authenticated' : 'unauthenticated';

  // Naviguer vers Home quand le token change de null à une valeur
  // Mais seulement si on n'est pas déjà sur Home
  useEffect(() => {
    if (token && navigationRef.current && bootstrapped) {
      // Attendre un peu pour que la navigation soit prête
      setTimeout(() => {
        if (navigationRef.current) {
          const currentRoute = navigationRef.current.getCurrentRoute();
          if (currentRoute?.name !== 'Home') {
            console.log('🔄 Token détecté, navigation vers Home...');
            navigationRef.current.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
          }
        }
      }, 100);
    }
  }, [token, bootstrapped]);

  useEffect(() => {
    const id = setTimeout(() => setBootTimeout(true), 2000);
    return () => clearTimeout(id);
  }, []);

  // Toujours afficher quelque chose - même pendant le bootstrap
  if (!bootstrapped) {
    console.log('⏳ Application en cours de chargement...');
    return (
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#FAFBFC',
        zIndex: 9999
      }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🤝</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#1A1A1A' }}>HumanLink</Text>
        <Text style={{ fontSize: 16, marginBottom: 10, color: '#6B7280' }}>Chargement…</Text>
        {bootTimeout && <Text style={{ marginTop: 8, color: '#9CA3AF', fontSize: 12 }}>Si cet écran persiste, rechargez la page.</Text>}
      </View>
    );
  }

  console.log('🎨 Rendu de l\'application, token:', token ? 'présent' : 'absent');
  console.log('🎨 Navigation key:', navigationKey);
  console.log('🎨 Écrans disponibles:', token ? 'authenticated' : 'unauthenticated');

  // Rendu principal - toujours afficher quelque chose
  console.log('🎨 Rendu principal de App, bootstrapped:', bootstrapped, 'token:', token ? 'présent' : 'absent');
  
  return (
    <View style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1, 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#FAFBFC' 
    }}>
      <SafeAreaProvider>
        <ApiProvider token={token} setToken={setToken}>
          <NavigationContainer 
            ref={navigationRef}
            key={navigationKey}
            onReady={() => {
              console.log('✅ NavigationContainer prêt, route actuelle:', navigationRef.current?.getCurrentRoute()?.name);
            }}
            onStateChange={(state) => {
              const currentRoute = state?.routes?.[state?.index]?.name;
              console.log('🔄 État de navigation changé:', currentRoute);
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { 
                  backgroundColor: '#FAFBFC',
                  flex: 1,
                },
              }}
              initialRouteName={token ? 'Home' : 'Login'}
            >
              {token ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Mood" component={MoodScreen} />
                  <Stack.Screen name="Suggestions" component={SuggestionsScreen} />
                  <Stack.Screen name="Place" component={PlaceScreen} />
                  <Stack.Screen name="Feedback" component={FeedbackScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Chat" component={ChatScreen} />
                  <Stack.Screen name="Feed" component={FeedScreen} />
                  <Stack.Screen name="Notifications" component={NotificationsScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ApiProvider>
      </SafeAreaProvider>
    </View>
  );
}


