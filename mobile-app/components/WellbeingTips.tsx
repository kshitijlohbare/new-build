import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize Supabase client
const supabaseUrl = Constants.manifest?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.manifest?.extra?.supabaseAnonKey || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define tip interface
interface WellbeingTip {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const WellbeingTips = () => {
  const [tips, setTips] = useState<WellbeingTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Get screen width to calculate tip width
  const screenWidth = Dimensions.get('window').width;
  const tipWidth = screenWidth - 60; // Minus padding and margins
  
  useEffect(() => {
    fetchTips();
  }, []);
  
  // Fetch tips from Supabase
  const fetchTips = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wellbeing_tips')
        .select('*')
        .limit(10);
        
      if (error) throw error;
      
      // If there's no data in the database, use default tips
      if (!data || data.length === 0) {
        setTips(defaultTips);
      } else {
        setTips(data);
      }
    } catch (error) {
      console.error('Error fetching wellbeing tips:', error);
      setTips(defaultTips); // Fall back to defaults on error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle slide change
  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#04C4D5" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Wellbeing Tips</Text>
      
      <FlatList
        data={tips}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.tipCard, { width: tipWidth }]}>
            {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.tipImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="leaf-outline" size={40} color="#04C4D5" />
              </View>
            )}
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{item.title}</Text>
              <Text style={styles.tipDescription}>{item.description}</Text>
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
      
      {/* Pagination indicators */}
      <View style={styles.pagination}>
        {tips.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

// Default tips to show if no data is fetched
const defaultTips: WellbeingTip[] = [
  {
    id: 1,
    title: 'Practice Mindfulness Daily',
    description: 'Take 5 minutes to be fully present. Focus on your breathing and observe your thoughts without judgment.',
    imageUrl: '',
    category: 'Mindfulness'
  },
  {
    id: 2,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain energy levels and overall health.',
    imageUrl: '',
    category: 'Physical Health'
  },
  {
    id: 3,
    title: 'Connect With Nature',
    description: 'Spend time outdoors to reduce stress and improve your mood. Even a short walk can make a difference.',
    imageUrl: '',
    category: 'Mental Health'
  }
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    gap: 15,
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Happy-Monkey',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#FAF8EC',
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
  },
  tipImage: {
    height: 120,
    width: '100%',
  },
  placeholderImage: {
    height: 120,
    width: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    padding: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#04C4D5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  paginationDotActive: {
    backgroundColor: '#04C4D5',
    width: 16,
  },
});

export default WellbeingTips;
