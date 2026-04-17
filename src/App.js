import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { supabase } from './lib/supabase'
import { needsOnboarding } from './lib/database'
import HomeScreen from './screens/HomeScreen'
import LogShotScreen from './screens/LogShotScreen'
import HistoryScreen from './screens/HistoryScreen'
import SettingsScreen from './screens/SettingsScreen'
import AuthScreen from './screens/AuthScreen'
import OnboardingScreen from './screens/OnboardingScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  const [session, setSession] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [showOnboarding, setShowOnboarding] = React.useState(false)

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)

      // Check if user needs onboarding
      if (session) {
        const needsSetup = await needsOnboarding()
        setShowOnboarding(needsSetup)
      }

      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      // Check onboarding for new session
      if (session) {
        const needsSetup = await needsOnboarding()
        setShowOnboarding(needsSetup)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return null // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {!session ? (
          // Auth flow
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : showOnboarding ? (
          // Onboarding flow (shown once after signup)
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
            initialParams={{ userId: session.user.id }}
          />
        ) : (
          // Main app
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LogShot"
              component={LogShotScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}