import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppState } from '../context/AppStateContext';

export default function StatPill({ label, value, themeColor = '#7BAF8E' }) {
  const { settings } = useAppState();
  const isDark = settings?.darkMode;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? `${themeColor}30` : `${themeColor}20` }
    ]}>
      <Text style={[styles.value, { color: isDark ? 'white' : themeColor }]}>{value}</Text>
      <Text style={[styles.label, isDark && { color: '#aaa' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
