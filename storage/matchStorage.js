// File: utils/matchStorage.js
// Description:
//    This module matches unlogged photo discoveries against stored dive logs.
//    If a match is found within a ±2 second timestamp window, it updates the photo
//    with depth and temperature and flags it as logged.

import {
  getDiscoveredPhotoEntries,
  updateAllPhotoDiscoveries,
  getStoredDiveLogs,
} from './storage';

/**
 * Matches all unlogged photos with available dive logs.
 * A match is defined as having a timestamp within ±2 seconds.
 * If a match is found, depth and temperature are added to the photo entry,
 * and `isLogged` is set to true. The full list is then persisted back to storage.
 */
export async function matchPhotosToDiveLogs() {
  try {
    const photos = await getDiscoveredPhotoEntries();
    const logs = await getStoredDiveLogs();

    console.log('[MATCH] Matching started');
    console.log('[MATCH] Total photos:', photos.length);
    console.log('[MATCH] Total logs:', logs.length);

    const updated = photos.map(photo => {
      // Skip photos already logged
      if (photo.isLogged) return photo;

      // Try to find a matching timestamp in any dive log
      for (const log of logs) {
        const match = log.find(
          entry => Math.abs(entry.timestamp - photo.timestamp) <= 2,
        );
        if (match) {
          const updatedPhoto = {
            ...photo,
            depth: match.depth,
            temperature: match.temperature,
            isLogged: true,
          };
          console.log('[MATCH] Found match for timestamp:', photo.timestamp);
          console.log('[MATCH] Matched with log entry:', match);
          return updatedPhoto;
        }
      }

      // No match found, return unchanged photo
      return photo;
    });

    console.log('[MATCH] Final updated photos:', updated.length);
    await updateAllPhotoDiscoveries(updated);
  } catch (err) {
    console.error('[MATCH] Error matching photos to dive logs:', err);
  }
}
