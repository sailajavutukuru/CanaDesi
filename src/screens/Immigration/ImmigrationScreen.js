import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { IMMIGRATION_CHECKLIST } from '../../data/immigrationData';

export default function ImmigrationScreen() {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedCategory, setExpandedCategory] = useState('Arrival Essentials');

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = IMMIGRATION_CHECKLIST.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>🛂 Immigration Tracker</Text>
          <Text style={styles.subtitle}>Your step-by-step guide to settling in Canada</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{completedItems}/{totalItems} steps</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { flex: progressPercent }]} />
            <View style={{ flex: 100 - progressPercent }} />
          </View>
          <Text style={styles.progressPercent}>{progressPercent}% complete</Text>
        </View>

        {IMMIGRATION_CHECKLIST.map((category) => {
          const isExpanded = expandedCategory === category.category;
          const catCompleted = category.items.filter(item => checkedItems[item.id]).length;

          return (
            <View key={category.category} style={styles.categoryBlock}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setExpandedCategory(isExpanded ? null : category.category)}
              >
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <View>
                    <Text style={styles.categoryTitle}>{category.category}</Text>
                    <Text style={styles.categoryProgress}>{catCompleted}/{category.items.length} done</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.checkItem, checkedItems[item.id] && styles.checkItemDone]}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={[styles.checkbox, checkedItems[item.id] && styles.checkboxDone]}>
                    {checkedItems[item.id] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.checkContent}>
                    <Text style={[styles.checkLabel, checkedItems[item.id] && styles.checkLabelDone]}>
                      {item.label}
                    </Text>
                    <Text style={styles.checkDetail}>{item.detail}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <View style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>📌 Key Resources</Text>
          {[
            { label: 'IRCC Official Website', url: 'canada.ca/immigration' },
            { label: 'CRA My Account', url: 'canada.ca/cra' },
            { label: 'Service Canada (SIN)', url: 'canada.ca/service-canada' },
            { label: 'WES Credential Evaluation', url: 'wes.org' },
          ].map((r, i) => (
            <View key={i} style={styles.resourceRow}>
              <Text style={styles.resourceLabel}>🔗 {r.label}</Text>
              <Text style={styles.resourceUrl}>{r.url}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#E6EDF3' },
  subtitle: { fontSize: 14, color: '#8B949E', marginTop: 4 },

  progressCard: {
    margin: 20, marginTop: 8, padding: 16,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#FF993366',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#E6EDF3' },
  progressValue: { fontSize: 14, color: '#FF9933', fontWeight: '700' },
  progressBar: {
    height: 8, backgroundColor: '#2D333B', borderRadius: 4,
    overflow: 'hidden', flexDirection: 'row',
  },
  progressFill: { backgroundColor: '#FF9933' },
  progressPercent: { fontSize: 12, color: '#8B949E', marginTop: 6, textAlign: 'right' },

  categoryBlock: {
    marginHorizontal: 20, marginBottom: 10,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#2D333B', overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryEmoji: { fontSize: 22 },
  categoryTitle: { fontSize: 15, fontWeight: '700', color: '#E6EDF3' },
  categoryProgress: { fontSize: 11, color: '#8B949E', marginTop: 1 },
  chevron: { color: '#8B949E', fontSize: 12 },

  checkItem: {
    flexDirection: 'row', padding: 12, paddingLeft: 14,
    borderTopWidth: 1, borderTopColor: '#2D333B', gap: 12, alignItems: 'flex-start',
  },
  checkItemDone: { opacity: 0.6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#FF9933',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxDone: { backgroundColor: '#FF9933', borderColor: '#FF9933' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '800' },
  checkContent: { flex: 1 },
  checkLabel: { fontSize: 14, fontWeight: '600', color: '#E6EDF3' },
  checkLabelDone: { textDecorationLine: 'line-through', color: '#8B949E' },
  checkDetail: { fontSize: 12, color: '#8B949E', marginTop: 3, lineHeight: 17 },

  resourcesCard: {
    margin: 20, padding: 16, backgroundColor: '#161B22',
    borderRadius: 14, borderWidth: 1, borderColor: '#58A6FF66',
  },
  resourcesTitle: { fontSize: 15, fontWeight: '700', color: '#58A6FF', marginBottom: 12 },
  resourceRow: { marginBottom: 10 },
  resourceLabel: { fontSize: 13, fontWeight: '600', color: '#E6EDF3' },
  resourceUrl: { fontSize: 12, color: '#8B949E', marginTop: 2 },
});
