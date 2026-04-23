import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Card from '../components/Card';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { session, settings, deleteUserAccount } = useAppState();
  const isDark = settings.darkMode;
  const themeColor = settings.characterColor || '#7BAF8E';
  const textColor = isDark ? 'white' : '#1c1c1e';
  const subTextColor = isDark ? '#aaa' : '#666';
  const appBg = isDark ? '#000' : '#F7F8FA';
  const headerBg = isDark ? '#1c1c1e' : 'white';

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); } },
    ]);
  };

  const handlePasswordReset = async () => {
    if (!session?.user?.email) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, { redirectTo: 'exp://' });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Email Sent', `A password reset link has been sent to ${session.user.email}`);
  };

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Account',
      'This will PERMANENTLY delete your account and all health data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteUserAccount();
            if (success) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert('Account Deleted', 'Your data has been removed.'); }
            else { Alert.alert('Error', 'Failed to delete account.'); }
          }
        },
      ]
    );
  };

  const joinDate = session?.user?.created_at 
    ? new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: subTextColor }]}>← Settings</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>My Profile</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: themeColor }]}>
            <Text style={styles.avatarText}>{session?.user?.email?.[0].toUpperCase() || 'A'}</Text>
          </View>
          <Text style={[styles.email, { color: textColor }]}>{session?.user?.email || 'Guest User'}</Text>
          <Text style={[styles.joined, { color: subTextColor }]}>Member since {joinDate}</Text>
        </Card>

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {session ? (
            <TouchableOpacity style={styles.row} onPress={handlePasswordReset}>
              <Text style={[styles.rowText, { color: textColor }]}>Reset Password</Text>
              <Text style={[styles.rowLink, { color: themeColor }]}>Send Email</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Auth')}>
              <Text style={[styles.rowText, { color: textColor }]}>Create an Account</Text>
              <Text style={[styles.rowLink, { color: themeColor }]}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </Card>

        <Text style={styles.sectionLabel}>DATA & PRIVACY</Text>
        <Card style={styles.dataCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.rowText, { color: textColor }]}>Sync Status</Text>
            <Text style={styles.statusBadge}>{session ? 'Cloud Active' : 'Local Only'}</Text>
          </View>
          {!session && (
            <Text style={[styles.hint, { color: subTextColor }]}>
              Log in to ensure your injection history and streaks are backed up safely.
            </Text>
          )}
        </Card>

        <View style={[styles.dangerZone, isDark && { backgroundColor: '#2c1515', borderColor: '#4d1a1a' }]}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={[styles.deleteButton, isDark && { backgroundColor: '#3d1a1a', borderColor: '#5d1a1a' }]} onPress={handleDeleteAccount}>
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
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 80 },
  backText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  profileCard: { alignItems: 'center', marginBottom: 25 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 18, fontWeight: 'bold' },
  joined: { fontSize: 14, marginTop: 5 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#aaa', letterSpacing: 1, paddingVertical: 12, paddingLeft: 4, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  rowText: { fontSize: 15, fontWeight: '700' },
  rowLink: { fontSize: 14, fontWeight: 'bold' },
  dataCard: { padding: 18, marginBottom: 20 },
  statusBadge: { fontSize: 12, fontWeight: 'bold', color: '#7BAF8E', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  hint: { fontSize: 13, marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  dangerZone: { backgroundColor: '#fff1f1', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ffcdd2' },
  dangerTitle: { fontSize: 14, fontWeight: '800', color: '#d32f2f', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  deleteButton: { paddingVertical: 12, alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#ffcdd2' },
  deleteText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },
  signOutButton: { marginTop: 20, padding: 15, alignItems: 'center' },
  signOutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 },
});
