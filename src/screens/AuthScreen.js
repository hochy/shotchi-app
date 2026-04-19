import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'
import * as Linking from 'expo-linking'

export default function AuthScreen({ navigation, onSkip }) {
  const [authMode, setAuthMode] = useState('login') // 'login', 'signup', 'forgot', 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle incoming deep links (for password reset)
  useEffect(() => {
    const handleUrl = (url) => {
      if (!url) return
      
      // On web, Supabase often uses the hash fragment (#)
      // On native, it uses query params
      const isRecovery = url.includes('type=recovery') || 
                         url.includes('access_token') || 
                         url.includes('recovery');

      if (isRecovery) {
        setAuthMode('reset')
      }
    }

    // 1. Check initial URL (Native)
    Linking.getInitialURL().then(handleUrl)
    
    // 2. Check current window URL (Web fallback)
    if (typeof window !== 'undefined' && window.location) {
      handleUrl(window.location.href)
    }
    
    // 3. Listen for links while app is open
    const subscription = Linking.addEventListener('url', (event) => handleUrl(event.url))
    return () => subscription.remove()
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: Linking.createURL('home')
        }
      })
      if (error) throw error
    } catch (error) {
      Alert.alert('Google Login Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (authMode !== 'forgot' && (!email || !password)) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if ((authMode === 'signup' || authMode === 'reset') && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setLoading(true)
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        Alert.alert('Success', 'Check your email for the confirmation link!')
      } else if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: Linking.createURL('reset-password')
        })
        if (error) throw error
        Alert.alert('Email Sent', 'Check your email for the reset link.')
        setAuthMode('login')
      } else if (authMode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        Alert.alert('Success', 'Your password has been updated!')
        setAuthMode('login')
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    if (onSkip) onSkip()
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Shotchi</Text>
      <Text style={styles.subtitle}>
        {authMode === 'reset' ? 'Set New Password' : 'Your GLP-1 Injection Tracker'}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.content}>
        {authMode !== 'reset' && (
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
              <Text style={styles.modeToggle}>
                {authMode === 'login' ? "Need an account? " : "Already have an account? "}
                <Text style={styles.modeToggleLink}>
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.form}>
          {authMode !== 'reset' && (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </>
          )}

          {authMode !== 'forgot' && (
            <>
              <Text style={styles.label}>{authMode === 'reset' ? 'New Password' : 'Password'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </>
          )}

          {(authMode === 'signup' || authMode === 'reset') && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {authMode === 'login' ? 'Sign In' : 
                 authMode === 'signup' ? 'Sign Up' : 
                 authMode === 'forgot' ? 'Send Reset Link' : 'Update Password'}
              </Text>
            )}
          </TouchableOpacity>

          {authMode === 'login' && (
            <>
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                disabled={loading}
              >
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setAuthMode('forgot')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </>
          )}

          {authMode === 'forgot' && (
            <TouchableOpacity onPress={() => setAuthMode('login')}>
              <Text style={styles.forgotPassword}>Back to Login</Text>
            </TouchableOpacity>
          )}

          {authMode !== 'reset' && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for now (use local data)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { alignItems: 'center', marginTop: 80, marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#7BAF8E', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },
  content: { flex: 1, paddingHorizontal: 30 },
  modeToggleContainer: { marginBottom: 30 },
  modeToggle: { fontSize: 15, color: '#666', textAlign: 'center' },
  modeToggleLink: { color: '#7BAF8E', fontWeight: 'bold' },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 20, fontSize: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  button: { backgroundColor: '#7BAF8E', paddingVertical: 18, borderRadius: 35, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 15, color: '#999', fontWeight: 'bold', fontSize: 12 },
  googleButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  googleButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  forgotPassword: { textAlign: 'center', color: '#999', fontWeight: '600', marginBottom: 20 },
  skipButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ddd', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  skipButtonText: { color: '#666', fontSize: 14, fontWeight: '600' },
})
