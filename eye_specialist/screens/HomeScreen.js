import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../configs/firebaseConfig';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const doc = await db.collection('users').doc(user.uid).get();
          setUserData(doc.data());
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      }
    });
    return unsubscribe;
  }, []);
<View></View>
  const features = [
    {
      title: 'Symptom Checker',
      screen: 'Symptoms',
      description: 'Select symptoms to check for Glaucoma or Cataract',
    },
    /*{
      title: 'Upload Image',
      screen: 'Upload',
      description: 'Upload or Take picture of your eye for analysis',
    },*/
    {
      title: 'Education',
      screen: 'Education',
      description: 'Learn about common eye conditions and eye health tips',
    },
    {
      title: 'History',
      screen: 'History',
      description: 'View your past symptom checks and uploaded images',
    },
    {
      title: 'Profile',
      screen: 'Profile',
      description: 'Manage your personal information and app settings',
    },
  ];

  const FeatureItem = ({ title, screen, description }) => (
    <TouchableOpacity 
      style={styles.featureItem}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {userData ? `Welcome, ${userData.name || userData.email.split('@')[0]}!` : 'Welcome to Eye Specialist'}
        </Text>
        <Text style={styles.subtitle}>Your personal Eye Specialist</Text>
      </View>

      {/*<Text style={styles.sectionTitle}>Features</Text>*/}
      <Text style={styles.subtitle1}>Click on the Camera icon(Upload) below to Upload or Take an image 
        of your eye for analysis
      </Text>
      <View style={styles.feature}>
      {features.map((feature) => (
        <FeatureItem
          key={feature.screen}
          title={feature.title}
          screen={feature.screen}
          description={feature.description}
        />
      ))}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Important: This app is not a substitute for professional medical advice. 
          Always consult an eye specialist for accurate diagnosis and treatment.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
  },
  subtitle1: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  featureItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a73e8',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  warningBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
});