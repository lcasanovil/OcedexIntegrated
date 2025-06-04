/**
 * index.js — Entry point used by React Native CLI to launch the app.
 * It registers the root component (`App`) defined in App.tsx.
 */

import {AppRegistry} from 'react-native'; // Core native app registry
import App from './App'; // Main app component
import {name as appName} from './app.json'; // App name defined in app.json

// Register the main component so it can be started by native code
AppRegistry.registerComponent(appName, () => App);
