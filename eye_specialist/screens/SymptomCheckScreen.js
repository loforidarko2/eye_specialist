import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';

export default function SymptomCheckScreen() {
  const [symptoms, setSymptoms] = useState({
    eyePain: false, headaches: false, redEyes: false, doubleVision: false,
    blurredVision: false, lowVision: false, tunnelVision: false,
    cloudedVision: false, nightTrouble: false, glareSensitivity: false,
    brightLightNeed: false, halos: false, prescriptionChanges: false,
    colorFading: false, doubleVisionOneEye: false, hyphema: false,
    bulgingEyes: false, nauseaVomiting: false, suddenVisionLoss: false,
    floaters: false, flashingLights: false,
  });

  const [result, setResult] = useState('');

  const toggle = (key) => {
    setSymptoms({ ...symptoms, [key]: !symptoms[key] });
  };

  const analyze = () => {
    const s = symptoms;

    if (s.hyphema || s.bulgingEyes || s.nauseaVomiting || s.suddenVisionLoss || s.flashingLights || s.floaters) {
      setResult(" EMERGENCY: Symptoms match acute Glaucoma. Seek IMMEDIATE medical attention.");
      return;
    }

    const cataractScore = s.cloudedVision + s.nightTrouble + s.glareSensitivity +
      s.brightLightNeed + s.halos + s.prescriptionChanges +
      s.colorFading + s.doubleVisionOneEye;

    const glaucomaScore = s.eyePain + s.headaches + s.redEyes + s.doubleVision +
      s.blurredVision + s.lowVision + s.tunnelVision;

    if (glaucomaScore >= 4 && glaucomaScore > cataractScore) {
      setResult(" Symptoms suggest possible **Glaucoma**. Consult an eye specialist.");
    } else if (cataractScore >= 4 && cataractScore > glaucomaScore) {
      setResult(" Symptoms suggest possible **Cataract**. Consult an eye specialist.");
    } else {
      setResult(" Symptoms are mixed or unclear. Please consult an eye specialist for a detailed evaluation.");
    }
  };

  const symptomList = [
    { key: 'eyePain', label: 'Eye pain or pressure' },
    { key: 'headaches', label: 'Headaches' },
    { key: 'redEyes', label: 'Red or bloodshot eyes' },
    { key: 'doubleVision', label: 'Double vision (both eyes)' },
    { key: 'blurredVision', label: 'Blurred vision' },
    { key: 'lowVision', label: 'Gradually developing low vision' },
    { key: 'tunnelVision', label: 'Tunnel vision or blind spots' },
    { key: 'cloudedVision', label: 'Clouded, blurred or dim vision' },
    { key: 'nightTrouble', label: 'Trouble seeing at night' },
    { key: 'glareSensitivity', label: 'Sensitivity to light and glare' },
    { key: 'brightLightNeed', label: 'Need for brighter light' },
    { key: 'halos', label: 'Seeing halos around lights' },
    { key: 'prescriptionChanges', label: 'Frequent prescription changes' },
    { key: 'colorFading', label: 'Fading or yellowing of colors' },
    { key: 'doubleVisionOneEye', label: 'Double vision in one eye' },
    { key: 'hyphema', label: 'Blood in front of iris (hyphema)' },
    { key: 'bulgingEyes', label: 'Bulging/enlarged eyeballs (buphthalmos)' },
    { key: 'nauseaVomiting', label: 'Nausea and vomiting with eye pain' },
    { key: 'suddenVisionLoss', label: 'Sudden vision loss' },
    { key: 'floaters', label: 'Sudden increase in floaters' },
    { key: 'flashingLights', label: 'Flashing lights (photopsias)' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {symptomList.map(({ key, label }) => (
        <View key={key} style={styles.symptomRow}>
          <Text style={styles.symptomLabel}>{label}</Text>
          <Switch
            value={symptoms[key]}
            onValueChange={() => toggle(key)}
            trackColor={{ false: "#ccc", true: "#4F46E5" }}
            thumbColor={symptoms[key] ? "#fff" : "#888"}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
        <Text style={styles.analyzeButtonText}>Analyze Symptoms</Text>
      </TouchableOpacity>

      {result !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 120,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111',
  },
  symptomRow: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  symptomLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  analyzeButton: {
    marginTop: 30,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 30,
    backgroundColor: '#eef2ff',
    padding: 20,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#1e1e1e',
    lineHeight: 22,
    textAlign: 'center',
  },
});
