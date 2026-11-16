import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blue?: boolean;
  padding?: number;
}

export default function GlassCard({ children, style, blue = false, padding = 16 }: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        blue ? styles.cardBlue : styles.cardDefault,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardDefault: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cardBlue: {
    backgroundColor: Colors.glassBlue,
    borderWidth: 1,
    borderColor: Colors.glassBlueBorder,
  },
});
