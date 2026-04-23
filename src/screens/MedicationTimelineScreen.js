import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { getTimelineData, calculateCurrentLevel } from '../lib/medicationLevels'
import { MotiView } from 'moti'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { format, differenceInDays, parseISO } from 'date-fns'
import Card from '../components/Card'

const { width } = Dimensions.get('window')

export default function MedicationTimelineScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { injections, loading } = useInjections()
  const { settings } = useSettings()
  const isDark = settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'
  const textColor = isDark ? 'white' : '#1c1c1e'
  const subTextColor = isDark ? '#aaa' : '#666'
  const appBg = isDark ? '#000' : '#F7F8FA'
  const headerBg = isDark ? '#1c1c1e' : 'white'
  const cardBg = isDark ? '#1c1c1e' : 'white'

  const timelineData = useMemo(() => getTimelineData(injections), [injections])
  const currentStatus = useMemo(() => calculateCurrentLevel(injections), [injections])

  const chartConfig = {
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    color: (opacity = 1) => themeColor ? `${themeColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(123, 175, 142, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 3,
    propsForDots: { r: "5", strokeWidth: "2", stroke: isDark ? '#1c1c1e' : "white" }
  }

  const dayOfCycle = useMemo(() => {
    if (!injections.length) return 1
    const lastShot = parseISO(injections[0].scheduled_for)
    const diff = differenceInDays(new Date(), lastShot)
    return (diff % 7) + 1
  }, [injections])

  if (loading) return null

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: subTextColor }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Medication Timeline</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Card style={[styles.statusCard, { backgroundColor: isDark ? `${themeColor}15` : `${themeColor}08`, borderColor: isDark ? `${themeColor}40` : `${themeColor}20` }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${themeColor}25` }]}>
              <Text style={{ fontSize: 20 }}>💊</Text>
            </View>
            <View>
              <Text style={[styles.statusTitle, { color: textColor }]}>You're at {currentStatus.percentage}% level</Text>
              <Text style={[styles.statusSub, { color: subTextColor }]}>Day {dayOfCycle} of your weekly cycle</Text>
            </View>
          </View>
          <View style={[styles.divider, isDark && { backgroundColor: '#333' }]} />
          <Text style={[styles.clinicalNote, { color: subTextColor }]}>
            ⚡ Side effects may peak <Text style={{ fontWeight: 'bold', color: textColor }}>1–2 days</Text> after injection.{'\n'}
            📅 Steady state is usually reached in <Text style={{ fontWeight: 'bold', color: themeColor }}>4–5 weeks</Text>.
          </Text>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.cardLabel}>ESTIMATED MEDICATION CONCENTRATION</Text>
          <Text style={[styles.cardSublabel, { color: subTextColor }]}>{settings.preferredDrug} · {currentStatus.currentLevel} mg remaining</Text>
          {timelineData ? (
            <LineChart
              data={timelineData}
              width={width - 70}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withHorizontalLines={false}
              withVerticalLines={false}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: subTextColor }}>Log a shot to see your projections!</Text>
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>THIS WEEK</Text>
          <View style={styles.daysRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isToday = i === (new Date().getDay() + 6) % 7;
              const isPast = i < (new Date().getDay() + 6) % 7;
              return (
                <View key={i} style={styles.dayCol}>
                  <Text style={[styles.dayInitial, isToday && { color: themeColor }]}>{day}</Text>
                  <View style={[
                    styles.dayIndicator, 
                    isToday ? { backgroundColor: themeColor } : isPast ? { backgroundColor: `${themeColor}30` } : { backgroundColor: isDark ? '#333' : '#f0f0f2' }
                  ]}>
                    {isToday && <Text style={styles.nowText}>now</Text>}
                    {i === 0 && <Text style={{ fontSize: 10 }}>💉</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { fontSize: 19, fontWeight: '900' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  statusCard: { borderRadius: 20, padding: 18, borderWidth: 1.5, marginBottom: 20 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontSize: 15, fontWeight: '900' },
  statusSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  clinicalNote: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  chartCard: { marginBottom: 20 },
  cardLabel: { fontSize: 10, color: '#aaa', fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 },
  cardSublabel: { fontSize: 11, fontWeight: '600', marginBottom: 15 },
  chart: { borderRadius: 16, marginTop: 10, paddingRight: 40 },
  emptyChart: { height: 150, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 20 },
  daysRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  dayCol: { flex: 1, alignItems: 'center', gap: 6 },
  dayInitial: { fontSize: 10, fontWeight: '800', color: '#aaa' },
  dayIndicator: { width: '100%', height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nowText: { fontSize: 8, color: 'white', fontWeight: '900', textTransform: 'uppercase' },
})
