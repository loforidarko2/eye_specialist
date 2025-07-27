import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Switch, ScrollView,SafeAreaView
} from 'react-native';
import { auth, db } from '../configs/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // You can persist this with AsyncStorage
  const { mode, setMode } = useContext(ThemeContext);

const handleThemeToggle = () => {
  if (mode === 'auto') setMode('light');
  else if (mode === 'light') setMode('dark');
  else setMode('auto');
};

const getThemeLabel = () => {
  if (mode === 'auto') return 'Auto (System)';
  return mode.charAt(0).toUpperCase() + mode.slice(1);
};


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigation.navigate('Login');

        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
        else Alert.alert('Error', 'User data not found');
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } catch (error) {
            Alert.alert('Logout Error', error.message);
          }
        },
      },
    ]);
  };

  const renderItem = (icon, label, onPress, isSwitch = false, switchValue = false, onSwitchChange = () => {}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={isSwitch ? null : onPress}
      activeOpacity={isSwitch ? 1 : 0.6}
    >
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      { /*<View style={styles.header}>
        <Image
          source={
            userData?.photoURL
              ? { uri: userData.photoURL }
              : require('../assets/avatar.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name || 'No Name Provided'}</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View> */}

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderItem(<Feather name="user" size={18} color="#555" />, 'View Profile', () => navigation.navigate('Profile'))}
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        {renderItem(
  <Feather name="sun" size={18} color="#555" />,
  `Theme: ${getThemeLabel()}`,
  handleThemeToggle
)}
        {renderItem(<Feather name="settings" size={18} color="#555" />, 'Preferences', () => navigation.navigate('Preferences'))}
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderItem(<Feather name="help-circle" size={18} color="#555" />, 'Help Center', () => navigation.navigate('HelpCenter'))}
        {renderItem(<Feather name="shield" size={18} color="#555" />, 'Privacy Policy', () => navigation.navigate('PrivacyPolicy'))}
        {renderItem(<Feather name="file-text" size={18} color="#555" />, 'Terms of Service', () => navigation.navigate('TermsofService'))}
      </View>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* App version */}
      <Text style={styles.version}>Eye Specialist v1.0.0</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 6,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    fontSize: 15,
    color: '#222',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: '#aaa',
  },
});
