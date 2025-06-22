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

// Define types for our practice items
interface Practice {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isDaily: boolean;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function PracticesScreen() {
  const [practices, setPractices] = useState<Practice[]>([
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
  const togglePracticeCompletion = (id: string) => {
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
        />
      </View>
      
      {/* Practice list */}
      <FlatList
        data={filteredPractices}
        style={styles.practicesList}
        contentContainerStyle={styles.practicesContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.practiceCard}>
            <TouchableOpacity
              style={styles.practiceHeader}
              onPress={() => togglePracticeCompletion(item.id)}
            >
              <View style={styles.practiceHeaderLeft}>
                <TouchableOpacity
                  style={item.completed ? styles.checkbox : styles.checkboxEmpty}
                  onPress={() => togglePracticeCompletion(item.id)}
                >
                  {item.completed && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </TouchableOpacity>
                <View style={styles.practiceInfo}>
                  <Text style={styles.practiceTitle}>{item.title}</Text>
                  <Text style={styles.practiceDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.practiceFooter}>
              <View style={styles.tagContainer}>
                {item.isDaily && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Daily</Text>
                  </View>
                )}
                <View style={[styles.tag, styles[`${item.difficulty}Tag`]]}>
                  <Text style={styles.tagText}>{item.difficulty}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Type for style variants
type StyleVariants = {
  [key: string]: any;
};

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
    color: '#fff',
  },
  practiceCount: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  categoriesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeCategoryButton: {
    backgroundColor: '#04C4D5',
    borderColor: '#04C4D5',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  practicesList: {
    flex: 1,
  },
  practicesContent: {
    padding: 15,
  },
  practiceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  practiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  practiceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#04C4D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#04C4D5',
    marginRight: 15,
  },
  practiceInfo: {
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
    lineHeight: 20,
  },
  categoryTag: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
  },
  practiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  EasyTag: {
    backgroundColor: '#D5F5E3',
  },
  MediumTag: {
    backgroundColor: '#FCF3CF',
  },
  HardTag: {
    backgroundColor: '#FADBD8',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});
