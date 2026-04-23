import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Btn from './Btn';
import * as Haptics from 'expo-haptics';

export default function WeightLogModal({ visible, onClose, onSave, themeColor = '#7BAF8E' }) {
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    const val = parseFloat(weight);
    if (!isNaN(val)) {
      onSave(val);
      setWeight('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modal}>
          <Text style={styles.title}>Log Weight</Text>
          <Text style={styles.subtitle}>Enter your current weight in lbs</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: themeColor }]}
              placeholder="000.0"
              keyboardType="decimal-pad"
              autoFocus
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.unit}>lbs</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Btn onPress={handleSave} color={themeColor} style={{ flex: 1 }}>
              Save Weight
            </Btn>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#1c1c1e' },
  subtitle: { fontSize: 14, color: '#aaa', fontWeight: '600', marginTop: 5, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  input: { fontSize: 48, fontWeight: '900', textAlign: 'center', minWidth: 120 },
  unit: { fontSize: 18, fontWeight: '800', color: '#aaa', marginLeft: 10, marginTop: 15 },
  buttonRow: { flexDirection: 'row', gap: 15, width: '100%', alignItems: 'center' },
  cancelBtn: { paddingHorizontal: 20 },
  cancelText: { color: '#aaa', fontWeight: 'bold', fontSize: 15 },
});
