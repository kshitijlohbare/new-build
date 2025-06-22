import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize Supabase client
const supabaseUrl = Constants.manifest?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.manifest?.extra?.supabaseAnonKey || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define practice interface
interface Practice {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isDaily: boolean;
}

const DailyPractices = () => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPractices();
  }, []);

  // Fetch practices from Supabase
  const fetchPractices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('practices')
        .select('*')
        .eq('isDaily', true);

      if (error) throw error;
      
      setPractices(data || []);
    } catch (error) {
      console.error('Error fetching practices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle practice completion
  const togglePracticeCompletion = async (id: number) => {
    const updatedPractices = practices.map(practice => {
      if (practice.id === id) {
        return { ...practice, completed: !practice.completed };
      }
      return practice;
    });
    
    setPractices(updatedPractices);
    
    try {
      // Find the practice to get its current state
      const practice = updatedPractices.find(p => p.id === id);
      
      // Update in Supabase
      const { error } = await supabase
        .from('practices')
        .update({ completed: practice?.completed })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating practice:', error);
      // Revert on error
      fetchPractices();
    }
  };

  // Calculate completion percentage
  const completedCount = practices.filter(p => p.completed).length;
  const totalCount = practices.length || 1; // Prevent division by zero
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  const completionPoints = completedCount * 88; // Calculate points based on completed practices

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#04C4D5" />
        <Text style={styles.loadingText}>Loading practices...</Text>
      </View>
    );
  }

  // Check for empty daily practices and show a message
  if (practices.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>You don't have any daily practices yet</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Practices' as never)}
        >
          <Text style={styles.addButtonText}>Add daily practice</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} className="daily-practice-todo-list">
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        {/* Shield icon with level indicator */}
        <View style={styles.shieldContainer}>
          <View style={styles.shield}>
            <Text style={styles.levelText}>{Math.ceil(completionPoints / 200)}</Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
        
        {/* Points display */}
        <Text style={styles.pointsText}>{completionPoints} pts</Text>
      </View>
      
      {/* Title */}
      <Text style={styles.sectionTitle}>Daily Practices</Text>
      
      {/* Practices list */}
      <View style={styles.practicesList}>
        {practices.map(practice => (
          <TouchableOpacity
            key={practice.id}
            style={styles.practiceItem}
            onPress={() => togglePracticeCompletion(practice.id)}
          >
            <View style={[styles.checkbox, practice.completed && styles.checkboxCompleted]}>
              {practice.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>{practice.title}</Text>
              <Text style={styles.practiceDescription}>{practice.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* View all button */}
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => navigation.navigate('Practices' as never)}
      >
        <Text style={styles.viewAllText}>View all practices</Text>
        <Ionicons name="chevron-forward" size={18} color="#04C4D5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8EC',
    borderRadius: 20,
    padding: 20,
    gap: 15,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#777',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shieldContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shield: {
    width: 30,
    height: 30,
    backgroundColor: '#04C4D5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontFamily: 'Happy-Monkey',
    fontSize: 16,
  },
  progressBarWrapper: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#04C4D5',
    borderRadius: 5,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#04C4D5',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Happy-Monkey',
    marginBottom: 10,
  },
  practicesList: {
    gap: 10,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#04C4D5',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#04C4D5',
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
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  viewAllText: {
    color: '#04C4D5',
    fontWeight: '600',
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#04C4D5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DailyPractices;
