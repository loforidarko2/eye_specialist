import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const STORAGE_KEY = 'notifications_enabled';

export default function Preferences() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  // Load saved preference from AsyncStorage
  useEffect(() => {
    const loadNotificationPreference = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue !== null) {
          setNotifications(storedValue === 'true');
        }
      } catch (error) {
        console.error('Failed to load notification preference:', error);
      }
    };

    loadNotificationPreference();
  }, []);

  const toggleNotifications = async (value) => {
    try {
      setNotifications(value);
      await AsyncStorage.setItem(STORAGE_KEY, value.toString());

      Alert.alert(
        'Notifications',
        value ? 'Notifications enabled' : 'Notifications disabled'
      );
    } catch (error) {
      console.error('Failed to save notification preference:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Preferences</Text>

      <View style={styles.option}>
        <View style={styles.optionLeft}>
          <Feather name="bell" size={18} color="#333" />
          <Text style={styles.optionLabel}>Enable Notifications</Text>
        </View>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>

       <View style={styles.option}>
        <View style={styles.optionLeft}>
          <Feather name="globe" size={18} color="#333" />
          <Text style={styles.optionLabel}>App Language</Text>
        </View>
        <Text style={styles.language}>{language}</Text>
      </View>

      <Text style={styles.note}>More preferences coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24, color: '#1a73e8' },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { fontSize: 16, color: '#333' },
  note: { marginTop: 30, fontSize: 14, color: '#888', textAlign: 'center' },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { fontSize: 16, color: '#333' },
  language: { fontSize: 16, color: '#555' },
  note: { marginTop: 30, fontSize: 14, color: '#888', textAlign: 'center' },
});
