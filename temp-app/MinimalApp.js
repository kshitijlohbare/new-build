import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { ActivityIndicator } from 'react-native';

// Create Tab Navigator
const Tab = createBottomTabNavigator();

// Home Screen Component
function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Caktus Coco</Text>
        <Text style={styles.subtitle}>Your Wellness Companion</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Caktus Coco!</Text>
        <Text style={styles.description}>
          Your personalized wellness app for daily practices, delights, and mindfulness.
        </Text>
        
        {/* Daily Practices Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Practices</Text>
          <View style={styles.practiceItem}>
            <TouchableOpacity style={styles.checkbox}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.practiceText}>Morning Meditation</Text>
          </View>
          <View style={styles.practiceItem}>
            <TouchableOpacity style={styles.checkboxEmpty} />
            <Text style={styles.practiceText}>Daily Exercise</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Practices Screen Component
function PracticesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practices</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Practices Screen</Text>
        <Text style={styles.description}>Your wellness practices will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

// Community Screen Component
function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Community Screen</Text>
        <Text style={styles.description}>Connect with your wellness community here.</Text>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen Component
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Profile Screen</Text>
        <Text style={styles.description}>Your wellness profile information will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

// Main App Component
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'HappyMonkey': require('./assets/fonts/HappyMonkey-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        // If font fails to load, we'll continue without it
        setFontsLoaded(true);
      }
    }
    
    loadFonts();
  }, []);

  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#04C4D5" />
        <Text style={{ marginTop: 15 }}>Loading fonts...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Practices') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Community') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#04C4D5',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarLabelStyle: { fontFamily: 'HappyMonkey' },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Practices" component={PracticesScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'HappyMonkey',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
    fontFamily: 'HappyMonkey',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'HappyMonkey',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'HappyMonkey',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
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
    fontFamily: 'HappyMonkey',
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
  practiceText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'HappyMonkey',
  },
});
