import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { getTimelineData, calculateCurrentLevel } from '../lib/medicationLevels'
import { MotiView } from 'moti'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

export default function MedicationTimelineScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { injections, loading } = useInjections()
  const { settings } = useSettings()

  const timelineData = useMemo(() => getTimelineData(injections), [injections])
  const currentStatus = useMemo(() => calculateCurrentLevel(injections), [injections])

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => settings.characterColor ? `${settings.characterColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(123, 175, 142, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 3,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: settings.characterColor
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Timeline...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medication Timeline</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>CURRENT CONCENTRATION</Text>
          <Text style={[styles.infoValue, { color: settings.characterColor }]}>{currentStatus.currentLevel} mg</Text>
          <Text style={styles.infoSubtitle}>Estimated based on half-life of {settings.preferredDrug}</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>7-Day Projection</Text>
          {timelineData ? (
            <LineChart
              data={timelineData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>Log your first shot to see your timeline!</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Understanding the Curve</Text>
          <View style={styles.detailRow}>
            <View style={[styles.dot, { backgroundColor: settings.characterColor }]} />
            <Text style={styles.detailText}>Peaks usually occur 24-48 hours after injection.</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={[styles.dot, { backgroundColor: settings.characterColor }]} />
            <Text style={styles.detailText}>The "Trough" is the lowest level, usually the day before your next dose.</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={[styles.dot, { backgroundColor: settings.characterColor }]} />
            <Text style={styles.detailText}>Steady state is achieved after about 4-5 weeks of consistent dosing.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.backButton, { borderColor: settings.characterColor }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: settings.characterColor }]}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  close: { fontSize: 24, color: '#666' },
  content: { padding: 20 },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 5 },
  infoValue: { fontSize: 36, fontWeight: 'bold' },
  infoSubtitle: { fontSize: 13, color: '#666', marginTop: 5 },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  chart: { borderRadius: 16, marginVertical: 8, paddingRight: 40 },
  emptyChart: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999' },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  detailText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
  backButton: {
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
  },
  backButtonText: { fontSize: 16, fontWeight: 'bold' },
})
