import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, TextInput, Platform } from 'react-native'
import { useAppState } from '../context/AppStateContext'
import * as Haptics from 'expo-haptics'
import Card from '../components/Card'

export default function SettingsScreen({ navigation }) {
  const { session, settings, updateSettings, resetAllData, loading } = useAppState()
  
  const isDark = !!settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'

  // Picker States
  const [activePicker, setActivePicker] = useState(null) // 'med', 'day', 'time'

  // Options
  const meds = ['Semaglutide (Wegovy)', 'Semaglutide (Ozempic)', 'Tirzepatide (Mounjaro)', 'Tirzepatide (Zepbound)', 'Liraglutide (Saxenda)']
  const dosages = [0.25, 0.5, 0.75, 1.0, 1.7, 2.0, 2.4, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0]
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const theme = {
    isDark,
    text: isDark ? '#FFFFFF' : '#1c1c1e',
    subText: isDark ? '#888888' : '#666666',
    bg: isDark ? '#000000' : '#F7F8FA',
    header: isDark ? '#1c1c1e' : '#FFFFFF',
    border: isDark ? '#333333' : '#f0f0f2',
    card: isDark ? '#1c1c1e' : '#FFFFFF',
    label: isDark ? '#555555' : '#aaaaaa'
  }

  const accents = ['#7BAF8E', '#7B8EAF', '#AF7B9C', '#AF9C7B', '#7BAFAF']

  const handleUpdate = async (updates) => {
    Haptics.selectionAsync()
    await updateSettings(updates)
  }

  const getCurrentTimeParts = () => {
    const [h24, m] = (settings.reminderTime || '09:00').split(':').map(Number)
    const ampm = h24 >= 12 ? 'PM' : 'AM'
    const h12 = h24 % 12 || 12
    return { h12, m, ampm }
  }

  const setTimePart = (part, delta) => {
    const current = getCurrentTimeParts()
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
    handleUpdate({ reminderTime: finalTime })
  }

  if (loading) return (
    <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: theme.text }}>Loading Settings...</Text>
    </View>
  )

  const Row = ({ icon, label, value, chevron = true, onPress, control, destructive = false, noBorder }) => (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1} 
      onPress={onPress} 
      style={[styles.row, { borderBottomColor: noBorder ? 'transparent' : theme.border }]}
    >
      {icon && <View style={[styles.rowIconBox, { backgroundColor: theme.isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>{icon}</Text></View>}
      <Text style={[styles.rowLabel, { color: destructive ? '#E74C3C' : theme.text }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: theme.subText }]}>{value}</Text>}
      {control}
      {chevron && !control && <Text style={[styles.chevron, { color: theme.label }]}>›</Text>}
    </TouchableOpacity>
  )

  const timeParts = getCurrentTimeParts()

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: theme.label }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: theme.label }]}>PROFILE</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <TouchableOpacity style={styles.profileRow} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.avatar, { backgroundColor: themeColor }]}>
              <Text style={styles.avatarText}>{session?.user?.email?.[0].toUpperCase() || 'S'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.profileName, { color: theme.text }]}>{settings.nickname || session?.user?.email?.split('@')[0] || 'Guest'}</Text>
              <Text style={[styles.profileEmail, { color: theme.subText }]}>{session?.user?.email || 'user@email.com'}</Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.label }}>›</Text>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.label }]}>PERSONALIZATION</Text>
        <Card style={{ padding: 16 }}>
           <Text style={[styles.miniLabel, { color: theme.subText }]}>WHAT SHOULD ADI CALL YOU?</Text>
           <TextInput
              style={[styles.nicknameInput, { borderColor: isDark ? '#444' : `${themeColor}30`, color: theme.text }]}
              placeholder="Enter nickname"
              placeholderTextColor={isDark ? '#444' : '#ccc'}
              value={settings.nickname}
              onChangeText={(v) => updateSettings({ nickname: v })}
              autoCapitalize="words"
           />
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.label }]}>MEDICATION</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Row 
            icon="💉" label="My Medication" 
            value={settings.preferredDrug?.split(' ')[1]?.replace('(', '').replace(')', '') || 'Wegovy'}
            onPress={() => setActivePicker(activePicker === 'med' ? null : 'med')}
          />
          {activePicker === 'med' && (
            <View style={[styles.pickerBox, { backgroundColor: isDark ? '#121212' : '#f9f9f9', borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                 {meds.map(m => (
                   <TouchableOpacity key={m} onPress={() => handleUpdate({ preferredDrug: m })} style={[styles.chip, settings.preferredDrug === m && { backgroundColor: themeColor }]}>
                     <Text style={[styles.chipText, settings.preferredDrug === m && { color: 'white' }]}>{m.split(' (')[1].replace(')', '')}</Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {dosages.map(d => (
                   <TouchableOpacity key={d} onPress={() => handleUpdate({ preferredDosage: d })} style={[styles.chip, settings.preferredDosage === d && { backgroundColor: themeColor }]}>
                     <Text style={[styles.chipText, settings.preferredDosage === d && { color: 'white' }]}>{d}mg</Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>
            </View>
          )}

          <Row 
            icon="📅" label="Dose Day" 
            value={settings.injectionDay?.charAt(0).toUpperCase() + settings.injectionDay?.slice(1)}
            onPress={() => setActivePicker(activePicker === 'day' ? null : 'day')}
          />
          {activePicker === 'day' && (
            <View style={[styles.pickerBox, { backgroundColor: isDark ? '#121212' : '#f9f9f9', borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
               <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                 {days.map(d => (
                   <TouchableOpacity key={d} onPress={() => handleUpdate({ injectionDay: d })} style={[styles.chip, settings.injectionDay === d && { backgroundColor: themeColor }]}>
                     <Text style={[styles.chipText, settings.injectionDay === d && { color: 'white' }]}>{d.charAt(0).toUpperCase() + d.slice(1, 3)}</Text>
                   </TouchableOpacity>
                 ))}
               </View>
            </View>
          )}

          <Row 
            icon="🔔" label="Reminder Time" 
            value={`${timeParts.h12}:${timeParts.m.toString().padStart(2, '0')} ${timeParts.ampm}`}
            noBorder onPress={() => setActivePicker(activePicker === 'time' ? null : 'time')}
          />
          {activePicker === 'time' && (
            <View style={[styles.stepperBox, { backgroundColor: isDark ? '#121212' : '#f9f9f9' }]}>
               <View style={styles.stepperRow}>
                 {/* Hour Stepper */}
                 <View style={styles.stepperGroup}>
                   <TouchableOpacity onPress={() => setTimePart('h', 1)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: themeColor }]}>+</Text></TouchableOpacity>
                   <Text style={[styles.stepVal, { color: theme.text }]}>{timeParts.h12}</Text>
                   <TouchableOpacity onPress={() => setTimePart('h', -1)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: themeColor }]}>−</Text></TouchableOpacity>
                   <Text style={styles.stepLabel}>HOUR</Text>
                 </View>
                 
                 <Text style={[styles.stepperColon, { color: theme.text }]}>:</Text>

                 {/* Minute Stepper */}
                 <View style={styles.stepperGroup}>
                   <TouchableOpacity onPress={() => setTimePart('m', 5)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: themeColor }]}>+</Text></TouchableOpacity>
                   <Text style={[styles.stepVal, { color: theme.text }]}>{timeParts.m.toString().padStart(2, '0')}</Text>
                   <TouchableOpacity onPress={() => setTimePart('m', -5)} style={styles.stepBtn}><Text style={[styles.stepBtnText, { color: themeColor }]}>−</Text></TouchableOpacity>
                   <Text style={styles.stepLabel}>MIN</Text>
                 </View>

                 {/* AM/PM Toggle */}
                 <TouchableOpacity onPress={() => setTimePart('ampm')} style={[styles.ampmBtn, { backgroundColor: `${themeColor}20` }]}>
                   <Text style={[styles.ampmText, { color: themeColor }]}>{timeParts.ampm}</Text>
                 </TouchableOpacity>
               </View>
            </View>
          )}
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.label }]}>PREFERENCES</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <View style={styles.colorRow}>
             <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>🎨</Text></View>
             <Text style={[styles.rowLabel, { color: theme.text }]}>Adi's Color</Text>
          </View>
          <View style={[styles.colorGrid, { borderBottomColor: theme.border }]}>
            {accents.map(c => (
              <TouchableOpacity 
                key={c} 
                onPress={() => handleUpdate({ characterColor: c })}
                style={[styles.colorCircle, { backgroundColor: c }, themeColor === c && { borderWidth: 3, borderColor: isDark ? '#fff' : '#000' }]} 
              />
            ))}
          </View>
          <Row 
            icon="❤️" label="Health App Sync" chevron={false} 
            control={
              <Switch 
                value={!!settings.healthSyncEnabled} 
                onValueChange={(v) => handleUpdate({ healthSyncEnabled: v })} 
                trackColor={{ true: themeColor, false: isDark ? '#333' : '#ddd' }} 
                thumbColor={Platform.OS === 'web' ? (settings.healthSyncEnabled ? themeColor : '#fff') : '#fff'}
                activeThumbColor={themeColor}
              />
            }
          />
          <Row 
            icon="🌙" label="Dark Mode" chevron={false} noBorder
            control={
              <Switch 
                value={isDark} 
                onValueChange={(v) => handleUpdate({ darkMode: v })} 
                trackColor={{ true: themeColor, false: isDark ? '#333' : '#ddd' }} 
                thumbColor={Platform.OS === 'web' ? (isDark ? themeColor : '#fff') : '#fff'}
                activeThumbColor={themeColor}
              />
            }
          />
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.label }]}>DATA</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Row icon="📋" label="Export for Doctor" onPress={() => navigation.navigate('History')} />
          <Row icon="🗑️" label="Reset All Data" destructive chevron={false} noBorder
            onPress={() => {
              Alert.alert("Reset Data", "Wipe all logs? This cannot be undone.", [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: resetAllData }
              ])
            }} 
          />
        </Card>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={[styles.signOutText, { color: theme.label }]}>Manage Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900' },
  content: { padding: 20, paddingBottom: 60 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, paddingVertical: 12, paddingLeft: 4, textTransform: 'uppercase' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 20, fontWeight: '900' },
  profileName: { fontSize: 16, fontWeight: '800' },
  profileEmail: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 13, paddingHorizontal: 16, borderBottomWidth: 1 },
  rowIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  rowValue: { fontSize: 14, fontWeight: '600', marginRight: 10 },
  chevron: { fontSize: 20 },
  pickerBox: { padding: 15 },
  stepperBox: { padding: 20, alignItems: 'center' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  stepperGroup: { alignItems: 'center', gap: 5 },
  stepperColon: { fontSize: 32, fontWeight: '900', marginTop: -20 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  stepBtnText: { fontSize: 24, fontWeight: '900' },
  stepVal: { fontSize: 32, fontWeight: '900', minWidth: 50, textAlign: 'center' },
  stepLabel: { fontSize: 9, fontWeight: '800', color: '#aaa', letterSpacing: 1 },
  ampmBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, marginLeft: 10 },
  ampmText: { fontSize: 18, fontWeight: '900' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#eee', marginRight: 8, marginBottom: 4 },
  chipText: { fontSize: 12, fontWeight: '700', color: '#666' },
  colorRow: { flexDirection: 'row', alignItems: 'center', padding: 13, paddingHorizontal: 16 },
  colorGrid: { flexDirection: 'row', gap: 12, paddingLeft: 62, paddingBottom: 15, borderBottomWidth: 1 },
  colorCircle: { width: 28, height: 28, borderRadius: 14 },
  nicknameInput: { height: 48, borderWidth: 2, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, fontWeight: '700' },
  miniLabel: { fontSize: 10, fontWeight: '800', marginBottom: 10, letterSpacing: 0.5 },
  signOutBtn: { marginTop: 30, alignItems: 'center' },
  signOutText: { fontSize: 15, fontWeight: '700' },
})
