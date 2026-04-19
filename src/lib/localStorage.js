import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = {
  PROFILE: '@shotchi:profile',
  INJECTIONS: '@shotchi:injections',
  STREAKS: '@shotchi:streaks',
  WEIGHTS: '@shotchi:weights',
  SIDE_EFFECTS: '@shotchi:side_effects',
}

// Default profile for local mode
const DEFAULT_PROFILE = {
  id: 'local-user',
  injection_day: 'monday',
  reminder_time: '09:00',
  character_type: 'blob',
  character_color: '#7BAF8E',
  has_completed_onboarding: false,
  last_milestone_celebrated: 0,
  preferred_drug: 'Semaglutide (Wegovy)',
  preferred_dosage: 0.25,
  doses_on_hand: 0,
  refill_threshold: 1,
  health_sync_enabled: false,
  last_health_sync: null,
  created_at: new Date().toISOString(),
}

// Default streaks for local mode
const DEFAULT_STREAKS = {
  current_streak: 0,
  longest_streak: 0,
  next_scheduled_date: new Date().toISOString().split('T')[0],
}

// Profile operations
export const getLocalProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE)
    return data ? JSON.parse(data) : DEFAULT_PROFILE
  } catch (error) {
    console.error('Error reading local profile:', error)
    return DEFAULT_PROFILE
  }
}

export const updateLocalProfile = async (updates) => {
  try {
    const profile = await getLocalProfile()
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile))
    return updatedProfile
  } catch (error) {
    console.error('Error updating local profile:', error)
    return null
  }
}

// Injection operations
export const getLocalInjections = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INJECTIONS)
    const injections = data ? JSON.parse(data) : []
    return injections.sort((a, b) => new Date(b.scheduled_for) - new Date(a.scheduled_for))
  } catch (error) {
    console.error('Error reading local injections:', error)
    return []
  }
}

export const addLocalInjection = async (injection) => {
  try {
    const injections = await getLocalInjections()
    const newInjection = {
      id: `local-${Date.now()}`,
      ...injection,
      injection_site: injection.injection_site || null,
      photo_url: injection.photo_url || null,
      created_at: new Date().toISOString(),
    }
    injections.push(newInjection)
    await AsyncStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(injections))
    return newInjection
  } catch (error) {
    console.error('Error adding local injection:', error)
    return null
  }
}

export const updateLocalInjection = async (id, updates) => {
  try {
    const injections = await getLocalInjections()
    const index = injections.findIndex(i => i.id === id)
    if (index !== -1) {
      injections[index] = { ...injections[index], ...updates }
      await AsyncStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(injections))
      return injections[index]
    }
    return null
  } catch (error) {
    console.error('Error updating local injection:', error)
    return null
  }
}

export const deleteLocalInjection = async (id) => {
  try {
    const injections = await getLocalInjections()
    const filtered = injections.filter(i => i.id !== id)
    await AsyncStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting local injection:', error)
    return false
  }
}

// Streak operations
export const getLocalStreaks = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAKS)
    return data ? JSON.parse(data) : DEFAULT_STREAKS
  } catch (error) {
    console.error('Error reading local streaks:', error)
    return DEFAULT_STREAKS
  }
}

export const updateLocalStreaks = async (updates) => {
  try {
    const streaks = await getLocalStreaks()
    const updated = { ...streaks, ...updates, updated_at: new Date().toISOString() }
    await AsyncStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error updating local streaks:', error)
    return null
  }
}

// Weight operations
export const getLocalWeights = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading local weights:', error)
    return []
  }
}

export const addLocalWeight = async (weightEntry) => {
  try {
    const weights = await getLocalWeights()
    const newWeight = {
      id: `local-w-${Date.now()}`,
      ...weightEntry,
      created_at: new Date().toISOString(),
    }
    weights.push(newWeight)
    await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights))
    return newWeight
  } catch (error) {
    console.error('Error adding local weight:', error)
    return null
  }
}

// Side Effect operations
export const getLocalSideEffects = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SIDE_EFFECTS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading local side effects:', error)
    return []
  }
}

export const addLocalSideEffect = async (sideEffect) => {
  try {
    const effects = await getLocalSideEffects()
    const newEffect = {
      id: `local-se-${Date.now()}`,
      ...sideEffect,
      created_at: new Date().toISOString(),
    }
    effects.push(newEffect)
    await AsyncStorage.setItem(STORAGE_KEYS.SIDE_EFFECTS, JSON.stringify(effects))
    return newEffect
  } catch (error) {
    console.error('Error adding local side effect:', error)
    return null
  }
}

// Clear all local data
export const clearLocalData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.INJECTIONS,
      STORAGE_KEYS.STREAKS,
      STORAGE_KEYS.WEIGHTS,
      STORAGE_KEYS.SIDE_EFFECTS,
    ])
    return true
  } catch (error) {
    console.error('Error clearing local data:', error)
    return false
  }
}
