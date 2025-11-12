// Import polyfills first for web compatibility
import './polyfills';

// Import gesture handler for react-navigation (required)
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);


