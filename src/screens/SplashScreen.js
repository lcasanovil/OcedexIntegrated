/**
 * File: screens/SplashScreen.js
 * Description:
 * Displays an animated splash screen when the app starts. It uses a background
 * color fade-in effect and a floating logo animation. After a delay, it calls
 * the provided `onFinish` callback to proceed to the next screen.
 */

import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, Easing, Image, StyleSheet} from 'react-native';

export default function SplashScreen({onFinish}) {
  // Animated value to interpolate background color
  const backgroundColor = useRef(new Animated.Value(0)).current;
  // Animated value to float the logo up and down
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate background color from light blue to dark blue
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Looping logo float animation (up and down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Timeout to end splash screen after 4 seconds
    const timer = setTimeout(() => {
      onFinish(); // Callback to parent (App) to transition screens
    }, 4000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Interpolate background color between two values
  const bgColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#b0c4de', '#4f6d7a'],
  });

  return (
    <Animated.View style={[styles.container, {backgroundColor: bgColor}]}>
      <Animated.Image
        source={{uri: 'logo_app_demo_1', scale: 1}} // Local image URI from assets
        style={[styles.logo, {transform: [{translateY: logoFloat}]}]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  logo: {
    width: 210,
    height: 200,
  },
});
