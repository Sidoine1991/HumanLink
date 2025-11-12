import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = 'hl_history_contacts';
const PLACES_KEY = 'hl_history_places';

export type ContactHistory = { ts: number; name?: string; mood?: string; lat?: number; lng?: number };
export type PlaceHistory = { ts: number; name: string; type?: string; lat: number; lng: number };

async function pushLimited<T>(key: string, item: T, limit = 10) {
  const raw = await AsyncStorage.getItem(key);
  const list: T[] = raw ? JSON.parse(raw) : [];
  list.unshift(item);
  const trimmed = list.slice(0, limit);
  await AsyncStorage.setItem(key, JSON.stringify(trimmed));
}

export async function saveContact(h: ContactHistory) {
  await pushLimited(CONTACTS_KEY, h);
}

export async function getContacts(): Promise<ContactHistory[]> {
  const raw = await AsyncStorage.getItem(CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function savePlace(h: PlaceHistory) {
  await pushLimited(PLACES_KEY, h);
}

export async function getPlaces(): Promise<PlaceHistory[]> {
  const raw = await AsyncStorage.getItem(PLACES_KEY);
  return raw ? JSON.parse(raw) : [];
}


