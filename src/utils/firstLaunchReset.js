// File: src/utils/firstLaunchReset.js
// Description:
// Handles one-time application reset logic upon first install or launch.
// Clears AsyncStorage, resets photo discoveries and mock timestamps,
// and flags the app as launched. Reusable by both App and Profile screens.

import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearPhotoDiscoveries, clearDiveLogs} from '../../storage/storage';
import {resetMockTimestamps} from '../mock/mockTimestampManager';

const FIRST_LAUNCH_KEY = 'FIRST_LAUNCH_DONE';

/**
 * Executes full reset only if the app is launched for the first time.
 * Scope tag is used for clearer logging from different call sites.
 * @param {string} scope - Tag to identify where the reset is triggered from
 */
export async function runFirstLaunchReset(scope = '[Startup]') {
  try {
    const flag = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    if (!flag) {
      console.log(`${scope} First launch detected. Resetting...`);

      // Clear all async storage
      await AsyncStorage.clear();

      // Remove previous discoveries and dive logs
      await clearPhotoDiscoveries();
      await clearDiveLogs();

      // Reset mock timestamp logic (mock mode only)
      resetMockTimestamps();

      // Mark first launch complete
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    } else {
      console.log(`${scope} Not first launch. Skipping reset.`);
    }
  } catch (err) {
    console.error(`${scope} Error during reset:`, err);
  }
}
