import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as database from '../lib/database'
import { supabase } from '../lib/supabase'
import * as NotificationService from '../lib/notifications'

const AppStateContext = createContext()

export const AppStateProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [injections, setInjections] = useState([])
  const [weightEntries, setWeightEntries] = useState([])
  const [settings, setSettings] = useState({
    injectionDay: 'monday',
    reminderTime: '09:00',
    notificationsEnabled: true,
    overdueEnabled: true,
    characterType: 'blob',
    characterColor: '#7BAF8E',
    hasCompletedOnboarding: false,
    lastMilestoneCelebrated: 0,
    preferredDrug: 'Semaglutide (Wegovy)',
    preferredDosage: 0.25
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
        stateData,
        weightsData
      ] = await Promise.all([
        database.getProfile(),
        database.getInjections(),
        database.getStreaks(),
        database.getCharacterState(),
        database.getWeightEntries()
      ])

      if (profileData) {
        setSettings({
          injectionDay: profileData.injection_day,
          reminderTime: profileData.reminder_time,
          notificationsEnabled: profileData.notifications_enabled,
          overdueEnabled: profileData.overdue_enabled,
          characterType: profileData.character_type,
          characterColor: profileData.character_color,
          hasCompletedOnboarding: profileData.has_completed_onboarding,
          lastMilestoneCelebrated: profileData.last_milestone_celebrated || 0,
          preferredDrug: profileData.preferred_drug || 'Semaglutide (Wegovy)',
          preferredDosage: profileData.preferred_dosage || 0.25,
          dosesOnHand: profileData.doses_on_hand || 0,
          refillThreshold: profileData.refill_threshold || 1
        })
      }

      setInjections(injectionsData || [])
      setWeightEntries(weightsData || [])
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

  const logWeight = async (weight, unit) => {
    const result = await database.logWeight(weight, unit)
    if (result) await loadAllData()
    return result
  }

  const updateSettings = async (updates) => {
    // Strictly map to database column names (snake_case)
    const dbUpdates = {}
    
    if (updates.injectionDay !== undefined || updates.injection_day !== undefined) 
      dbUpdates.injection_day = updates.injectionDay || updates.injection_day
    
    if (updates.reminderTime !== undefined || updates.reminder_time !== undefined) 
      dbUpdates.reminder_time = updates.reminderTime || updates.reminder_time
    
    if (updates.notificationsEnabled !== undefined || updates.notifications_enabled !== undefined) 
      dbUpdates.notifications_enabled = updates.notificationsEnabled ?? updates.notifications_enabled
    
    if (updates.overdueEnabled !== undefined || updates.overdue_enabled !== undefined) 
      dbUpdates.overdue_enabled = updates.overdueEnabled ?? updates.overdue_enabled
    
    if (updates.characterType !== undefined || updates.character_type !== undefined) 
      dbUpdates.character_type = updates.characterType || updates.character_type
    
    if (updates.characterColor !== undefined || updates.character_color !== undefined) 
      dbUpdates.character_color = updates.characterColor || updates.character_color
    
    if (updates.hasCompletedOnboarding !== undefined || updates.has_completed_onboarding !== undefined) 
      dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding ?? updates.has_completed_onboarding
    
    if (updates.lastMilestoneCelebrated !== undefined || updates.last_milestone_celebrated !== undefined) 
      dbUpdates.last_milestone_celebrated = updates.lastMilestoneCelebrated ?? updates.last_milestone_celebrated
    
    if (updates.preferredDrug !== undefined || updates.preferred_drug !== undefined)
      dbUpdates.preferred_drug = updates.preferredDrug || updates.preferred_drug
    
    if (updates.preferredDosage !== undefined || updates.preferred_dosage !== undefined)
      dbUpdates.preferred_dosage = updates.preferredDosage ?? updates.preferred_dosage
    
    if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone

    const result = await database.updateProfile(dbUpdates)
    if (result) {
      await loadAllData()
      
      // Notification rescheduling logic
      if (dbUpdates.injection_day || dbUpdates.reminder_time || dbUpdates.notifications_enabled === true) {
        const profile = await database.getProfile()
        if (profile && (dbUpdates.notifications_enabled !== false && profile.notifications_enabled)) {
          await NotificationService.scheduleWeeklyReminder(
            profile.injection_day,
            profile.reminder_time
          )
        }
      } else if (dbUpdates.notifications_enabled === false) {
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

  const resetAllData = async () => {
    const result = await database.clearAllInjections()
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
        setWeightEntries([])
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
    weightEntries,
    sideEffects,
    settings,
    streaks,
    characterState,
    loading,
    refreshing,
    refresh: loadAllData,
    logInjection,
    logWeight,
    logSideEffect,
    updateSettings,
    deleteInjection,
    resetAllData
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
onst context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
 be used within an AppStateProvider')
  }
  return context
}
onst context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
