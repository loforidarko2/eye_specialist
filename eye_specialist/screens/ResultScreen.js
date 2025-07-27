import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ResultScreen({ route }) {
  const { result } = route.params;
  const navigation = useNavigation();

  const isEye = result.result !== 'Not an eye';
  const confidencePercent = (result.confidence * 1).toFixed(2);

  const getDetails = () => {
    switch (result.result) {
      case 'Cataract':
        return {
          icon: 'eye',
          color: '#8e44ad',
          message: 'Cataracts may cause blurry vision or glare. Seek medical advice early.',
          action: 'Consider booking an eye exam soon.',
        };
      case 'Glaucoma':
        return {
          icon: 'eye-off',
          color: '#f39c12',
          message: 'Glaucoma can lead to vision loss if not treated. It often has no early symptoms.',
          action: 'Immediate medical consultation is recommended.',
        };
      case 'Normal':
        return {
          icon: 'checkmark-circle',
          color: '#27ae60',
          message: 'No signs of Cataract or Glaucoma were detected in this scan.',
          action: 'Maintain regular eye checkups.',
        };
      default:
        return {
          icon: 'close-circle',
          color: '#e74c3c',
          message: 'This image does not appear to be an eye.',
          action: 'Please try uploading a clear eye photo.',
        };
    }
  };

  const { icon, color, message, action } = getDetails();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Ionicons name={icon} size={80} color={color} style={styles.icon} />
        <Text style={[styles.resultLabel, { color }]}>
          {isEye ? result.result : 'Not an Eye'}
        </Text>

        {isEye && (
          <Text style={styles.confidenceText}>
            Confidence: {confidencePercent}%
          </Text>
        )}

        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.actionText}>{action}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Education')}
        >
          <Ionicons name="book-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Learn More About This</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#3498db' }]}
          onPress={() => navigation.navigate('Main')}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f2f6fa',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  confidenceText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 25,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
