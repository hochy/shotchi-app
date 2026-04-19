import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

export default function LogSideEffectScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { logSideEffect } = useInjections()
  const { settings } = useSettings()
  
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [severity, setSeverity] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const symptoms = [
    'Nausea', 'Fatigue', 'Constipation', 'Diarrhea', 
    'Headache', 'Dizziness', 'Stomach Pain', 'Acid Reflux', 
    'Bloating', 'Loss of Appetite'
  ]

  const severities = [
    { label: 'Mild', value: 1 },
    { label: 'Noticeable', value: 2 },
    { label: 'Moderate', value: 3 },
    { label: 'Uncomfortable', value: 4 },
    { label: 'Severe', value: 5 },
  ]

  const handleSave = async () => {
    if (!selectedSymptom) {
      Alert.alert('Selection Required', 'Please pick a symptom to log.')
      return
    }

    try {
      setLoading(true)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      
      const result = await logSideEffect(selectedSymptom, severity, notes)
      
      if (result) {
        navigation.goBack()
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert('Error', 'Failed to save side effect.')
      }
    } catch (error) {
      console.error('Error logging side effect:', error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Side Effect</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.label}>What are you feeling?</Text>
        <View style={styles.symptomsGrid}>
          {symptoms.map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.symptomChip,
                selectedSymptom === s && [styles.symptomChipSelected, { backgroundColor: settings.characterColor, borderColor: settings.characterColor }]
              ]}
              onPress={() => setSelectedSymptom(s)}
            >
              <Text style={[
                styles.symptomText,
                selectedSymptom === s && styles.symptomTextSelected
              ]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Severity</Text>
        <View style={styles.severityContainer}>
          {severities.map(s => (
            <TouchableOpacity
              key={s.value}
              style={[
                styles.severityButton,
                severity === s.value && [styles.severityButtonSelected, { borderColor: settings.characterColor }]
              ]}
              onPress={() => setSeverity(s.value)}
            >
              <Text style={[
                styles.severityLabel,
                severity === s.value && { color: settings.characterColor, fontWeight: 'bold' }
              ]}>{s.label}</Text>
              <View style={[
                styles.severityDot,
                { backgroundColor: severity >= s.value ? settings.characterColor : '#eee' }
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Anything else to note?"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: settings.characterColor }, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? 'SAVING...' : 'LOG SYMPTOM'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  close: { fontSize: 24, color: '#666' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15, marginTop: 10 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  symptomChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  symptomChipSelected: {
    borderColor: '#7BAF8E',
  },
  symptomText: { color: '#666', fontWeight: '500' },
  symptomTextSelected: { color: 'white', fontWeight: 'bold' },
  severityContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },
  severityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  severityButtonSelected: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
  },
  severityLabel: { fontSize: 14, color: '#666' },
  severityDot: { width: 12, height: 12, borderRadius: 6 },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  saveButton: {
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
})
