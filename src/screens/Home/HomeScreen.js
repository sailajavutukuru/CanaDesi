import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const QUICK_STATS = [
  { label: 'PR Progress', value: '68%', emoji: '🛂', color: '#FF9933' },
  { label: 'Monthly Budget', value: '$3,200', emoji: '💰', color: '#3FB950' },
  { label: 'CAD → INR Rate', value: '61.4', emoji: '💸', color: '#58A6FF' },
  { label: 'TFSA Room Left', value: '$18,500', emoji: '🏦', color: '#CC0000' },
];

const QUICK_LINKS = [
  { label: 'PR Checklist', emoji: '📋', screen: 'Immigration' },
  { label: 'Track Expenses', emoji: '📊', screen: 'Budget' },
  { label: 'Send Money', emoji: '💸', screen: 'Budget' },
  { label: 'TFSA Tracker', emoji: '🏦', screen: 'Budget' },
];

export default function HomeScreen({ navigation }) {
  const today = new Date().toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Namaste 🙏</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.flagBadge}>
            <Text style={styles.flagEmoji}>🇨🇦🇮🇳</Text>
          </View>
        </View>

        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>CanaDesi</Text>
          <Text style={styles.heroSubtitle}>
            Your all-in-one guide to life in Canada — immigration, budgeting, and beyond.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your Snapshot</Text>
        <View style={styles.statsGrid}>
          {QUICK_STATS.map((stat, i) => (
            <View key={i} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.linksGrid}>
          {QUICK_LINKS.map((link, i) => (
            <TouchableOpacity
              key={i}
              style={styles.linkCard}
              onPress={() => navigation.navigate(link.screen)}
            >
              <Text style={styles.linkEmoji}>{link.emoji}</Text>
              <Text style={styles.linkLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipHeader}>💡 Newcomer Tip</Text>
          <Text style={styles.tipText}>
            Open your TFSA before your RRSP. TFSA room accumulates from age 18 regardless of income —
            and withdrawals are tax-free. Your 2024 contribution limit is $7,000.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const cardWidth = (width - 40) / 2 - 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: '#E6EDF3' },
  date: { fontSize: 13, color: '#8B949E', marginTop: 2 },
  flagBadge: {
    backgroundColor: '#1C2128', borderRadius: 12,
    padding: 8, borderWidth: 1, borderColor: '#2D333B',
  },
  flagEmoji: { fontSize: 22 },

  heroBanner: {
    margin: 20, padding: 20, borderRadius: 16,
    backgroundColor: '#1C2128',
    borderWidth: 1, borderColor: '#FF993366',
    borderLeftWidth: 4, borderLeftColor: '#FF9933',
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#FF9933', letterSpacing: 1 },
  heroSubtitle: { fontSize: 14, color: '#8B949E', marginTop: 6, lineHeight: 20 },

  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#E6EDF3',
    paddingHorizontal: 20, marginBottom: 12, marginTop: 4,
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, gap: 8, marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1C2128', borderRadius: 12, padding: 14,
    width: cardWidth, borderLeftWidth: 3,
    borderWidth: 1, borderColor: '#2D333B',
  },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#8B949E', marginTop: 2 },

  linksGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, gap: 8, marginBottom: 20,
  },
  linkCard: {
    backgroundColor: '#1C2128', borderRadius: 12, padding: 16,
    alignItems: 'center', width: cardWidth,
    borderWidth: 1, borderColor: '#2D333B',
  },
  linkEmoji: { fontSize: 28, marginBottom: 6 },
  linkLabel: { fontSize: 13, fontWeight: '600', color: '#E6EDF3' },

  tipCard: {
    margin: 20, marginTop: 0, padding: 16, borderRadius: 12,
    backgroundColor: '#1C2128', borderWidth: 1, borderColor: '#D2992280',
  },
  tipHeader: { fontSize: 14, fontWeight: '700', color: '#D29922', marginBottom: 6 },
  tipText: { fontSize: 13, color: '#8B949E', lineHeight: 19 },
});
