import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as database from '../lib/database'
import { supabase } from '../lib/supabase'
import * as NotificationService from '../lib/notifications'

const AppStateContext = createContext()

export const AppStateProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [injections, setInjections] = useState([])
  const [settings, setSettings] = useState({
    injectionDay: 'monday',
    reminderTime: '09:00',
    notificationsEnabled: true,
    overdueEnabled: true,
    characterType: 'blob',
    characterColor: '#7BAF8E',
    hasCompletedOnboarding: false
  })
  const [streaks, setStreaks] = useState({ current: 0, longest: 0, nextDue: null })
  const [characterState, setCharacterState] = useState('waiting')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadAllData = useCallback(async () => {
    try {
      setRefreshing(true)
      
      const [
        profileData,
        injectionsData,
        streaksData,
        stateData
      ] = await Promise.all([
        database.getProfile(),
        database.getInjections(),
        database.getStreaks(),
        database.getCharacterState()
      ])

      if (profileData) {
        setSettings({
          injectionDay: profileData.injection_day,
          reminderTime: profileData.reminder_time,
          notificationsEnabled: profileData.notifications_enabled,
          overdueEnabled: profileData.overdue_enabled,
          characterType: profileData.character_type,
          characterColor: profileData.character_color,
          hasCompletedOnboarding: profileData.has_completed_onboarding
        })
      }

      setInjections(injectionsData || [])
      setStreaks(streaksData || { current: 0, longest: 0, nextDue: null })
      setCharacterState(stateData || 'neutral')
    } catch (error) {
      console.error('Error loading app state:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Mutations with automatic refresh
  const logInjection = async (data) => {
    const result = await database.logInjection(data)
    if (result) await loadAllData()
    return result
  }

  const updateSettings = async (updates) => {
    const result = await database.updateProfile(updates)
    if (result) {
      await loadAllData()
      
      // If day or time changed, reschedule notifications
      if (updates.injection_day || updates.reminder_time || updates.notifications_enabled === true) {
        const profile = await database.getProfile()
        if (profile && (updates.notifications_enabled !== false && profile.notifications_enabled)) {
          await NotificationService.scheduleWeeklyReminder(
            profile.injection_day,
            profile.reminder_time
          )
        }
      } else if (updates.notifications_enabled === false) {
        await NotificationService.cancelAllScheduledNotifications()
      }
    }
    return result
  }

  const deleteInjection = async (id) => {
    const result = await database.deleteInjection(id)
    if (result) await loadAllData()
    return result
  }

  // Auth listener
  useEffect(() => {
    // Initial permission request
    NotificationService.requestPermissions()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadAllData()
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadAllData()
      else {
        setInjections([])
        setStreaks({ current: 0, longest: 0, nextDue: null })
        setCharacterState('waiting')
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadAllData])

  const value = {
    session,
    injections,
    settings,
    streaks,
    characterState,
    loading,
    refreshing,
    refresh: loadAllData,
    logInjection,
    updateSettings,
    deleteInjection
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
