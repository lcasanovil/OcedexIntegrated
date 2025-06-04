// File: src/model/predictor.js
// Description:
// Loads TensorFlow Lite model and performs image-based prediction of fish species.
// Handles confidence thresholds and returns results with optional confirmation logic.

import {loadTensorflowModel} from 'react-native-fast-tflite';
import {classLabels} from '../data/predictorLabels';

let model = null;

/**
 * Predicts fish species from an image using the TFLite model.
 * @param {string} uri - Image file path from gallery.
 * @param {object} BitmapModule - Native module to convert image to normalized pixel array.
 * @returns {Promise<object>} - Prediction object with species and optional confirmation.
 * Throws error if confidence is below 0.6.
 */
export async function predictSpeciesFromImage(uri, BitmapModule) {
  try {
    console.log('[Predict] Extracting normalized pixels...');
    const normalizedPixels = await BitmapModule.getNormalizedPixels(uri);

    // Load model if not already cached
    if (!model) {
      console.log('[Predict] Loading TFLite model...');
      model = await loadTensorflowModel({
        url: 'classification_model_5_species',
        isAsset: true,
      });
      console.log('[Predict] Model loaded successfully.');
    }

    // Prepare tensor input from pixel array
    const inputTensor = new Float32Array(normalizedPixels);
    const output = await model.run([inputTensor]);
    const preds = output[0]; // Prediction scores

    // Determine prediction with highest confidence
    let maxIndex = 0;
    let maxVal = preds[0];
    for (let i = 1; i < preds.length; i++) {
      if (preds[i] > maxVal) {
        maxVal = preds[i];
        maxIndex = i;
      }
    }

    const predictedLabel = classLabels[maxIndex];
    const confidence = maxVal;

    // Automatically accept high confidence predictions
    if (confidence >= 0.9) {
      console.log(
        `[Predict] High confidence: ${confidence.toFixed(
          2,
        )} - ${predictedLabel}`,
      );
      return {
        scientificName: predictedLabel,
        commonName: predictedLabel.replace('_', ' '),
        confidence,
        confirmationRequired: false,
      };
    }

    // Ask for user confirmation if confidence is moderate
    if (confidence >= 0.6) {
      console.warn(
        `[Predict] Medium confidence: ${confidence.toFixed(
          2,
        )} - ${predictedLabel}`,
      );
      return {
        scientificName: predictedLabel,
        commonName: predictedLabel.replace('_', ' '),
        confidence,
        confirmationRequired: true,
      };
    }

    // Reject predictions below threshold
    throw new Error(`Confidence too low: ${confidence.toFixed(2)}`);
  } catch (err) {
    console.error('[Predict] Error:', err);
    throw err;
  }
}
