import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useInjections } from '../hooks/useInjections'

// Asset imports - easy to replace by swapping files in assets/ folder
import adiHappy from '../assets/character/adi-happy.png'
import adiNeutral from '../assets/character/adi-neutral.png'
import adiSad from '../assets/character/adi-sad.png'
import adiWaiting from '../assets/character/adi-waiting.png'

export default function HomeScreen({ navigation }) {
  const { streaks, characterState, loading, logInjection } = useInjections()
  
  // Character state to asset mapping
  const characterAssets = {
    happy: adiHappy,
    neutral: adiNeutral,
    sad: adiSad,
    waiting: adiWaiting,
  }

  const handleLogShot = async () => {
    const today = new Date().toISOString().split('T')[0]
    const success = await logInjection(today)
    
    if (success) {
      // Success feedback
      console.log('Injection logged successfully')
      // Navigation happens in LogShot screen
    } else {
      console.error('Failed to log injection')
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  // Format next due date
  const nextDueDate = streaks.nextDue 
    ? new Date(streaks.nextDue).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
    : 'No due date'

  // Status message based on character state
  const getStatusMessage = () => {
    switch (characterState) {
      case 'happy':
        return 'Great job! Keep it up!'
      case 'neutral':
        return `Time for your shot on ${nextDueDate}`
      case 'sad':
        return `Overdue! Shot on ${nextDueDate}`
      case 'waiting':
        return 'Ready for your first shot?'
      default:
        return 'You\'re on day 1!'
    }
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.header}>
        <Text style={styles.title}>Shotchi</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settings}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Character display */}
      <View style={styles.characterContainer}>
        <Image source={characterAssets[characterState]} style={styles.characterImage} />
      </View>

      {/* Status message */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
      </View>

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
      <TouchableOpacity style={styles.logButton} onPress={handleLogShot}>
        <Text style={styles.logButtonText}>LOG SHOT</Text>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.navText}>History 📊</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
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
  },
  characterImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  streakText: {
    fontSize: 18,
    color: '#666',
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
    backgroundColor: '#7BAF8E',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  logButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navText: {
    fontSize: 16,
    color: '#666',
  },
})