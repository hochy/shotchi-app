import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Detection for Expo Go (where native health modules won't work)
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * HealthService handles synchronization with Apple Health (iOS) 
 * and Google Fit / Health Connect (Android).
 */
export const HealthService = {
  /**
   * Checks if health integration is supported in the current environment.
   */
  isSupported: () => {
    return !isExpoGo;
  },

  /**
   * Requests necessary permissions from the user.
   */
  requestPermissions: async () => {
    if (isExpoGo) {
      console.info('Health Sync: Mocking permissions in Expo Go.');
      return true;
    }

    try {
      // Future implementation:
      // if (Platform.OS === 'ios') AppleHealthKit.initHealthKit(permissions)
      // else HealthConnect.requestPermission(permissions)
      return true;
    } catch (error) {
      console.error('Health Sync Permission Error:', error);
      return false;
    }
  },

  /**
   * Syncs a weight entry to the system health app.
   */
  syncWeight: async (weightLbs) => {
    if (isExpoGo) {
      console.info(`Health Sync: Weight (${weightLbs} lbs) would be synced in a native build.`);
      return true;
    }

    try {
      // Future implementation for actual data write
      console.log('Syncing to native health app...');
      return true;
    } catch (error) {
      console.error('Weight Sync Error:', error);
      return false;
    }
  },

  /**
   * Performs a full sync (Injections, Weight, etc.)
   */
  performFullSync: async (data) => {
    if (isExpoGo) return { success: true, timestamp: new Date().toISOString() };

    console.log('Performing full health sync...');
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }
};
