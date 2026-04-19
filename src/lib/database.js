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

export const decrementDoses = async () => {
  if (await isLocalMode()) {
    const profile = await localStorage.getLocalProfile()
    if (profile && profile.doses_on_hand > 0) {
      return localStorage.updateLocalProfile({ doses_on_hand: profile.doses_on_hand - 1 })
    }
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Manual update for simplicity (can be optimized to RPC later)
  const profile = await getProfile()
  if (profile && profile.doses_on_hand > 0) {
    return updateProfile({ doses_on_hand: profile.doses_on_hand - 1 })
  }
  return null
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

// Weight operations
export const getWeightEntries = async () => {
  if (await isLocalMode()) {
    return localStorage.getLocalWeights()
  }

  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .order('logged_at', { ascending: false })

  if (error) {
    console.error('Error fetching weights:', error)
    return []
  }
  return data
}

export const logWeight = async (weight, unit = 'lbs') => {
  if (await isLocalMode()) {
    return localStorage.addLocalWeight({ weight, unit, logged_at: new Date().toISOString() })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('weight_entries')
    .insert({
      user_id: user.id,
      weight,
      unit,
      logged_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error logging weight:', error)
    return null
  }
  return data
}

// Side Effect operations
export const getSideEffects = async () => {
  if (await isLocalMode()) {
    return localStorage.getLocalSideEffects()
  }

  const { data, error } = await supabase
    .from('side_effects')
    .select('*')
    .order('logged_at', { ascending: false })

  if (error) {
    console.error('Error fetching side effects:', error)
    return []
  }
  return data
}

export const logSideEffect = async (symptom, severity, notes = null) => {
  if (await isLocalMode()) {
    return localStorage.addLocalSideEffect({ symptom, severity, notes, logged_at: new Date().toISOString() })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('side_effects')
    .insert({
      user_id: user.id,
      symptom,
      severity,
      notes,
      logged_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error logging side effect:', error)
    return null
  }
  return data
}

export const logInjection = async ({ scheduledFor, note = null, injectionSite = null, drugName = null, dosage = null }) => {
  if (await isLocalMode()) {
    const newInjection = {
      scheduled_for: scheduledFor,
      note,
      injection_site: injectionSite,
      drug_name: drugName,
      dosage,
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
      injection_site: injectionSite,
      drug_name: drugName,
      dosage,
      logged_at: new Date().toISOString()
    })
    .select()
    .single()

  if (data) {
    await decrementDoses()
  }

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

export const clearAllInjections = async () => {
  if (await isLocalMode()) {
    return localStorage.clearLocalData()
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('injections')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Error clearing injections:', error)
    return false
  }

  // Also reset last_injected_at on profile
  await updateProfile({ 
    last_injected_at: null, 
    last_milestone_celebrated: 0, 
    preferred_dosage: 0.25,
    doses_on_hand: 0,
    refill_threshold: 1
  })

  // Reset streaks table
  await supabase
    .from('streaks')
    .update({ current_streak: 0, longest_streak: 0 })
    .eq('user_id', user.id)

  // Delete all weight entries
  await supabase
    .from('weight_entries')
    .delete()
    .eq('user_id', user.id)

  // Delete all side effect records
  await supabase
    .from('side_effects')
    .delete()
    .eq('user_id', user.id)

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
