import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../configs/firebaseConfig';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const unsubscribe = db.collection('history')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString()
        }));
        setHistory(items);
        setLoading(false);
      }, error => {
        console.error('Snapshot error:', error);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.createdAt}</Text>
      <Text>Prediction: {item.prediction}</Text>
      <Text>Confidence: {(item.confidence * 100).toFixed(2)}%</Text>
      {item.imageUri && (
        <Image 
          source={{ uri: item.imageUri }} 
          style={styles.thumbnail} 
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No history found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 4
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20
  }
});