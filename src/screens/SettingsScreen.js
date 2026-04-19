import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSettings } from '../hooks/useSettings'
import { useAppState } from '../context/AppStateContext'
import * as Haptics from 'expo-haptics'

export default function SettingsScreen({ navigation }) {
  const { settings, loading, saving, updateSettings } = useSettings()
  const { resetAllData } = useAppState()
  const [showTimePicker, setShowTimePicker] = useState(false)

  const injectionDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ]

  const characterColors = [
    '#7BAF8E', // Original Green
    '#7B8EAF', // Blue
    '#AF7B9C', // Pink
    '#AF9C7B', // Amber
    '#7BAFAF', // Teal
  ]

  const drugOptions = [
    'Semaglutide (Wegovy)',
    'Semaglutide (Ozempic)',
    'Tirzepatide (Zepbound)',
    'Tirzepatide (Mounjaro)',
    'Liraglutide (Saxenda)',
  ]

  const dosageOptions = [0.25, 0.5, 0.75, 1.0, 1.7, 2.0, 2.4, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0]

  // Convert "HH:MM" string to Date object for picker
  const getPickerDate = () => {
    const [hours, minutes] = (settings.reminderTime || '09:00').split(':').map(Number)
    const d = new Date()
    d.setHours(hours, minutes, 0, 0)
    return d
  }

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }) },
    ])
  }

  const handleResetData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    Alert.alert(
      'Reset All Data', 
      'This will delete all your injection logs and reset your streaks. This cannot be undone. Are you sure?', 
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            const success = await resetAllData()
            if (success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
              Alert.alert('Success', 'All data has been cleared.')
            }
          }
        },
      ]
    )
  }

  const handleUpdate = async (updates) => {
    Haptics.selectionAsync()
    const success = await updateSettings(updates)
    if (!success) {
      Alert.alert('Error', 'Failed to update settings')
    }
  }

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false)
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      handleUpdate({ reminderTime: `${hours}:${minutes}` })
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Injection Schedule</Text>
          
          <Text style={styles.label}>Weekly Day</Text>
          <View style={styles.daysContainer}>
            {injectionDays.map(day => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayButton,
                  settings.injectionDay === day.value && styles.dayButtonSelected
                ]}
                onPress={() => handleUpdate({ injectionDay: day.value })}
              >
                <Text style={[
                  styles.dayText,
                  settings.injectionDay === day.value && styles.dayTextSelected
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Reminder Time</Text>
          <TouchableOpacity 
            style={styles.timeButton} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeText}>{settings.reminderTime}</Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={getPickerDate()}
              mode="time"
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adi's Look</Text>
          <Text style={styles.label}>Character Color</Text>
          <View style={styles.colorsContainer}>
            {characterColors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  settings.characterColor === color && styles.colorCircleSelected
                ]}
                onPress={() => handleUpdate({ characterColor: color })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication</Text>
          <Text style={styles.label}>Default Medication</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugsScroll}>
            <View style={styles.drugsContainer}>
              {drugOptions.map(drug => (
                <TouchableOpacity
                  key={drug}
                  style={[
                    styles.drugChip,
                    settings.preferredDrug === drug && [styles.drugChipSelected, { backgroundColor: settings.characterColor, borderColor: settings.characterColor }]
                  ]}
                  onPress={() => handleUpdate({ preferredDrug: drug })}
                >
                  <Text style={[
                    styles.drugText,
                    settings.preferredDrug === drug && styles.drugTextSelected
                  ]}>
                    {drug}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.label}>Default Dosage (mg)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drugsScroll}>
            <View style={styles.drugsContainer}>
              {dosageOptions.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.drugChip,
                    settings.preferredDosage === opt && [styles.drugChipSelected, { backgroundColor: settings.characterColor, borderColor: settings.characterColor }]
                  ]}
                  onPress={() => handleUpdate({ preferredDosage: opt })}
                >
                  <Text style={[
                    styles.drugText,
                    settings.preferredDosage === opt && styles.drugTextSelected
                  ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Enabled</Text>
            <Switch 
              value={settings.notificationsEnabled}
              onValueChange={(val) => handleUpdate({ notificationsEnabled: val })}
              trackColor={{ true: '#7BAF8E' }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Overdue Alerts</Text>
            <Switch 
              value={settings.overdueEnabled}
              onValueChange={(val) => handleUpdate({ overdueEnabled: val })}
              trackColor={{ true: '#7BAF8E' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Tools</Text>
          <TouchableOpacity style={styles.devButton} onPress={handleResetData}>
            <Text style={styles.devButtonText}>Reset All Injection Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
            <Text style={styles.dangerButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  close: { fontSize: 24, color: '#666' },
  content: { padding: 20, paddingBottom: 60 },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#333' },
  label: { fontSize: 14, color: '#666', marginBottom: 10, fontWeight: '600' },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  colorsContainer: { flexDirection: 'row', gap: 15, marginBottom: 10 },
  drugsScroll: { marginBottom: 10 },
  drugsContainer: { flexDirection: 'row', gap: 10, paddingRight: 20 },
  drugChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  drugChipSelected: {
    // Background color handled dynamically
  },
  drugText: {
    fontSize: 13,
    color: '#666',
  },
  drugTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: { backgroundColor: '#7BAF8E' },
  dayText: { fontSize: 12, fontWeight: '600' },
  dayTextSelected: { color: 'white' },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeText: { fontSize: 18, fontWeight: '700', color: '#333' },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 16, color: '#333' },
  devButton: { padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12 },
  devButtonText: { color: '#666', fontSize: 14, fontWeight: '600' },
  dangerButton: { padding: 15, alignItems: 'center' },
  dangerButtonText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 },
})
