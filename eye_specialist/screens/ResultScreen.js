import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultScreen({ route }) {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Text style={styles.resultText}>
        {result.result === 'Not an eye' ? " Not an Eye" : ` ${result.result}\nConfidence: ${(result.confidence * 2).toFixed(2)}%`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  resultText: { fontSize: 20, textAlign: 'center', color: '#333' },
});
