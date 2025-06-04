// File: utils/timestampManager.js
// Description: Manages assignment of mock timestamps to uploaded images.
// Ensures each mock timestamp is used once, tracking usage in memory.

import {MOCK_TIMESTAMPS} from './mockTimestamps';

let usedTimestamps = []; // in-memory tracking

/**
 * Returns the next mock timestamp in circular order.
 * Cycles through MOCK_TIMESTAMPS indefinitely.
 * @returns {number} timestamp
 */
export function getNextMockTimestamp() {
  const index = usedTimestamps.length % MOCK_TIMESTAMPS.length;
  const next = MOCK_TIMESTAMPS[index];
  usedTimestamps.push(next);
  return next;
}

/**
 * Resets the used timestamp list (useful in test mode).
 */
export function resetMockTimestamps() {
  usedTimestamps = [];
}

/**
 * Returns the full list of used timestamps so far.
 */
export function getUsedMockTimestamps() {
  return [...usedTimestamps];
}
