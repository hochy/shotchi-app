import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as database from '../lib/database'
import { supabase } from '../lib/supabase'
import * as NotificationService from '../lib/notifications'
import { HealthService } from '../lib/healthService'

const AppStateContext = createContext()

export const AppStateProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [injections, setInjections] = useState([])
  const [weightEntries, setWeightEntries] = useState([])
  const [sideEffects, setSideEffects] = useState([])
  const [settings, setSettings] = useState({
    nickname: '',
    darkMode: false,
    injectionDay: 'monday',
    reminderTime: '09:00',
    notificationsEnabled: true,
    overdueEnabled: true,
    characterType: 'blob',
    characterColor: '#7BAF8E',
    hasCompletedOnboarding: false,
    lastMilestoneCelebrated: 0,
    preferredDrug: 'Semaglutide (Wegovy)',
    preferredDosage: 0.25,
    dosesOnHand: 0,
    refillThreshold: 1,
    healthSyncEnabled: false,
    lastHealthSync: null
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
        weightsData,
        sideEffectsData
      ] = await Promise.all([
        database.getProfile(),
        database.getInjections(),
        database.getStreaks(),
        database.getCharacterState(),
        database.getWeightEntries(),
        database.getSideEffects()
      ])

      if (profileData) {
        setSettings({
          nickname: profileData.nickname || '',
          darkMode: !!profileData.dark_mode,
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
          refillThreshold: profileData.refill_threshold || 1,
          healthSyncEnabled: profileData.health_sync_enabled || false,
          lastHealthSync: profileData.last_health_sync
        })
      }

      setInjections(injectionsData || [])
      setWeightEntries(weightsData || [])
      setSideEffects(sideEffectsData || [])
      setStreaks(streaksData || { current: 0, longest: 0, nextDue: null })
      setCharacterState(stateData || 'neutral')
    } catch (error) {
      console.error('Error loading app state:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const logInjection = async (data) => {
    const result = await database.logInjection(data)
    if (result) await loadAllData()
    return result
  }

  const logWeight = async (weight, unit) => {
    const result = await database.logWeight(weight, unit)
    if (result) {
      await loadAllData()
      if (settings.healthSyncEnabled) {
        await HealthService.syncWeight(weight)
      }
    }
    return result
  }

  const logSideEffect = async (symptom, severity, notes) => {
    const result = await database.logSideEffect(symptom, severity, notes)
    if (result) await loadAllData()
    return result
  }

  const updateSettings = async (updates) => {
    // Optimistically update local state for instant feedback
    setSettings(prev => ({ ...prev, ...updates }))

    const dbUpdates = {}
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname
    if (updates.darkMode !== undefined) dbUpdates.dark_mode = updates.darkMode
    if (updates.injectionDay !== undefined) dbUpdates.injection_day = updates.injectionDay
    if (updates.reminderTime !== undefined) dbUpdates.reminder_time = updates.reminderTime
    if (updates.notificationsEnabled !== undefined) dbUpdates.notifications_enabled = updates.notificationsEnabled
    if (updates.overdueEnabled !== undefined) dbUpdates.overdue_enabled = updates.overdueEnabled
    if (updates.characterType !== undefined) dbUpdates.character_type = updates.characterType
    if (updates.characterColor !== undefined) dbUpdates.character_color = updates.characterColor
    if (updates.hasCompletedOnboarding !== undefined) dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding
    if (updates.lastMilestoneCelebrated !== undefined) dbUpdates.last_milestone_celebrated = updates.lastMilestoneCelebrated
    if (updates.preferredDrug !== undefined) dbUpdates.preferred_drug = updates.preferredDrug
    if (updates.preferredDosage !== undefined) dbUpdates.preferred_dosage = updates.preferredDosage
    if (updates.dosesOnHand !== undefined) dbUpdates.doses_on_hand = updates.dosesOnHand
    if (updates.refillThreshold !== undefined) dbUpdates.refill_threshold = updates.refillThreshold
    if (updates.healthSyncEnabled !== undefined) dbUpdates.health_sync_enabled = updates.healthSyncEnabled
    if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone

    const result = await database.updateProfile(dbUpdates)
    if (result) {
      await loadAllData()
      if (updates.healthSyncEnabled === true) {
        await HealthService.requestPermissions();
      }
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

  const deleteUserAccount = async () => {
    const result = await database.deleteUserAccount()
    return result
  }

  useEffect(() => {
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
        setSideEffects([])
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
    resetAllData,
    deleteUserAccount
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
