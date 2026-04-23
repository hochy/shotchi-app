import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useInjections } from '../hooks/useInjections';
import { useSettings } from '../hooks/useSettings';
import Adi from '../components/Adi';
import Card from '../components/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function AchievementsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { injections, weightEntries, streaks, loading } = useInjections();
  const { settings } = useSettings();
  const isDark = settings.darkMode;
  const themeColor = settings.characterColor || '#7BAF8E';
  const textColor = isDark ? 'white' : '#1c1c1e';
  const subTextColor = isDark ? '#aaa' : '#666';
  const appBg = isDark ? '#000' : '#F7F8FA';
  const headerBg = isDark ? '#1c1c1e' : 'white';

  const badges = useMemo(() => {
    const totalLost = weightEntries.length > 1 
      ? Math.max(0, parseFloat(weightEntries[weightEntries.length-1].weight) - parseFloat(weightEntries[0].weight)) 
      : 0;
    const usedSites = new Set(injections.map(i => i.injection_site).filter(Boolean));

    return [
      { id:'first', emoji:'🥇', title:'First Shot', earned: injections.length >= 1 },
      { id:'week1', emoji:'🌱', title:'One Week In', earned: injections.length >= 1, progress: injections.length > 0 ? 100 : 0 },
      { id:'month1', emoji:'🌟', title:'One Month', earned: streaks.current >= 4, progress: Math.min(100, (streaks.current / 4) * 100) },
      { id:'streak4', emoji:'🔥', title:'4-Week Streak', earned: streaks.current >= 4, progress: Math.min(100, (streaks.current / 4) * 100) },
      { id:'sitemaster', emoji:'🗺️', title:'Site Master', earned: usedSites.size >= 6, progress: Math.min(100, (usedSites.size / 6) * 100) },
      { id:'10lbs', emoji:'⚖️', title:'10 lbs Down', earned: totalLost >= 10, progress: Math.min(100, (totalLost / 10) * 100) },
      { id:'month3', emoji:'💎', title:'3-Month Champ', earned: streaks.current >= 12, progress: Math.min(100, (streaks.current / 12) * 100) },
      { id:'ontime', emoji:'⏰', title:'Perfect Month', earned: streaks.current >= 4, progress: 90 },
    ];
  }, [injections, weightEntries, streaks]);

  const earned = badges.filter(b => b.earned);
  const upcoming = badges.filter(b => !b.earned);

  const BadgeCard = ({ badge }) => {
    const radius = 23;
    const circumference = 2 * Math.PI * radius;
    const progress = badge.progress || 0;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Card style={[
          styles.badgeCard, 
          badge.earned ? { backgroundColor: isDark ? `${themeColor}30` : `${themeColor}15`, borderColor: themeColor } : { borderColor: isDark ? '#333' : '#eee' }
        ]}
      >
        {!badge.earned && (
          <View style={styles.progressRing}>
            <Svg width={52} height={52}>
              <Circle cx={26} cy={26} r={radius} fill="none" stroke={isDark ? '#333' : "#ddd"} strokeWidth={3} />
              <Circle 
                cx={26} cy={26} r={radius} fill="none" stroke={themeColor} strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
              />
            </Svg>
          </View>
        )}
        <Text style={[styles.badgeEmoji, !badge.earned && { opacity: 0.4 }]}>{badge.emoji}</Text>
        <Text style={[styles.badgeTitle, { color: textColor }]} numberOfLines={1}>{badge.title}</Text>
        <Text style={[styles.badgeMeta, { color: subTextColor }]}>{badge.earned ? 'EARNED' : `${Math.round(progress)}%`}</Text>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: appBg }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>Achievements</Text>
          <Text style={[styles.subtitle, { color: subTextColor }]}>{earned.length} earned · {upcoming.length} in progress</Text>
        </View>
        <Adi state="happy" color={themeColor} size={60} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: '#aaa', marginLeft: 15 }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.streakBanner, { backgroundColor: themeColor }]}>
          <Text style={{ fontSize: 36 }}>🔥</Text>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.bannerTitle}>{streaks.current}-Week Streak!</Text>
            <Text style={styles.bannerSub}>Every shot on time. You're unstoppable.</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>EARNED ({earned.length})</Text>
        <View style={styles.grid}>{earned.map(b => <BadgeCard key={b.id} badge={b} />)}</View>

        <Text style={styles.sectionLabel}>IN PROGRESS</Text>
        <View style={styles.grid}>{upcoming.map(b => <BadgeCard key={b.id} badge={b} />)}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  content: { padding: 20 },
  streakBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 25 },
  bannerTitle: { color: 'white', fontSize: 18, fontWeight: '900' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginTop: 2 },
  sectionLabel: { fontSize: 12, color: '#aaa', fontWeight: '800', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  badgeCard: { width: (width - 60) / 3, alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5, borderRadius: 18, borderWidth: 2, position: 'relative', padding: 0 },
  badgeEmoji: { fontSize: 28, marginBottom: 5 },
  badgeTitle: { fontSize: 10, fontWeight: '800', textAlign: 'center' },
  badgeMeta: { fontSize: 9, fontWeight: '700', marginTop: 4 },
  progressRing: { position: 'absolute', top: 5 },
});
