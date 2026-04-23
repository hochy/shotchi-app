import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

export default function SpeechBubble({ message, themeColor = '#7BAF8E' }) {
  if (!message) return null;

  return (
    <AnimatePresence exitBeforeEnter>
      <MotiView
        key={message}
        from={{ opacity: 0, scale: 0.5, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ opacity: 0, scale: 0.5, translateY: 10 }}
        transition={{ type: 'spring', damping: 15 }}
        style={styles.container}
      >
        <View style={styles.bubble}>
          <Text style={styles.text}>{message}</Text>
        </View>
        <View style={styles.arrow} />
      </MotiView>
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  bubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '800',
    textAlign: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    marginTop: -1,
  },
});
