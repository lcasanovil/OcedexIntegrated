// File: src/screens/UploadScreen.js
// Description:
// Manages photo selection from gallery, performs species prediction using TFLite,
// handles low-confidence confirmation modal, BLE dive log syncing, and
// updates persistent discovery state with timestamp matching.

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeModules} from 'react-native';
import {predictSpeciesFromImage} from '../model/predictor';
import {getNextMockTimestamp} from '../mock/mockTimestampManager';
import {matchPhotosToDiveLogs} from '../../storage/matchStorage';
import {
  saveImageWithScientificName,
  savePhotoDiscovery,
  getStoredDiveLogs,
} from '../../storage/storage';
import {connectAndSyncDiveLog} from '../ble/bleClient';

const {BitmapModule} = NativeModules;

export default function UploadScreen() {
  const [image, setImage] = useState(null); // holds current image URI
  const [loading, setLoading] = useState(false); // global UI loading state
  const [confirmationVisible, setConfirmationVisible] = useState(false); // modal control
  const [pendingPrediction, setPendingPrediction] = useState(null); // stores low-confidence predictions temporarily
  const navigation = useNavigation();

  // === PHOTO UPLOAD ===
  // Triggered when user presses "Choose from Gallery" button
  const pickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 224,
        height: 224,
        compressImageQuality: 1,
      });

      if (result.path) {
        setImage(result.path);
        // call prediction handler
        await handlePrediction(result.path);
      }
    } catch (err) {
      console.error('[Picker] Error:', err);
      Alert.alert('Image Error', 'Could not pick image.');
    }
  };

  // === SPECIES PREDICTION ===
  // Responsible for prediction and subsequent branching
  const handlePrediction = async imagePath => {
    setLoading(true);
    try {
      // Assign next available mock timestamp
      const timestamp = getNextMockTimestamp();
      if (!timestamp) throw new Error('No mock timestamps left');

      console.log(`[Discovery] Timestamp: ${timestamp}`);

      // Run TFLite prediction on image (via native module)
      const prediction = await predictSpeciesFromImage(imagePath, BitmapModule);

      const confidencePercent = (prediction.confidence * 100).toFixed(2);
      prediction.confidencePercent = confidencePercent;

      // Branch logic depending on confidence
      if (prediction.confirmationRequired) {
        // If prediction is low confidence, ask user for confirmation
        setPendingPrediction({imagePath, prediction, timestamp});
        setConfirmationVisible(true);
        return;
      }

      // Save image and discovery directly if confidence is high
      await saveConfirmedDiscovery(imagePath, prediction, timestamp);
    } catch (err) {
      console.error('[Predict] Pipeline error:', err);
      setImage(null); // reset image
      Alert.alert('Prediction Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // === STORE CONFIRMED DISCOVERY ===
  // Saves image to file system, registers discovery, and optionally matches with log
  const saveConfirmedDiscovery = async (imagePath, prediction, timestamp) => {
    // Save image file with scientific name for organization
    const savedPath = await saveImageWithScientificName(
      imagePath,
      prediction.scientificName,
    );

    const discovery = {
      imagePath: 'file://' + savedPath,
      scientificName: prediction.scientificName,
      timestamp,
      isLogged: false, // updated to true later if matched with a dive log
    };

    // Save discovery to persistent AsyncStorage
    await savePhotoDiscovery(discovery);
    console.log('[Discovery] Saved discovery');

    // Immediately attempt to match this discovery with any existing dive logs
    const logs = await getStoredDiveLogs();
    if (logs.length > 0) {
      console.log('[Discovery] Matching with logs...');
      await matchPhotosToDiveLogs();
    }

    // Notify user of successful discovery
    Alert.alert(
      'New species discovered!',
      `You found: ${prediction.commonName}.\n(${prediction.confidencePercent}% confidence)`,
    );

    // Cleanup and navigate to discovery catalog
    setImage(null);
    navigation.navigate('MyOcedex');
  };

  // === CONFIRMATION: USER ACCEPTS LOW CONFIDENCE PREDICTION ===
  const handleConfirmYes = async () => {
    if (!pendingPrediction) return;

    const {imagePath, prediction, timestamp} = pendingPrediction;
    setConfirmationVisible(false);
    setPendingPrediction(null);
    setLoading(true);
    try {
      await saveConfirmedDiscovery(imagePath, prediction, timestamp);
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setLoading(false);
      setImage(null); // prevent stale image state
    }
  };

  // === CONFIRMATION: USER REJECTS LOW CONFIDENCE PREDICTION ===
  const handleConfirmNo = () => {
    setConfirmationVisible(false);
    setPendingPrediction(null);
    setImage(null); // allow retry
  };

  // === DIVE LOG UPLOAD ===
  // Called when user wants to sync new dive log via BLE
  const handleUploadDiveLog = async () => {
    setLoading(true);
    try {
      console.log('[BLE] Starting dive log sync...');
      await connectAndSyncDiveLog();

      // Small wait to ensure data is persisted
      console.log('[BLE] Waiting for log to persist...');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Re-run matcher logic to update any previous discoveries
      console.log('[BLE] Running matchPhotosToDiveLogs after new log sync...');
      await matchPhotosToDiveLogs();
    } catch (err) {
      console.error('[BLE] Sync error:', err);
      Alert.alert('Sync Failed', err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Trigger photo picker */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>

      {/* Trigger BLE log sync */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#34a853'}]}
        onPress={handleUploadDiveLog}>
        <Text style={styles.buttonText}>Upload Dive Log</Text>
      </TouchableOpacity>

      {/* Show loading overlay while prediction or sync is active */}
      {loading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </Modal>
      )}

      {/* Modal for low-confidence prediction confirmation */}
      {confirmationVisible && pendingPrediction && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Low Prediction Confidence</Text>
              <Text style={styles.modalText}>
                Confidence: {pendingPrediction.prediction.confidencePercent}%
              </Text>
              <Text style={styles.modalText}>
                It looks like a {pendingPrediction.prediction.commonName}.
              </Text>
              <Text style={styles.modalText}>Upload anyway?</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: '#007AFF'}]}
                  onPress={handleConfirmYes}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                  onPress={handleConfirmNo}>
                  <Text style={[styles.buttonText, {color: '#333'}]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Image preview (only when selected and not loading) */}
      {image && !loading && (
        <Image source={{uri: image}} style={styles.preview} />
      )}
    </View>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef',
  },
  preview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    maxWidth: 130,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
