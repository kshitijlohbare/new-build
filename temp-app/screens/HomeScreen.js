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

export default function HomeScreen() {
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
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 20,
    padding: 20,
  },
  delightsInputContainer: {
    backgroundColor: '#FFD400',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  practiceItem: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#04C4D5',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    color: '#333',
  },
  practiceDescription: {
    fontSize: 14,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#04C4D5',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delightsList: {
    marginTop: 15,
    gap: 10,
  },
  delightItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  delightText: {
    fontSize: 16,
    color: '#333',
  },
});
