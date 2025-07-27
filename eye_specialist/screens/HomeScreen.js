import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Image, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db, storage } from '../configs/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__
  ? 'http://192.168.32.239:8000/predict'
  : 'https://192.168.32.239:8000/predict';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [userStats, setUserStats] = useState({
    totalScans: 0,
    lastScanDays: 0,
    healthScore: 100,
    recentScans: [],
  });

  useEffect(() => {
  let unsubscribeHistory = null;

  const unsubscribeAuth = auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('users').doc(user.uid).get()
        .then(doc => setUserData(doc.data()))
        .catch(console.log);

      // Fetch all user history, order by newest first
      unsubscribeHistory = db.collection('history')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const allDocs = snapshot.docs;
          const allScans = allDocs.map(doc => doc.data());
          
          const total = allScans.length;
          const firstScanDate = allScans.at(-1)?.createdAt?.toDate() || new Date();
          const daysSinceFirst = Math.floor((Date.now() - firstScanDate.getTime()) / (1000 * 60 * 60 * 24));
          const healthScore = Math.round(
            (allScans.filter(s => s.prediction === 'normal').length / (total || 1)) * 100
          );

          const recentScans = allDocs.slice(0, 5).map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              primaryDetection: d.prediction,
              confidence: d.confidence,
              createdAt: d.createdAt?.toDate() || new Date(),
              imageUrl: d.imageUrl,
            };
          });

          setUserStats({
            totalScans: total,
            lastScanDays: daysSinceFirst,
            healthScore,
            recentScans,
          });

          setLoading(false);
        }, error => {
          console.log('History fetch error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  });

  const unsubscribeNet = NetInfo.addEventListener(state => setIsOnline(state.isConnected));

  return () => {
    unsubscribeAuth();
    unsubscribeNet();
    if (unsubscribeHistory) unsubscribeHistory();
  };
}, []);


  const handlePrediction = async image => {
  if (!image || !isOnline) return Alert.alert('Error', 'No image or no internet connection.');
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    const res = await fetch(API_URL, { method: 'POST', body: formData });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API responded with ${res.status}: ${errorText}`);
    }

    const json = await res.json();
    const uid = auth.currentUser?.uid;

    const entry = {
      userId: uid,
      imageUrl: image.uri,  // Just store local uri for display (not persistent)
      prediction: json.prediction,
      confidence: json.confidence,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'image_analysis',
    };

    if (uid) {
      await db.collection('history').add(entry);
    } else {
      const pending = JSON.parse(await AsyncStorage.getItem('pendingHistory') || '[]');
      pending.push(entry);
      await AsyncStorage.setItem('pendingHistory', JSON.stringify(pending));
    }

    navigation.navigate('Result', {
      result: {
        result: json.prediction,
        confidence: json.confidence,
      },
    });
  } catch (e) {
    console.error('Prediction Failed:', e);
    Alert.alert('Prediction Failed', e.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  const handleTakePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert('Permission required', 'Camera access needed.');
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) handlePrediction(result.assets[0]);
  };

  const handleUploadPhoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permission required', 'Gallery access needed.');
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) handlePrediction(result.assets[0]);
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#1a73e8" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {userData?.name || userData?.email?.split('@')[0] || 'User'}!
          </Text>
          <Text style={styles.subGreeting}>How are your eyes today?</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard title="Total Scans" value={userStats.totalScans} />
        <StatCard title="Days Ago" value={userStats.lastScanDays} />
        <StatCard title="Health Score" value={`${userStats.healthScore}%`} isHighlight />
      </View>

      {/* Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <ActionButton icon={<Feather name="camera" size={24} color="#fff" />} label="Take Photo" subLabel="Camera scan" onPress={handleTakePhoto} color="#1a73e8" />
        <ActionButton icon={<Feather name="upload" size={24} color="#fff" />} label="Upload Photo" subLabel="From gallery" onPress={handleUploadPhoto} color="#34a853" />
      </View>

      {/* Recent Results */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Results</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {userStats.recentScans.length > 0 ? userStats.recentScans.map((scan, i) => (
          <View key={i} style={styles.scanItem}>
            <Image source={{ uri: scan.imageUrl }} style={styles.scanThumb} />
            <View style={styles.scanInfo}>
              <Text style={styles.scanText}>
                {scan.primaryDetection === 'normal' ? 'Normal Eye' : `${scan.primaryDetection} Detected`}
              </Text>
              <Text style={styles.scanDate}>{scan.createdAt.toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.scanConfidence, { color: scan.primaryDetection === 'normal' ? '#34a853' : '#e37400' }]}>
              {Math.round(scan.confidence * 100)}%
            </Text>
          </View>
        )) : (
          <View style={styles.noScan}>
            <Feather name="eye" size={32} color="#999" />
            <Text style={styles.noScanText}>No scans yet. Take your first eye photo!</Text>
          </View>
        )}
      </View>

      {/* Tip */}
      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Feather name="feather" size={24} color="#1a73e8" />
        </View>
        <View>
          <Text style={styles.tipTitle}>20-20-20 Rule</Text>
          <Text style={styles.tipDescription}>
            Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
          </Text>
        </View>
      </View>

      {/* Warning */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Important: This app is not a substitute for professional medical advice. Always consult an eye specialist for accurate diagnosis and treatment.
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ title, value, isHighlight }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, isHighlight && { color: '#34a853' }]}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const ActionButton = ({ icon, label, subLabel, onPress, color }) => (
  <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
    {icon}
    <Text style={styles.actionLabel}>{label}</Text>
    <Text style={styles.actionSub}>{subLabel}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16, marginTop: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1a73e8', borderRadius: 20, padding: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 14, color: '#cbe1ff' },
  iconButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#111827' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionButton: { flex: 1, alignItems: 'center', padding: 16, marginHorizontal: 5, borderRadius: 16, elevation: 3 },
  actionLabel: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  actionSub: { fontSize: 12, color: '#dbeafe' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#111827' },
  viewAll: { color: '#1a73e8', fontSize: 14 },
  scanItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  scanThumb: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  scanInfo: { flex: 1 },
  scanText: { fontWeight: '500', color: '#111827' },
  scanDate: { fontSize: 12, color: '#6b7280' },
  scanConfidence: { fontWeight: 'bold' },
  noScan: { alignItems: 'center', paddingVertical: 20 },
  noScanText: { color: '#9ca3af', fontSize: 14, marginTop: 10, textAlign: 'center' },
  tipCard: { flexDirection: 'row', backgroundColor: '#e0f2fe', borderRadius: 16, padding: 16, marginBottom: 24, alignItems: 'center' },
  tipIcon: { width: 48, height: 48, backgroundColor: '#bae6fd', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tipTitle: { fontWeight: 'bold', fontSize: 14, color: '#1e3a8a', marginBottom: 4 },
  tipDescription: { color: '#1e40af', fontSize: 12 },
  warningBox: { padding: 16, backgroundColor: '#fff3cd', borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba', marginBottom: 40 },
  warningText: { fontSize: 12, color: '#856404', lineHeight: 16 },
});
