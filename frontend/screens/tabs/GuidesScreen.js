import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GuidesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guides</Text>
      <Text style={styles.subtitle}>
        Find someone who can guide you through your journey.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#8875B7',
  },
  subtitle: {
    fontSize: 15,
    color: '#77717F',
    textAlign: 'center',
    marginTop: 10,
  },
});