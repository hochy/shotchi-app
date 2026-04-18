import { supabase } from './supabase'
import * as localStorage from './localStorage'
import { format, addDays, parseISO, startOfDay, isBefore, isToday as isTodayFn } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

// Check if we're in local mode (no Supabase session)
const isLocalMode = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !session
}

// Profile operations
export const getProfile = async () => {
  if (await isLocalMode()) {
    return localStorage.getLocalProfile()
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export const updateProfile = async (updates) => {
  if (await isLocalMode()) {
    return localStorage.updateLocalProfile(updates)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
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
  if (await isLocalMode()) {
    return localStorage.getLocalInjections()
  }

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
  if (await isLocalMode()) {
    const newInjection = {
      scheduled_for: scheduledFor,
      note,
      logged_at: new Date().toISOString(),
    }
    return localStorage.addLocalInjection(newInjection)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('injections')
    .insert({
      user_id: user.id,
      scheduled_for: scheduledFor,
      note,
      logged_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      console.info('User attempted to log a duplicate injection for this period.')
      return { error: 'ALREADY_LOGGED' }
    }
    console.error('Error logging injection:', error)
    return null
  }
  return data
}

export const updateInjection = async (id, updates) => {
  if (await isLocalMode()) {
    return localStorage.updateLocalInjection(id, updates)
  }

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
  if (await isLocalMode()) {
    return localStorage.deleteLocalInjection(id)
  }

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
  if (await isLocalMode()) {
    return localStorage.getLocalStreaks()
  }

  // Use the RPC to get fresh calculated streaks from the DB
  const { data, error } = await supabase.rpc('calculate_streak')

  if (error) {
    console.error('Error fetching streaks via RPC:', error)
    // Fallback to the view/table if RPC fails
    const { data: viewData, error: viewError } = await supabase
      .from('user_streaks')
      .select('*')
      .single()
    
    if (viewError) return null
    return {
      current: viewData.current_streak,
      longest: viewData.longest_streak,
      nextDue: null // View doesn't have nextDue yet
    }
  }

  // calculate_streak returns a table, but for a single user it's the first row
  const result = Array.isArray(data) ? data[0] : data
  return {
    current: result.current_streak,
    longest: result.longest_streak,
    nextDue: result.next_scheduled_date
  }
}

// Character State
export const getCharacterState = async () => {
  if (await isLocalMode()) {
    // Basic local calculation for offline/skip mode
    const profile = await localStorage.getLocalProfile()
    if (!profile || !profile.last_injected_at) return 'waiting'
    
    const streaks = await localStorage.getLocalStreaks()
    const now = new Date()
    const nextDue = parseISO(streaks.nextDue)
    
    if (isTodayFn(nextDue)) return 'neutral'
    if (isBefore(nextDue, startOfDay(now))) return 'sad'
    return 'happy'
  }

  const { data, error } = await supabase.rpc('get_character_state')

  if (error) {
    console.error('Error fetching character state:', error)
    return 'neutral'
  }
  return data
}

export const needsOnboarding = async () => {
  const profile = await getProfile()
  if (!profile) return true
  
  // Deterministic check using the new flag
  return profile.has_completed_onboarding === false
}
