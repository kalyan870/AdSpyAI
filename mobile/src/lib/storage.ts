import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../types';

const HISTORY_KEY = '@adspy_history';
const SETTINGS_KEY = '@adspy_settings';

export interface AppSettings {
  apiKey?: string;
  websiteUrl?: string;
  saveHistory: boolean;
  demoMode: boolean;
}

export const defaultSettings: AppSettings = {
  apiKey: '',
  websiteUrl: 'http://localhost:3000',
  saveHistory: true,
  demoMode: true,
};

export async function saveAnalysis(result: AnalysisResult): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings.saveHistory) return;

    const existing = await getHistory();
    const updated = [result, ...existing].slice(0, 50); // Keep last 50
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save analysis:', error);
  }
}

export async function getHistory(): Promise<AnalysisResult[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const existing = await getHistory();
    const updated = existing.filter((a) => a.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete analysis:', error);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
