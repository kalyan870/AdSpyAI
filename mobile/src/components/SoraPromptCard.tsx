import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';

interface SoraPromptCardProps {
  index: number;
  prompt: string;
  onCopy: () => void;
  copied: boolean;
}

export default function SoraPromptCard({ index, prompt, onCopy, copied }: SoraPromptCardProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCopy();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <TouchableOpacity
          onPress={handleCopy}
          style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
          activeOpacity={0.75}
        >
          <Text style={[styles.copyText, copied && styles.copyTextSuccess]}>
            {copied ? '✓ Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.promptText}>{prompt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
    backgroundColor: Colors.glassBlue,
  },
  copyBtnSuccess: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(0,204,102,0.1)',
  },
  copyText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '600',
  },
  copyTextSuccess: {
    color: Colors.success,
  },
  promptText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
