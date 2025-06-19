import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function EducationScreen() {
  return (
    <ScrollView style={styles.container}>
     

      <Text style={styles.sectionTitle}>Why Eye Health Matters</Text>
      <Text style={styles.text}>
        Your eyes are essential for daily life, yet many people ignore symptoms of serious eye diseases. Early detection and proper care can prevent long-term damage.
      </Text>

      <Text style={styles.sectionTitle}>About Glaucoma</Text>
      <Text style={styles.text}>
        Glaucoma refers to a group of eye conditions that damage the optic nerve due to increased eye pressure. It can lead to irreversible blindness if not treated early.
        Symptoms may include:
        {"\n"}1. Eye pain or pressure
        {"\n"}2. Blurred vision
        {"\n"}3. Headaches
        {"\n"}4. Tunnel vision or blind spots
      </Text>

      <Text style={styles.sectionTitle}>About Cataracts</Text>
      <Text style={styles.text}>
        Cataracts cause the lens of the eye to become cloudy, affecting vision. It's common with aging and may require surgery if vision loss progresses.
        Symptoms include:
        {"\n"}1. Clouded or blurry vision
        {"\n"}2. Trouble seeing at night
        {"\n"}3. Sensitivity to light
        {"\n"}4. Frequent changes in glasses
      </Text>

      <Text style={styles.sectionTitle}>How This App Helps</Text>
      <Text style={styles.text}>
        This app allows you to:
        {"\n"}1. Upload or take a photo of your eye
        {"\n"}2. Get instant predictions (Cataract, Glaucoma, Normal, or Not an Eye)
        {"\n"}3. Check symptoms manually using a questionnaire
        {"\n"}4. Learn more through this education section

        Note: This app is not a substitute for professional diagnosis. Always consult an eye care specialist for any concerning symptoms.
      </Text>

      <Text style={styles.sectionTitle}>Tips for Healthy Vision</Text>
      <Text style={styles.text}>
        1. Get regular eye exams, especially if you're over 40{"\n"}
        2. Wear sunglasses with UV protection{"\n"}
        3. Eat a diet rich in leafy greens, fruits, and omega-3 fatty acids{"\n"}
        4. Limit screen time and take breaks to rest your eyes{"\n"}
        5. Don't ignore symptoms like pain, redness, or vision changes
      </Text>

      <Text style={styles.footer}>
        This is Powered by AI | Created for awareness and early detection
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    color: '#2d3436',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#0984e3',
  },
  text: {
    fontSize: 16,
    color: '#2f3542',
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#636e72',
  },
});
