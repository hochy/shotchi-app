import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { MotiView } from 'moti'
import * as Haptics from 'expo-haptics'
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { generateDoctorReport } from '../lib/pdfGenerator'

const { width } = Dimensions.get('window')

export default function HistoryScreen({ navigation }) {
  const { injections, weightEntries, sideEffects, streaks, loading } = useInjections()
  const { settings } = useSettings()

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
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => {
      // Use the theme color for the chart line
      return settings.characterColor ? `${settings.characterColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(123, 175, 142, ${opacity})`
    },
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  }), [settings.characterColor]);

  const stats = useMemo(() => {
    if (!injections.length && !weightEntries.length && !sideEffects.length) {
      return { onTime: 0, siteData: [], currentWeight: '--', topSymptom: '--' }
    }
    
    // Calculate on-time rate
    const onTimeCount = injections.filter(i => i.logged_at && i.scheduled_for === i.logged_at.split('T')[0]).length
    const onTimeRate = injections.length > 0 ? Math.round((onTimeCount / injections.length) * 100) : 0

    // Calculate site distribution
    const siteCounts = injections.reduce((acc, curr) => {
      if (curr.injection_site) {
        acc[curr.injection_site] = (acc[curr.injection_site] || 0) + 1
      }
      return acc
    }, {})

    const siteColors = [settings.characterColor || '#7BAF8E', '#7B8EAF', '#AF7B9C', '#AF9C7B', '#7BAFAF']
    const siteData = Object.keys(siteCounts).map((key, idx) => ({
      name: key.replace('_', ' '),
      population: siteCounts[key],
      color: siteColors[idx % siteColors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }))

    const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : '--'

    // Calculate top symptom
    const symptomCounts = sideEffects.reduce((acc, curr) => {
      acc[curr.symptom] = (acc[curr.symptom] || 0) + 1
      return acc
    }, {})
    const topSymptom = Object.keys(symptomCounts).sort((a, b) => symptomCounts[b] - symptomCounts[a])[0] || '--'

    return { onTime: onTimeRate, siteData, currentWeight, topSymptom }
  }, [injections, weightEntries, sideEffects, settings.characterColor])

  // Prep line chart data (last 6 months)
  const chartData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date()
    })

    const labels = last6Months.map(m => format(m, 'MMM'))
    const data = last6Months.map(m => {
      const monthStart = startOfMonth(m)
      const shotsInMonth = injections.filter(i => {
        const shotDate = parseISO(i.scheduled_for)
        return shotDate >= monthStart && shotDate <= m
      }).length
      return shotsInMonth
    })

    return { labels, datasets: [{ data }] }
  }, [injections])

  // Prep weight chart data
  const weightChartData = useMemo(() => {
    if (weightEntries.length < 2) return null
    const recentWeights = [...weightEntries].slice(0, 7).reverse()
    const labels = recentWeights.map(w => format(parseISO(w.logged_at), 'MM/dd'))
    const data = recentWeights.map(w => parseFloat(w.weight))
    return { labels, datasets: [{ data }] }
  }, [weightEntries])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    )
  }

  const renderHistoryItem = (item) => (
    <MotiView 
      key={item.id}
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      style={[styles.historyCard, { borderLeftColor: settings.characterColor }]}
    >
      <View style={styles.cardMain}>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>{format(parseISO(item.scheduled_for), 'EEEE, MMM d')}</Text>
            <Text style={[styles.cardStatus, { color: settings.characterColor }]}>On Time</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardDrug}>💊 {item.drug_name || 'Unspecified'}</Text>
            <Text style={styles.cardSite}>📍 {item.injection_site?.replace('_', ' ') || 'Not specified'}</Text>
            {item.note && <Text style={styles.cardNote}>" {item.note} "</Text>}
          </View>
        </View>
        
        {item.photo_url && (
          <Image source={{ uri: item.photo_url }} style={styles.cardThumbnail} />
        )}
      </View>
    </MotiView>
  )

  const renderSideEffectItem = (item) => (
    <MotiView 
      key={item.id}
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={styles.symptomCard}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardSymptom}>🤒 {item.symptom}</Text>
        <Text style={[styles.cardSeverity, { color: item.severity > 3 ? '#FF5252' : '#FF9800' }]}>
          Level {item.severity}
        </Text>
      </View>
      <Text style={styles.cardTime}>{format(parseISO(item.logged_at), 'MMM d, h:mm a')}</Text>
      {item.notes && <Text style={styles.cardNote}>"{item.notes}"</Text>}
    </MotiView>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
            <Text style={[styles.exportText, { color: settings.characterColor }]}>Export PDF 📄</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            navigation.goBack()
          }}
        >
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streaks.current}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>⚖️</Text>
            <Text style={styles.statValue}>{stats.currentWeight}</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🤒</Text>
            <Text style={styles.statValue} numberOfLines={1}>{stats.topSymptom}</Text>
            <Text style={styles.statLabel}>Top Issue</Text>
          </View>
        </View>

        {/* Weight Trend Chart */}
        {weightChartData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight Journey (lbs)</Text>
            <LineChart
              data={weightChartData}
              width={width - 40}
              height={180}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(123, 175, 142, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Injection Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Injection Activity</Text>
          <LineChart
            data={chartData}
            width={width - 40}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {stats.siteData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Site Rotation</Text>
            <PieChart
              data={stats.siteData}
              width={width - 40}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Side Effects History */}
        {sideEffects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Symptoms</Text>
            {sideEffects.slice(0, 5).map(renderSideEffectItem)}
          </View>
        )}

        {/* Recent History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          {injections.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No shots logged yet. Adi is waiting!</Text>
            </View>
          ) : (
            injections.slice(0, 10).map(renderHistoryItem)
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#7BAF8E', fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  exportButton: {
    marginTop: 5,
  },
  exportText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  close: { fontSize: 24, color: '#666' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statEmoji: { fontSize: 20, marginBottom: 5 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  statLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase', fontWeight: 'bold' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#333' },
  chart: { borderRadius: 16, marginVertical: 8 },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cardThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  symptomCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardSymptom: { fontWeight: 'bold', color: '#333', fontSize: 16 },
  cardSeverity: { fontSize: 12, fontWeight: 'bold' },
  cardTime: { fontSize: 12, color: '#999', marginBottom: 5 },
  cardDate: { fontWeight: 'bold', color: '#333' },
  cardStatus: { fontSize: 12, fontWeight: 'bold' },
  cardFooter: { gap: 4 },
  cardDrug: { fontSize: 13, color: '#333', fontWeight: '600' },
  cardSite: { fontSize: 13, color: '#666' },
  cardNote: { fontSize: 13, color: '#999', fontStyle: 'italic' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', textAlign: 'center' },
})
