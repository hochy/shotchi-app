import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../lib/database'

export const useSettings = () => {
  const [settings, setSettings] = useState({
    injectionDay: 'monday',
    reminderTime: '09:00',
    notificationsEnabled: true,
    overdueEnabled: true,
    characterType: 'blob',
    characterColor: '#7BAF8E'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadSettings = async () => {
    try {
      setLoading(true)
      const profile = await getProfile()
      if (profile) {
        setSettings({
          injectionDay: profile.injection_day,
          reminderTime: profile.reminder_time,
          notificationsEnabled: profile.notifications_enabled,
          overdueEnabled: profile.overdue_enabled,
          characterType: profile.character_type,
          characterColor: profile.character_color,
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      setSaving(true)
      const updatedProfile = await updateProfile(newSettings)
      if (updatedProfile) {
        setSettings(prev => ({ ...prev, ...newSettings }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refresh: loadSettings
  }
}