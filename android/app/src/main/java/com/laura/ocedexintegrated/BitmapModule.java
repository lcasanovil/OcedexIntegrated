// File: android/app/src/main/java/com/laura/ocedexintegrated/BitmapModule.java
// Description:
// Native Java module for React Native to load an image from a URI,
// resize it to 224x224, extract pixel RGB values, normalize them to [0,1],
// and return the data as a JS-compatible array.
// This module is designed to prepare image input for a TensorFlow Lite model.
// Author: Ocedex Integrated App
// Dependencies: Android Bitmap API, React Native Bridge

package com.laura.ocedexintegrated;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.io.InputStream;

public class BitmapModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public BitmapModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    // Expose this module to JavaScript as 'BitmapModule'
    @Override
    public String getName() {
        return "BitmapModule";
    }

    /**
     * Converts an image URI to a normalized RGB float array (224x224).
     * Each pixel is represented as 3 floats (R, G, B) normalized to [0, 1].
     * Returns a 1D array of floats as a WritableArray to JS.
     *
     * @param imageUri - The URI string of the image (e.g., from ImagePicker)
     * @param promise - The JS promise to resolve with the float array
     */
    @ReactMethod
    public void getNormalizedPixels(String imageUri, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri uri = Uri.parse(imageUri);

            // Decode image from content URI
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            Bitmap originalBitmap = BitmapFactory.decodeStream(inputStream);
            inputStream.close();

            // Resize image to 224x224 for TFLite input
            Bitmap resizedBitmap = Bitmap.createScaledBitmap(originalBitmap, 224, 224, true);
            int width = resizedBitmap.getWidth();
            int height = resizedBitmap.getHeight();

            // Get raw pixels (as ARGB integers)
            int[] pixels = new int[width * height];
            resizedBitmap.getPixels(pixels, 0, width, 0, 0, width, height);

            // Convert to normalized RGB float array
            float[] normalizedPixels = new float[width * height * 3];
            for (int i = 0; i < pixels.length; i++) {
                int pixel = pixels[i];
                float r = ((pixel >> 16) & 0xff) / 255.0f;
                float g = ((pixel >> 8) & 0xff) / 255.0f;
                float b = (pixel & 0xff) / 255.0f;
                int baseIndex = i * 3;
                normalizedPixels[baseIndex] = r;
                normalizedPixels[baseIndex + 1] = g;
                normalizedPixels[baseIndex + 2] = b;
            }

            // Convert float[] to WritableArray (JS can't receive float[])
            WritableArray array = new WritableNativeArray();
            for (float f : normalizedPixels) {
                array.pushDouble(f); // Send as double to JS
            }

            promise.resolve(array);

        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
}
