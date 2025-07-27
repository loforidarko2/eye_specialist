import React, { useState, useEffect } from 'react';
import {
  View, Image, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert, Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../configs/firebaseConfig';
import firebase from 'firebase/compat/app';
import { Feather } from '@expo/vector-icons';

const API_URL = __DEV__
  ? 'http://192.168.32.239:8000/predict'
  : 'https://192.168.32.239:8000/predict';

export default function UploadImageScreen({ navigation, route }) {
  const [imageUri, setImageUri] = useState(route.params?.capturedImage || null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setIsOnline(state.isConnected));
    return () => unsubscribe();
  }, []);

  const requestPermission = async (type) => {
    const permission = type === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        `Please enable ${type} access in your device settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  const handleImagePick = async (fromCamera = false) => {
    const granted = await requestPermission(fromCamera ? 'camera' : 'gallery');
    if (!granted) return;

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      Alert.alert('No image selected.');
    }
  };

  const handlePrediction = async () => {
    if (!imageUri) return Alert.alert('Select an image first.');
    if (!isOnline) return Alert.alert('Offline', 'You must be connected to the internet.');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const text = await res.text();
      const json = JSON.parse(text);
      if (!json.prediction || json.confidence === undefined) {
        throw new Error('Invalid response from server.');
      }

      await saveHistory(json);
      navigation.navigate('Result', {
        result: { result: json.prediction, confidence: json.confidence },
      });

    } catch (err) {
      Alert.alert('Prediction Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (data) => {
    const user = auth.currentUser;
    const entry = {
      userId: user?.uid || 'guest',
      imageUri,
      prediction: data.prediction,
      confidence: data.confidence,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'image_analysis',
    };

    if (!user) return await cacheOffline(entry);

    try {
      await db.collection('history').add(entry);
    } catch {
      await cacheOffline(entry);
    }
  };

  const cacheOffline = async (entry) => {
    try {
      const existing = await AsyncStorage.getItem('pendingHistory');
      const entries = existing ? JSON.parse(existing) : [];
      entries.push(entry);
      await AsyncStorage.setItem('pendingHistory', JSON.stringify(entries));
    } catch (err) {
      console.warn('Local cache failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => handleImagePick(false)}
        disabled={loading}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Feather name="image" size={40} color="#999" />
        )}
        <Text style={styles.placeholderText}>
          {imageUri ? 'Tap to change image' : 'Tap to select image'}
        </Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#1a73e8' }]}
          onPress={() => handleImagePick(true)}
          disabled={loading}
        >
          <Feather name="camera" size={24} color="#fff" />
          <Text style={styles.actionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#34a853' }]}
          onPress={handlePrediction}
          disabled={!imageUri || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="search" size={24} color="#fff" />
              <Text style={styles.actionText}>Analyze</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {!isOnline && (
        <Text style={styles.offlineText}>You're offline. Internet is required for predictions.</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Symptoms')}>
        <Text style={styles.symptomText}>Check Symptoms Instead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f5f9', justifyContent: 'center' },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    borderWidth: 2,
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  symptomText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1a73e8',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  offlineText: {
    textAlign: 'center',
    color: '#dc2626',
    marginBottom: 10,
  },
});
