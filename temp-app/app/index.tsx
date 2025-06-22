import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const [newDelight, setNewDelight] = useState('');
  const [userDelights, setUserDelights] = useState([
    "had a fun conversation with a colleague",
    "watched birds chirping",
    "saw a beautiful sunset today and felt grateful",
    "completed my morning meditation"
  ]);

  const addNewDelight = () => {
    if (newDelight.trim()) {
      setUserDelights([newDelight, ...userDelights]);
      setNewDelight('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi there!</Text>
        <Text style={styles.welcomeText}>Welcome to Caktus Coco</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Daily Practices Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Practices</Text>
          
          <View style={styles.practiceItem}>
            <TouchableOpacity style={styles.checkbox}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Morning Meditation</Text>
              <Text style={styles.practiceDescription}>Start your day with 10 minutes of mindfulness meditation.</Text>
            </View>
          </View>
          
          <View style={styles.practiceItem}>
            <TouchableOpacity style={styles.checkboxEmpty} />
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Daily Exercise</Text>
              <Text style={styles.practiceDescription}>Get moving for at least 30 minutes today.</Text>
            </View>
          </View>
        </View>

        {/* Delights Input Container */}
        <View style={styles.delightsInputContainer}>
          <Text style={styles.sectionTitle}>What delighted you today?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newDelight}
              onChangeText={setNewDelight}
              placeholder="I was delighted by..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewDelight}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Delights List */}
          <View style={styles.delightsList}>
            {userDelights.map((delight, index) => (
              <View key={index} style={styles.delightItem}>
                <Text style={styles.delightText}>{delight}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EC',
  },
  header: {
    backgroundColor: '#04C4D5',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#04C4D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkboxEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#04C4D5',
    marginRight: 15,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  practiceDescription: {
    fontSize: 14,
    color: '#666',
  },
  delightsInputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#04C4D5',
    width: 45,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delightsList: {
    marginTop: 10,
  },
  delightItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  delightText: {
    fontSize: 15,
    color: '#444',
  },
});
