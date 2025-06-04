// File: src/screens/MyOcedexScreen.js
// Description:
// Displays the catalog of discovered fish species with metadata (image, timestamp, depth, temperature).
// When a species is discovered, the catalog updates the default image with the actual one taken by the user.
// Dependencies:
// - Uses FlatList and custom FishCard component for rendering
// - Retrieves saved discoveries using photoStorage.js (underlying storage logic)
// - Uses RNFS to verify local image file existence

import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import speciesCatalog from '../data/speciesCatalog';
import {getDiscoveredPhotoEntries} from '../../storage/storage';
import FishCard from '../components/FishCard';
import RNFS from 'react-native-fs';

export default function MyOcedexScreen({navigation}) {
  const [mergedCatalog, setMergedCatalog] = useState([]); // merged species catalog with discovery info

  // === HEADER INFO ICON ===
  // Adds a clickable info icon to the screen header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Info', 'This is your discovered species catalog.')
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

  // === LOAD AND MERGE DISCOVERIES ===
  // Executes on screen focus to refresh discovered entries and update images and metadata
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; // prevents state update after unmount

      const loadCatalog = async () => {
        try {
          console.log('[MyOcedex] Loading discovered photo entries...');
          const discoveredEntries = await getDiscoveredPhotoEntries(); // load saved discoveries
          const discoveredMap = new Map(
            discoveredEntries.map(entry => [entry.scientificName, entry]),
          );

          // For each species in the catalog, check if it has been discovered
          const updatedCatalog = await Promise.all(
            speciesCatalog.map(async item => {
              const localEntry = discoveredMap.get(item.scientificName);
              let image = item.image;

              // If discovered, verify the file exists and replace the image
              if (localEntry) {
                const localPath = localEntry.imagePath;
                const fileExists = await RNFS.exists(localPath);
                if (fileExists) {
                  image = {uri: 'file://' + localPath};
                }
              }

              return {
                ...item,
                discovered: !!localEntry,
                image,
                timestamp: localEntry?.timestamp,
                depth: localEntry?.depth,
                temperature: localEntry?.temperature,
              };
            }),
          );

          // Commit result if still mounted
          if (isActive) {
            console.log('[MyOcedex] Catalog merged.');
            setMergedCatalog(updatedCatalog);
          }
        } catch (error) {
          console.error('[MyOcedex] Error loading catalog:', error);
        }
      };

      loadCatalog();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // === CARD PRESS HANDLER ===
  // On tap: navigates to species detail if discovered, else shows hint/target info
  const handlePress = item => {
    if (item.discovered) {
      navigation.navigate('SpeciesDetail', {
        scientificName: item.scientificName,
        name: item.name,
        description: item.description,
        image: item.image,
        timestamp: item.timestamp,
        depth: item.depth,
        temperature: item.temperature,
      });
    } else {
      Alert.alert(
        'Not yet discovered!',
        `Hint: ${item.hint}\nLocation: ${item.location}\nDepth: ${item.depth}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Renders the full list of species, including discovered and undiscovered */}
      <FlatList
        data={mergedCatalog}
        keyExtractor={item => item.scientificName}
        renderItem={({item, index}) => (
          <FishCard
            item={item}
            index={index}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
    padding: 10,
  },
});
