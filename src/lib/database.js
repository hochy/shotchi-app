import { supabase } from './supabase'

// Profile operations
export const getProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export const updateProfile = async (updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// Injection operations
export const getInjections = async () => {
  const { data, error } = await supabase
    .from('injections')
    .select('*')
    .order('scheduled_for', { ascending: false })

  if (error) {
    console.error('Error fetching injections:', error)
    return []
  }

  return data
}

export const logInjection = async ({ scheduledFor, note = null }) => {
  const { data, error } = await supabase
    .from('injections')
    .insert({
      scheduled_for: scheduledFor,
      note,
      logged_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error logging injection:', error)
    return null
  }

  return data
}

export const updateInjection = async (id, updates) => {
  const { data, error } = await supabase
    .from('injections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating injection:', error)
    return null
  }

  return data
}

export const deleteInjection = async (id) => {
  const { error } = await supabase
    .from('injections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting injection:', error)
    return false
  }

  return true
}

// Streak operations
export const getStreaks = async () => {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching streaks:', error)
    return null
  }

  return data
}

export const updateStreaks = async (currentStreak, longestStreak) => {
  const { data, error } = await supabase
    .from('streaks')
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error updating streaks:', error)
    return null
  }

  return data
}

// Utility functions
export const calculateStreak = async () => {
  const profile = await getProfile()
  if (!profile) return { current: 0, longest: 0, nextDue: null }

  // Get all injections in chronological order
  const injections = await getInjections()
  const sortedInjections = injections.sort((a, b) => 
    new Date(a.scheduled_for) - new Date(b.scheduled_for)
  )

  let currentStreak = 0
  let longestStreak = 0
  let lastDate = null

  // Calculate streak
  for (const injection of sortedInjections) {
    const injectionDate = new Date(injection.scheduled_for)
    
    if (lastDate) {
      const daysDiff = Math.floor((injectionDate - lastDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 7) {
        // On time
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else if (daysDiff < 7) {
        // Early (counts as logged but breaks streak)
        currentStreak = 1
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        // Late (resets streak)
        currentStreak = 1
        longestStreak = Math.max(longestStreak, currentStreak)
      }
    } else {
      // First injection
      currentStreak = 1
      longestStreak = 1
    }
    
    lastDate = injectionDate
  }

  // Calculate next due date
  const injectionDay = profile.injection_day
  const nextDue = getNextDueDate(injectionDay, lastDate || new Date())

  return {
    current: currentStreak,
    longest: longestStreak,
    nextDue
  }
}

const getNextDueDate = (injectionDay, lastDate) => {
  const nextDate = new Date(lastDate)
  nextDate.setDate(nextDate.getDate() + 7)
  
  // Adjust to next injection day
  const dayMap = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
    'sunday': 0
  }
  
  const targetDay = dayMap[injectionDay]
  const currentDay = nextDate.getDay()
  
  if (currentDay !== targetDay) {
    const daysToAdd = (targetDay - currentDay + 7) % 7
    nextDate.setDate(nextDate.getDate() + daysToAdd)
  }
  
  return nextDate
}

export const getCharacterState = async () => {
  const profile = await getProfile()
  
  // Never logged = waiting state (new user)
  if (!profile || !profile.last_injected_at) {
    return 'waiting'
  }
  
  const streaks = await calculateStreak()
  const now = new Date()
  const nextDue = new Date(streaks.nextDue)
  
  // Check if next due is today
  const isToday = 
    now.toDateString() === nextDue.toDateString()
  
  // Check if next due is in the past
  const isOverdue = nextDue < now
  
  // Check if any injection is due today and logged
  const todayInjections = await getInjections().then(injections => 
    injections.filter(injection => {
      const injectionDate = new Date(injection.scheduled_for)
      return (
        injectionDate.toDateString() === now.toDateString() &&
        injection.logged_at
      )
    })
  )
  
  if (todayInjections.length > 0) {
    return 'happy'
  } else if (isToday) {
    return 'neutral'
  } else if (isOverdue) {
    return 'sad'
  } else {
    return 'neutral'
  }
}

export const needsOnboarding = async () => {
  const profile = await getProfile()
  
  // If no profile or default injection_day, needs onboarding
  if (!profile || profile.injection_day === 'monday') {
    // Check if this is truly a new user (no injections)
    const injections = await getInjections()
    if (injections.length === 0) {
      return true
    }
  }
  
  return false
}