import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Button, StyleSheet, Alert } from 'react-native';

export default function SymptomCheckScreen() {
  const [symptoms, setSymptoms] = useState({
    eyePain: false,
    headaches: false,
    redEyes: false,
    doubleVision: false,
    blurredVision: false,
    lowVision: false,
    tunnelVision: false,
    cloudedVision: false,
    nightTrouble: false,
    glareSensitivity: false,
    brightLightNeed: false,
    halos: false,
    prescriptionChanges: false,
    colorFading: false,
    doubleVisionOneEye: false,
    hyphema: false,
    bulgingEyes: false,
    nauseaVomiting: false,
    suddenVisionLoss: false,
    floaters: false,
    flashingLights: false,
  });

  const [result, setResult] = useState('');

  const toggle = (key) => {
    setSymptoms({ ...symptoms, [key]: !symptoms[key] });
  };

  const analyze = () => {
    const s = symptoms;

    //  Emergency glaucoma detection
    if (
      s.hyphema || s.bulgingEyes || s.nauseaVomiting || 
      s.suddenVisionLoss || s.flashingLights || s.floaters
    ) {
      setResult(" EMERGENCY: You are showing symptoms of acute Glaucoma. Seek IMMEDIATE medical attention.");
      return;
    }

    //  Cataract symptom scoring
    const cataractScore =
      s.cloudedVision + s.nightTrouble + s.glareSensitivity +
      s.brightLightNeed + s.halos + s.prescriptionChanges +
      s.colorFading + s.doubleVisionOneEye;

    //  Glaucoma symptom scoring
    const glaucomaScore =
      s.eyePain + s.headaches + s.redEyes + s.doubleVision +
      s.blurredVision + s.lowVision + s.tunnelVision;

    if (glaucomaScore >= 4 && glaucomaScore > cataractScore) {
      setResult("Your symptoms may indicate **Glaucoma**. Please consult an eye specialist.");
    } else if (cataractScore >= 4 && cataractScore > glaucomaScore) {
      setResult("Your symptoms may indicate **Cataract**. Please consult an eye specialist.");
    } else {
      setResult("Symptoms are unclear or mixed. Please consult an eye specialist for further evaluation.");
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

    // EMERGENCY symptoms
    { key: 'hyphema', label: 'Blood gathering in front of iris (hyphema)' },
    { key: 'bulgingEyes', label: 'Bulging/enlarged eyeballs (buphthalmos)' },
    { key: 'nauseaVomiting', label: 'Nausea and vomiting with eye pain' },
    { key: 'suddenVisionLoss', label: 'Sudden vision loss' },
    { key: 'floaters', label: 'Sudden increase in floaters' },
    { key: 'flashingLights', label: 'Sudden flashing lights (photopsias)' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Symptom Checker</Text>

      {symptomList.map(({ key, label }) => (
        <View key={key} style={styles.switchRow}>
          <Text style={styles.label}>{label}</Text>
          <Switch value={symptoms[key]} onValueChange={() => toggle(key)} />
        </View>
      ))}

      <Button title="Analyze Symptoms" onPress={analyze} />

      {result ? <Text style={styles.result}>{result}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'center'
  },
  label: { flex: 1, fontSize: 15 },
  result: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 10
  },
});
