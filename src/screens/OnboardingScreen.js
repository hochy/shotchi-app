import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { supabase } from '../lib/supabase'

export default function OnboardingScreen({ navigation, route }) {
  const { userId } = route.params || {}
  const [step, setStep] = useState(1) // 1: day, 2: time, 3: done
  const [injectionDay, setInjectionDay] = useState('monday')
  const [reminderTime, setReminderTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  const injectionDays = [
    { label: 'Mon', value: 'monday' },
    { label: 'Tue', value: 'tuesday' },
    { label: 'Wed', value: 'wednesday' },
    { label: 'Thu', value: 'thursday' },
    { label: 'Fri', value: 'friday' },
    { label: 'Sat', value: 'saturday' },
    { label: 'Sun', value: 'sunday' },
  ]

  const handleNext = async () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      await saveSettings()
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const hours = reminderTime.getHours().toString().padStart(2, '0')
      const minutes = reminderTime.getMinutes().toString().padStart(2, '0')
      const timeString = `${hours}:${minutes}`

      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          injection_day: injectionDay,
          reminder_time: timeString,
          timezone: timezone
        })
        .eq('id', userId)

      if (error) throw error

      setStep(3)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }]
    })
  }

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What day do you take your shot?</Text>
      <Text style={styles.stepSubtitle}>Select your weekly injection day</Text>

      <View style={styles.daysContainer}>
        {injectionDays.map(day => (
          <TouchableOpacity
            key={day.value}
            style={[
              styles.dayButton,
              injectionDay === day.value && styles.dayButtonSelected
            ]}
            onPress={() => setInjectionDay(day.value)}
          >
            <Text style={[
              styles.dayText,
              injectionDay === day.value && styles.dayTextSelected
            ]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>When should we remind you?</Text>
      <Text style={styles.stepSubtitle}>Set your reminder time</Text>

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timeText}>
          {reminderTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={reminderTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false)
            if (date) setReminderTime(date)
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.nextButton, loading && styles.nextButtonLoading]}
        onPress={handleNext}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? 'Saving...' : 'Complete Setup'}
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successIcon}>
        <Text style={styles.successEmoji}>✅</Text>
      </View>

      <Text style={styles.stepTitle}>You're all set!</Text>
      <Text style={styles.stepSubtitle}>
        Your first reminder is scheduled for{'\n'}
        {injectionDay.charAt(0).toUpperCase() + injectionDay.slice(1)} at{' '}
        {reminderTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}
      </Text>

      <TouchableOpacity style={styles.nextButton} onPress={handleDone}>
        <Text style={styles.nextButtonText}>Let's Go!</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Shotchi!</Text>
        {step < 3 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7BAF8E',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  progressDotActive: {
    backgroundColor: '#7BAF8E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#7BAF8E',
    borderColor: '#7BAF8E',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dayTextSelected: {
    color: 'white',
  },
  timeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#7BAF8E',
    marginBottom: 40,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#7BAF8E',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 30,
  },
  nextButtonLoading: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successIcon: {
    marginBottom: 30,
  },
  successEmoji: {
    fontSize: 80,
  },
})