import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Modal, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'rent', label: 'Rent / Housing', emoji: '🏠', color: '#CC0000', budget: 1800 },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', color: '#3FB950', budget: 400 },
  { id: 'remittance', label: 'Remittance (INR)', emoji: '💸', color: '#FF9933', budget: 500 },
  { id: 'transport', label: 'Transport', emoji: '🚇', color: '#58A6FF', budget: 200 },
  { id: 'phone', label: 'Phone / Internet', emoji: '📱', color: '#9B59B6', budget: 100 },
  { id: 'dining', label: 'Dining Out', emoji: '🍛', color: '#E67E22', budget: 150 },
  { id: 'tfsa', label: 'TFSA Contribution', emoji: '🏦', color: '#2ECC71', budget: 583 },
  { id: 'rrsp', label: 'RRSP Contribution', emoji: '📈', color: '#3498DB', budget: 300 },
  { id: 'misc', label: 'Miscellaneous', emoji: '🎯', color: '#8B949E', budget: 200 },
];

const MONTH = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

export default function BudgetScreen() {
  const [expenses, setExpenses] = useState({
    rent: 1750, groceries: 320, remittance: 500,
    transport: 156, phone: 89, dining: 95,
    tfsa: 583, rrsp: 300, misc: 67,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const totalBudget = CATEGORIES.reduce((a, c) => a + c.budget, 0);
  const totalSpent = Object.values(expenses).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setInputValue(String(expenses[cat.id] || ''));
    setModalVisible(true);
  };

  const saveExpense = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) setExpenses(prev => ({ ...prev, [selectedCat.id]: val }));
    setModalVisible(false);
  };

  const tfsaLimit = 7000;
  const rrspLimit = 18000;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>💰 Budget Manager</Text>
          <Text style={styles.subtitle}>{MONTH}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={[styles.summaryValue, { color: '#E6EDF3' }]}>${totalBudget.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={[styles.summaryValue, { color: '#CC0000' }]}>${totalSpent.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Left</Text>
              <Text style={[styles.summaryValue, { color: remaining >= 0 ? '#3FB950' : '#F85149' }]}>
                ${Math.abs(remaining).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {
              flex: overallPct,
              backgroundColor: totalSpent > totalBudget ? '#F85149' : '#FF9933',
            }]} />
            <View style={{ flex: 100 - overallPct }} />
          </View>
          <Text style={styles.barLabel}>{overallPct}% of budget used</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['overview', 'investments', 'remittance'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'overview' ? '📊 Overview' : tab === 'investments' ? '🏦 Savings' : '💸 Remit'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview */}
        {activeTab === 'overview' && (
          <View style={styles.section}>
            {CATEGORIES.map((cat) => {
              const spent = expenses[cat.id] || 0;
              const pct = Math.min(Math.round((spent / cat.budget) * 100), 100);
              const over = spent > cat.budget;
              return (
                <TouchableOpacity key={cat.id} style={styles.catRow} onPress={() => openEdit(cat)}>
                  <View style={styles.catLeft}>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catLabel}>{cat.label}</Text>
                      <View style={styles.barTrackSmall}>
                        <View style={[styles.barFillSmall, {
                          flex: pct,
                          backgroundColor: over ? '#F85149' : cat.color,
                        }]} />
                        <View style={{ flex: 100 - pct }} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.catRight}>
                    <Text style={[styles.catSpent, { color: over ? '#F85149' : '#E6EDF3' }]}>${spent}</Text>
                    <Text style={styles.catBudget}>/ ${cat.budget}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <Text style={styles.tapHint}>Tap any category to update</Text>
          </View>
        )}

        {/* Investments */}
        {activeTab === 'investments' && (
          <View style={styles.section}>
            {[
              { title: '🏦 TFSA Tracker', sub: '2024 Room: $7,000', monthly: expenses.tfsa, limit: tfsaLimit, color: '#2ECC71', note: '💡 Use RRSP first as a dual citizen — TFSA growth is taxable by the IRS.' },
              { title: '📈 RRSP Tracker', sub: 'Est. 2024 Limit: $18,000', monthly: expenses.rrsp, limit: rrspLimit, color: '#3498DB', note: '💡 RRSP is recognized by the US-Canada tax treaty — great for dual citizens.' },
            ].map((item, i) => {
              const annual = item.monthly * 12;
              const pct = Math.min(Math.round((annual / item.limit) * 100), 100);
              return (
                <View key={i} style={styles.investCard}>
                  <Text style={styles.investTitle}>{item.title}</Text>
                  <Text style={styles.investSub}>{item.sub}</Text>
                  <View style={styles.investRow}>
                    <Text style={styles.investLabel}>Monthly</Text>
                    <Text style={styles.investVal}>${item.monthly}/mo</Text>
                  </View>
                  <View style={styles.investRow}>
                    <Text style={styles.investLabel}>Annualized</Text>
                    <Text style={styles.investVal}>${annual.toLocaleString()}/yr</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { flex: pct, backgroundColor: item.color }]} />
                    <View style={{ flex: 100 - pct }} />
                  </View>
                  <Text style={styles.barLabel}>${annual.toLocaleString()} of ${item.limit.toLocaleString()} used</Text>
                  <Text style={styles.investNote}>{item.note}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Remittance */}
        {activeTab === 'remittance' && (
          <View style={styles.section}>
            <View style={styles.rateCard}>
              <Text style={styles.rateTitle}>CAD → INR Today</Text>
              <Text style={styles.rateValue}>1 CAD = 61.42 INR</Text>
              <Text style={styles.rateSub}>via Wise (live rate)</Text>
            </View>
            <View style={styles.investCard}>
              <Text style={styles.investTitle}>Monthly Remittance</Text>
              <View style={styles.investRow}>
                <Text style={styles.investLabel}>Sending</Text>
                <Text style={styles.investVal}>${expenses.remittance} CAD</Text>
              </View>
              <View style={styles.investRow}>
                <Text style={styles.investLabel}>Recipient gets (~)</Text>
                <Text style={[styles.investVal, { color: '#FF9933' }]}>
                  ₹{Math.round(expenses.remittance * 61.42).toLocaleString('en-IN')} INR
                </Text>
              </View>
              <View style={styles.investRow}>
                <Text style={styles.investLabel}>Annual total</Text>
                <Text style={styles.investVal}>${(expenses.remittance * 12).toLocaleString()} CAD</Text>
              </View>
            </View>
            <View style={styles.investCard}>
              <Text style={styles.investTitle}>Platform Comparison</Text>
              {[
                { name: 'Wise ⭐', rate: '61.42', fee: '$2.50', best: true },
                { name: 'Remitly', rate: '60.85', fee: '$0', best: false },
                { name: 'Western Union', rate: '59.10', fee: '$5.00', best: false },
              ].map((p, i) => (
                <View key={i} style={[styles.platformRow, p.best && styles.platformBest]}>
                  <Text style={styles.platformName}>{p.name}</Text>
                  <Text style={styles.platformRate}>₹{p.rate}/CAD</Text>
                  <Text style={styles.platformFee}>{p.fee}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCat?.emoji} {selectedCat?.label}</Text>
            <Text style={styles.modalSub}>Budget: ${selectedCat?.budget}/month</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="Enter amount spent"
              placeholderTextColor="#484F58"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveExpense}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#E6EDF3' },
  subtitle: { fontSize: 14, color: '#8B949E', marginTop: 4 },

  summaryCard: {
    margin: 20, marginTop: 8, padding: 16,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#FF993366',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: '#8B949E', marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryDivider: { width: 1, backgroundColor: '#2D333B' },

  barTrack: {
    height: 8, backgroundColor: '#2D333B', borderRadius: 4,
    overflow: 'hidden', flexDirection: 'row',
  },
  barFill: { height: 8 },
  barLabel: { fontSize: 11, color: '#8B949E', marginTop: 6, textAlign: 'right' },

  barTrackSmall: {
    height: 4, backgroundColor: '#2D333B', borderRadius: 2,
    overflow: 'hidden', flexDirection: 'row', marginTop: 4, width: width * 0.35,
  },
  barFillSmall: { height: 4 },

  tabs: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 4,
    backgroundColor: '#161B22', borderRadius: 12, padding: 4,
    borderWidth: 1, borderColor: '#2D333B',
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#FF993330' },
  tabText: { fontSize: 11, color: '#8B949E', fontWeight: '600' },
  tabTextActive: { color: '#FF9933' },

  section: { padding: 20, paddingTop: 12 },

  catRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2D333B',
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  catEmoji: { fontSize: 22 },
  catLabel: { fontSize: 13, fontWeight: '600', color: '#E6EDF3', marginBottom: 2 },
  catRight: { alignItems: 'flex-end' },
  catSpent: { fontSize: 15, fontWeight: '700' },
  catBudget: { fontSize: 11, color: '#8B949E' },
  tapHint: { textAlign: 'center', fontSize: 12, color: '#484F58', marginTop: 16 },

  investCard: {
    backgroundColor: '#161B22', borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#2D333B',
  },
  investTitle: { fontSize: 15, fontWeight: '700', color: '#E6EDF3', marginBottom: 4 },
  investSub: { fontSize: 12, color: '#8B949E', marginBottom: 12 },
  investRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2D333B',
  },
  investLabel: { fontSize: 13, color: '#8B949E' },
  investVal: { fontSize: 13, fontWeight: '700', color: '#E6EDF3' },
  investNote: { fontSize: 12, color: '#D29922', marginTop: 10, lineHeight: 17 },

  rateCard: {
    backgroundColor: '#FF993320', borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#FF993350', alignItems: 'center',
  },
  rateTitle: { fontSize: 14, color: '#8B949E', marginBottom: 6 },
  rateValue: { fontSize: 28, fontWeight: '900', color: '#FF9933' },
  rateSub: { fontSize: 11, color: '#484F58', marginTop: 4 },

  platformRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2D333B',
  },
  platformBest: { backgroundColor: '#3FB95015', borderRadius: 8, paddingHorizontal: 4 },
  platformName: { fontSize: 13, fontWeight: '600', color: '#E6EDF3', flex: 1 },
  platformRate: { fontSize: 13, color: '#58A6FF', fontWeight: '700' },
  platformFee: { fontSize: 12, color: '#8B949E', marginLeft: 12 },

  modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#161B22', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, borderTopWidth: 1, borderColor: '#2D333B',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#E6EDF3', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#8B949E', marginBottom: 16 },
  modalInput: {
    backgroundColor: '#1C2128', borderRadius: 10, padding: 14,
    fontSize: 18, color: '#E6EDF3', borderWidth: 1, borderColor: '#2D333B', marginBottom: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 10,
    backgroundColor: '#1C2128', alignItems: 'center',
    borderWidth: 1, borderColor: '#2D333B',
  },
  cancelText: { color: '#8B949E', fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FF9933', alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
