import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

export default function SpeechBubble({ message, themeColor = '#7BAF8E' }) {
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
        <View style={[styles.bubble, { borderColor: themeColor }]}>
          <Text style={styles.text}>{message}</Text>
        </View>
        <View style={[styles.arrow, { borderTopColor: themeColor }]} />
      </MotiView>
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  bubble: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
