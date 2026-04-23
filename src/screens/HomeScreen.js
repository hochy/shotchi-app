import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import * as Haptics from 'expo-haptics'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import CelebrationModal from '../components/CelebrationModal'
import WeightLogModal from '../components/WeightLogModal'
import Adi from '../components/Adi'
import SpeechBubble from '../components/SpeechBubble'
import StatPill from '../components/StatPill'
import Btn from '../components/Btn'
import Card from '../components/Card'
import SkeletonLoader from '../components/SkeletonLoader'
import { calculateCurrentLevel } from '../lib/medicationLevels'
import { getAdiMessage } from '../lib/adiMessages'
import { format, differenceInDays, parseISO } from 'date-fns'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { session, injections, weightEntries, sideEffects, streaks, characterState, loading, logWeight } = useInjections()
  const { settings, updateSettings } = useSettings()
  const [showCelebration, setShowCelebration] = useState(false)
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState(0)
  const [adiMessage, setAdiMessage] = useState('')

  const isDark = settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'
  const textColor = isDark ? '#FFFFFF' : '#1c1c1e'
  const subTextColor = isDark ? '#aaaaaa' : '#666666'
  const cardBg = isDark ? '#1c1c1e' : '#FFFFFF'
  const appBg = isDark ? '#000000' : '#FFFFFF'

  const medLevel = useMemo(() => calculateCurrentLevel(injections), [injections])

  useEffect(() => {
    if (!loading) {
      const msg = getAdiMessage({ streaks, characterState, settings, injections, sideEffects })
      setAdiMessage(msg)
    }
  }, [loading, characterState, streaks.current, sideEffects.length])

  const handleCycleMessage = () => {
    const msg = getAdiMessage({ streaks, characterState, settings, injections, sideEffects })
    setAdiMessage(msg)
  }

  useEffect(() => {
    if (streaks.current > 0) {
      const milestones = [52, 26, 12, 4]
      const currentMilestone = milestones.find(m => streaks.current >= m)
      if (currentMilestone && currentMilestone > (settings.lastMilestoneCelebrated || 0)) {
        setMilestoneReached(currentMilestone)
        setShowCelebration(true)
      }
    }
  }, [streaks.current, settings.lastMilestoneCelebrated])

  const handleDismissCelebration = async () => {
    setShowCelebration(false)
    await updateSettings({ lastMilestoneCelebrated: milestoneReached })
  }

  const onSaveWeight = async (val) => {
    await logWeight(val, 'lbs')
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const totalLost = useMemo(() => {
    if (weightEntries.length < 2) return 0
    const start = parseFloat(weightEntries[weightEntries.length - 1].weight)
    const current = parseFloat(weightEntries[0].weight)
    return (start - current).toFixed(1)
  }, [weightEntries])

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const displayName = useMemo(() => {
    if (settings.nickname) return settings.nickname
    const givenName = session?.user?.user_metadata?.given_name
    if (givenName) return givenName
    const fullName = session?.user?.user_metadata?.full_name
    if (fullName) return fullName.split(' ')[0]
    if (session?.user?.email) {
      const emailPrefix = session.user.email.split('@')[0]
      const firstName = emailPrefix.split('.')[0]
      return firstName.charAt(0).toUpperCase() + firstName.slice(1)
    }
    return 'friend'
  }, [settings.nickname, session])

  const nextDueDate = streaks.nextDue ? format(new Date(streaks.nextDue), 'EEEE') : 'Monday'
  const onTimeRate = useMemo(() => {
    if (injections.length === 0) return 0
    const onTimeCount = injections.filter(i => i.logged_at && i.scheduled_for === i.logged_at.split('T')[0]).length
    return Math.round((onTimeCount / injections.length) * 100)
  }, [injections])

  const dayOfCycle = useMemo(() => {
    if (!injections.length) return 1
    const diff = differenceInDays(new Date(), parseISO(injections[0]?.scheduled_for || new Date().toISOString()))
    return (diff % 7) + 1
  }, [injections])

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: appBg, paddingHorizontal: 20 }]}>
        <View style={styles.header}>
          <SkeletonLoader width={120} height={32} />
          <SkeletonLoader width={30} height={30} borderRadius={15} />
        </View>
        <View style={styles.adiLoadingContainer}><SkeletonLoader width={150} height={150} borderRadius={75} /></View>
        <View style={{ gap: 15 }}>
          <SkeletonLoader width="100%" height={80} borderRadius={20} />
          <SkeletonLoader width="100%" height={60} borderRadius={20} />
          <SkeletonLoader width="100%" height={150} borderRadius={20} />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MotiView 
          animate={{ backgroundColor: characterState === 'happy' ? (isDark ? '#1a2e1d' : '#E8F5E9') : (isDark ? '#121212' : '#F7F8FA') }} 
          style={styles.topSection}
        >
          <View style={styles.header}>
            <Text style={[styles.dateText, { color: subTextColor }]}>{format(new Date(), 'EEEE, MMM d')}</Text>
            <View style={styles.headerRight}>
              <View style={[styles.streakBadge, { backgroundColor: themeColor }]}>
                <Text style={styles.streakBadgeText}>🔥 {streaks.current}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
                <Text style={{ fontSize: 22 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity activeOpacity={0.9} onPress={handleCycleMessage} style={styles.adiContainer}>
            <SpeechBubble message={adiMessage} themeColor={themeColor} />
            <Adi state={characterState} color={themeColor} size={125} />
          </TouchableOpacity>
          
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: textColor }]}>{timeGreeting}, {displayName}! 👋</Text>
            <Text style={[styles.statusSubtext, { color: subTextColor }]}>{characterState === 'happy' ? "You're crushing it — shot logged today" : "Ready for your weekly injection?"}</Text>
          </View>
        </MotiView>

        <View style={styles.mainContent}>
          <Btn full onPress={() => navigation.navigate('LogShot')} color={themeColor} style={styles.mainLogBtn}>💉 Log Today's Shot</Btn>
          <View style={styles.statsRow}>
            <StatPill label="Next dose" value={nextDueDate} themeColor={themeColor} />
            <StatPill label="Lost" value={`${Math.abs(totalLost)} lbs`} themeColor={themeColor} />
            <StatPill label="On-time" value={`${onTimeRate}%`} themeColor={themeColor} />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('MedicationTimeline')} style={[styles.medLevelBadge, { backgroundColor: isDark ? `${themeColor}15` : `${themeColor}12`, borderColor: isDark ? `${themeColor}30` : `${themeColor}44` }]}>
            <View style={[styles.iconCircle, { backgroundColor: `${themeColor}30` }]}><Text style={{ fontSize: 18 }}>💊</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.medLevelTitle, { color: themeColor }]}>{medLevel.percentage}% medication level · Day {dayOfCycle}</Text>
              <Text style={[styles.medLevelSub, { color: subTextColor }]}>Peak side effects may occur tomorrow</Text>
            </View>
            <Text style={{ color: themeColor, fontSize: 16 }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('History')}>
            <Card style={[styles.weightCard, { backgroundColor: cardBg }]}>
              <View>
                <Text style={[styles.miniCardLabel, { color: subTextColor }]}>WEIGHT TREND</Text>
                <Text style={[styles.weightValue, { color: textColor }]}>{weightEntries[0]?.weight || '--'} <Text style={[styles.weightUnit, { color: subTextColor }]}>lbs</Text></Text>
                {Math.abs(totalLost) > 0 && (
                  <Text style={[styles.weightLoss, { color: totalLost >= 0 ? '#4caf7d' : '#E74C3C' }]}>
                    {totalLost >= 0 ? '↓' : '↑'} {Math.abs(totalLost)} lbs total
                  </Text>
                )}
              </View>
              <View style={[styles.sparklinePlaceholder, { borderColor: isDark ? '#333' : '#eee' }]}><Text style={{ color: themeColor, fontSize: 10, fontWeight: 'bold' }}>📉 View History</Text></View>
            </Card>
          </TouchableOpacity>

          <View style={styles.shortcutsGrid}>
            <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: cardBg, borderColor: isDark ? '#333' : '#eee' }]} onPress={() => navigation.navigate('LogSideEffect')}><Text style={styles.shortcutEmoji}>😊</Text><Text style={[styles.shortcutLabel, { color: subTextColor }]}>Symptoms</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: cardBg, borderColor: isDark ? '#333' : '#eee' }]} onPress={() => setShowWeightModal(true)}><Text style={styles.shortcutEmoji}>⚖️</Text><Text style={[styles.shortcutLabel, { color: subTextColor }]}>Weight Log</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: cardBg, borderColor: isDark ? '#333' : '#eee' }]} onPress={() => navigation.navigate('Achievements')}><Text style={styles.shortcutEmoji}>🏆</Text><Text style={[styles.shortcutLabel, { color: subTextColor }]}>Awards</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CelebrationModal visible={showCelebration} milestone={milestoneReached} onDismiss={handleDismissCelebration} />
      <WeightLogModal visible={showWeightModal} onClose={() => setShowWeightModal(false)} onSave={onSaveWeight} themeColor={themeColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  topSection: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateText: { fontSize: 13, fontWeight: '700' },
  streakBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  streakBadgeText: { color: 'white', fontSize: 12, fontWeight: '900' },
  settingsBtn: { padding: 4 },
  adiContainer: { height: 180, alignItems: 'center', justifyContent: 'center', width: '100%', marginVertical: 10 },
  welcomeContainer: { alignItems: 'center', marginTop: 10 },
  welcomeText: { fontSize: 21, fontWeight: '900' },
  statusSubtext: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  mainContent: { paddingHorizontal: 20, paddingTop: 10 },
  mainLogBtn: { marginBottom: 15 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  medLevelBadge: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 15 },
  iconCircle: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  medLevelTitle: { fontSize: 13, fontWeight: '800' },
  medLevelSub: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  weightCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 15 },
  miniCardLabel: { fontSize: 11, fontWeight: '700', marginBottom: 2, letterSpacing: 0.5 },
  weightValue: { fontSize: 24, fontWeight: '900' },
  weightUnit: { fontSize: 13, fontWeight: '600' },
  weightLoss: { fontSize: 12, fontWeight: '700' },
  sparklinePlaceholder: { width: 90, height: 40, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderRadius: 8 },
  shortcutsGrid: { flexDirection: 'row', gap: 10 },
  shortcutItem: { flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  shortcutEmoji: { fontSize: 22, marginBottom: 6 },
  shortcutLabel: { fontSize: 12, fontWeight: '700' },
  adiLoadingContainer: { height: 200, alignItems: 'center', justifyContent: 'center' },
})
