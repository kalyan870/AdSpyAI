import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { getSettings, saveSettings, clearHistory, AppSettings } from '../lib/storage';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    websiteUrl: '',
    saveHistory: true,
    demoMode: true,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'Delete all saved analyses?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          Alert.alert('Done', 'History cleared.');
        },
      },
    ]);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <LinearGradient colors={['#050B1A', '#0A1628']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Settings</Text>

          {/* API Configuration */}
          <SectionHeader title="🔑 API Configuration" />
          <GlassCard style={styles.card} padding={16}>
            <Text style={styles.label}>OpenAI API Key</Text>
            <Text style={styles.labelSub}>Required for live AI analysis (optional)</Text>
            <View style={styles.apiKeyRow}>
              <TextInput
                style={[styles.input, styles.apiKeyInput]}
                value={settings.apiKey}
                onChangeText={(v) => setSettings({ ...settings, apiKey: v })}
                placeholder="sk-..."
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowApiKey(!showApiKey)}
                style={styles.showBtn}
              >
                <Text style={styles.showBtnText}>{showApiKey ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {settings.apiKey && settings.apiKey.startsWith('sk-') ? (
              <View style={styles.apiStatus}>
                <View style={[styles.statusDot, styles.statusGreen]} />
                <Text style={styles.statusText}>API key configured</Text>
              </View>
            ) : (
              <View style={styles.apiStatus}>
                <View style={[styles.statusDot, styles.statusYellow]} />
                <Text style={styles.statusText}>Demo mode active</Text>
              </View>
            )}

            <Text style={[styles.label, { marginTop: 14 }]}>Website API URL</Text>
            <Text style={styles.labelSub}>Connect to your deployed website (optional)</Text>
            <TextInput
              style={styles.input}
              value={settings.websiteUrl}
              onChangeText={(v) => setSettings({ ...settings, websiteUrl: v })}
              placeholder="https://your-adspy-ai-site.vercel.app"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </GlassCard>

          {/* Preferences */}
          <SectionHeader title="⚙️ Preferences" />
          <GlassCard style={styles.card} padding={16}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Save Analyses</Text>
                <Text style={styles.labelSub}>Store analyses in history</Text>
              </View>
              <Switch
                value={settings.saveHistory}
                onValueChange={(v) => setSettings({ ...settings, saveHistory: v })}
                trackColor={{ false: Colors.glass, true: Colors.primary }}
                thumbColor="white"
              />
            </View>
            <View style={[styles.switchRow, { borderTopWidth: 1, borderTopColor: Colors.glassBorder, paddingTop: 14 }]}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>Demo Mode</Text>
                <Text style={styles.labelSub}>Use sample data when no API key set</Text>
              </View>
              <Switch
                value={settings.demoMode}
                onValueChange={(v) => setSettings({ ...settings, demoMode: v })}
                trackColor={{ false: Colors.glass, true: Colors.primary }}
                thumbColor="white"
              />
            </View>
          </GlassCard>

          <GradientButton
            onPress={handleSave}
            label={saved ? '✓ Saved!' : 'Save Settings'}
            style={styles.saveBtn}
          />

          {/* Data */}
          <SectionHeader title="🗂️ Data" />
          <GlassCard style={styles.card} padding={16}>
            <TouchableOpacity onPress={handleClearHistory} style={styles.dangerBtn}>
              <Text style={styles.dangerBtnText}>🗑️ Clear Analysis History</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* About */}
          <SectionHeader title="ℹ️ About" />
          <GlassCard style={styles.card} padding={16}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://adspy-ai.vercel.app')}
              style={styles.linkBtn}
            >
              <Text style={styles.linkBtnText}>🌐 Visit Website →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://adspy-ai.vercel.app/privacy')}
              style={styles.linkBtn}
            >
              <Text style={styles.linkBtnText}>🔒 Privacy Policy →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://adspy-ai.vercel.app/terms')}
              style={styles.linkBtn}
            >
              <Text style={styles.linkBtnText}>📄 Terms of Service →</Text>
            </TouchableOpacity>
          </GlassCard>

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
  title: { fontSize: 26, fontWeight: '900', color: Colors.white, marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: { marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  labelSub: { fontSize: 11, color: Colors.textMuted, marginBottom: 10 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.white,
    fontSize: 14,
    marginBottom: 10,
  },
  apiKeyRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  apiKeyInput: { flex: 1, marginBottom: 0 },
  showBtn: { padding: 10 },
  showBtnText: { fontSize: 18 },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusGreen: { backgroundColor: Colors.success },
  statusYellow: { backgroundColor: Colors.warning },
  statusText: { fontSize: 12, color: Colors.textSecondary },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { flex: 1 },
  saveBtn: { marginTop: 6, marginBottom: 6 },
  dangerBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
  },
  dangerBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  aboutLabel: { fontSize: 14, color: Colors.textSecondary },
  aboutValue: { fontSize: 14, color: Colors.white, fontWeight: '600' },
  linkBtn: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.glassBorder },
  linkBtnText: { fontSize: 14, color: Colors.cyan, fontWeight: '500' },
});
