import React, { createContext, useContext, useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import { setToken as storageSetToken } from './utils/storage';

type Ctx = {
  client: AxiosInstance;
  setToken: (t: string | null) => void;
};

const ApiContext = createContext<Ctx>({} as Ctx);

export const ApiProvider: React.FC<{ token: string | null; setToken: (t: string | null) => void; children: React.ReactNode }> = ({ token, setToken, children }) => {
  const client = useMemo(() => {
    // Pour Expo Go sur téléphone physique, utilisez votre IP locale au lieu de localhost
    // Trouvez votre IP avec: ipconfig (Windows) ou ifconfig (Mac/Linux)
    // Exemple: 'http://192.168.1.100:8000'
    const baseURL = 'http://localhost:8000';
    console.log('🔗 Configuration API avec baseURL:', baseURL);
    
    const instance = axios.create({ 
      baseURL,
      timeout: 30000, // 30 secondes de timeout
    });
    instance.interceptors.request.use((config) => {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    instance.interceptors.response.use(
      (r) => {
        console.log(`✅ ${r.config.method?.toUpperCase()} ${r.config.url} - Status: ${r.status}`);
        if (r.data) {
          console.log(`📦 Réponse data:`, r.data);
        }
        return r;
      },
      async (err) => {
        const errorDetails = {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
          code: err.code,
        };
        console.error(`❌ ${err.config?.method?.toUpperCase()} ${err.config?.url} - Erreur:`, errorDetails);
        // Afficher le détail de l'erreur si disponible
        if (err.response?.data?.detail) {
          console.error(`❌ Détail de l'erreur serveur:`, err.response.data.detail);
        }
        if (err.response?.status === 401) {
          await storageSetToken(null);
          setToken(null);
        }
        return Promise.reject(err);
      },
    );
    return instance;
  }, [token, setToken]);

  const value = useMemo(() => ({ client, setToken }), [client, setToken]);
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);


