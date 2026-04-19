import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = {
  PROFILE: '@shotchi:profile',
  INJECTIONS: '@shotchi:injections',
  STREAKS: '@shotchi:streaks',
}

// Default profile for local mode
const DEFAULT_PROFILE = {
  id: 'local-user',
  injection_day: 'monday',
  injection_time: '09:00',
  created_at: new Date().toISOString(),
}

// Default streaks for local mode
const DEFAULT_STREAKS = {
  current_streak: 0,
  longest_streak: 0,
  next_due: null,
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
    const current = await getLocalProfile()
    const updated = { ...current, ...updates }
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error updating local profile:', error)
    return null
  }
}

// Injection operations
export const getLocalInjections = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INJECTIONS)
    return data ? JSON.parse(data) : []
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

export const updateLocalStreaks = async (currentStreak, longestStreak, nextDue) => {
  try {
    const streaks = { current_streak: currentStreak, longest_streak: longestStreak, next_due: nextDue }
    await AsyncStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks))
    return streaks
  } catch (error) {
    console.error('Error updating local streaks:', error)
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
    ])
    return true
  } catch (error) {
    console.error('Error clearing local data:', error)
    return false
  }
}
t weights = await getLocalWeights()
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

// Clear all local data
export const clearLocalData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.INJECTIONS,
      STORAGE_KEYS.STREAKS,
    ])
    return true
  } catch (error) {
    console.error('Error clearing local data:', error)
    return false
  }
}
