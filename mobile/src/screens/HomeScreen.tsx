import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { getHistory } from '../lib/storage';
import { AnalysisResult, RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const load = async () => {
      const history = await getHistory();
      setRecentAnalyses(history.slice(0, 3));
    };
    load();
  }, []);

  const features = [
    { icon: '🎣', label: 'Hook Decoder' },
    { icon: '📋', label: 'Script' },
    { icon: '🎬', label: 'Sora Prompts' },
    { icon: '✅', label: 'UGC Ready' },
  ];

  return (
    <LinearGradient colors={['#050B1A', '#0A1628', '#050B1A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <LinearGradient
                colors={['#0066FF', '#00B4FF']}
                style={styles.logoIcon}
              >
                <Text style={styles.logoIconText}>⚡</Text>
              </LinearGradient>
              <View>
                <Text style={styles.logoText}>AdSpy AI</Text>
                <Text style={styles.logoSub}>UGC Ads Intelligence</Text>
              </View>
            </View>
            <GlassCard blue style={styles.badge} padding={8}>
              <Text style={styles.badgeText}>🤖 AI-Powered</Text>
            </GlassCard>
          </View>

          {/* Hero Card */}
          <LinearGradient
            colors={['#0A1F3C', '#0D2751']}
            style={styles.heroCard}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>AI UGC ADS SPY GENERATOR</Text>
            </View>
            <Text style={styles.heroHeadline}>
              Reverse-Engineer{'\n'}
              <Text style={styles.heroHeadlineBlue}>Viral Ads 10X</Text>
              {'\n'}Faster
            </Text>
            <Text style={styles.heroSub}>
              Analyze hooks, decode scripts, generate Sora 2 prompts in seconds.
            </Text>
            <GradientButton
              onPress={() => (navigation as any).navigate('Analyze')}
              label="Quick Analyze →"
              style={styles.heroBtn}
            />
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { val: 'Hook', label: 'Score & opening' },
              { val: 'Script', label: 'Beat breakdown' },
              { val: 'UGC', label: 'Rewrite' },
            ].map((stat) => (
              <GlassCard key={stat.label} style={styles.statCard} padding={12}>
                <Text style={styles.statValue}>{stat.val}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Feature chips */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.chipsRow}>
            {features.map((f) => (
              <GlassCard key={f.label} blue style={styles.chip} padding={10}>
                <Text style={styles.chipIcon}>{f.icon}</Text>
                <Text style={styles.chipLabel}>{f.label}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Recent analyses */}
          <Text style={styles.sectionTitle}>Recent Analyses</Text>
          {recentAnalyses.length === 0 ? (
            <GlassCard style={styles.emptyCard} padding={24}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No analyses yet</Text>
              <Text style={styles.emptyDesc}>
                Paste a viral ad URL in the Analyze tab to get started.
              </Text>
            </GlassCard>
          ) : (
            recentAnalyses.map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => navigation.navigate('AnalysisDetail', { result: a })}
                activeOpacity={0.75}
              >
                <GlassCard style={styles.historyItem} padding={14}>
                  <View style={styles.historyRow}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyUrl} numberOfLines={1}>
                        {a.url}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(a.analyzedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreBadgeText}>{a.hookScore}</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))
          )}

          <View style={styles.bottomPad} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: '800', color: Colors.white },
  logoSub: { fontSize: 11, color: Colors.textSecondary },
  badge: { borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700', color: Colors.cyan },
  heroCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,102,255,0.25)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,102,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  heroBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.cyan, letterSpacing: 0.5 },
  heroHeadline: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 34,
    marginBottom: 10,
  },
  heroHeadlineBlue: { color: Colors.cyan },
  heroSub: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  heroBtn: { alignSelf: 'flex-start' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: Colors.cyan, marginBottom: 2 },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 10,
    marginTop: 4,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20 },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: 12, fontWeight: '600', color: Colors.cyan },
  emptyCard: { alignItems: 'center', borderRadius: 16 },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.white, marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  historyItem: { marginBottom: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyLeft: { flex: 1 },
  historyUrl: { fontSize: 13, color: Colors.white, fontWeight: '600', marginBottom: 3 },
  historyDate: { fontSize: 11, color: Colors.textSecondary },
  scoreBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.glassBlue,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeText: { fontSize: 14, fontWeight: '900', color: Colors.cyan },
  bottomPad: { height: 20 },
});
