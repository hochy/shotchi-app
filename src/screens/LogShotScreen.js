import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BodyDiagram from '../components/BodyDiagram'
import * as Haptics from 'expo-haptics'

export default function LogShotScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { injections, logInjection, logWeight } = useInjections()
  const { settings } = useSettings()
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [note, setNote] = useState('')
  const [weight, setWeight] = useState('')
  const [injectionSite, setInjectionSite] = useState(null)
  const [drugName, setDrugName] = useState(settings.preferredDrug || 'Semaglutide (Wegovy)')
  const [dosage, setDosage] = useState(settings.preferredDosage || 0.25)
  const [loading, setLoading] = useState(false)

  // Sync with default medication from settings
  useEffect(() => {
    if (settings.preferredDrug) {
      setDrugName(settings.preferredDrug)
    }
    if (settings.preferredDosage) {
      setDosage(settings.preferredDosage)
    }
  }, [settings.preferredDrug, settings.preferredDosage])

  const lastUsedSite = injections.length > 0 ? injections[0].injection_site : null

  const drugs = [
    { label: 'Semaglutide (Wegovy)', value: 'Semaglutide (Wegovy)' },
    { label: 'Semaglutide (Ozempic)', value: 'Semaglutide (Ozempic)' },
    { label: 'Tirzepatide (Zepbound)', value: 'Tirzepatide (Zepbound)' },
    { label: 'Tirzepatide (Mounjaro)', value: 'Tirzepatide (Mounjaro)' },
    { label: 'Liraglutide (Saxenda)', value: 'Liraglutide (Saxenda)' },
  ]

  const dosageOptions = [0.25, 0.5, 0.75, 1.0, 1.7, 2.0, 2.4, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0]

  const handleConfirm = async () => {
    try {
      setLoading(true)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      const scheduledDate = new Date(date)
      scheduledDate.setHours(time.getHours(), time.getMinutes(), 0, 0)

      const formattedDate = scheduledDate.toISOString().split('T')[0]

      // Save via context so state updates everywhere
      const result = await logInjection({ 
        scheduledFor: formattedDate, 
        note: note || null,
        injectionSite: injectionSite,
        drugName: drugName,
        dosage: dosage
      })

      // Also log weight if provided
      if (weight && !isNaN(parseFloat(weight))) {
        await logWeight(parseFloat(weight), 'lbs')
      }
      
      if (result && result.error === 'ALREADY_LOGGED') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        Alert.alert('Already Logged', 'An injection for this date has already been recorded.')
        return
      }

      if (result) {
        navigation.goBack()
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert('Error', 'Failed to log injection')
      }
    } catch (error) {
      console.error('Error logging shot:', error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Error', 'An error occurred while logging')
    } finally {
      setLoading(false)
    }
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)
  }

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time
    setShowTimePicker(false)
    setTime(currentTime)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Shot</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.inputText}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <Text style={styles.label}>Current Weight (optional)</Text>
        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            placeholder="0.0"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
          <Text style={styles.weightUnit}>lbs</Text>
        </View>

        <Text style={styles.label}>Medication</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
          <View style={styles.chipContainer}>
            {drugs.map(drug => (
              <TouchableOpacity
                key={drug.value}
                style={[
                  styles.chip,
                  drugName === drug.value && [styles.chipSelected, { backgroundColor: settings.characterColor, borderColor: settings.characterColor }]
                ]}
                onPress={() => setDrugName(drug.value)}
              >
                <Text style={[
                  styles.chipText,
                  drugName === drug.value && styles.chipTextSelected
                ]}>
                  {drug.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.label}>Dosage (mg)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
          <View style={styles.chipContainer}>
            {dosageOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.chip,
                  dosage === opt && [styles.chipSelected, { backgroundColor: settings.characterColor, borderColor: settings.characterColor }]
                ]}
                onPress={() => setDosage(opt)}
              >
                <Text style={[
                  styles.chipText,
                  dosage === opt && styles.chipTextSelected
                ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.label}>Injection Site (rotation recommended)</Text>
        <BodyDiagram
          selectedSite={injectionSite}
          onSelectSite={(site) => {
            Haptics.selectionAsync()
            setInjectionSite(site)
          }}
          themeColor={settings.characterColor}
          lastUsedSite={lastUsedSite}
        />
        
        {injectionSite && (
          <Text style={[styles.siteSelectionText, { color: settings.characterColor }]}>
            Selected: {injectionSite.replace('_', ' ').toUpperCase()}
          </Text>
        )}

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="How was your shot? Any notes..."
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            { backgroundColor: settings.characterColor },
            loading && styles.confirmButtonLoading
          ]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'SAVING...' : 'CONFIRM'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  close: { fontSize: 24, color: '#666' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
  },
  inputText: { fontSize: 16 },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  weightInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightUnit: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  scrollSelector: {
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    // Dynamic
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  siteSelectionText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'capitalize'
  },
  notesInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  confirmButton: {
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  confirmButtonLoading: { opacity: 0.7 },
})
