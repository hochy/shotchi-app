import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { logInjection } from '../lib/database'

export default function LogShotScreen({ navigation }) {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      
      // Combine date and time
      const scheduledDate = new Date(date)
      scheduledDate.setHours(time.getHours(), time.getMinutes(), 0, 0)
      
      const formattedDate = scheduledDate.toISOString().split('T')[0]
      
      // Save to Supabase
      const success = await logInjection(formattedDate, note || null)
      
      if (success) {
        navigation.goBack()
      } else {
        Alert.alert('Error', 'Failed to log injection')
      }
    } catch (error) {
      console.error('Error logging shot:', error)
      Alert.alert('Error', 'Failed to log injection')
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

      <View style={styles.content}>
        {/* Date */}
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

        {/* Time */}
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

        {/* Notes */}
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="How was your shot? Any notes..."
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Confirm button */}
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.confirmButtonLoading]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'SAVING...' : 'CONFIRM'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  close: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#7BAF8E',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})