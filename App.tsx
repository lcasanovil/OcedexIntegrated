// File: App.tsx
// Description:
// Entry point of the Ocedex mobile app.
// It manages:
// - Navigation container and bottom tab bar,
// - First-launch reset logic (e.g. cleaning mock data on fresh installs),
// - Initial splash screen that fades into the main app once complete.

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens (UI components) and logic
import UploadScreen from './src/screens/UploadScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';
import SplashScreen from './src/screens/SplashScreen';
import MyOcedexStack from './src/screens/MyOcedexStack'; // nested stack for detail navigation

// Utilities
import {runFirstLaunchReset} from './src/utils/firstLaunchReset';

// === Navigation Setup ===
const Tab = createBottomTabNavigator();

// === App Component ===
export default function App() {
  const [showSplash, setShowSplash] = useState(true); // controls splash screen visibility
  const [storageReset, setStorageReset] = useState(false); // ensures one-time reset

  /**
   * Runs once after splash finishes — performs any reset required on first install.
   * This is called **after** the splash screen disappears to avoid blocking animation.
   */
  useEffect(() => {
    if (!showSplash && !storageReset) {
      runFirstLaunchReset('[App]').finally(() => setStorageReset(true));
    }
  }, [showSplash, storageReset]);

  // === Splash screen shown first ===
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // === Main App Navigator ===
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerBackVisible: false}}>
        {/* Upload Tab — image selection and prediction */}
        <Tab.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Ionicons name="cloud-upload-outline" size={size} color={color} />
            ),
          }}
        />
        {/* MyOcedex Tab — shows discovered species and links to species detail */}
        <Tab.Screen
          name="MyOcedex"
          component={MyOcedexStack}
          options={{
            headerShown: false, // handled by the stack
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Search Tab — species and dive site search */}
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Map Tab — shows dive site locations */}
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Profile Tab — stats and reset button */}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color, size}: {color: string; size: number}) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
