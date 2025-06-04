// File: src/screens/SpeciesDetailScreen.js
// Description:
// This screen displays detailed information about a discovered fish species,
// including image, common and scientific name, discovery metadata, and description.
// Accessed when the user taps a discovered species in the catalog.

import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function SpeciesDetailScreen({route}) {
  const navigation = useNavigation();

  // Destructure all route parameters passed from MyOcedexScreen
  const {
    scientificName,
    name,
    imageUri,
    timestamp,
    depth,
    temperature,
    discoverySite,
    description,
  } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display main species image */}
      <Image
        source={{uri: imageUri}}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* Species info card */}
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.scientificName}>{scientificName}</Text>

        {/* First row: Location and Timestamp */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Discovery Location</Text>
            <Text style={styles.statValue}>
              {discoverySite?.trim() || 'TBD'}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Discovery Time</Text>
            <Text style={styles.statValue}>
              {timestamp
                ? new Date(timestamp * 1000).toLocaleString()
                : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Second row: Depth and Temperature */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Discovery Depth</Text>
            <Text style={styles.statValue}>
              {typeof depth === 'number' ? `${depth.toFixed(1)} m` : 'Unknown'}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Discovery Temp</Text>
            <Text style={styles.statValue}>
              {typeof temperature === 'number'
                ? `${temperature.toFixed(1)} °C`
                : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Species description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            {description || 'No description available.'}
          </Text>
        </View>

        {/* Back button to return to MyOcedex */}
        <View style={{marginTop: 20}}>
          <Button title="Back to Catalog" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e9f0f7',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f4fa',
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },
  descriptionBox: {
    marginTop: 18,
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
  },
});
