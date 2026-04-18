import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import Constants, { ExecutionEnvironment } from 'expo-constants'

// Check if we are running in Expo Go on Android
const isExpoGoAndroid = Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const requestPermissions = async () => {
  if (isExpoGoAndroid) {
    console.info('Notifications: Permission request skipped in Expo Go Android (feature removed by Expo)')
    return true
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!')
    return false
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7BAF8E',
    })
  }
  
  return true
}

export const cancelAllScheduledNotifications = async () => {
  if (isExpoGoAndroid) return
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Schedules a weekly recurring notification
 * @param {string} day - 'monday' to 'sunday'
 * @param {string} time - 'HH:MM' format
 */
export const scheduleWeeklyReminder = async (day, time) => {
  if (isExpoGoAndroid) {
    console.info('Notifications: Scheduling skipped in Expo Go Android (feature removed by Expo)')
    return 'expo-go-dummy-id'
  }

  try {
    // 1. Clear existing first
    await cancelAllScheduledNotifications()
    
    const dayMap = {
      'sunday': 1,
      'monday': 2,
      'tuesday': 3,
      'wednesday': 4,
      'thursday': 5,
      'friday': 6,
      'saturday': 7,
    }

    const [hours, minutes] = time.split(':').map(Number)
    
    // 3. Schedule the main reminder
    const trigger = {
      weekday: dayMap[day.toLowerCase()],
      hour: hours,
      minute: minutes,
      repeats: true,
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for your Shotchi! 💉",
        body: `It's ${day} at ${time}. Don't forget to log your injection!`,
        data: { screen: 'LogShot' },
        sound: true,
        priority: 'high',
      },
      trigger,
    })

    console.log(`Scheduled weekly reminder: ${day} at ${time} (ID: ${notificationId})`)
    return notificationId
  } catch (error) {
    console.error('Error scheduling notification:', error)
    return null
  }
}

export const testNotification = async () => {
  if (isExpoGoAndroid) return
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Adi is waving! 👋",
      body: "Your notifications are working perfectly.",
    },
    trigger: { seconds: 2 },
  })
}
