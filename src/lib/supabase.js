import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://koutcowlqxobbavhqwba.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdXRjb3dscXhvYmJhdmhxd2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzQ5ODMsImV4cCI6MjA5MTk1MDk4M30.tLqQ74hfgbOZWKXgd-GmjyRizkT3I_RThgwbGYz9rbQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
