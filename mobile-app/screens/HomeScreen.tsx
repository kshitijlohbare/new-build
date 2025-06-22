import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import DailyPractices from '../components/DailyPractices';
import WellbeingTips from '../components/WellbeingTips';
import BookSession from '../components/BookSession';

const HomeScreen = () => {
  const [newDelight, setNewDelight] = useState('');
  const [userDelights, setUserDelights] = useState([
    "had a fun conversation with a colleague",
    "watched birds chirping",
    "saw a beautiful sunset today and felt grateful",
    "completed my morning meditation"
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 80],
    extrapolate: 'clamp',
  });

  const addNewDelight = () => {
    if (newDelight.trim()) {
      setUserDelights([newDelight, ...userDelights]);
      setNewDelight('');
    }
  };

  const deleteDelight = (index: number) => {
    setUserDelights(userDelights.filter((_, i) => i !== index));
    setActiveIndex(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hi, {user?.email?.split('@')[0] || 'there'}!</Text>
          <Text style={styles.welcomeText}>Welcome back to your wellness journey</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Daily Practices Section */}
        <View style={styles.section}>
          <DailyPractices />
        </View>

        {/* Delights Input Container */}
        <View style={styles.delightsInputContainer} id="delights-input-container">
          <Text style={styles.sectionTitle}>What delighted you today?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newDelight}
              onChangeText={setNewDelight}
              placeholder="I was delighted by..."
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.addButton} onPress={addDelight}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Delights List */}
          <View style={styles.delightsList}>
            {userDelights.map((delight, index) => (
              <Pressable
                key={index}
                style={styles.delightItem}
                onLongPress={() => setActiveIndex(index)}
              >
                <Text style={styles.delightText}>{delight}</Text>
                {activeIndex === index && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteDelight(index)}
                  >
                    <Ionicons name="trash" size={18} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Wellbeing Tips Section */}
        <View style={styles.section}>
          <WellbeingTips />
        </View>

        {/* Book Session Section */}
        <View style={styles.section}>
          <BookSession />
        </View>
        
        {/* Extra space at the bottom for comfortable scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EC',
  },
  headerContainer: {
    backgroundColor: '#04C4D5',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerContent: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Righteous',
    color: 'white',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Happy-Monkey',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
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
    fontFamily: 'Happy-Monkey',
    marginBottom: 15,
    color: '#333',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delightText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  bottomPadding: {
    height: 80,
  },
});

export default HomeScreen;
