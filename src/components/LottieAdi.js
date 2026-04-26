import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * A drop-in replacement for Adi that uses high-quality Lottie JSON animations.
 */
export default function LottieAdi({ 
  animationName = 'happy-blob', 
  size = 200, 
  loop = true,
  themeColor = '#7BAF8E'
}) {
  const animation = useRef(null);

  // Note: To use this, you must download a .json file from LottieFiles 
  // and place it in assets/animations/
  
  // We'll use a placeholder for now until you drop in your first file
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: themeColor, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
        Lottie Ready!{'\n'}Drop JSON in{'\n'}assets/animations/
      </Text>
      
      {/* 
      Once you have a file, uncomment this:
      <LottieView
        autoPlay
        ref={animation}
        style={{ width: size, height: size }}
        source={require('../../assets/animations/your-file.json')}
        colorFilters={[
          { keypath: "body", color: themeColor } // Allows Adi's body to stay themed!
        ]}
      /> 
      */}
    </View>
  );
}
