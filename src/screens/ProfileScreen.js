import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { session, settings, deleteUserAccount } = useAppState();

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
        } 
      },
    ]);
  };

  const handlePasswordReset = async () => {
    if (!session?.user?.email) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
      redirectTo: 'exp://'
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Email Sent', `A password reset link has been sent to ${session.user.email}`);
    }
  };

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Account',
      'This will PERMANENTLY delete your account and all health data (injections, weight, side effects). This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteUserAccount();
            if (success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Account Deleted', 'Your data has been completely removed.');
            } else {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        },
      ]
    );
  };

  const joinDate = session?.user?.created_at 
    ? new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Settings</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: settings.characterColor }]}>
            <Text style={styles.avatarText}>
              {session?.user?.email?.[0].toUpperCase() || 'A'}
            </Text>
          </View>
          <Text style={styles.email}>{session?.user?.email || 'Guest User'}</Text>
          <Text style={styles.joined}>Member since {joinDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          {session ? (
            <TouchableOpacity style={styles.row} onPress={handlePasswordReset}>
              <Text style={styles.rowText}>Reset Password</Text>
              <Text style={[styles.rowLink, { color: settings.characterColor }]}>Send Email</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.rowText}>Create an Account</Text>
              <Text style={[styles.rowLink, { color: settings.characterColor }]}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Sync Status</Text>
            <Text style={styles.statusBadge}>{session ? 'Cloud Active' : 'Local Only'}</Text>
          </View>
          {!session && (
            <Text style={styles.hint}>
              Log in to ensure your injection history and streaks are backed up safely.
            </Text>
          )}
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account & Data</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: { width: 80 },
  backText: { color: '#666', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  joined: { fontSize: 14, color: '#999', marginTop: 5 },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 5,
  },
  rowText: { fontSize: 16, color: '#333', fontWeight: '500' },
  rowLink: { fontSize: 14, fontWeight: 'bold' },
  statusBadge: { fontSize: 12, fontWeight: 'bold', color: '#7BAF8E', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  hint: { fontSize: 13, color: '#999', marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  dangerZone: {
    backgroundColor: '#fff1f1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  dangerTitle: { fontSize: 14, fontWeight: 'bold', color: '#d32f2f', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  deleteButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  deleteText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },
  signOutButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  signOutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 },
});
