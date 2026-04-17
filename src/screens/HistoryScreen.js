import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { getInjections } from '../lib/database'

export default function HistoryScreen({ navigation }) {
  const [injections, setInjections] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    onTimeRate: '0%',
    avgDayLogged: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInjections()
  }, [])

  const loadInjections = async () => {
    try {
      const injectionsData = await getInjections()
      setInjections(injectionsData)
      
      // Calculate stats
      const total = injectionsData.length
      const onTimeCount = injectionsData.filter(injection => 
        injection.logged_at && injection.scheduled_for === injection.logged_at.split('T')[0]
      ).length
      const onTimeRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 0
      
      setStats({
        total,
        onTimeRate: `${onTimeRate}%`,
        avgDayLogged: total > 0 ? Math.round(total / 4) : 0, // Assuming 4 months of data
      })
    } catch (error) {
      console.error('Error loading injections:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderMonth = (monthName, injections) => {
    return (
      <View key={monthName} style={styles.monthSection}>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <View style={styles.datesContainer}>
          {injections.map(injection => (
            <View key={injection.id} style={styles.dateRow}>
              <Text style={styles.dateText}>{injection.date}</Text>
              <Text style={styles.timeText}>{injection.time}</Text>
              <Text style={styles.statusText}>{injection.status}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading history...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Total injections:</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>On-time rate:</Text>
            <Text style={styles.statValue}>{stats.onTimeRate}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Avg days logged:</Text>
            <Text style={styles.statValue}>{stats.avgDayLogged}</Text>
          </View>
        </View>

        {/* Monthly history */}
        <View style={styles.historyContainer}>
          {renderMonthGroups()}
        </View>
      </ScrollView>
    </View>
  )

  const renderMonthGroups = () => {
    const monthGroups = {}
    
    // Group injections by month
    injections.forEach(injection => {
      const month = new Date(injection.scheduled_for).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
      
      if (!monthGroups[month]) {
        monthGroups[month] = []
      }
      
      monthGroups[month].push(injection)
    })
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthGroups).sort((a, b) => {
      const monthA = new Date(a)
      const monthB = new Date(b)
      return monthB - monthA
    })
    
    return sortedMonths.map(month => {
      const monthInjections = monthGroups[month].sort((a, b) => 
        new Date(b.scheduled_for) - new Date(a.scheduled_for)
      )
      return renderMonth(month, monthInjections)
    })
  }
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
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyContainer: {
    marginTop: 10,
  },
  monthSection: {
    marginBottom: 30,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  datesContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateRow:last-child: {
    borderBottomWidth: 0,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    width: 80,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    width: 80,
  },
  statusText: {
    fontSize: 18,
    color: '#7BAF8E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})