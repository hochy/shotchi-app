import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useInjections } from '../hooks/useInjections';
import { useSettings } from '../hooks/useSettings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

export default function WeightHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { weightEntries, loading } = useInjections();
  const { settings } = useSettings();
  const themeColor = settings.characterColor || '#7BAF8E';
  const [range, setRange] = useState('6m');

  const stats = useMemo(() => {
    if (weightEntries.length === 0) return { totalLost: 0, avgPerWeek: 0, start: '--', current: '--' };
    
    const current = parseFloat(weightEntries[0].weight);
    const start = parseFloat(weightEntries[weightEntries.length - 1].weight);
    const totalLost = (start - current).toFixed(1);
    
    // Estimate weeks since start
    const startDate = parseISO(weightEntries[weightEntries.length-1].logged_at);
    const weeks = Math.max(1, Math.round((new Date() - startDate) / (1000 * 60 * 60 * 24 * 7)));
    const avgPerWeek = (totalLost / weeks).toFixed(1);

    return { totalLost, avgPerWeek, start, current };
  }, [weightEntries]);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => themeColor ? `${themeColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(123, 175, 142, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    strokeWidth: 3,
  };

  const weightChartData = useMemo(() => {
    if (weightEntries.length < 2) return null;
    const slices = { '1m': 4, '3m': 12, '6m': 24 };
    const recentWeights = [...weightEntries].slice(0, slices[range]).reverse();
    const labels = recentWeights.map(w => format(parseISO(w.logged_at), 'MM/dd'));
    const data = recentWeights.map(w => parseFloat(w.weight));
    return { labels, datasets: [{ data }] };
  }, [weightEntries, range]);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weight History</Text>
          <Text style={styles.subtitle}>Since {weightEntries.length > 0 ? format(parseISO(weightEntries[weightEntries.length-1].logged_at), 'MMM d, yyyy') : 'Start'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: '#aaa' }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        {/* Hero Stats Banner */}
        <View style={[styles.heroBanner, { backgroundColor: themeColor }]}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>TOTAL LOST</Text>
              <Text style={styles.heroValue}>{stats.totalLost}<Text style={{ fontSize: 18 }}> lbs</Text></Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.heroLabel}>AVG / WEEK</Text>
              <Text style={styles.heroSubValue}>{stats.avgPerWeek}<Text style={{ fontSize: 13 }}> lbs</Text></Text>
            </View>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroGrid}>
            <View>
              <Text style={styles.heroGridLabel}>Start</Text>
              <Text style={styles.heroGridValue}>{stats.start} lbs</Text>
            </View>
            <View>
              <Text style={styles.heroGridLabel}>Current</Text>
              <Text style={styles.heroGridValue}>{stats.current} lbs</Text>
            </View>
            <View>
              <Text style={styles.heroGridLabel}>Goal</Text>
              <Text style={styles.heroGridValue}>150 lbs</Text>
            </View>
          </View>
        </View>

        {/* Trend Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>TREND</Text>
            <View style={styles.rangeTabs}>
              {['1m', '3m', '6m'].map(r => (
                <TouchableOpacity 
                  key={r} 
                  onPress={() => setRange(r)}
                  style={[styles.rangeTab, range === r && { backgroundColor: themeColor }]}
                >
                  <Text style={[styles.rangeTabText, range === r && { color: 'white' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {weightChartData ? (
            <LineChart
              data={weightChartData}
              width={width - 70}
              height={150}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}><Text style={{ color: '#aaa' }}>Add more logs to see trends!</Text></View>
          )}
        </Card>

        {/* Log Entries */}
        <Text style={styles.sectionLabel}>LOG ENTRIES</Text>
        <View style={{ gap: 8 }}>
          {weightEntries.map((e, i) => {
            const diff = i < weightEntries.length - 1 
              ? (parseFloat(weightEntries[i+1].weight) - parseFloat(e.weight)).toFixed(1)
              : null;
            return (
              <Card key={e.id} style={styles.logItem}>
                <View style={styles.logLeft}>
                  <View style={[styles.logIndicator, i === 0 ? { backgroundColor: themeColor } : { backgroundColor: '#eee' }]} />
                  <Text style={styles.logDate}>{format(parseISO(e.logged_at), 'MMM d, yyyy')}</Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logWeight}>{e.weight} lbs</Text>
                  {diff !== null && (
                    <Text style={[styles.logDiff, { color: parseFloat(diff) >= 0 ? '#4caf7d' : '#E74C3C' }]}>
                      {parseFloat(diff) >= 0 ? '↓' : '↑'} {Math.abs(diff)}
                    </Text>
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: '900', color: '#1c1c1e' },
  subtitle: { fontSize: 12, color: '#aaa', fontWeight: '600', marginTop: 2 },
  content: { padding: 20 },
  heroBanner: { borderRadius: 22, padding: 20, marginBottom: 25 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '800', marginBottom: 4 },
  heroValue: { fontSize: 42, fontWeight: '900', color: 'white' },
  heroSubValue: { fontSize: 28, fontWeight: '900', color: 'white' },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  heroGrid: { flexDirection: 'row', gap: 30 },
  heroGridLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '800' },
  heroGridValue: { fontSize: 15, color: 'white', fontWeight: '800', marginTop: 2 },
  card: { marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardLabel: { fontSize: 11, color: '#aaa', fontWeight: '800', letterSpacing: 0.5 },
  rangeTabs: { flexDirection: 'row', gap: 5 },
  rangeTab: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0f0f2' },
  rangeTabText: { fontSize: 10, fontWeight: '800', color: '#aaa' },
  chart: { paddingRight: 40, marginTop: 10 },
  sectionLabel: { fontSize: 11, color: '#aaa', fontWeight: '800', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase', marginLeft: 4 },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logIndicator: { width: 8, height: 8, borderRadius: 4 },
  logDate: { fontSize: 13, color: '#666', fontWeight: '600' },
  logRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logWeight: { fontSize: 15, fontWeight: '800', color: '#1c1c1e' },
  logDiff: { fontSize: 11, fontWeight: '800' },
  emptyChart: { height: 120, justifyContent: 'center', alignItems: 'center' },
});
