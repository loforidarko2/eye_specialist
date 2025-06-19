import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../configs/firebaseConfig';
import firebase from 'firebase/compat/app';

const API_URL = __DEV__
  ? 'http://10.40.32.118:8000/predict'
  : 'https://10.40.32.118:8000/predict';

export default function UploadImageScreen({ navigation, route }) {
  const [imageUri, setImageUri] = useState(route.params?.capturedImage || null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
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
    if (!imageUri) {
      Alert.alert('Select an image first.');
      return;
    }

    if (!isOnline) {
      Alert.alert('Offline', 'You must be connected to the internet.');
      return;
    }

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

    if (!user) {
      await cacheOffline(entry);
      return;
    }

    try {
      await db.collection('history').add(entry);
    } catch (err) {
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
      <TouchableOpacity
        style={styles.imageBox}
        onPress={() => handleImagePick(false)}
        disabled={loading}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleImagePick(true)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.predictButton, (!imageUri || loading) && { opacity: 0.6 }]}
        onPress={handlePrediction}
        disabled={!imageUri || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyze</Text>
        )}
      </TouchableOpacity>

      {!isOnline && (
        <Text style={styles.warning}>You're offline. Prediction requires internet.</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Symptoms')}>
        <Text style={styles.link}>Check Symptoms Instead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  imageBox: {
    height: 300,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  predictButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#1e88e5',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  warning: {
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
