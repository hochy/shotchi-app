import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Dimensions } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useInjections } from '../hooks/useInjections'
import { useSettings } from '../hooks/useSettings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BodyDiagram from '../components/BodyDiagram'
import Adi from '../components/Adi'
import Btn from '../components/Btn'
import Card from '../components/Card'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'

const { width } = Dimensions.get('window')

export default function LogShotScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { injections, logInjection, logWeight } = useInjections()
  const { settings } = useSettings()
  const isDark = settings.darkMode
  const themeColor = settings.characterColor || '#7BAF8E'
  const textColor = isDark ? 'white' : '#1c1c1e'
  const subTextColor = isDark ? '#aaa' : '#666'
  const appBg = isDark ? '#000' : '#F7F8FA'
  const headerBg = isDark ? '#1c1c1e' : 'white'
  
  const [step, setStep] = useState(1)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [note, setNote] = useState('')
  const [weight, setWeight] = useState('')
  const [injectionSite, setInjectionSite] = useState(null)
  const [drugName, setDrugName] = useState(settings.preferredDrug || 'Semaglutide (Wegovy)')
  const [dosage, setDosage] = useState(settings.preferredDosage || 0.25)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings.preferredDrug) setDrugName(settings.preferredDrug)
    if (settings.preferredDosage) setDosage(settings.preferredDosage)
  }, [settings.preferredDrug, settings.preferredDosage])

  const lastUsedSite = injections.length > 0 ? injections[0].injection_site : null

  const drugs = ['Semaglutide (Wegovy)', 'Semaglutide (Ozempic)', 'Tirzepatide (Zepbound)', 'Tirzepatide (Mounjaro)', 'Liraglutide (Saxenda)']
  const dosageOptions = [0.25, 0.5, 0.75, 1.0, 1.7, 2.0, 2.4, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0]

  const handleFinalConfirm = async () => {
    try {
      setLoading(true)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(time.getHours(), time.getMinutes(), 0, 0)
      const formattedDate = scheduledDate.toISOString().split('T')[0]

      const result = await logInjection({ 
        scheduledFor: formattedDate, 
        note: note || null,
        injectionSite: injectionSite,
        drugName: drugName,
        dosage: dosage,
        photoUrl: image
      })

      if (weight && !isNaN(parseFloat(weight))) {
        await logWeight(parseFloat(weight), 'lbs')
      }
      
      if (result) setStep(3)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: subTextColor }}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Log Your Shot</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.row}>
          <Card style={styles.dateTimeBox}>
            <Text style={styles.miniLabel}>DATE</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.dateTimeText, { color: textColor }]}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.dateTimeBox}>
            <Text style={styles.miniLabel}>TIME</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={[styles.dateTimeText, { color: textColor }]}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {showDatePicker && <DateTimePicker value={date} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}
        {showTimePicker && <DateTimePicker value={time} mode="time" onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />}

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>INJECTION SITE</Text>
          <BodyDiagram
            selectedSite={injectionSite}
            onSelectSite={setInjectionSite}
            themeColor={themeColor}
            lastUsedSite={lastUsedSite}
          />
          <View style={[styles.siteIndicator, { backgroundColor: isDark ? `${themeColor}25` : `${themeColor}15` }]}>
            <Text style={[styles.siteIndicatorText, { color: themeColor }]}>
              📍 {injectionSite ? injectionSite.replace('_', ' ').toUpperCase() : 'Select a site'}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>MEDICATION & DOSAGE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {drugs.map(d => (
                <TouchableOpacity 
                  key={d} 
                  onPress={() => setDrugName(d)}
                  style={[styles.pillChip, isDark && { backgroundColor: '#333', borderColor: '#444' }, drugName === d && { backgroundColor: themeColor, borderColor: themeColor }]}
                >
                  <Text style={[styles.pillChipText, isDark && { color: '#ccc' }, drugName === d && { color: 'white' }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {dosageOptions.map(d => (
                <TouchableOpacity 
                  key={d} 
                  onPress={() => setDosage(d)}
                  style={[styles.pillChip, isDark && { backgroundColor: '#333', borderColor: '#444' }, dosage === d && { backgroundColor: themeColor, borderColor: themeColor }]}
                >
                  <Text style={[styles.pillChipText, isDark && { color: '#ccc' }, dosage === d && { color: 'white' }]}>{d} mg</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Btn full onPress={() => setStep(2)} color={themeColor}>
          Next — Log Weight →
        </Btn>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15, alignItems: 'center' }}>
          <Text style={{ color: '#aaa', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

  const renderStep2 = () => (
    <View style={[styles.stepContainer, { backgroundColor: appBg }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: subTextColor }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Log Weight</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.centerStage}>
        <Adi state="neutral" color={themeColor} size={100} />
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={[styles.centerTitle, { color: textColor }]}>How much do you weigh today?</Text>
          <Text style={styles.centerSub}>Optional — helps track your progress</Text>
        </View>
        
        <View style={styles.weightPicker}>
          <TouchableOpacity onPress={() => setWeight(w => String(Math.max(0, parseFloat(w || 0) - 1)))} style={[styles.weightCircle, { backgroundColor: `${themeColor}25` }]}>
            <Text style={[styles.weightCircleText, { color: themeColor }]}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.weightLarge, { color: themeColor }]}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={isDark ? '#333' : '#eee'}
          />
          <TouchableOpacity onPress={() => setWeight(w => String(parseFloat(w || 0) + 1))} style={[styles.weightCircle, { backgroundColor: `${themeColor}25` }]}>
            <Text style={[styles.weightCircleText, { color: themeColor }]}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.lbsLabel}>lbs</Text>

        <View style={{ width: '100%', gap: 10, marginTop: 40 }}>
          <Btn full onPress={handleFinalConfirm} color={themeColor} disabled={loading}>
            {loading ? 'Saving...' : 'Save & Confirm 🎉'}
          </Btn>
          <TouchableOpacity onPress={handleFinalConfirm} style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ color: '#aaa', fontWeight: 'bold' }}>Skip weight</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderStep3 = () => (
    <View style={[styles.successContainer, { backgroundColor: appBg }]}>
      <Adi state="excited" color={themeColor} size={150} />
      <Text style={[styles.successTitle, { color: textColor }]}>Shot logged! 🎉</Text>
      <Text style={styles.successSub}>
        {drugName} · {injectionSite?.replace('_', ' ')} · {weight || '--'} lbs
      </Text>
      <Btn full onPress={() => navigation.navigate('Home')} color={themeColor} style={{ marginTop: 20 }}>
        Back to Home
      </Btn>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { fontSize: 19, fontWeight: '900' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  dateTimeBox: { flex: 1, padding: 12, borderRadius: 16 },
  miniLabel: { fontSize: 9, color: '#aaa', fontWeight: '800', marginBottom: 2 },
  dateTimeText: { fontSize: 14, fontWeight: '800' },
  card: { marginBottom: 15 },
  cardLabel: { fontSize: 10, color: '#aaa', fontWeight: '800', marginBottom: 12, letterSpacing: 0.5 },
  siteIndicator: { padding: 10, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  siteIndicatorText: { fontWeight: '900', fontSize: 13 },
  pillChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f9f9f9' },
  pillChipText: { fontSize: 13, fontWeight: '700', color: '#666' },
  stepContainer: { flex: 1 },
  centerStage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  centerTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  centerSub: { fontSize: 13, color: '#aaa', fontWeight: '600', marginTop: 4 },
  weightPicker: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 20 },
  weightCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  weightCircleText: { fontSize: 24, fontWeight: '900' },
  weightLarge: { fontSize: 54, fontWeight: '900', minWidth: 100, textAlign: 'center' },
  lbsLabel: { fontSize: 16, color: '#aaa', fontWeight: '700', marginTop: -5 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 15 },
  successTitle: { fontSize: 26, fontWeight: '900' },
  successSub: { fontSize: 14, color: '#aaa', fontWeight: '600', textAlign: 'center' },
})
