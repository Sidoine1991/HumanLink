import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../api';
import { saveContact, getContacts, ContactHistory } from '../utils/history';
import Chip from '../ui/Chip';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';
import { CardLines } from '../ui/Skeleton';
import BottomTabNavigator from '../components/BottomTabNavigator';

type S = { user_id: number; distance_m?: number; mood_label: string; display_name?: string; lat?: number; lng?: number };

export default function SuggestionsScreen() {
  const { client } = useApi();
  const nav = useNavigation<any>();
  const [items, setItems] = useState<S[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [radiusM, setRadiusM] = useState<number>(1500);
  const [recent, setRecent] = useState<ContactHistory[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MapModule: any = Platform.OS === 'web' ? null : require('react-native-maps');
  const MapViewComp = MapModule?.default;
  const MarkerComp = MapModule?.Marker;

  const load = async () => {
    setLoading(true);
    try {
      console.log('📡 Chargement des suggestions de match...', { anonymous, radius_m: radiusM });
      const { data } = await client.get('/match/suggestions', { params: { anonymous, radius_m: radiusM } });
      console.log('✅ Suggestions chargées:', data?.length || 0, 'personnes');
      setItems(data || []);
    } catch (e: any) {
      console.error('❌ Erreur chargement suggestions:', e);
      if (e?.response?.status === 400) {
        // L'utilisateur n'a pas encore partagé d'humeur avec localisation
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [anonymous, radiusM]);

  useEffect(() => {
    (async () => setRecent(await getContacts()))();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 260 }}>
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' }}>
            <Text>Carte indisponible sur web (préversion)</Text>
          </View>
        ) : (
          MapViewComp ? (
            <MapViewComp style={{ flex: 1 }}
              initialRegion={{ latitude: items.find(i=>i.lat)?.lat ?? 48.8566, longitude: items.find(i=>i.lng)?.lng ?? 2.3522, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
              {items.filter(i=>i.lat && i.lng).map((i: S, idx: number) => (
                <MarkerComp key={idx} coordinate={{ latitude: i.lat!, longitude: i.lng! }} title={i.display_name ?? 'Anonyme'} description={`${i.mood_label}${i.distance_m?` • ${i.distance_m} m`:''}`} />
              ))}
            </MapViewComp>
          ) : null
        )}
      </View>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text>Mode anonyme</Text>
          <Switch value={anonymous} onValueChange={setAnonymous} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: '600', marginRight: 8 }}>Rayon</Text>
          {[300, 800, 1500, 3000].map((v) => (
            <Chip key={v} label={`${v} m`} active={v===radiusM} onPress={() => { setRadiusM(v); Haptics.selectionAsync(); }} />
          ))}
        </View>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Personnes compatibles</Text>
        {loading ? (
          <>
            <CardLines />
            <CardLines />
            <CardLines />
          </>
        ) : (
        <FlatList<S>
        data={items}
        keyExtractor={(i: S, idx: number) => String(i.user_id) + String(idx)}
        renderItem={({ item }: { item: S }) => (
            <TouchableOpacity onPress={async () => {
              await saveContact({ ts: Date.now(), name: item.display_name, mood: item.mood_label, lat: item.lat, lng: item.lng });
              setRecent(await getContacts());
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              nav.navigate('Place', { candidate: { lat: item.lat, lng: item.lng, name: item.display_name, mood: item.mood_label } });
            }}>
            <View style={{ paddingVertical: 12, borderBottomWidth: 1 }}>
              <Text>{item.display_name ?? 'Anonyme'} • {item.mood_label} • {item.distance_m ? `${item.distance_m} m` : ''}</Text>
                <View style={{ marginTop: 6 }}>
                  <Button title="Proposer un lieu" onPress={async () => {
                    await saveContact({ ts: Date.now(), name: item.display_name, mood: item.mood_label, lat: item.lat, lng: item.lng });
                    setRecent(await getContacts());
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    nav.navigate('Place', { candidate: { lat: item.lat, lng: item.lng, name: item.display_name, mood: item.mood_label } });
                  }} />
                </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
              Aucune suggestion pour le moment
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 }}>
              Partagez d'abord votre humeur avec votre localisation pour découvrir des personnes compatibles
            </Text>
            <Button 
              title="Partager mon humeur" 
              onPress={() => nav.navigate('Mood')} 
            />
          </View>
        }
        />)}
        {recent.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Récemment contactés</Text>
            {recent.slice(0,5).map((r, idx) => (
              <Text key={idx} style={{ color: '#555' }}>{r.name ?? 'Anonyme'} • {r.mood ?? ''}</Text>
            ))}
          </View>
        )}
        <Button title="Actualiser" onPress={load} />
      </View>
      <BottomTabNavigator />
    </View>
  );
}


