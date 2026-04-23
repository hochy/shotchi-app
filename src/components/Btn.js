import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function Btn({ 
  children, 
  onPress, 
  color = '#7BAF8E', 
  outline = false, 
  full = false,
  style = {} 
}) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress && onPress();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: outline ? 'transparent' : color },
        outline && { borderWidth: 2, borderColor: color },
        full && { width: '100%' },
        !outline && styles.shadow,
        style
      ]}
    >
      <Text style={[
        styles.text,
        { color: outline ? color : 'white' }
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  }
});
