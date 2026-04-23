import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { MotiView } from 'moti'
import * as Haptics from 'expo-haptics'
import { format, parseISO } from 'date-fns'
import { generateDoctorReport } from '../lib/pdfGenerator'
import SkeletonLoader from '../components/SkeletonLoader'
import StatPill from '../components/StatPill'
import Card from '../components/Card'
import Btn from '../components/Btn'

const { width } = Dimensions.get('window')

export default function HistoryScreen({ navigation }) {
  const { injections, weightEntries, sideEffects, loading } = useInjections()
  const { settings } = useSettings()
  const isDark = settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'
  const textColor = isDark ? 'white' : '#1c1c1e'
  const subTextColor = isDark ? '#aaa' : '#666'
  const cardBg = isDark ? '#1c1c1e' : 'white'

  const handleExport = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await generateDoctorReport({
        profile: settings,
        injections: injections,
        weights: weightEntries,
        sideEffects: sideEffects
      })
    } catch (error) {
      console.error('Export Error:', error)
      Alert.alert('Export Error', 'Failed to generate PDF report.')
    }
  }

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    color: (opacity = 1) => themeColor ? `${themeColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(123, 175, 142, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 2,
  }), [themeColor, isDark, cardBg]);

  const stats = useMemo(() => {
    const onTimeCount = injections.filter(i => i.logged_at && i.scheduled_for === i.logged_at.split('T')[0]).length
    const onTimeRate = injections.length > 0 ? Math.round((onTimeCount / injections.length) * 100) : 0
    const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : '--'
    
    let lostWeight = '0'
    if (weightEntries.length > 1) {
      const start = parseFloat(weightEntries[weightEntries.length - 1].weight)
      const current = parseFloat(weightEntries[0].weight)
      lostWeight = (start - current).toFixed(1)
    }

    const siteCounts = injections.reduce((acc, curr) => {
      if (curr.injection_site) {
        acc[curr.injection_site] = (acc[curr.injection_site] || 0) + 1
      }
      return acc
    }, {})

    const siteColors = [themeColor, '#7B8EAF', '#AF7B9C', '#AF9C7B', '#7BAFAF', '#F5A623']
    const siteData = Object.keys(siteCounts).map((key, idx) => ({
      name: key.replace('_', ' '),
      population: siteCounts[key],
      color: siteColors[idx % siteColors.length],
      legendFontColor: isDark ? '#aaa' : '#7F7F7F',
      legendFontSize: 10
    }))

    return { onTime: onTimeRate, currentWeight, lostWeight, siteData }
  }, [injections, weightEntries, themeColor, isDark])

  const weightChartData = useMemo(() => {
    if (weightEntries.length < 2) return null
    const recentWeights = [...weightEntries].slice(0, 6).reverse()
    const labels = recentWeights.map(w => format(parseISO(w.logged_at), 'MMM'))
    const data = recentWeights.map(w => parseFloat(w.weight))
    return { labels, datasets: [{ data }] }
  }, [weightEntries])

  if (loading) {
    return (
      <View style={[styles.container, isDark && { backgroundColor: '#000' }, { paddingHorizontal: 20 }]}>
        <View style={styles.header}>
          <SkeletonLoader width={150} height={32} />
          <SkeletonLoader width={30} height={30} />
        </View>
        <View style={styles.statsRow}>
          <SkeletonLoader width={(width-60)/3} height={60} borderRadius={14} />
          <SkeletonLoader width={(width-60)/3} height={60} borderRadius={14} />
          <SkeletonLoader width={(width-60)/3} height={60} borderRadius={14} />
        </View>
        <SkeletonLoader width="100%" height={200} borderRadius={20} style={{ marginTop: 20 }} />
      </View>
    )
  }

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#000' }]}>
      <View style={[styles.header, isDark && { backgroundColor: '#1c1c1e' }]}>
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>Your Journey</Text>
          <Text style={[styles.headerSub, { color: subTextColor }]}>{injections.length} total injections</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: '#aaa' }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <StatPill label="Total shots" value={injections.length} themeColor={themeColor} />
          <StatPill label="On-time" value={`${stats.onTime}%`} themeColor={themeColor} />
          <StatPill label="Lost" value={`${stats.lostWeight} lbs`} themeColor={themeColor} />
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardLabel, { color: subTextColor }]}>WEIGHT TREND — 6 MONTHS</Text>
          {weightChartData ? (
            <LineChart
              data={weightChartData}
              width={width - 70}
              height={120}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}><Text style={{ color: subTextColor }}>Add weigh-ins to see your trend!</Text></View>
          )}
          <View style={styles.weightSummary}>
            <Text style={[styles.currentWeightText, { color: textColor }]}>{stats.currentWeight} lbs</Text>
            <Text style={[styles.weightChange, { color: parseFloat(stats.lostWeight) >= 0 ? '#4caf7d' : '#E74C3C' }]}>
              {parseFloat(stats.lostWeight) >= 0 ? '↓' : '↑'} {Math.abs(parseFloat(stats.lostWeight))} lbs total
            </Text>
          </View>
        </Card>

        {stats.siteData.length > 0 && (
          <Card style={styles.card}>
            <Text style={[styles.cardLabel, { color: subTextColor }]}>SITE ROTATION</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PieChart
                data={stats.siteData}
                width={width - 60}
                height={150}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={true}
              />
            </View>
          </Card>
        )}

        <View style={styles.listSection}>
          <Text style={[styles.cardLabel, { color: subTextColor }]}>RECENT INJECTIONS</Text>
          <View style={{ gap: 8 }}>
            {injections.length === 0 ? (
              <Text style={[styles.emptyText, { color: subTextColor }]}>No shots logged yet.</Text>
            ) : (
              injections.slice(0, 10).map((item) => (
                <Card key={item.id} style={styles.historyCard}>
                  <View style={[styles.historyIconBox, isDark && { backgroundColor: '#333' }]}><Text style={{ fontSize: 17 }}>💉</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.historyTitle, { color: textColor }]}>{item.drug_name || 'GLP-1'} · {item.injection_site?.replace('_', ' ')}</Text>
                    <Text style={[styles.historyDate, { color: subTextColor }]}>{format(parseISO(item.scheduled_for), 'MMM d, yyyy')}</Text>
                  </View>
                  <Text style={[styles.historyWeight, { color: themeColor }]}>{item.weight_at_log || '--'} lbs</Text>
                </Card>
              ))
            )}
          </View>
        </View>

        <Btn full onPress={handleExport} color={themeColor} style={{ marginTop: 20 }}>
          📤 Export for Doctor
        </Btn>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 22, fontWeight: '900' },
  headerSub: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: { marginBottom: 20 },
  cardLabel: { fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5, marginLeft: 4 },
  chart: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },
  weightSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  currentWeightText: { fontSize: 24, fontWeight: '900' },
  weightChange: { fontSize: 13, fontWeight: '800' },
  listSection: { marginTop: 10 },
  historyCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18 },
  historyIconBox: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#F0F0F2', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  historyTitle: { fontSize: 13, fontWeight: '800', textTransform: 'capitalize' },
  historyDate: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  historyWeight: { fontSize: 13, fontWeight: '800' },
  emptyChart: { height: 100, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', padding: 20 },
})
