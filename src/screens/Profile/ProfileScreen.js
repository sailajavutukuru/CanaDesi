import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PROVINCES = [
  'Ontario', 'British Columbia', 'Alberta', 'Quebec',
  'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick',
  'Newfoundland', 'PEI', 'Northwest Territories', 'Yukon', 'Nunavut'
];

const PR_TYPES = ['Express Entry', 'PNP', 'Family Sponsorship', 'Refugee', 'Other'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: '',
    province: '',
    landingDate: '',
    prType: '',
    income: '',
    homeCity: '',
    originState: '',
  });
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [listModal, setListModal] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {}
  };

  const saveProfile = async (updated) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
    } catch (e) {}
  };

  const openEdit = (field, label) => {
    setEditField({ key: field, label });
    setInputValue(profile[field] || '');
    setModalVisible(true);
  };

  const saveField = () => {
    const updated = { ...profile, [editField.key]: inputValue };
    setProfile(updated);
    saveProfile(updated);
    setModalVisible(false);
  };

  const selectOption = (field, value) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    saveProfile(updated);
    setListModal(null);
  };

  const getDaysInCanada = () => {
    if (!profile.landingDate) return null;
    const parts = profile.landingDate.split('/');
    if (parts.length !== 3) return null;
    const landing = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    const diff = Math.floor((today - landing) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCitizenshipDays = () => {
    const days = getDaysInCanada();
    if (!days) return null;
    const needed = 1095;
    return Math.max(0, needed - days);
  };

  const days = getDaysInCanada();
  const citizenshipDays = getCitizenshipDays();

  const FIELDS = [
    { key: 'name', label: 'Full Name', emoji: '👤', type: 'text' },
    { key: 'homeCity', label: 'City in Canada', emoji: '🏙️', type: 'text' },
    { key: 'province', label: 'Province', emoji: '🗺️', type: 'list', options: PROVINCES },
    { key: 'landingDate', label: 'Landing Date (DD/MM/YYYY)', emoji: '✈️', type: 'text' },
    { key: 'prType', label: 'PR Pathway', emoji: '🛂', type: 'list', options: PR_TYPES },
    { key: 'income', label: 'Monthly Income (CAD)', emoji: '💵', type: 'text' },
    { key: 'originState', label: 'State in India', emoji: '🇮🇳', type: 'text' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 My Profile</Text>
          <Text style={styles.subtitle}>Your personal CanaDesi setup</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '🙏'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{profile.name || 'Tap to set your name'}</Text>
          <Text style={styles.avatarSub}>{profile.province || 'Province not set'}</Text>
        </View>

        {/* Stats */}
        {days !== null && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{days}</Text>
              <Text style={styles.statLbl}>Days in Canada</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#3FB950' }]}>{citizenshipDays}</Text>
              <Text style={styles.statLbl}>Days to Citizenship</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FF9933' }]}>
                {Math.round((days / 1095) * 100)}%
              </Text>
              <Text style={styles.statLbl}>Citizenship Progress</Text>
            </View>
          </View>
        )}

        {/* Fields */}
        <Text style={styles.sectionTitle}>Your Details</Text>
        {FIELDS.map((field) => (
          <TouchableOpacity
            key={field.key}
            style={styles.fieldRow}
            onPress={() => field.type === 'list'
              ? setListModal({ key: field.key, label: field.label, options: field.options })
              : openEdit(field.key, field.label)
            }
          >
            <Text style={styles.fieldEmoji}>{field.emoji}</Text>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={[styles.fieldValue, !profile[field.key] && styles.fieldEmpty]}>
                {profile[field.key] || 'Tap to set'}
              </Text>
            </View>
            <Text style={styles.fieldArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Text Input Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editField?.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={`Enter ${editField?.label}`}
              placeholderTextColor="#484F58"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveField}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* List Selection Modal */}
      <Modal visible={!!listModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: 400 }]}>
            <Text style={styles.modalTitle}>{listModal?.label}</Text>
            <ScrollView>
              {listModal?.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.listOption, profile[listModal?.key] === opt && styles.listOptionSelected]}
                  onPress={() => selectOption(listModal.key, opt)}
                >
                  <Text style={[styles.listOptionText, profile[listModal?.key] === opt && styles.listOptionTextSelected]}>
                    {opt}
                  </Text>
                  {profile[listModal?.key] === opt && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setListModal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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

  avatarSection: { alignItems: 'center', padding: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FF993330', borderWidth: 2, borderColor: '#FF9933',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 32 },
  avatarName: { fontSize: 20, fontWeight: '800', color: '#E6EDF3', marginTop: 12 },
  avatarSub: { fontSize: 14, color: '#8B949E', marginTop: 4 },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 20,
    backgroundColor: '#161B22', borderRadius: 14,
    borderWidth: 1, borderColor: '#2D333B', overflow: 'hidden',
  },
  statBox: { flex: 1, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: '#FF9933' },
  statLbl: { fontSize: 9, color: '#8B949E', marginTop: 2, textAlign: 'center' },

  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: '#8B949E',
    paddingHorizontal: 20, marginBottom: 8, letterSpacing: 1,
    textTransform: 'uppercase',
  },

  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#2D333B',
    backgroundColor: '#161B22',
  },
  fieldEmoji: { fontSize: 20, width: 36 },
  fieldContent: { flex: 1 },
  fieldLabel: { fontSize: 12, color: '#8B949E', marginBottom: 2 },
  fieldValue: { fontSize: 15, fontWeight: '600', color: '#E6EDF3' },
  fieldEmpty: { color: '#484F58', fontStyle: 'italic', fontWeight: '400' },
  fieldArrow: { fontSize: 20, color: '#484F58' },

  modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#161B22', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, borderTopWidth: 1, borderColor: '#2D333B',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#E6EDF3', marginBottom: 16 },
  modalInput: {
    backgroundColor: '#1C2128', borderRadius: 10, padding: 14,
    fontSize: 16, color: '#E6EDF3', borderWidth: 1, borderColor: '#2D333B', marginBottom: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 10,
    backgroundColor: '#1C2128', alignItems: 'center',
    borderWidth: 1, borderColor: '#2D333B', marginTop: 8,
  },
  cancelText: { color: '#8B949E', fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FF9933', alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },

  listOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#2D333B',
  },
  listOptionSelected: { backgroundColor: '#FF993320' },
  listOptionText: { fontSize: 15, color: '#E6EDF3' },
  listOptionTextSelected: { color: '#FF9933', fontWeight: '700' },
  checkmark: { color: '#FF9933', fontSize: 16, fontWeight: '800' },
});

