// File: src/screens/ProfileScreen.js
// Description:
// Displays user profile information including discovered species count.
// Allows manual reset of photo discoveries, dive logs, and local images.
// Reuses shared reset logic for both manual and first-time app launch.

import React, {useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs'; // File system access for local file deletion
import {
  getDiscoveredPhotoEntries,
  clearPhotoDiscoveries,
  clearDiveLogs,
} from '../../storage/storage'; // Custom storage utilities
import {runFirstLaunchReset} from '../utils/firstLaunchReset'; // Logic for first-time app reset
import speciesList from '../data/speciesCatalog'; // Full list of cataloged species

export default function ProfileScreen({navigation}) {
  const [speciesCount, setSpeciesCount] = useState(0); // State to track discovered species

  // Configure info icon in header bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Info',
              'Track your discoveries and reset progress here.',
            )
          }
          style={{marginRight: 15}}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Refresh species count and trigger reset if app launched for the first time
  useFocusEffect(
    useCallback(() => {
      runFirstLaunchReset('[Profile]'); // Optional first-time reset logic

      const loadCount = async () => {
        try {
          console.log('[Profile] Loading discovered entries...');
          const discovered = await getDiscoveredPhotoEntries();
          const uniqueSpecies = new Set(discovered.map(e => e.scientificName));
          console.log('[Profile] Unique discovered species:', [
            ...uniqueSpecies,
          ]);
          setSpeciesCount(uniqueSpecies.size); // Count distinct species
        } catch (err) {
          console.log('[Profile] Error loading species count:', err);
        }
      };
      loadCount();
    }, []),
  );

  // Delete all discovery data and stored images
  const handleReset = async () => {
    try {
      console.log('[Profile] Manual reset triggered.');
      await clearPhotoDiscoveries(); // Clear stored predictions
      await clearDiveLogs(); // Clear BLE dive logs
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath); // Read saved image files
      for (const file of files) {
        await RNFS.unlink(file.path); // Delete each file
      }
      setSpeciesCount(0); // Reset species count in UI
      Alert.alert(
        'Ocedex Reset',
        'All discoveries and saved images were removed.',
      );
    } catch (err) {
      Alert.alert('Reset Error', 'Something went wrong while resetting.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: 'thresher_shark_lcv'}} style={styles.avatar} />
      <Text style={styles.name}>Diver Explorer 🌊</Text>
      <Text style={styles.padiLevel}>PADI Advanced Open Water Diver</Text>
      <Text style={styles.info}>
        Species discovered: {speciesCount} / {speciesList.length}
      </Text>
      <Text style={styles.description}>
        Keep exploring to discover all the species of Indonesia! 🌊🐟
      </Text>
      <Button title="Reset Ocedex" onPress={handleReset} color="#cc3333" />
    </View>
  );
}

// Styling for the profile layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  padiLevel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
});
