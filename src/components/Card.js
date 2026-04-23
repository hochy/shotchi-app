import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppState } from '../context/AppStateContext';

export default function Card({ children, style }) {
  const { settings } = useAppState();
  const isDark = settings?.darkMode;

  return (
    <View style={[
      styles.card, 
      isDark ? styles.cardDark : styles.cardLight,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowRadius: 10,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: 'white',
    shadowOpacity: 0.05,
  },
  cardDark: {
    backgroundColor: '#1c1c1e',
    shadowOpacity: 0.2,
    borderWidth: 1,
    borderColor: '#333',
  },
});
