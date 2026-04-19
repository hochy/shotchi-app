import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import ConfettiCannon from 'react-native-confetti-cannon'
import * as Haptics from 'expo-haptics'

const { width, height } = Dimensions.get('window')

export default function CelebrationModal({ visible, milestone, onDismiss }) {
  const confettiRef = useRef(null)

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      // Small delay to let the modal open before firing confetti
      setTimeout(() => {
        confettiRef.current?.start()
      }, 500)
    }
  }, [visible])

  const getMilestoneText = () => {
    switch (milestone) {
      case 4: return "1 Month Streak! You're glowing!"
      case 12: return "3 Months! Adi is so proud of you!"
      case 26: return "6 Months! A true health warrior!"
      case 52: return "1 YEAR! You are absolutely incredible!"
      default: return `${milestone} Weeks! Keep it up!`
    }
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          style={styles.container}
        >
          <Text style={styles.emoji}>✨🥳✨</Text>
          <Text style={styles.title}>Milestone Reached!</Text>
          <Text style={styles.message}>{getMilestoneText()}</Text>
          
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Adi Rocks!</Text>
          </TouchableOpacity>
        </MotiView>
        
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: width / 2, y: height }}
          autoStart={false}
          fadeOut={true}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#7BAF8E',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
