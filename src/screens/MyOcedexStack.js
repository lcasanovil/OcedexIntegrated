// File: src/screens/MyOcedexStack.js
// Description:
// This file defines the navigation stack for the MyOcedex section of the app.
// It handles navigation between the main discovered species catalog and the species detail screen.
// Uses React Navigation's native stack navigator for a smooth native transition experience.

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyOcedexScreen from './MyOcedexScreen';
import SpeciesDetailScreen from './SpeciesDetailScreen';

// Create a new stack navigator instance
const Stack = createNativeStackNavigator();

// Component that defines the navigator with two screens: catalog and species detail
export default function MyOcedexStack() {
  return (
    <Stack.Navigator screenOptions={{headerBackVisible: false}}>
      {/* Main screen showing the discovered species catalog */}
      <Stack.Screen
        name="MyOcedex"
        component={MyOcedexScreen}
        options={{title: 'My Ocedex'}}
      />
      {/* Detail screen shown when a discovered species is selected */}
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={{title: 'Species Detail'}}
      />
    </Stack.Navigator>
  );
}
