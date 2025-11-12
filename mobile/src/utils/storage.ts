import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Type declaration for web environment
declare const window: {
  localStorage?: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
} | undefined;

const TOKEN_KEY = 'token';

export async function getToken(): Promise<string | null> {
  try {
    console.log('📦 getToken appelé, Platform.OS:', Platform.OS);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = window.localStorage.getItem(TOKEN_KEY);
        console.log('📦 Token depuis localStorage:', token ? 'présent' : 'absent');
        return token;
      }
      console.warn('⚠️ localStorage non disponible sur web');
      return null;
    }
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('📦 Token depuis SecureStore:', token ? 'présent' : 'absent');
    return token;
  } catch (e) {
    console.error('❌ Erreur lecture token', e);
    return null;
  }
}

export async function setToken(value: string | null): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (value === null) {
          window.localStorage.removeItem(TOKEN_KEY);
        } else {
          window.localStorage.setItem(TOKEN_KEY, value);
        }
        return;
      }
      console.warn('localStorage non disponible sur web');
      return;
    }
    if (value === null) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, value);
    }
  } catch (e) {
    console.error('Erreur écriture token', e);
  }
}


