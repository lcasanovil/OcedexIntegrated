# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# Keep BLEManager class and its members
-keep class it.innove.** { *; }

# Keep React Native BLE Manager package
-keep class com.polidea.** { *; }

# Keep BLE callbacks
-keepclassmembers class * {
    @android.bluetooth.BluetoothGattCallback *;
}
-keep class android.bluetooth.** { *; }

# Keep JSON parsing (used in dive log BLE messages)
-keep class org.json.** { *; }
-dontwarn org.json.**
