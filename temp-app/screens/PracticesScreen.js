import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PracticesScreen() {
  const [practices, setPractices] = useState([
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Start your day with 10 minutes of mindfulness meditation.',
      completed: true,
      isDaily: true,
      category: 'Mindfulness',
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Cold Shower',
      description: 'Take a cold shower for 30 seconds to improve circulation.',
      completed: false,
      isDaily: true,
      category: 'Physical Health',
      difficulty: 'Hard'
    },
    {
      id: '3',
      title: 'Gratitude Journal',
      description: 'Write down three things you are grateful for today.',
      completed: true,
      isDaily: true,
      category: 'Mental Health',
      difficulty: 'Easy'
    },
    {
      id: '4',
      title: 'Stretching Routine',
      description: 'Do 10 minutes of full-body stretching exercises.',
      completed: false,
      isDaily: false,
      category: 'Physical Health',
      difficulty: 'Medium'
    },
    {
      id: '5',
      title: 'Breathing Exercises',
      description: 'Practice 4-7-8 breathing technique for 5 minutes.',
      completed: false,
      isDaily: false,
      category: 'Mindfulness',
      difficulty: 'Easy'
    }
  ]);
  
  const [activeCategory, setActiveCategory] = useState('All');

  // Toggle practice completion
  const togglePracticeCompletion = (id) => {
    setPractices(practices.map(practice => 
      practice.id === id ? {...practice, completed: !practice.completed} : practice
    ));
  };
  
  // Filter practices by category
  const filteredPractices = activeCategory === 'All'
    ? practices
    : practices.filter(p => p.category === activeCategory);
  
  // Extract unique categories
  const categories = ['All', ...new Set(practices.map(p => p.category))];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practices</Text>
        <Text style={styles.practiceCount}>{practices.length} practices</Text>
      </View>
      
      {/* Category filters */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === item && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === item && styles.activeCategoryText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Practices list */}
      <FlatList
        data={filteredPractices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.practiceItem}
            onPress={() => togglePracticeCompletion(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
              {item.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>{item.title}</Text>
              <Text style={styles.practiceDescription}>{item.description}</Text>
              <View style={styles.tagContainer}>
                {item.isDaily && (
                  <View style={[styles.tag, styles.dailyTag]}>
                    <Text style={styles.tagText}>Daily</Text>
                  </View>
                )}
                <View style={[styles.tag, 
                  item.difficulty === 'Easy' ? styles.easyTag : 
                  item.difficulty === 'Medium' ? styles.mediumTag : styles.hardTag
                ]}>
                  <Text style={styles.tagText}>{item.difficulty}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.practicesList}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  practiceCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeCategoryButton: {
    backgroundColor: '#04C4D5',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  practicesList: {
    padding: 15,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dailyTag: {
    backgroundColor: '#04C4D5',
  },
  easyTag: {
    backgroundColor: '#6FCF97',
  },
  mediumTag: {
    backgroundColor: '#F2C94C',
  },
  hardTag: {
    backgroundColor: '#EB5757',
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
