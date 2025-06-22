import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookSession = () => {
  const navigation = useNavigation();
  
  // Navigate to booking screen
  const navigateToBooking = () => {
    // This would navigate to your booking screen in a full implementation
    // navigation.navigate('AppointmentBooking' as never);
    // For now, we'll just show a placeholder
    alert('This would navigate to the appointment booking screen');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Book a Session</Text>
      
      <View style={styles.practitionerCard}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/practitioner-placeholder.png')} 
            style={styles.practitionerImage}
            defaultSource={require('../assets/practitioner-placeholder.png')}
          />
        </View>
        
        <View style={styles.practitionerInfo}>
          <Text style={styles.matchText}>Your best match</Text>
          <Text style={styles.practitionerName}>Dr. Emma Wilson</Text>
          <Text style={styles.practitionerSpecialty}>Psychologist, CBT Specialist</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.9</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.bookButton}
        onPress={navigateToBooking}
      >
        <Text style={styles.bookButtonText}>Book a Session</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => alert('View all practitioners')}
      >
        <Text style={styles.viewAllText}>View all practitioners</Text>
        <Ionicons name="chevron-forward" size={18} color="#04C4D5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Happy-Monkey',
    marginBottom: 10,
  },
  practitionerCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF8EC',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  imageContainer: {
    width: 100,
    height: 120,
  },
  practitionerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  practitionerInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  matchText: {
    fontSize: 12,
    color: '#04C4D5',
    fontWeight: '600',
    marginBottom: 5,
  },
  practitionerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  practitionerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#04C4D5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewAllText: {
    color: '#04C4D5',
    fontWeight: '600',
    marginRight: 5,
  },
});

export default BookSession;
