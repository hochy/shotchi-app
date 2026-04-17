import { useState, useEffect } from 'react'
import { logInjection, getInjections, calculateStreak, getCharacterState } from '../lib/database'

export const useInjections = () => {
  const [injections, setInjections] = useState([])
  const [streaks, setStreaks] = useState({ current: 0, longest: 0, nextDue: null })
  const [characterState, setCharacterState] = useState('neutral')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadInjections = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load data
      const [injectionsData, streaksData, characterStateData] = await Promise.all([
        getInjections(),
        calculateStreak(),
        getCharacterState()
      ])
      
      setInjections(injectionsData)
      setStreaks(streaksData)
      setCharacterState(characterStateData)
    } catch (err) {
      setError(err)
      console.error('Error loading injections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogInjection = async (scheduledFor, note = null) => {
    try {
      const newInjection = await logInjection({ scheduledFor, note })
      if (newInjection) {
        await loadInjections() // Refresh data
        return true
      }
      return false
    } catch (err) {
      setError(err)
      console.error('Error logging injection:', err)
      return false
    }
  }

  // Auto-refresh when app comes to foreground
  useEffect(() => {
    loadInjections()
    
    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(loadInjections, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    injections,
    streaks,
    characterState,
    loading,
    error,
    refresh: loadInjections,
    logInjection: handleLogInjection
  }
}