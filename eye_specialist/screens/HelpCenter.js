import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpCenter() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>

      <Text style={styles.sectionTitle}>How the App Works</Text>
      <Text style={styles.text}>
        Upload or take a photo of your eye to detect signs of Cataract, Glaucoma, or Normal condition using AI.
      </Text>

      <Text style={styles.sectionTitle}>Troubleshooting</Text>
      <Text style={styles.text}>
        - Make sure you allow camera and photo access permissions.{'\n'}
        - Ensure good lighting when taking pictures.{'\n'}
        - If the app crashes, restart and try again.
      </Text>

      <Text style={styles.sectionTitle}>Need More Help?</Text>
      <Text style={styles.text}>
        Contact support at: support@eye-specialist-app.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  text: { fontSize: 16, marginTop: 8, lineHeight: 22 },
});
