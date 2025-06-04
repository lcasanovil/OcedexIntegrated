// File: src/storage/storage.js
// Description:
//    Centralized storage module for Ocedex app.
//    Handles: local image file saving, AsyncStorage of photo discoveries and dive logs.
//    This simplifies the app structure by consolidating all persistent storage logic.

import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// === Constants for AsyncStorage Keys === //
const DISCOVERY_KEY = 'DISCOVERED_PHOTO_ENTRIES';
const DIVE_LOGS_KEY = 'DIVE_LOGS_MAX2';

// ========================================
// === File System Operations
// ========================================

/**
 * Saves an image under a filename that includes the scientific name and timestamp.
 * Stored in the app's document directory.
 * @param {string} uri - Temporary image path
 * @param {string} scientificName - Predicted species scientific name
 * @returns {Promise<string|null>} - New file path or null if error
 */
export async function saveImageWithScientificName(uri, scientificName) {
  try {
    const safeName = scientificName.replace(/\s+/g, '_');
    const timestamp = Date.now();
    const fileName = `${safeName}_${timestamp}.jpg`;
    const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.copyFile(uri, newPath);
    console.log(`[FileSystem] Saved image to: ${newPath}`);
    return newPath;
  } catch (error) {
    console.error('[FileSystem] Error saving image:', error);
    return null;
  }
}

/**
 * Deletes all files inside the document directory (used on reset).
 */
export async function clearAllImageFiles() {
  try {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    for (const file of files) {
      await RNFS.unlink(file.path);
    }
    console.log('[FileSystem] Cleared all saved images');
  } catch (error) {
    console.error('[FileSystem] Error clearing images:', error);
  }
}

// ========================================
// === Photo Discovery Operations
// ========================================

/**
 * Retrieves all photo discoveries with metadata (scientificName, imagePath, timestamp, etc).
 * @returns {Promise<Array>} List of photo entries
 */
export async function getDiscoveredPhotoEntries() {
  try {
    const data = await AsyncStorage.getItem(DISCOVERY_KEY);
    const parsed = data ? JSON.parse(data) : [];
    console.log('[STORAGE] Loaded photo entries:', parsed.length);
    return parsed;
  } catch (err) {
    console.error('[STORAGE] Error reading discoveries:', err);
    return [];
  }
}

/**
 * Appends a new discovery entry to AsyncStorage.
 * @param {Object} entry - Contains imagePath, scientificName, timestamp, isLogged, etc.
 */
export async function savePhotoDiscovery(entry) {
  try {
    const current = await getDiscoveredPhotoEntries();
    current.push(entry);
    await AsyncStorage.setItem(DISCOVERY_KEY, JSON.stringify(current));
    console.log('[STORAGE] Saved photo discovery:', entry);
  } catch (err) {
    console.error('[STORAGE] Error saving photo discovery:', err);
  }
}

/**
 * Overwrites all discovery entries (used after log matching).
 * @param {Array} entries - Updated photo entries list
 */
export async function updateAllPhotoDiscoveries(entries) {
  try {
    await AsyncStorage.setItem(DISCOVERY_KEY, JSON.stringify(entries));
    console.log(
      '[STORAGE] Updated all photo discoveries. Count:',
      entries.length,
    );
  } catch (err) {
    console.error('[STORAGE] Error updating photo discoveries:', err);
  }
}

/**
 * Clears all discoveries from AsyncStorage.
 */
export async function clearPhotoDiscoveries() {
  try {
    await AsyncStorage.removeItem(DISCOVERY_KEY);
    console.log('[STORAGE] Cleared all photo discoveries');
  } catch (err) {
    console.error('[STORAGE] Error clearing discoveries:', err);
  }
}

// ========================================
// === Dive Log Operations
// ========================================

/**
 * Retrieves all dive logs (up to 2 max logs, each an array of 720 entries).
 * @returns {Promise<Array>} List of logs
 */
export async function getStoredDiveLogs() {
  try {
    const data = await AsyncStorage.getItem(DIVE_LOGS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    console.log('[STORAGE] Loaded dive logs. Count:', parsed.length);
    return parsed;
  } catch (err) {
    console.error('[STORAGE] Error reading dive logs:', err);
    return [];
  }
}

/**
 * Adds a new dive log using FIFO (only keeps the 2 most recent logs).
 * @param {Array} newLog - Array of dive entries (timestamp, depth, temp)
 */
export async function saveDiveLog(newLog) {
  try {
    let logs = await getStoredDiveLogs();
    if (logs.length >= 2) logs.shift();
    logs.push(newLog);
    await AsyncStorage.setItem(DIVE_LOGS_KEY, JSON.stringify(logs));
    console.log('[STORAGE] Saved new dive log. Total logs:', logs.length);
  } catch (err) {
    console.error('[STORAGE] Error saving dive log:', err);
  }
}

/**
 * Clears all dive logs (used in reset or debug).
 */
export async function clearDiveLogs() {
  try {
    await AsyncStorage.removeItem(DIVE_LOGS_KEY);
    console.log('[STORAGE] Cleared all dive logs');
  } catch (err) {
    console.error('[STORAGE] Error clearing dive logs:', err);
  }
}
