import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;
import { View, Text, FlatList, Linking, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApi } from '../api';
// MapView is dynamically required to avoid web import errors
import { savePlace } from '../utils/history';
import Button from '../components/Button';
import Card from '../components/Card';
import { colors, spacing, radius } from '../ui/theme';
import * as Haptics from 'expo-haptics';
import BottomTabNavigator from '../components/BottomTabNavigator';

type P = { name: string; lat: number; lng: number; type: string; distance_m?: number };
type NearbyUser = { user_id: number; display_name?: string | null; mood_label: string; lat?: number; lng?: number };

export default function PlaceScreen() {
  const { client } = useApi();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const candidate = route.params?.candidate as { lat?: number; lng?: number; name?: string; mood?: string } | undefined;
  const [items, setItems] = useState<P[]>([]);
  const [nearby, setNearby] = useState<NearbyUser[]>([]);
  // dynamic import guards for web
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MapModule: any = Platform.OS === 'web' ? null : require('react-native-maps');
  const MapViewComp = MapModule?.default;
  const MarkerComp = MapModule?.Marker;

  const load = async () => {
    try {
      console.log('📡 Chargement des suggestions de lieux...');
      const { data } = await client.get('/places/suggest');
      console.log('✅ Lieux chargés:', data);
      setItems(data);
      // Charger aussi les utilisateurs à proximité selon la dernière humeur
      const refLat = data?.[0]?.lat ?? candidate?.lat;
      const refLng = data?.[0]?.lng ?? candidate?.lng;
      if (refLat != null && refLng != null) {
        const { data: nearbyUsers } = await client.get(`/mood/nearby?lat=${refLat}&lng=${refLng}&radius_m=2000`).catch(() => ({ data: [] }));
        setNearby(Array.isArray(nearbyUsers) ? nearbyUsers : []);
      } else {
        setNearby([]);
      }
    } catch (e: any) {
      console.error('❌ Erreur chargement lieux:', e);
      // Afficher un message d'erreur si nécessaire
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ height: 260 }}>
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📍</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Carte indisponible sur web (préversion)</Text>
          </View>
        ) : (
          MapViewComp ? (
            <MapViewComp style={{ flex: 1 }}
              initialRegion={{
                latitude: candidate?.lat ?? items[0]?.lat ?? 48.8566,
                longitude: candidate?.lng ?? items[0]?.lng ?? 2.3522,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {candidate?.lat && candidate?.lng && (
                <MarkerComp coordinate={{ latitude: candidate.lat, longitude: candidate.lng }} title={candidate.name ?? 'Anonyme'} description={candidate.mood} pinColor="#4b7bec" />
              )}
              {items.map((p: P, idx: number) => (
                <MarkerComp key={String(idx)} coordinate={{ latitude: p.lat, longitude: p.lng }} title={p.name} description={p.type} />
              ))}
              {nearby.map((u, idx) => (
                u.lat != null && u.lng != null ? (
                  <MarkerComp
                    key={`u-${idx}`}
                    coordinate={{ latitude: u.lat, longitude: u.lng }}
                    title={u.display_name || `Utilisateur #${u.user_id}`}
                    description={`Humeur: ${u.mood_label}`}
                    pinColor={u.mood_label === 'joy' ? '#f1c40f' : u.mood_label === 'calm' ? '#2ecc71' : '#9b59b6'}
                  />
                ) : null
              ))}
            </MapViewComp>
          ) : null
        )}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: spacing.md, color: colors.text }}>
          Lieux publics suggérés
        </Text>
        {items.length === 0 ? (
          <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📍</Text>
            <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md }}>
              Aucun lieu suggéré pour le moment. Partagez d'abord votre humeur avec votre localisation.
            </Text>
            <Button 
              title="Partager mon humeur" 
              onPress={() => nav.navigate('Mood')} 
              variant="outline"
            />
          </Card>
        ) : (
          <>
            {items.map((item: P, idx: number) => (
              <Card key={String(idx)} style={{ marginBottom: spacing.md }} elevated>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: spacing.xs, color: colors.text }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xs }}>
                  {item.type}
                </Text>
                {item.distance_m && (
                  <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: spacing.xs }}>
                    À {item.distance_m.toFixed(0)} mètres
                  </Text>
                )}
              </Card>
            ))}
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <Button 
                title="J'y vais" 
                onPress={async () => {
                  if (items[0]) {
                    await savePlace({ ts: Date.now(), name: items[0].name, type: items[0].type, lat: items[0].lat, lng: items[0].lng });
                  }
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  nav.navigate('Feedback');
                }}
                fullWidth
                size="large"
              />
              {items[0] && (
                <Button 
                  title="Voir l'itinéraire" 
                  onPress={() => {
                    const { lat, lng } = items[0];
                    const url = Platform.select({
                      ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
                      android: `geo:0,0?q=${lat},${lng}`,
                      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                    });
                    if (url) Linking.openURL(url);
                  }}
                  variant="outline"
                  fullWidth
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
      <BottomTabNavigator />
    </View>
  );
}


