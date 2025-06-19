import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';

export default function AppSettings({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    Alert.alert('Notice', 'Dark mode toggle works visually only. Full theme support requires additional setup.');
  };

  const handleLogout = () => {
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.replace('Login'); // or pop to top
  };

  return (
    <View style={styles.container}>

      <View style={styles.settingRow}>
        {/*<Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />*/}
      </View>

      {/*<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HelpCenter')}>
        <Text style={styles.buttonText}>Go to Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 16 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  logout: { marginTop: 30, padding: 15, backgroundColor: '#dc3545', borderRadius: 8 },
  logoutText: { color: 'white', textAlign: 'center' },
});
