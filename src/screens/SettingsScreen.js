import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSettings } from '../hooks/useSettings'

export default function SettingsScreen({ navigation }) {
  const { settings, loading, saving, updateSettings } = useSettings()
  
  const injectionDay = settings.injectionDay
  const reminderTime = settings.reminderTime
  const notificationsEnabled = settings.notificationsEnabled
  const overdueEnabled = settings.overdueEnabled
  const [showTimePicker, setShowTimePicker] = useState(false)

  const injectionDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ]

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: () => {
            // TODO: Clear auth state
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            })
          }
        },
      ]
    )
  }

  const handleInjectionDayChange = async (day) => {
    const success = await updateSettings({ injectionDay: day })
    if (!success) {
      Alert.alert('Error', 'Failed to update injection day')
    }
  }

  const handleNotificationToggle = async (enabled) => {
    const success = await updateSettings({ notificationsEnabled: enabled })
    if (!success) {
      Alert.alert('Error', 'Failed to update notification settings')
    }
  }

  const handleOverdueToggle = async (enabled) => {
    const success = await updateSettings({ overdueEnabled: enabled })
    if (!success) {
      Alert.alert('Error', 'Failed to update overdue settings')
    }
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all injection data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete account
            Alert.alert('Account deleted')
          }
        },
      ]
    )
  }

  const onChangeReminderTime = (event, selectedTime) => {
    const currentTime = selectedTime || reminderTime
    setShowTimePicker(false)
    setReminderTime(currentTime)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
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
        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          
          <Text style={styles.label}>Injection Day</Text>
          <View style={styles.optionsContainer}>
            {injectionDays.map(day => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.option,
                  injectionDay === day.value && styles.selectedOption
                ]}
                onPress={() => handleInjectionDayChange(day.value)}
              >
                <Text style={[
                  styles.optionText,
                  injectionDay === day.value && styles.selectedOptionText
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Reminder Time</Text>
          <TouchableOpacity 
            style={styles.timeInput} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeInputText}>
              {reminderTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={reminderTime}
              mode="time"
              display="default"
              onChange={onChangeReminderTime}
            />
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>On day reminder</Text>
            <TouchableOpacity 
              style={[
                styles.toggle,
                notificationsEnabled && styles.toggleEnabled
              ]}
              onPress={() => handleNotificationToggle(!notificationsEnabled)}
            >
              <View style={[
                styles.toggleCircle,
                notificationsEnabled && styles.toggleCircleEnabled
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Overdue alert</Text>
            <TouchableOpacity 
              style={[
                styles.toggle,
                overdueEnabled && styles.toggleEnabled
              ]}
              onPress={() => handleOverdueToggle(!overdueEnabled)}
            >
              <View style={[
                styles.toggleCircle,
                overdueEnabled && styles.toggleCircleEnabled
              ]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create account (optional)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>About & Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  selectedOption: {
    backgroundColor: '#7BAF8E',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: 'white',
  },
  timeInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  timeInputText: {
    fontSize: 16,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggle: {
    width: 50,
    height: 26,
    backgroundColor: '#ddd',
    borderRadius: 13,
    padding: 3,
    position: 'relative',
  },
  toggleEnabled: {
    backgroundColor: '#7BAF8E',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    left: 3,
  },
  toggleCircleEnabled: {
    left: 27,
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 15,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})