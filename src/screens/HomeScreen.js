import React, { useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import * as Haptics from 'expo-haptics'
import { useInjections } from '../hooks/useInjections'

// Asset imports
import adiHappy from '../assets/character/adi-happy.png'
import adiNeutral from '../assets/character/adi-neutral.png'
import adiSad from '../assets/character/adi-sad.png'
import adiWaiting from '../assets/character/adi-waiting.png'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { streaks, characterState, loading, logInjection } = useInjections()
  
  // Character state to asset mapping
  const characterAssets = {
    happy: adiHappy,
    neutral: adiNeutral,
    sad: adiSad,
    waiting: adiWaiting,
  }

  // Mood-based background colors
  const bgColor = useMemo(() => {
    switch (characterState) {
      case 'happy': return '#E8F5E9' // Light green
      case 'sad': return '#E3F2FD' // Light blue/grey
      case 'neutral': return '#FFF8E1' // Light amber
      case 'waiting': return '#F3E5F5' // Light purple
      default: return '#F5F5F5'
    }
  }, [characterState])

  const handleLogShot = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    
    const today = new Date().toISOString().split('T')[0]
    const result = await logInjection({ scheduledFor: today })
    
    if (result && result.error === 'ALREADY_LOGGED') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      Alert.alert('Already Logged', 'You have already logged an injection for this week! Adi is well-fed.')
      return
    }

    if (result) {
      console.log('Injection logged successfully')
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Error', 'Failed to log injection. Please try again.')
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Loading Adi...</Text>
        </MotiView>
      </View>
    )
  }

  const nextDueDate = streaks.nextDue 
    ? new Date(streaks.nextDue).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
    : 'No due date'

  const getStatusMessage = () => {
    switch (characterState) {
      case 'happy': return 'Great job! Keep it up!'
      case 'neutral': return `Time for your shot on ${nextDueDate}`
      case 'sad': return `Overdue! Shot on ${nextDueDate}`
      case 'waiting': return 'Ready for your first shot?'
      default: return 'How are you today?'
    }
  }

  return (
    <MotiView 
      animate={{ backgroundColor: bgColor }}
      transition={{ type: 'timing', duration: 1000 }}
      style={styles.container}
    >
      {/* Top bar */}
      <View style={styles.header}>
        <Text style={styles.title}>Shotchi</Text>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            navigation.navigate('Settings')
          }}
        >
          <Text style={styles.settings}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Character display with Animations */}
      <View style={styles.characterContainer}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={characterState}
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, translateY: -20 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.characterWrapper}
          >
            {/* Idle Animation (Floating/Breathing) */}
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: characterState === 'happy' ? -15 : -8 }}
              transition={{
                type: 'timing',
                duration: characterState === 'happy' ? 800 : 2000,
                loop: true,
                repeatReverse: true,
              }}
            >
              <Image 
                source={characterAssets[characterState]} 
                style={[
                  styles.characterImage,
                  characterState === 'happy' && styles.happyImage
                ]} 
              />
              
              {/* Shadow animation */}
              <MotiView 
                from={{ scale: 1, opacity: 0.2 }}
                animate={{ 
                  scale: characterState === 'happy' ? 0.7 : 0.85, 
                  opacity: characterState === 'happy' ? 0.1 : 0.15 
                }}
                transition={{
                  type: 'timing',
                  duration: characterState === 'happy' ? 800 : 2000,
                  loop: true,
                  repeatReverse: true,
                }}
                style={styles.shadow}
              />
            </MotiView>
          </MotiView>
        </AnimatePresence>
      </View>

      {/* Status message */}
      <MotiView 
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        key={getStatusMessage()}
        style={styles.statusContainer}
      >
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
      </MotiView>

      {/* Streak info */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>🔥 {streaks.current} day streak</Text>
        <Text style={styles.bestStreakText}>Best: {streaks.longest} days</Text>
      </View>

      {/* Next due */}
      <View style={styles.dueContainer}>
        <Text style={styles.dueText}>Next shot: {nextDueDate}</Text>
      </View>

      {/* Log Shot CTA */}
      <TouchableOpacity 
        style={styles.logButton} 
        onPress={handleLogShot}
        activeOpacity={0.7}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: characterState === 'neutral' || characterState === 'sad' ? 1.05 : 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
          style={styles.logButtonInner}
        >
          <Text style={styles.logButtonText}>LOG SHOT</Text>
        </MotiView>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            navigation.navigate('History')
          }}
        >
          <Text style={styles.navText}>History 📊</Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7BAF8E',
    fontWeight: '600',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7BAF8E',
  },
  settings: {
    fontSize: 24,
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  happyImage: {
    // Add any specific style for happy state if needed
  },
  shadow: {
    width: 100,
    height: 15,
    backgroundColor: '#000',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: -10,
    zIndex: -1,
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  streakText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  bestStreakText: {
    fontSize: 14,
    color: '#999',
  },
  dueContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dueText: {
    fontSize: 16,
    color: '#666',
  },
  logButton: {
    marginBottom: 20,
  },
  logButtonInner: {
    backgroundColor: '#7BAF8E',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  navText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  })