import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Dimensions } from 'react-native'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider'
import * as Haptics from 'expo-haptics'
import Btn from '../components/Btn'
import Card from '../components/Card'
import { format } from 'date-fns'

const { width } = Dimensions.get('window')

export default function LogSideEffectScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { logSideEffect } = useInjections()
  const { settings } = useSettings()
  const isDark = settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'
  const textColor = isDark ? 'white' : '#1c1c1e'
  const subTextColor = isDark ? '#aaa' : '#666'
  const appBg = isDark ? '#000' : '#F7F8FA'
  const headerBg = isDark ? '#1c1c1e' : 'white'
  
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [severity, setSeverity] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const symptoms = [
    { id: 'Nausea', emoji: '😣' },
    { id: 'Fatigue', emoji: '😫' },
    { id: 'Constipation', emoji: '😣' },
    { id: 'Diarrhea', emoji: '😖' },
    { id: 'Headache', emoji: '🤕' },
    { id: 'Dizziness', emoji: '😵' },
    { id: 'Stomach Pain', emoji: '🤢' },
    { id: 'Acid Reflux', emoji: '🔥' },
    { id: 'Bloating', emoji: '🎈' },
    { id: 'No Appetite', emoji: '🍽️' }
  ]

  const toggleSymptom = (id) => {
    Haptics.selectionAsync()
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id))
    } else {
      setSelectedSymptoms([...selectedSymptoms, id])
    }
  }

  const handleSave = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Selection Required', 'Please pick at least one symptom.')
      return
    }

    try {
      setLoading(true)
      for (const s of selectedSymptoms) {
        await logSideEffect(s, severity, notes)
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      navigation.goBack()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityLabel = () => {
    if (severity <= 1) return 'Mild'
    if (severity <= 2) return 'Noticeable'
    if (severity <= 3) return 'Moderate'
    if (severity <= 4) return 'Uncomfortable'
    return 'Severe'
  }

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: subTextColor }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>How are you feeling?</Text>
          <Text style={[styles.headerSub, { color: subTextColor }]}>{format(new Date(), 'eeee, h:mm a')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.sectionLabel}>Tap all that apply</Text>
        <View style={styles.symptomsGrid}>
          {symptoms.map(s => {
            const isSelected = selectedSymptoms.includes(s.id)
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => toggleSymptom(s.id)}
                style={[
                  styles.symptomChip,
                  isDark && { backgroundColor: '#1c1c1e', borderColor: '#333' },
                  isSelected && { backgroundColor: isDark ? `${themeColor}30` : `${themeColor}15`, borderColor: themeColor }
                ]}
              >
                <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                <Text style={[styles.symptomLabel, { color: isDark ? '#ccc' : '#666' }, isSelected && { color: themeColor, fontWeight: 'bold' }]}>{s.id}</Text>
                {isSelected && <Text style={{ color: themeColor, marginLeft: 5 }}>✓</Text>}
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity 
          style={[styles.noneButton, isDark && { backgroundColor: '#1c1c1e', borderColor: '#333' }, selectedSymptoms.length === 0 && { borderColor: themeColor, backgroundColor: isDark ? `${themeColor}20` : `${themeColor}10` }]}
          onPress={() => setSelectedSymptoms([])}
        >
          <Text style={[styles.noneText, selectedSymptoms.length === 0 && { color: themeColor }]}>😊 None today!</Text>
        </TouchableOpacity>

        {selectedSymptoms.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>SEVERITY</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={severity}
              onValueChange={setSeverity}
              minimumTrackTintColor={themeColor}
              maximumTrackTintColor={isDark ? '#333' : "#eee"}
              thumbTintColor={themeColor}
            />
            <View style={styles.severityRow}>
              <Text style={styles.sevMin}>Mild</Text>
              <Text style={[styles.sevCurrent, { color: themeColor }]}>{getSeverityLabel()}</Text>
              <Text style={styles.sevMax}>Severe</Text>
            </View>
          </Card>
        )}

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>NOTES</Text>
          <TextInput
            style={[styles.notesInput, { color: textColor }]}
            placeholder="Add notes..."
            placeholderTextColor="#555"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Card>

        <Btn full onPress={handleSave} color={themeColor} disabled={loading}>
          {loading ? 'Saving...' : 'Save Symptoms'}
        </Btn>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15, alignItems: 'center' }}>
          <Text style={{ color: '#aaa', fontWeight: 'bold' }}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { fontSize: 19, fontWeight: '900' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#999', marginBottom: 15 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  symptomChip: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  symptomLabel: { fontSize: 12, marginLeft: 10, flex: 1 },
  noneButton: { padding: 12, borderRadius: 16, borderWidth: 2, borderColor: '#eee', backgroundColor: 'white', alignItems: 'center', marginBottom: 25 },
  noneText: { fontSize: 14, fontWeight: '700', color: '#aaa' },
  card: { marginBottom: 20 },
  cardLabel: { fontSize: 10, color: '#aaa', fontWeight: '800', marginBottom: 15, letterSpacing: 0.5 },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  sevMin: { fontSize: 12, color: '#aaa', fontWeight: '600' },
  sevMax: { fontSize: 12, color: '#aaa', fontWeight: '600' },
  sevCurrent: { fontSize: 14, fontWeight: '900' },
  notesInput: { fontSize: 14, fontWeight: '600', minHeight: 40 },
})
