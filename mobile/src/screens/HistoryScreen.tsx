import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import GlassCard from '../components/GlassCard';
import { getHistory, deleteAnalysis, clearHistory } from '../lib/storage';
import { AnalysisResult, RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<NavProp>();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getHistory();
        setHistory(data);
      };
      load();
    }, [])
  );

  const filtered = history.filter(
    (a) =>
      a.url.toLowerCase().includes(search.toLowerCase()) ||
      a.hookType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete Analysis', 'Are you sure you want to delete this analysis?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await deleteAnalysis(id);
          setHistory((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear History', 'Delete all analyses? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: AnalysisResult }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AnalysisDetail', { result: item })}
      activeOpacity={0.75}
    >
      <GlassCard style={styles.item} padding={14}>
        <View style={styles.itemRow}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{item.hookScore}</Text>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemUrl} numberOfLines={1}>
              {item.url}
            </Text>
            <Text style={styles.itemMeta}>
              {item.hookType} · {new Date(item.analyzedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </Text>
            <Text style={styles.itemPlatform}>{item.platform}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#050B1A', '#0A1628']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Analysis History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        {history.length > 0 && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by URL or hook type..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        )}

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No analyses yet</Text>
            <Text style={styles.emptyDesc}>
              Analyzed ads will appear here for quick access.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <GlassCard padding={20} style={styles.noResults}>
                <Text style={styles.noResultsText}>No results for "{search}"</Text>
              </GlassCard>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '900', color: Colors.white },
  clearAll: { fontSize: 13, color: '#EF4444', fontWeight: '600' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 12 },
  searchInput: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.white,
    fontSize: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  item: { marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glassBlue,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreText: { fontSize: 15, fontWeight: '900', color: Colors.cyan },
  itemContent: { flex: 1 },
  itemUrl: { fontSize: 13, color: Colors.white, fontWeight: '600', marginBottom: 3 },
  itemMeta: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  itemPlatform: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 14, color: Colors.textMuted },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  noResults: { alignItems: 'center' },
  noResultsText: { color: Colors.textSecondary, fontSize: 14 },
});
