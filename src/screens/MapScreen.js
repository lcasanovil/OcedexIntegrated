// File: src/screens/MapScreen.js
// Description:
// Displays an interactive map of dive sites using Leaflet.js rendered inside a WebView.
// The map is defined in an external HTML string (leafletHtml) and embedded via WebView.

import React from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import leafletHtml from '../data/mapHtml'; // HTML string that contains Leaflet map setup

export default function MapScreen({navigation}) {
  // === Add info icon to header bar ===
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Info', 'This map shows available dive sites.')
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

  return (
    <View style={styles.container}>
      {/* Renders HTML content using WebView. 
          This HTML includes a Leaflet map centered on dive locations. */}
      <WebView
        originWhitelist={['*']} // Allows loading any local HTML content
        source={{html: leafletHtml}} // Load Leaflet map HTML from local variable
        style={{flex: 1}} // Full screen height/width
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full height container
  },
});
