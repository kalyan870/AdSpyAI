import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import GlassCard from '../components/GlassCard';
import HookScoreRing from '../components/HookScoreRing';
import SoraPromptCard from '../components/SoraPromptCard';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'AnalysisDetail'>;

type ResultTab = 'hook' | 'script' | 'sora' | 'ugc';

const SECTION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  HOOK: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)', text: Colors.neonCyan },
  PROBLEM: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  SOLUTION: { bg: 'rgba(0,204,102,0.08)', border: 'rgba(0,204,102,0.25)', text: Colors.success },
  CTA: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: Colors.warning },
};

export default function AnalysisDetailScreen() {
  const route = useRoute<RouteType>();
  const { result } = route.params;
  const [activeTab, setActiveTab] = useState<ResultTab>('hook');
  const [copiedPrompts, setCopiedPrompts] = useState<Set<number>>(new Set());

  const tabs: { id: ResultTab; label: string }[] = [
    { id: 'hook', label: '🎣 Hook' },
    { id: 'script', label: '📋 Script' },
    { id: 'sora', label: '🎬 Sora' },
    { id: 'ugc', label: '✅ UGC' },
  ];

  return (
    <LinearGradient colors={['#050B1A', '#0A1628']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Analysis Result</Text>
          <Text style={styles.url} numberOfLines={2}>{result.url}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {activeTab === 'hook' && (
            <View>
              <GlassCard padding={16} style={styles.hookCard}>
                <View style={styles.hookRow}>
                  <HookScoreRing score={result.hookScore} size={90} />
                  <View style={styles.hookInfo}>
                    <Text style={styles.hookType}>{result.hookType}</Text>
                    <Text style={styles.hookTrigger}>{result.emotionalTrigger}</Text>
                    <Text style={styles.hookPlatform}>{result.platform} · {result.estimatedDuration}</Text>
                  </View>
                </View>
              </GlassCard>
              <GlassCard padding={14} style={styles.mb10}>
                <Text style={styles.fieldLabel}>Opening Hook</Text>
                <Text style={styles.openingText}>{result.openingHook}</Text>
              </GlassCard>
              {[
                { label: 'Pacing', value: result.pacing },
                { label: 'CTA Type', value: result.ctaType },
                { label: 'Target Audience', value: result.targetAudience },
              ].map((item) => (
                <GlassCard key={item.label} padding={12} style={styles.mb10}>
                  <Text style={styles.fieldLabel}>{item.label}</Text>
                  <Text style={styles.metaValue}>{item.value}</Text>
                </GlassCard>
              ))}
            </View>
          )}

          {activeTab === 'script' && result.scriptStructure.map((section) => {
            const colors = SECTION_COLORS[section.label];
            return (
              <View key={section.label} style={[styles.scriptSection, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <View style={styles.scriptHeader}>
                  <Text style={[styles.scriptLabel, { color: colors.text }]}>{section.label}</Text>
                  <Text style={styles.scriptDuration}>{section.duration}</Text>
                </View>
                <Text style={styles.scriptContent}>{section.content}</Text>
                {section.note && <Text style={styles.scriptNote}>💡 {section.note}</Text>}
              </View>
            );
          })}

          {activeTab === 'sora' && (
            <View>
              <Text style={styles.soraHeader}>5 Sora 2 Prompts</Text>
              {result.soraPrompts.map((prompt, i) => (
                <SoraPromptCard
                  key={i}
                  index={i}
                  prompt={prompt}
                  copied={copiedPrompts.has(i)}
                  onCopy={() => {
                    const next = new Set(copiedPrompts);
                    next.add(i);
                    setCopiedPrompts(next);
                    setTimeout(() => {
                      setCopiedPrompts((prev) => { const s = new Set(prev); s.delete(i); return s; });
                    }, 2000);
                  }}
                />
              ))}
            </View>
          )}

          {activeTab === 'ugc' && (
            <GlassCard padding={16}>
              <View style={styles.ugcHeader}>
                <Text style={styles.fieldLabel}>UGC Script</Text>
                <View style={styles.ugcActions}>
                  <TouchableOpacity
                    onPress={async () => {
                      await Clipboard.setStringAsync(result.ugcScript);
                      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                    style={styles.ugcBtn}
                  >
                    <Text style={styles.ugcBtnText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Share.share({ message: result.ugcScript })}
                    style={styles.ugcBtn}
                  >
                    <Text style={styles.ugcBtnText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.ugcScript}>{result.ugcScript}</Text>
            </GlassCard>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  url: { fontSize: 12, color: Colors.textMuted, marginBottom: 16, lineHeight: 17 },
  tabBar: { paddingBottom: 14, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  hookCard: { marginBottom: 10 },
  hookRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  hookInfo: { flex: 1 },
  hookType: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  hookTrigger: { fontSize: 12, color: Colors.cyan, marginBottom: 4 },
  hookPlatform: { fontSize: 11, color: Colors.textMuted },
  mb10: { marginBottom: 10 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
  openingText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, fontStyle: 'italic' },
  metaValue: { fontSize: 13, color: Colors.white, fontWeight: '600', lineHeight: 18 },
  scriptSection: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 10 },
  scriptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  scriptLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  scriptDuration: { fontSize: 11, color: Colors.textMuted },
  scriptContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 4 },
  scriptNote: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' },
  soraHeader: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  ugcHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  ugcActions: { flexDirection: 'row', gap: 8 },
  ugcBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.glassBlue, borderWidth: 1, borderColor: Colors.glassBlueBorder },
  ugcBtnText: { fontSize: 12, color: Colors.cyan, fontWeight: '600' },
  ugcScript: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
