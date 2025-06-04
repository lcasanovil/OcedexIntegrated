// File: src/screens/SearchScreen.js
// Description:
// This screen allows the user to search for fish species or dive zones.
// Based on the selected mode, users can:
// - Search by species: see matching species and then dive zones where they appear
// - Search by zone: see matching dive sites and then fish species typically seen there

import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import speciesCatalog from '../data/speciesCatalog';
import diveSites from '../data/diveSites';
import {mockZonesBySpecies} from '../mock/mockZonesBySpecies';
import {mockSpeciesByZone} from '../mock/mockSpeciesByZone';

export default function SearchScreen({navigation}) {
  // === State ===
  const [mode, setMode] = useState('species'); // 'species' or 'zone'
  const [searchText, setSearchText] = useState(''); // search bar input
  const [selectedItem, setSelectedItem] = useState(null); // selected species or zone

  // === Header: info icon ===
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Info', 'Search species or dive sites by name.')
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

  // === Toggle Search Mode (species <-> zone) ===
  const handleToggle = newMode => {
    setMode(newMode);
    setSearchText('');
    setSelectedItem(null);
  };

  // === Filter species and dive zones by name ===
  const filteredSpecies = speciesCatalog.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const filteredZones = diveSites.filter(site =>
    site.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* === Toggle Buttons === */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === 'species' && styles.activeButton,
          ]}
          onPress={() => handleToggle('species')}>
          <Text style={styles.toggleText}>Search by Species</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'zone' && styles.activeButton]}
          onPress={() => handleToggle('zone')}>
          <Text style={styles.toggleText}>Search by Zone</Text>
        </TouchableOpacity>
      </View>

      {/* === Search by Species (Main List) === */}
      {mode === 'species' && selectedItem === null && (
        <View style={{flex: 1, padding: 20}}>
          <TextInput
            placeholder="Search species..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredSpecies}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.siteItem}
                onPress={() => setSelectedItem(item.name)}>
                <Text style={styles.siteName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* === Search by Species (Zones Appearing) === */}
      {mode === 'species' && selectedItem !== null && (
        <View style={{flex: 1, padding: 20}}>
          <TouchableOpacity
            style={styles.zoneButton}
            onPress={() => setSelectedItem(null)}>
            <Text style={styles.zoneButtonText}>← Back to Species</Text>
          </TouchableOpacity>
          <FlatList
            data={mockZonesBySpecies[selectedItem] || []}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.siteItem}
                onPress={() => {
                  if (item.name === 'Nusa Penida') {
                    navigation.navigate('Map'); // only Nusa Penida has navigation
                  }
                }}>
                <Text style={styles.siteName}>{item.name}</Text>
                <Text style={styles.siteLocation}>{item.location}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* === Search by Zone (Main List) === */}
      {mode === 'zone' && selectedItem === null && (
        <View style={{flex: 1, padding: 20}}>
          <TextInput
            placeholder="Search dive site..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredZones}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.siteItem}
                onPress={() => setSelectedItem(item.name)}>
                <Text style={styles.siteName}>{item.name}</Text>
                <Text style={styles.siteLocation}>{item.location}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* === Search by Zone (Species Found There) === */}
      {mode === 'zone' && selectedItem !== null && (
        <View style={{flex: 1, padding: 20}}>
          <TouchableOpacity
            style={styles.zoneButton}
            onPress={() => {
              setSelectedItem(null);
              setMode('zone');
            }}>
            <Text style={styles.zoneButtonText}>← Back to Dive Sites</Text>
          </TouchableOpacity>
          <FlatList
            data={mockSpeciesByZone[selectedItem] || []}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.zoneSpeciesCard}>
                <Image
                  source={item.image}
                  style={{width: 80, height: 80, borderRadius: 8}}
                />
                <Text style={{marginLeft: 10, fontSize: 16}}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#eef'},

  // Toggle (top bar)
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  toggleButton: {padding: 10, marginHorizontal: 10},
  activeButton: {borderBottomWidth: 2, borderColor: '#007AFF'},
  toggleText: {fontSize: 16, fontWeight: '600'},

  // Search bar
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  // List items (site or species name)
  siteItem: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  siteName: {fontSize: 18, fontWeight: '500'},
  siteLocation: {fontSize: 14, color: '#666'},

  // Back button for detail views
  zoneButton: {marginBottom: 10},
  zoneButtonText: {fontSize: 16, color: '#007AFF'},

  // Card layout for species in a zone
  zoneSpeciesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
