import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useAppState } from '../context/AppStateContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Adi from '../components/Adi'
import Btn from '../components/Btn'
import { MotiView, AnimatePresence } from 'moti'

const { width } = Dimensions.get('window')

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { updateSettings, settings } = useAppState()
  
  const [step, setStep] = useState(0)
  const [med, setMed] = useState('Semaglutide (Wegovy)')
  const [day, setDay] = useState('monday')
  const [dosage, setDosage] = useState(0.25)
  const [reminderTime, setReminderTime] = useState('09:00')

  const meds = [
    { name: 'Semaglutide (Wegovy)', generic: 'semaglutide', badge: 'Weekly', emoji: '💚' },
    { name: 'Semaglutide (Ozempic)', generic: 'semaglutide', badge: 'Weekly', emoji: '🔵' },
    { name: 'Tirzepatide (Mounjaro)', generic: 'tirzepatide', badge: 'Weekly', emoji: '🟣' },
    { name: 'Tirzepatide (Zepbound)', generic: 'tirzepatide', badge: 'Weekly', emoji: '🟡' },
    { name: 'Liraglutide (Saxenda)', generic: 'liraglutide', badge: 'Daily', emoji: '🟠' },
  ]

  const days = [
    { label: 'Mon', value: 'monday' },
    { label: 'Tue', value: 'tuesday' },
    { label: 'Wed', value: 'wednesday' },
    { label: 'Thu', value: 'thursday' },
    { label: 'Fri', value: 'friday' },
    { label: 'Sat', value: 'saturday' },
    { label: 'Sun', value: 'sunday' },
  ]

  // Time Stepper Logic
  const getTimeParts = () => {
    const [h24, m] = reminderTime.split(':').map(Number)
    const ampm = h24 >= 12 ? 'PM' : 'AM'
    const h12 = h24 % 12 || 12
    return { h12, m, ampm }
  }

  const setTimePart = (part, delta) => {
    const current = getTimeParts()
    let h12 = current.h12
    let m = current.m
    let ampm = current.ampm

    if (part === 'h') {
      h12 = ((h12 + delta - 1 + 12) % 12) + 1
    } else if (part === 'm') {
      m = (m + delta + 60) % 60
    } else if (part === 'ampm') {
      ampm = ampm === 'AM' ? 'PM' : 'AM'
    }

    let h24 = h12
    if (ampm === 'PM' && h12 < 12) h24 += 12
    if (ampm === 'AM' && h12 === 12) h24 = 0

    const finalTime = `${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    setReminderTime(finalTime)
    Haptics.selectionAsync()
  }

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await updateSettings({
      preferredDrug: med,
      preferredDosage: dosage,
      injectionDay: day,
      reminderTime: reminderTime,
      hasCompletedOnboarding: true
    })
  }

  const renderWelcome = () => (
    <View style={styles.stepContent}>
      <Adi state="happy" color={settings.characterColor} size={150} />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.welcomeTitle}>Welcome to</Text>
        <Text style={[styles.brandTitle, { color: settings.characterColor }]}>Shotchi</Text>
      </View>
      <Text style={styles.welcomeSub}>Your friendly GLP-1 journey companion</Text>
      
      <View style={styles.featureGrid}>
        {[
          ['📅', 'Track your weekly injections'],
          ['🎉', 'Celebrate your milestones'],
          ['📊', 'Understand your progress']
        ].map(([emoji, text]) => (
          <View key={text} style={[styles.featureRow, { backgroundColor: `${settings.characterColor}15` }]}>
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  const renderMedication = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>What medication are you taking?</Text>
        <Text style={styles.stepSub}>We'll personalize your experience</Text>
      </View>
      <ScrollView style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
        {meds.map(m => (
          <TouchableOpacity 
            key={m.name} 
            onPress={() => { Haptics.selectionAsync(); setMed(m.name); }}
            style={[
              styles.medCard, 
              med === m.name && { borderColor: settings.characterColor, backgroundColor: `${settings.characterColor}10`, borderWidth: 2.5 }
            ]}
          >
            <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.medName}>{m.name.split(' (')[1].replace(')', '')}</Text>
              <Text style={styles.medGeneric}>{m.generic}</Text>
            </View>
            <View style={[styles.medBadge, med === m.name ? { backgroundColor: settings.characterColor } : { backgroundColor: '#f0f0f2' }]}>
              <Text style={[styles.medBadgeText, med === m.name && { color: 'white' }]}>{m.badge}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  const renderSchedule = () => {
    const timeParts = getTimeParts()
    return (
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>When is your injection day?</Text>
          <Text style={styles.stepSub}>We'll remind you so you never miss a dose</Text>
        </View>
        
        <View style={styles.daysRow}>
          {days.map(d => (
            <TouchableOpacity 
              key={d.value} 
              onPress={() => { Haptics.selectionAsync(); setDay(d.value); }}
              style={[
                styles.dayBtn, 
                day === d.value ? { backgroundColor: settings.characterColor, borderColor: settings.characterColor } : { backgroundColor: 'white', borderColor: '#eee' }
              ]}
            >
              <Text style={[styles.dayText, day === d.value && { color: 'white' }]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeCard}>
          <Text style={styles.miniLabel}>REMINDER TIME</Text>
          <View style={styles.stepperRow}>
            {/* Hour */}
            <View style={styles.stepperGroup}>
              <TouchableOpacity onPress={() => setTimePart('h', 1)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: settings.characterColor }]}>+</Text></TouchableOpacity>
              <Text style={styles.stepVal}>{timeParts.h12}</Text>
              <TouchableOpacity onPress={() => setTimePart('h', -1)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: settings.characterColor }]}>−</Text></TouchableOpacity>
              <Text style={styles.stepLabel}>HOUR</Text>
            </View>
            
            <Text style={styles.stepperColon}>:</Text>

            {/* Min */}
            <View style={styles.stepperGroup}>
              <TouchableOpacity onPress={() => setTimePart('m', 5)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: settings.characterColor }]}>+</Text></TouchableOpacity>
              <Text style={styles.stepVal}>{timeParts.m.toString().padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => setTimePart('m', -5)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: settings.characterColor }]}>−</Text></TouchableOpacity>
              <Text style={styles.stepLabel}>MIN</Text>
            </View>

            {/* AM/PM */}
            <TouchableOpacity onPress={() => setTimePart('ampm')} style={[styles.ampmBtn, { backgroundColor: `${settings.characterColor}15` }]}>
              <Text style={[styles.ampmText, { color: settings.characterColor }]}>{timeParts.ampm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderAllSet = () => {
    const timeParts = getTimeParts()
    const formattedTime = `${timeParts.h12}:${timeParts.m.toString().padStart(2, '0')} ${timeParts.ampm}`
    return (
      <View style={styles.stepContent}>
        <Adi state="excited" color={settings.characterColor} size={150} />
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.welcomeTitle}>You're all set! 🎉</Text>
          <Text style={styles.summaryText}>
            We'll remind you every <Text style={{ color: settings.characterColor, fontWeight: '900' }}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text> at <Text style={{ color: settings.characterColor, fontWeight: '900' }}>{formattedTime}</Text>
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: `${settings.characterColor}15` }]}>
          <Text style={styles.summaryRow}>💊 <Text style={{ fontWeight: 'bold' }}>{med.split(' (')[1].replace(')', '')}</Text></Text>
          <Text style={styles.summaryRow}>📅 Every <Text style={{ fontWeight: 'bold' }}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text></Text>
          <Text style={styles.summaryRow}>🔔 Reminder at <Text style={{ fontWeight: 'bold' }}>{formattedTime}</Text></Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map(i => (
          <View 
            key={i} 
            style={[
              styles.progressDot, 
              step === i ? { width: 22, backgroundColor: settings.characterColor } : { width: 8, backgroundColor: '#f0f0f2' }
            ]} 
          />
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {step === 0 && renderWelcome()}
        {step === 1 && renderMedication()}
        {step === 2 && renderSchedule()}
        {step === 3 && renderAllSet()}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Btn 
          full 
          onPress={() => step < 3 ? setStep(s => s + 1) : handleFinish()} 
          color={settings.characterColor}
        >
          {step === 3 ? 'Start Tracking →' : step === 0 ? 'Get Started →' : 'Continue →'}
        </Btn>
        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(s => s - 1)} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 15 },
  progressDot: { height: 8, borderRadius: 4 },
  stepContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  welcomeTitle: { fontSize: 26, fontWeight: '900', color: '#1c1c1e' },
  brandTitle: { fontSize: 32, fontWeight: '900' },
  welcomeSub: { fontSize: 14, color: '#666', fontWeight: '600', marginTop: 8, textAlign: 'center' },
  featureGrid: { width: '100%', gap: 10, marginTop: 30 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 14, borderRadius: 16 },
  featureText: { fontSize: 14, fontWeight: '700', color: '#1c1c1e' },
  stepHeader: { width: '100%', marginBottom: 20 },
  stepTitle: { fontSize: 22, fontWeight: '900', color: '#1c1c1e' },
  stepSub: { fontSize: 13, color: '#aaa', fontWeight: '600', marginTop: 4 },
  medCard: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 2, borderColor: '#f0f0f2', backgroundColor: 'white', marginBottom: 10 },
  medName: { fontSize: 16, fontWeight: '800', color: '#1c1c1e' },
  medGeneric: { fontSize: 12, color: '#aaa', fontWeight: '600', marginTop: 2 },
  medBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  medBadgeText: { fontSize: 10, fontWeight: '900', color: '#aaa' },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, justifyContent: 'center' },
  dayBtn: { width: '22%', height: 44, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  dayText: { fontSize: 11, fontWeight: '800', color: '#aaa' },
  timeCard: { width: '100%', backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 30, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 3, alignItems: 'center' },
  miniLabel: { fontSize: 10, color: '#aaa', fontWeight: '800', letterSpacing: 1, marginBottom: 15 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  stepperGroup: { alignItems: 'center', gap: 5 },
  stepperColon: { fontSize: 28, fontWeight: '900', color: '#1c1c1e', marginTop: -20 },
  stepBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f9f9f9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
  stepBtnText: { fontSize: 20, fontWeight: '900' },
  stepVal: { fontSize: 28, fontWeight: '900', color: '#1c1c1e', minWidth: 40, textAlign: 'center' },
  stepLabel: { fontSize: 8, fontWeight: '800', color: '#aaa', letterSpacing: 1 },
  ampmBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  ampmText: { fontSize: 16, fontWeight: '900' },
  summaryText: { fontSize: 15, color: '#666', fontWeight: '600', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  summaryCard: { width: '100%', borderRadius: 20, padding: 20, marginTop: 30 },
  summaryRow: { fontSize: 15, color: '#1c1c1e', marginBottom: 8 },
  footer: { paddingHorizontal: 30, gap: 10 },
  backLink: { padding: 10, alignItems: 'center' },
  backLinkText: { fontSize: 14, color: '#aaa', fontWeight: '800' },
})
