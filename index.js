import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

// Silencing the noisy Expo Go and Deprecation warnings
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported',
  'SafeAreaView has been deprecated',
  'Notifications: Permission request skipped',
  'Notifications: Scheduling skipped',
]);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
