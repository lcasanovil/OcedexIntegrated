/**
 * File: components/FishCard.js
 * Description:
 * This component renders a single species card for the MyOcedex catalog.
 * If the species has been discovered, it shows its name, image, and scientific name.
 * If not, it shows a placeholder image and "???" as the name.
 */

import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

// Main React component that renders each card
export default function FishCard({item, onPress, index}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageWrapper}>
        {/* Species image — discovered = real image, else show placeholder */}
        <Image
          source={
            item.discovered
              ? item.image
              : {uri: 'placeholder', bundle: 'drawable'}
          }
          style={styles.image}
        />

        {/* Number box with index like #001, #002, etc. */}
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>
            #{String(index + 1).padStart(3, '0')}
          </Text>
        </View>
      </View>

      {/* Info block with species name and scientific name */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.discovered ? item.name : '???'}</Text>
        <Text style={styles.scientific}>
          {item.discovered ? item.scientificName : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Styles for the card — similar to CSS, but JS object format
const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  imageWrapper: {
    position: 'relative', // allows positioning the number box
  },
  image: {
    width: '100%',
    height: 220,
  },
  numberBox: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0077cc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scientific: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 4,
  },
});
