import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { AppStateProvider, useAppState } from './src/context/AppStateContext'
import HomeScreen from './src/screens/HomeScreen'
import LogShotScreen from './src/screens/LogShotScreen'
import HistoryScreen from './src/screens/HistoryScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import AuthScreen from './src/screens/AuthScreen'
import OnboardingScreen from './src/screens/OnboardingScreen'
import MedicationTimelineScreen from './src/screens/MedicationTimelineScreen'
import LogSideEffectScreen from './src/screens/LogSideEffectScreen'
import { ActivityIndicator, View } from 'react-native'

const Stack = createNativeStackNavigator()

function AppNavigator() {
  const { session, settings, loading } = useAppState()
  const [skippedAuth, setSkippedAuth] = React.useState(false)

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#7BAF8E" />
      </View>
    )
  }

  // LOGIC:
  // 1. If not authenticated (no session AND not skipped), show Auth
  // 2. If authenticated BUT onboarding not done, show Onboarding
  // 3. Otherwise, show Main App (Home, etc)
  
  const isAuthenticated = !!session || skippedAuth
  const needsOnboarding = !settings.hasCompletedOnboarding

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {(props) => <AuthScreen {...props} onSkip={() => setSkippedAuth(true)} />}
        </Stack.Screen>
      ) : needsOnboarding ? (
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }}
          initialParams={{ userId: session?.id }}
        />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LogShot" component={LogShotScreen} options={{ headerShown: false }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MedicationTimeline" component={MedicationTimelineScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LogSideEffect" component={LogSideEffectScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AppStateProvider>
  )
}
