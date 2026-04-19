import { differenceInHours, parseISO, addHours, format, isAfter } from 'date-fns'

const MEDICATION_DATA = {
  'Semaglutide (Wegovy)': { halfLifeHours: 168 }, // 7 days
  'Semaglutide (Ozempic)': { halfLifeHours: 168 },
  'Tirzepatide (Zepbound)': { halfLifeHours: 120 }, // 5 days
  'Tirzepatide (Mounjaro)': { halfLifeHours: 120 },
  'Liraglutide (Saxenda)': { halfLifeHours: 13 }, // 13 hours
}

const DEFAULT_HALF_LIFE = 168

/**
 * Calculates the estimated current level of medication in the body.
 * @param {Array} injections - List of injection objects
 * @returns {Object} { currentLevel, unit: 'mg', percentage: 0-100 }
 */
export const calculateCurrentLevel = (injections) => {
  if (!injections || injections.length === 0) return { currentLevel: 0, percentage: 0 }

  const now = new Date()
  let totalMg = 0

  injections.forEach(inj => {
    const shotDate = parseISO(inj.scheduled_for)
    const hoursPast = differenceInHours(now, shotDate)
    
    if (hoursPast < 0) return // Skip future shots

    const drug = MEDICATION_DATA[inj.drug_name] || { halfLifeHours: DEFAULT_HALF_LIFE }
    const dosage = parseFloat(inj.dosage) || 0.25
    
    // Remaining = Dose * (0.5 ^ (hoursPast / halfLife))
    const remaining = dosage * Math.pow(0.5, hoursPast / drug.halfLifeHours)
    totalMg += remaining
  })

  // Determine percentage relative to steady state or max dose
  // For simplicity, we'll use a relative scale based on the most recent dose
  const lastDose = parseFloat(injections[0]?.dosage) || 0.25
  const percentage = Math.min(Math.round((totalMg / (lastDose * 2)) * 100), 100)

  return {
    currentLevel: totalMg.toFixed(2),
    percentage
  }
}

/**
 * Generates data for a 7-day projection chart.
 * @param {Array} injections - List of injection objects
 * @returns {Object} Chart data for react-native-chart-kit
 */
export const getTimelineData = (injections) => {
  if (!injections || injections.length === 0) return null

  const now = new Date()
  const dataPoints = []
  const labels = []

  // Generate 8 points (one every 24 hours for a week)
  for (let i = 0; i <= 7; i++) {
    const targetDate = addHours(now, i * 24)
    let totalMg = 0

    injections.forEach(inj => {
      const shotDate = parseISO(inj.scheduled_for)
      const hoursPast = differenceInHours(targetDate, shotDate)
      
      if (hoursPast < 0) return

      const drug = MEDICATION_DATA[inj.drug_name] || { halfLifeHours: DEFAULT_HALF_LIFE }
      const dosage = parseFloat(inj.dosage) || 0.25
      const remaining = dosage * Math.pow(0.5, hoursPast / drug.halfLifeHours)
      totalMg += remaining
    })

    dataPoints.push(parseFloat(totalMg.toFixed(2)))
    labels.push(i === 0 ? 'Now' : format(targetDate, 'EEE'))
  }

  return {
    labels,
    datasets: [{ data: dataPoints }]
  }
}
