// File: src/ble/bleClient.js
// Description:
// Bluetooth Low Energy (BLE) module that connects to the ESP32 device named "DiveLoggerESP32".
// It subscribes to dive log entries broadcast over BLE notifications in base64-encoded JSON lines.
// Each chunk is parsed, buffered, and accumulated into a structured dive log array,
// which is then saved locally and matched against previously stored photo timestamps.
//
// Dependencies:
// - react-native-ble-plx: BLE communication
// - buffer: to decode base64 strings into UTF-8 text
// - AsyncStorage via storage/storage
// - match logic via storage/matchStorage

import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {saveDiveLog} from '../../storage/storage';
import {matchPhotosToDiveLogs} from '../../storage/matchStorage';

// === Constants ===

// UUIDs for custom BLE service and characteristic (must match ESP32 definitions)
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// Target BLE device name advertised by ESP32
const DEVICE_NAME = 'DiveLoggerESP32';

// BLE manager instance for controlling scan, connect, and notification flow
const bleManager = new BleManager();

// In-memory buffer to accumulate fragmented JSON strings received from BLE
let buffer = [];

/**
 * Requests BLE + location permissions required on Android 12+.
 * On iOS, permissions are automatically handled by the system.
 */
async function requestPermissions() {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }
}

/**
 * Handles incoming BLE chunks, parsing complete JSON lines terminated by '\n'.
 * Buffers partial strings between messages until a full JSON object is received.
 *
 * @param {string} incomingChunk - UTF-8 string decoded from BLE base64 message.
 * @param {function} onParsedMessage - Callback triggered with each parsed JSON object.
 */
function handleBLEMessage(incomingChunk, onParsedMessage) {
  try {
    buffer += incomingChunk; // Append to buffer
    const split = buffer.split('\n'); // Split into complete lines
    for (let i = 0; i < split.length - 1; i++) {
      const line = split[i].trim();
      if (!line) continue;
      try {
        const parsed = JSON.parse(line);
        onParsedMessage(parsed);
      } catch (err) {
        console.error('[BLE] JSON parse error:', err, 'Line:', line);
      }
    }
    buffer = split[split.length - 1]; // Save trailing fragment
  } catch (err) {
    console.error('[BLE] BLE chunk handling failed:', err);
  }
}

/**
 * Initiates connection to DiveLoggerESP32, receives the dive log in real-time,
 * stores it locally, and matches it against stored photo timestamps.
 *
 * Uses monitor (subscription) pattern from BLE characteristic.
 * Auto-resolves once the final log entry (i == 166) is received.
 */
export async function connectAndSyncDiveLog() {
  let device;
  const log = [];

  return new Promise(async (resolve, reject) => {
    try {
      console.log('[BLE] Requesting permissions');
      await requestPermissions();

      console.log('[BLE] Scanning for DiveLoggerESP32...');
      // Start scanning for devices for up to 8 seconds
      device = await new Promise((resolveScan, rejectScan) => {
        const timeout = setTimeout(() => rejectScan('Scan timeout'), 8000);
        bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (error) {
            clearTimeout(timeout);
            rejectScan(error);
            return;
          }
          if (scannedDevice?.name === DEVICE_NAME) {
            clearTimeout(timeout);
            bleManager.stopDeviceScan();
            resolveScan(scannedDevice);
          }
        });
      });

      console.log(`[BLE] Connecting to ${device.name}...`);
      await device.connect(); // Establish connection
      await device.discoverAllServicesAndCharacteristics(); // Fetch UUIDs

      // Locate the custom service by partial UUID match
      const services = await device.services();
      const service = services.find(s =>
        s.uuid.toLowerCase().includes(SERVICE_UUID.slice(0, 8)),
      );
      if (!service) throw new Error('Dive service not found');

      // Locate characteristic used for notifications
      const characteristics = await device.characteristicsForService(
        service.uuid,
      );
      const charac = characteristics.find(c =>
        c.uuid.toLowerCase().includes(CHARACTERISTIC_UUID.slice(0, 8)),
      );
      if (!charac) throw new Error('Dive log characteristic not found');

      console.log('[BLE] Subscribing to dive log notifications...');

      // Subscribe to characteristic notifications (BLE event stream)
      await charac.monitor((err, characteristic) => {
        if (err) {
          console.error('[BLE] Notification error:', err);
          reject(err);
          return;
        }

        // Decode base64-encoded UTF-8 payload from ESP32
        const value = Buffer.from(characteristic.value, 'base64').toString(
          'utf8',
        );
        console.log('[BLE] Received chunk:', value);

        // Handle the incoming chunk, parse and accumulate JSON entries
        handleBLEMessage(value, parsed => {
          if ('i' in parsed) {
            log.push({
              index: parsed.i,
              pressure: parsed.p,
              temperature: parsed.t,
              depth: parsed.d,
              timestamp: parsed.ts,
            });

            console.log(
              `[BLE] Parsed i=${parsed.i} ts=${parsed.ts} log.length=${log.length}`,
            );

            // Resolve once final entry is received
            if (parsed.i === 166) {
              console.log('[BLE] Final entry received. Saving log...');
              saveDiveLog(log); // Persist in AsyncStorage
              matchPhotosToDiveLogs(); // Match to photo timestamps
              Alert.alert(
                'Dive Log Synced',
                'Log received and matched to photos.',
              );
              resolve();
            }
          }
        });
      });
    } catch (err) {
      console.error('[BLE] Sync failed:', err);
      reject(err);
    }
  });
}
