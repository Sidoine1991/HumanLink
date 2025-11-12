// Mock for react-native-maps on web platform
import { View } from 'react-native';

export const MapView = View;
export const Marker = View;
export const Polyline = View;
export const Polygon = View;
export const Circle = View;
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

const defaultExport = MapView;
export default defaultExport;

