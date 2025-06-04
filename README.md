## OcedexIntegrated

    OcedexIntegrated is a React Native mobile application for offline fish species recognition using TensorFlow Lite. It supports optional Bluetooth synchronization with an ESP32-based dive computer, enabling users to associate photographic observations with timestamped dive log data.

    ## Features

    - Offline image-based fish species classification
    - Personal species catalog with discovery tracking
    - Dive site and species search functionalities
    - Interactive dive site map (Leaflet-based WebView)
    - Bluetooth Low Energy (BLE) connection to ESP32 for log synchronization
    - Persistent local storage for logs, photos, and user data

    ## Project Structure

    ```
    OcedexIntegrated/
    ├── android/                # Native Android configuration and Java modules
    ├── ios/                    # iOS placeholder (unused)
    ├── src/
    │   ├── screens/            # UI components and navigation
    │   ├── ble/                # BLE communication and parsing logic
    │   ├── storage/            # Storage, matching, and data handling
    │   ├── data/               # Static catalogs, info texts, HTML assets
    │   ├── mock/               # Mock logic for fallback and testing
    │   └── utils/              # Utilities (e.g., first-launch reset)
    ├── App.tsx                # Entry point with bottom tab navigation
    ├── README.md
    └── ...
    ```

    ## Build and Deployment

    This project is intended for Android and uses a Bare React Native workflow.

    ### Prerequisites

    - Node.js and Yarn
    - Java Development Kit (JDK 17)
    - Android SDK and NDK (via Android Studio or CLI tools)
    - Physical Android device for testing (recommended)
    - ADB access from Windows (for APK installation)
    - WSL2 (Ubuntu) for compiling the Android project

    ### Installation Steps

    ```bash
    # From WSL
    yarn install
    cd android
    ./gradlew clean assembleRelease
    ```

    ```powershell
    # From Windows
    adb install -r android\\app\\build\\outputs\\apk\\release\\app-release.apk
    ```

    ## Native Modules

    ### BitmapModule (Java)
    - Loads image URI as a bitmap
    - Resizes to 224×224 pixels
    - Extracts normalized RGB data
    - Returns the data to JavaScript for TensorFlow Lite inference

    ### BLE Integration
    - Uses `react-native-ble-plx`
    - Connects to ESP32 advertising as `DiveLoggerESP32`
    - Receives chunked JSON dive logs via BLE notifications
    - Logs are stored and matched to photo timestamps

    ## Libraries and Dependencies

    - `react-native-fast-tflite` – model loading and inference
    - `react-native-image-crop-picker` – image selection and preprocessing
    - `react-native-ble-plx` – BLE communication with the ESP32
    - `react-native-webview` – map integration with Leaflet
    - `@react-navigation/native` – navigation container
    - `@react-navigation/bottom-tabs` – tab-based navigation
    - `@react-native-async-storage/async-storage` – persistent storage

    ## Development Notes

    - Image prediction is based on a `.tflite` model using EfficientNet-B0 architecture
    - Matching logic cross-references prediction timestamps with dive log entries
    - App logic is modular and organized by domain (BLE, storage, screens, etc.)
    - Gradle is used for all builds; Metro and Expo are not part of this workflow

    ## Author

    This application was developed by Laura Casanovas as part of a final engineering project focused on real-time species identification and system integration with embedded logging devices.

    ## License

    All rights reserved. For academic or research collaboration, contact the author.
