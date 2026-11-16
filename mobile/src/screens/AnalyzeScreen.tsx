import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import HookScoreRing from '../components/HookScoreRing';
import SoraPromptCard from '../components/SoraPromptCard';
import { analyzeAd } from '../lib/api';
import { saveAnalysis, getSettings } from '../lib/storage';
import { AnalysisResult } from '../types';

type ResultTab = 'hook' | 'script' | 'sora' | 'ugc';

const SECTION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  HOOK: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)', text: Colors.neonCyan },
  PROBLEM: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  SOLUTION: { bg: 'rgba(0,204,102,0.08)', border: 'rgba(0,204,102,0.25)', text: Colors.success },
  CTA: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: Colors.warning },
};

const LOADING_MESSAGES = [
  'Fetching ad data...',
  'Analyzing hook structure...',
  'Decoding script format...',
  'Generating Sora prompts...',
  'Building UGC script...',
];

export default function AnalyzeScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<ResultTab>('hook');
  const [copiedPrompts, setCopiedPrompts] = useState<Set<number>>(new Set());
  const [ugcCopied, setUgcCopied] = useState(false);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setLoadingStep(0);
    setResult(null);
    setCopiedPrompts(new Set());

    // Cycle loading messages
    let step = 0;
    stepTimer.current = setInterval(() => {
      step = Math.min(step + 1, LOADING_MESSAGES.length - 1);
      setLoadingStep(step);
    }, 500);

    try {
      const settings = await getSettings();
      const { result: res, isDemo: demo } = await analyzeAd(url.trim(), {
        apiKey: settings.apiKey,
        baseUrl: settings.websiteUrl,
      });
      setResult(res);
      setIsDemo(demo);
      await saveAnalysis(res);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed';
      Alert.alert('Error', msg);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      if (stepTimer.current) clearInterval(stepTimer.current);
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setUrl(text);
  };

  const handleShareScript = async () => {
    if (!result) return;
    await Share.share({ message: result.ugcScript, title: 'UGC Script from AdSpy AI' });
  };

  const tabs: { id: ResultTab; label: string }[] = [
    { id: 'hook', label: '🎣 Hook' },
    { id: 'script', label: '📋 Script' },
    { id: 'sora', label: '🎬 Sora' },
    { id: 'ugc', label: '✅ UGC' },
  ];

  return (
    <LinearGradient colors={['#050B1A', '#0A1628']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.title}>Analyze Viral Ad</Text>
          <Text style={styles.subtitle}>Paste any ad URL to decode its viral formula</Text>

          {/* Input */}
          <GlassCard blue style={styles.inputCard} padding={16}>
            <Text style={styles.inputLabel}>Ad URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://instagram.com/reel/... or TikTok, YouTube"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleAnalyze}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity onPress={handlePaste} style={styles.pasteBtn}>
                <Text style={styles.pasteBtnText}>📋 Paste</Text>
              </TouchableOpacity>
              {url.length > 0 && (
                <TouchableOpacity onPress={() => setUrl('')} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>✕ Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>

          <GradientButton
            onPress={handleAnalyze}
            label="Analyze Now →"
            disabled={!url.trim()}
            loading={loading}
            style={styles.analyzeBtn}
          />

          {/* Loading state */}
          {loading && (
            <GlassCard style={styles.loadingCard} padding={20}>
              <View style={styles.loadingRow}>
                <View style={styles.spinner} />
                <Text style={styles.loadingMsg}>{LOADING_MESSAGES[loadingStep]}</Text>
              </View>
              <View style={styles.stepIndicators}>
                {LOADING_MESSAGES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.stepDot,
                      i <= loadingStep && styles.stepDotActive,
                    ]}
                  />
                ))}
              </View>
            </GlassCard>
          )}

          {/* Demo banner */}
          {isDemo && result && !loading && (
            <View style={styles.demoBanner}>
              <Text style={styles.demoBannerText}>
                🔬 Demo mode — Add API key in Settings for live AI analysis
              </Text>
            </View>
          )}

          {/* Results */}
          {result && !loading && (
            <View>
              {/* Tab bar */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBar}
              >
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Hook tab */}
              {activeTab === 'hook' && (
                <View>
                  <GlassCard style={styles.hookCard} padding={16}>
                    <View style={styles.hookRow}>
                      <HookScoreRing score={result.hookScore} size={90} />
                      <View style={styles.hookInfo}>
                        <Text style={styles.hookType}>{result.hookType}</Text>
                        <Text style={styles.hookTrigger}>
                          Trigger: {result.emotionalTrigger}
                        </Text>
                        <View style={styles.hookChips}>
                          <GlassCard blue padding={6} style={styles.chip}>
                            <Text style={styles.chipText}>{result.platform}</Text>
                          </GlassCard>
                          <GlassCard blue padding={6} style={styles.chip}>
                            <Text style={styles.chipText}>{result.estimatedDuration}</Text>
                          </GlassCard>
                        </View>
                      </View>
                    </View>
                  </GlassCard>

                  <GlassCard style={styles.openingCard} padding={14}>
                    <Text style={styles.fieldLabel}>Opening Hook</Text>
                    <Text style={styles.openingText}>{result.openingHook}</Text>
                  </GlassCard>

                  <View style={styles.metaGrid}>
                    {[
                      { label: 'Pacing', value: result.pacing },
                      { label: 'CTA Type', value: result.ctaType },
                      { label: 'Target Audience', value: result.targetAudience },
                    ].map((item) => (
                      <GlassCard key={item.label} padding={12} style={styles.metaCard}>
                        <Text style={styles.fieldLabel}>{item.label}</Text>
                        <Text style={styles.metaValue}>{item.value}</Text>
                      </GlassCard>
                    ))}
                  </View>
                </View>
              )}

              {/* Script tab */}
              {activeTab === 'script' && (
                <View>
                  {result.scriptStructure.map((section) => {
                    const colors = SECTION_COLORS[section.label];
                    return (
                      <View
                        key={section.label}
                        style={[
                          styles.scriptSection,
                          { backgroundColor: colors.bg, borderColor: colors.border },
                        ]}
                      >
                        <View style={styles.scriptHeader}>
                          <Text style={[styles.scriptLabel, { color: colors.text }]}>
                            {section.label}
                          </Text>
                          <Text style={styles.scriptDuration}>{section.duration}</Text>
                        </View>
                        <Text style={styles.scriptContent}>{section.content}</Text>
                        {section.note && (
                          <Text style={styles.scriptNote}>💡 {section.note}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Sora tab */}
              {activeTab === 'sora' && (
                <View>
                  <Text style={styles.soraHeader}>5 Sora 2 video prompts — ready to use</Text>
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
                          setCopiedPrompts((prev) => {
                            const s = new Set(prev);
                            s.delete(i);
                            return s;
                          });
                        }, 2000);
                      }}
                    />
                  ))}
                </View>
              )}

              {/* UGC tab */}
              {activeTab === 'ugc' && (
                <GlassCard padding={16}>
                  <View style={styles.ugcHeader}>
                    <View>
                      <Text style={styles.fieldLabel}>UGC Script</Text>
                      <Text style={styles.ugcWordCount}>
                        {result.ugcScript.split(' ').length} words · film-ready
                      </Text>
                    </View>
                    <View style={styles.ugcActions}>
                      <TouchableOpacity
                        onPress={async () => {
                          await Clipboard.setStringAsync(result.ugcScript);
                          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          setUgcCopied(true);
                          setTimeout(() => setUgcCopied(false), 2000);
                        }}
                        style={[styles.ugcBtn, ugcCopied && styles.ugcBtnSuccess]}
                      >
                        <Text style={[styles.ugcBtnText, ugcCopied && styles.ugcBtnSuccessText]}>
                          {ugcCopied ? '✓ Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleShareScript} style={styles.ugcBtn}>
                        <Text style={styles.ugcBtnText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.ugcScript}>{result.ugcScript}</Text>
                </GlassCard>
              )}
            </View>
          )}

          {/* Empty state */}
          {!result && !loading && (
            <GlassCard style={styles.emptyState} padding={32}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Ready to Analyze</Text>
              <Text style={styles.emptyDesc}>
                Paste a viral ad URL above and tap Analyze Now
              </Text>
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
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 18 },
  inputCard: { marginBottom: 14 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
  input: {
    color: Colors.white,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 10,
  },
  inputActions: { flexDirection: 'row', gap: 8 },
  pasteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.glassBlue,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
  },
  pasteBtnText: { fontSize: 12, color: Colors.cyan, fontWeight: '600' },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  clearBtnText: { fontSize: 12, color: '#EF4444', fontWeight: '600' },
  analyzeBtn: { marginBottom: 16 },
  loadingCard: { marginBottom: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderTopColor: 'transparent',
  },
  loadingMsg: { fontSize: 14, color: Colors.textSecondary },
  stepIndicators: { flexDirection: 'row', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.glassBorder },
  stepDotActive: { backgroundColor: Colors.primary },
  demoBanner: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  demoBannerText: { fontSize: 12, color: Colors.warning, lineHeight: 17 },
  tabBar: { paddingBottom: 12, gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  hookCard: { marginBottom: 10 },
  hookRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  hookInfo: { flex: 1 },
  hookType: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  hookTrigger: { fontSize: 12, color: Colors.cyan, marginBottom: 8 },
  hookChips: { flexDirection: 'row', gap: 6 },
  chip: { borderRadius: 20 },
  chipText: { fontSize: 10, fontWeight: '600', color: Colors.cyan },
  openingCard: { marginBottom: 10 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
  openingText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, fontStyle: 'italic' },
  metaGrid: { gap: 8 },
  metaCard: { marginBottom: 0 },
  metaValue: { fontSize: 13, color: Colors.white, fontWeight: '600', lineHeight: 18 },
  scriptSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  scriptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  scriptLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  scriptDuration: { fontSize: 11, color: Colors.textMuted },
  scriptContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  scriptNote: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' },
  soraHeader: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  ugcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  ugcWordCount: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  ugcActions: { flexDirection: 'row', gap: 8 },
  ugcBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.glassBlue,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
  },
  ugcBtnSuccess: { backgroundColor: 'rgba(0,204,102,0.1)', borderColor: 'rgba(0,204,102,0.3)' },
  ugcBtnText: { fontSize: 12, color: Colors.cyan, fontWeight: '600' },
  ugcBtnSuccessText: { color: Colors.success },
  ugcScript: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  emptyState: { alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 42, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
});
