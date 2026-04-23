import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, TextInput } from 'react-native'
import { useAppState } from '../context/AppStateContext'
import * as Haptics from 'expo-haptics'

export default function SettingsScreen({ navigation }) {
  const { session, settings, updateSettings, resetAllData, loading } = useAppState()
  
  // SINGLE SOURCE OF TRUTH
  const isDark = !!settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'

  // Standardized dynamic styles - mapped to one variable (isDark)
  const textColor = isDark ? '#FFFFFF' : '#1c1c1e'
  const subTextColor = isDark ? '#888888' : '#666666'
  const appBg = isDark ? '#000000' : '#F7F8FA'
  const headerBg = isDark ? '#1c1c1e' : '#FFFFFF'
  const cardBg = isDark ? '#1c1c1e' : '#FFFFFF'
  const borderColor = isDark ? '#333333' : '#f0f0f2'
  const labelColor = isDark ? '#555555' : '#aaaaaa'

  const accents = ['#7BAF8E', '#7B8EAF', '#AF7B9C', '#AF9C7B', '#7BAFAF']

  const handleUpdate = async (updates) => {
    Haptics.selectionAsync()
    await updateSettings(updates)
  }

  if (loading) return (
    <View style={[styles.container, { backgroundColor: appBg, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: textColor }}>Loading Settings...</Text>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: borderColor, borderBottomWidth: 1 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: labelColor }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { backgroundColor: appBg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: labelColor }]}>PROFILE</Text>
        <View style={[styles.cardReplacement, { backgroundColor: cardBg, borderColor: borderColor }]}>
          <TouchableOpacity style={styles.profileRow} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.avatar, { backgroundColor: themeColor }]}>
              <Text style={styles.avatarText}>{session?.user?.email?.[0].toUpperCase() || 'S'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.profileName, { color: textColor }]}>{settings.nickname || session?.user?.email?.split('@')[0] || 'Guest'}</Text>
              <Text style={[styles.profileEmail, { color: subTextColor }]}>{session?.user?.email || 'user@email.com'}</Text>
            </View>
            <Text style={{ fontSize: 20, color: labelColor }}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: labelColor }]}>PERSONALIZATION</Text>
        <View style={[styles.cardReplacement, { backgroundColor: cardBg, borderColor: borderColor, padding: 16 }]}>
           <Text style={[styles.miniLabel, { color: subTextColor }]}>WHAT SHOULD ADI CALL YOU?</Text>
           <TextInput
              style={[styles.nicknameInput, { borderColor: isDark ? '#444' : `${themeColor}30`, color: textColor }]}
              placeholder="Enter nickname"
              placeholderTextColor={isDark ? '#444' : '#ccc'}
              value={settings.nickname}
              onChangeText={(v) => updateSettings({ nickname: v })}
              autoCapitalize="words"
           />
        </View>

        <Text style={[styles.sectionLabel, { color: labelColor }]}>MEDICATION</Text>
        <View style={[styles.cardReplacement, { backgroundColor: cardBg, borderColor: borderColor }]}>
          {/* My Medication Row */}
          <View style={[styles.row, { borderBottomColor: borderColor }]}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>💉</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>My Medication</Text>
            <Text style={[styles.rowValue, { color: subTextColor }]}>{`${settings.preferredDrug?.split(' ')[0] || 'GLP-1'} ${settings.preferredDosage}mg`}</Text>
            <Text style={{ fontSize: 20, color: labelColor }}>›</Text>
          </View>
          {/* Dose Day Row */}
          <View style={[styles.row, { borderBottomColor: borderColor }]}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>📅</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>Dose Day</Text>
            <Text style={[styles.rowValue, { color: subTextColor }]}>{settings.injectionDay?.charAt(0).toUpperCase() + settings.injectionDay?.slice(1)}</Text>
            <Text style={{ fontSize: 20, color: labelColor }}>›</Text>
          </View>
          {/* Reminder Time Row */}
          <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>🔔</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>Reminder Time</Text>
            <Text style={[styles.rowValue, { color: subTextColor }]}>{settings.reminderTime}</Text>
            <Text style={{ fontSize: 20, color: labelColor }}>›</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: labelColor }]}>PREFERENCES</Text>
        <View style={[styles.cardReplacement, { backgroundColor: cardBg, borderColor: borderColor }]}>
          <View style={styles.colorRow}>
             <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>🎨</Text></View>
             <Text style={[styles.rowLabel, { color: textColor }]}>Adi's Color</Text>
          </View>
          <View style={[styles.colorGrid, { borderBottomColor: borderColor }]}>
            {accents.map(c => (
              <TouchableOpacity 
                key={c} 
                onPress={() => handleUpdate({ characterColor: c })}
                style={[styles.colorCircle, { backgroundColor: c }, themeColor === c && { borderWidth: 3, borderColor: isDark ? '#fff' : '#000' }]} 
              />
            ))}
          </View>
          {/* Health Sync Row */}
          <View style={[styles.row, { borderBottomColor: borderColor }]}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>❤️</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>Health App Sync</Text>
            <Switch value={!!settings.healthSyncEnabled} onValueChange={(v) => handleUpdate({ healthSyncEnabled: v })} trackColor={{ true: themeColor }} />
          </View>
          {/* Dark Mode Row */}
          <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>🌙</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={(v) => handleUpdate({ darkMode: v })} trackColor={{ true: themeColor }} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: labelColor }]}>DATA</Text>
        <View style={[styles.cardReplacement, { backgroundColor: cardBg, borderColor: borderColor }]}>
          <TouchableOpacity style={[styles.row, { borderBottomColor: borderColor }]} onPress={() => navigation.navigate('History')}>
            <View style={[styles.rowIconBox, { backgroundColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}><Text style={{ fontSize: 18 }}>📋</Text></View>
            <Text style={[styles.rowLabel, { color: textColor }]}>Export for Doctor</Text>
            <Text style={{ fontSize: 20, color: labelColor }}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => {
            Alert.alert("Reset Data", "Wipe all logs? This cannot be undone.", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: resetAllData }
            ])
          }}>
            <View style={[styles.rowIconBox, { backgroundColor: 'rgba(231, 76, 60, 0.2)' }]}><Text style={{ fontSize: 18 }}>🗑️</Text></View>
            <Text style={[styles.rowLabel, { color: '#E74C3C' }]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={[styles.signOutText, { color: labelColor }]}>Manage Account</Text>
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
  cardReplacement: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 20, fontWeight: '900' },
  profileName: { fontSize: 16, fontWeight: '800' },
  profileEmail: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 13, paddingHorizontal: 16, borderBottomWidth: 1 },
  rowIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  rowValue: { fontSize: 14, fontWeight: '600', marginRight: 10 },
  colorRow: { flexDirection: 'row', alignItems: 'center', padding: 13, paddingHorizontal: 16 },
  colorGrid: { flexDirection: 'row', gap: 12, paddingLeft: 62, paddingBottom: 15, borderBottomWidth: 1 },
  colorCircle: { width: 28, height: 28, borderRadius: 14 },
  nicknameInput: { height: 48, borderWidth: 2, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, fontWeight: '700' },
  miniLabel: { fontSize: 10, fontWeight: '800', marginBottom: 10, letterSpacing: 0.5 },
  signOutBtn: { marginTop: 30, alignItems: 'center' },
  signOutText: { fontSize: 15, fontWeight: '700' },
})
