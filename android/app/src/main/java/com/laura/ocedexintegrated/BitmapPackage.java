/**
 * File: BitmapPackage.java
 * Project: OcedexIntegrated (React Native)
 * Description:
 *  This file defines a custom ReactPackage that registers the native Java module
 *  BitmapModule with the React Native bridge. This enables JavaScript to invoke
 *  bitmap processing functions for image preprocessing tasks (e.g., resizing, normalization).
 * 
 * Author: Laura Casanovas
 * Created: June 2025
 * License: MIT or specify your license
 */

package com.laura.ocedexintegrated;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * BitmapPackage is a custom React Native package used to register native modules
 * written in Java with the React Native bridge.
 * 
 * This package specifically provides the BitmapModule, which allows Java code to process
 * images (e.g., resizing and converting bitmaps to normalized RGB arrays) and pass the
 * result back to the JavaScript layer of a React Native app.
 */
public class BitmapPackage implements ReactPackage {

    /**
     * Called by the React Native framework to collect the list of native modules
     * exposed by this package.
     *
     * @param reactContext The ReactApplicationContext provided by React Native.
     * @return A list containing all NativeModules in this package.
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        // Register the BitmapModule so it can be used from JavaScript
        modules.add(new BitmapModule(reactContext));
        return modules;
    }

    /**
     * Called by the React Native framework to collect view managers
     * (i.e., native UI components). This package does not provide any.
     *
     * @param reactContext The ReactApplicationContext provided by React Native.
     * @return An empty list, since no custom views are registered here.
     */
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
