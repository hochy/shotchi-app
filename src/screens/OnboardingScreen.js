import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAppState } from '../context/AppStateContext'
import * as Haptics from 'expo-haptics'

export default function OnboardingScreen({ navigation }) {
  const { updateSettings } = useAppState()
  const [step, setStep] = useState(1)
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
    Haptics.selectionAsync()
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
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

      // Use the centralized updateSettings which now handles notification scheduling
      await updateSettings({
        injection_day: injectionDay,
        reminder_time: timeString,
        timezone: timezone,
        has_completed_onboarding: true,
        notifications_enabled: true
      })

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setStep(3)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // No need to reset navigation manually, AppStateContext will detect hasCompletedOnboarding
    // and AppNavigator will automatically switch to the main stack.
  }

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pick your shot day</Text>
      <Text style={styles.stepSubtitle}>Consistency is key for Adi's happiness!</Text>

      <View style={styles.daysContainer}>
        {injectionDays.map(day => (
          <TouchableOpacity
            key={day.value}
            style={[styles.dayButton, injectionDay === day.value && styles.dayButtonSelected]}
            onPress={() => setInjectionDay(day.value)}
          >
            <Text style={[styles.dayText, injectionDay === day.value && styles.dayTextSelected]}>
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
      <Text style={styles.stepTitle}>What time?</Text>
      <Text style={styles.stepSubtitle}>We'll send a nudge so you never miss it.</Text>

      <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.timeText}>
          {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={false}
          onChange={(e, date) => {
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
        <Text style={styles.nextButtonText}>{loading ? 'Saving...' : 'Complete Setup'}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.successEmoji}>✨</Text>
      <Text style={styles.stepTitle}>Perfect!</Text>
      <Text style={styles.stepSubtitle}>Adi is so excited to meet you.</Text>
      <TouchableOpacity style={styles.nextButton} onPress={handleDone}>
        <Text style={styles.nextButtonText}>Start Journey</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shotchi</Text>
        {step < 3 && <Text style={styles.stepIndicator}>Step {step} of 2</Text>}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { paddingTop: 80, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#7BAF8E' },
  stepIndicator: { marginTop: 10, color: '#999', fontWeight: '600' },
  content: { padding: 40, alignItems: 'center' },
  stepContainer: { width: '100%', alignItems: 'center' },
  stepTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  stepSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 },
  dayButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  dayButtonSelected: { backgroundColor: '#7BAF8E' },
  dayText: { fontWeight: 'bold' },
  dayTextSelected: { color: 'white' },
  timeButton: { padding: 20, backgroundColor: '#f5f5f5', borderRadius: 20, marginBottom: 40 },
  timeText: { fontSize: 32, fontWeight: 'bold' },
  nextButton: { backgroundColor: '#7BAF8E', paddingHorizontal: 60, paddingVertical: 18, borderRadius: 35 },
  nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  successEmoji: { fontSize: 80, marginBottom: 20 }
})
