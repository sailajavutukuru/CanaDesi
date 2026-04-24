import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Linking, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLATFORMS = [
  {
    name: 'Wise',
    emoji: '🏆',
    badge: 'Best Rate',
    badgeColor: '#3FB950',
    fee: 'Low fee',
    speed: '1-2 days',
    url: 'https://wise.com/invite/ih/sailajav',
    color: '#3FB950',
  },
  {
    name: 'Remitly',
    emoji: '💸',
    badge: 'Fast',
    badgeColor: '#58A6FF',
    fee: 'No fee',
    speed: 'Minutes',
    url: 'https://remitly.com',
    color: '#58A6FF',
  },
  {
    name: 'Western Union',
    emoji: '🏦',
    badge: 'Established',
    badgeColor: '#8B949E',
    fee: 'Higher fee',
    speed: 'Same day',
    url: 'https://westernunion.com',
    color: '#8B949E',
  },
];

export default function RatesScreen() {
  const [rate, setRate] = useState(61.42);
  const [loading, setLoading] = useState(false);
  const [sendAmount, setSendAmount] = useState('500');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [alert, setAlert] = useState('');

  const receiveAmount = (parseFloat(sendAmount) * rate).toFixed(0);

  const refreshRate = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
      const data = await res.json();
      if (data.rates && data.rates.INR) {
        setRate(data.rates.INR.toFixed(2));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      // keep existing rate
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshRate();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>💸 Send Money</Text>
          <Text style={styles.subtitle}>CAD → INR rates & transfers</Text>
        </View>

        {/* Live Rate Card */}
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>Live Exchange Rate</Text>
          <View style={styles.rateRow}>
            {loading ? (
              <ActivityIndicator color="#FF9933" size="large" />
            ) : (
              <Text style={styles.rateValue}>1 CAD = ₹{rate}</Text>
            )}
          </View>
          <Text style={styles.rateUpdated}>Updated: {lastUpdated}</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={refreshRate}>
            <Text style={styles.refreshText}>🔄 Refresh Rate</Text>
          </TouchableOpacity>
        </View>

        {/* Calculator */}
        <View style={styles.calcCard}>
          <Text style={styles.calcTitle}>💰 Remittance Calculator</Text>
          <View style={styles.calcRow}>
            <View style={styles.calcInput}>
              <Text style={styles.calcLabel}>You send (CAD)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currency}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={sendAmount}
                  onChangeText={setSendAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#484F58"
                />
              </View>
            </View>
            <Text style={styles.calcArrow}>→</Text>
            <View style={styles.calcInput}>
              <Text style={styles.calcLabel}>They receive (INR)</Text>
              <View style={[styles.inputWrapper, { borderColor: '#FF9933' }]}>
                <Text style={[styles.currency, { color: '#FF9933' }]}>₹</Text>
                <Text style={styles.receiveAmount}>
                  {isNaN(receiveAmount) ? '0' : parseInt(receiveAmount).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.calcNote}>
            Annual total: ${(parseFloat(sendAmount) * 12).toLocaleString()} CAD →
            ₹{(parseFloat(sendAmount) * 12 * rate).toLocaleString('en-IN')} INR
          </Text>
        </View>

        {/* Rate Alert */}
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>🔔 Rate Alert</Text>
          <Text style={styles.alertSub}>Notify me when rate goes above:</Text>
          <View style={styles.alertRow}>
            <TextInput
              style={styles.alertInput}
              value={alert}
              onChangeText={setAlert}
              keyboardType="numeric"
              placeholder="e.g. 63"
              placeholderTextColor="#484F58"
            />
            <TouchableOpacity style={styles.alertBtn}>
              <Text style={styles.alertBtnText}>Set Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Platform Comparison */}
        <Text style={styles.sectionTitle}>Choose Platform</Text>
        {PLATFORMS.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={styles.platformCard}
            onPress={() => Linking.openURL(p.url)}
          >
            <View style={styles.platformLeft}>
              <Text style={styles.platformEmoji}>{p.emoji}</Text>
              <View>
                <View style={styles.platformNameRow}>
                  <Text style={styles.platformName}>{p.name}</Text>
                  <View style={[styles.badge, { backgroundColor: p.badgeColor + '30' }]}>
                    <Text style={[styles.badgeText, { color: p.badgeColor }]}>{p.badge}</Text>
                  </View>
                </View>
                <Text style={styles.platformDetails}>
                  {p.fee} · {p.speed}
                </Text>
              </View>
            </View>
            <View style={styles.platformRight}>
              <Text style={[styles.platformRate, { color: p.color }]}>
                ₹{(rate * 0.998).toFixed(2)}
              </Text>
              <Text style={styles.sendNow}>Send →</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Tips */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Money Transfer Tips</Text>
          <Text style={styles.tipText}>• Send larger amounts less often to save on fees</Text>
          <Text style={styles.tipText}>• Weekday rates are often better than weekends</Text>
          <Text style={styles.tipText}>• Set a rate alert to send when the rate peaks</Text>
          <Text style={styles.tipText}>• Annual remittance limit from India: $250,000 USD</Text>
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

  rateCard: {
    margin: 20, marginTop: 8, padding: 20,
    backgroundColor: '#FF993315', borderRadius: 16,
    borderWidth: 1, borderColor: '#FF993350', alignItems: 'center',
  },
  rateLabel: { fontSize: 13, color: '#8B949E', marginBottom: 8 },
  rateRow: { minHeight: 50, justifyContent: 'center' },
  rateValue: { fontSize: 32, fontWeight: '900', color: '#FF9933' },
  rateUpdated: { fontSize: 11, color: '#484F58', marginTop: 6 },
  refreshBtn: {
    marginTop: 12, paddingHorizontal: 20, paddingVertical: 8,
    backgroundColor: '#FF993320', borderRadius: 20,
    borderWidth: 1, borderColor: '#FF993350',
  },
  refreshText: { color: '#FF9933', fontWeight: '600', fontSize: 13 },

  calcCard: {
    marginHorizontal: 20, marginBottom: 16, padding: 16,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#2D333B',
  },
  calcTitle: { fontSize: 15, fontWeight: '700', color: '#E6EDF3', marginBottom: 14 },
  calcRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calcInput: { flex: 1 },
  calcLabel: { fontSize: 11, color: '#8B949E', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C2128', borderRadius: 8,
    borderWidth: 1, borderColor: '#2D333B', padding: 10,
  },
  currency: { fontSize: 16, color: '#8B949E', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 18, fontWeight: '700', color: '#E6EDF3' },
  receiveAmount: { flex: 1, fontSize: 18, fontWeight: '700', color: '#FF9933' },
  calcArrow: { fontSize: 20, color: '#8B949E' },
  calcNote: { fontSize: 11, color: '#8B949E', marginTop: 10, lineHeight: 16 },

  alertCard: {
    marginHorizontal: 20, marginBottom: 16, padding: 16,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#58A6FF30',
  },
  alertTitle: { fontSize: 15, fontWeight: '700', color: '#58A6FF', marginBottom: 4 },
  alertSub: { fontSize: 12, color: '#8B949E', marginBottom: 12 },
  alertRow: { flexDirection: 'row', gap: 10 },
  alertInput: {
    flex: 1, backgroundColor: '#1C2128', borderRadius: 8,
    padding: 10, fontSize: 16, color: '#E6EDF3',
    borderWidth: 1, borderColor: '#2D333B',
  },
  alertBtn: {
    backgroundColor: '#58A6FF', borderRadius: 8,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  alertBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: '#8B949E',
    paddingHorizontal: 20, marginBottom: 8, letterSpacing: 1,
  },

  platformCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 10, padding: 14,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#2D333B',
  },
  platformLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  platformEmoji: { fontSize: 28 },
  platformNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  platformName: { fontSize: 15, fontWeight: '700', color: '#E6EDF3' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  platformDetails: { fontSize: 12, color: '#8B949E' },
  platformRight: { alignItems: 'flex-end' },
  platformRate: { fontSize: 16, fontWeight: '800' },
  sendNow: { fontSize: 11, color: '#8B949E', marginTop: 2 },

  tipCard: {
    margin: 20, padding: 16, backgroundColor: '#161B22',
    borderRadius: 14, borderWidth: 1, borderColor: '#D2992240',
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#D29922', marginBottom: 8 },
  tipText: { fontSize: 12, color: '#8B949E', marginBottom: 4, lineHeight: 18 },
});
