import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommunityScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Community Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Groups</Text>
          <Text style={styles.sectionDescription}>
            Connect with like-minded people on similar wellness journeys
          </Text>
          
          {/* Group cards */}
          <View style={styles.groupCard}>
            <View style={[styles.groupBadge, { backgroundColor: '#FFD400' }]}>
              <Ionicons name="people" size={24} color="white" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Mindfulness Meditation</Text>
              <Text style={styles.groupMemberCount}>142 members</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.groupCard}>
            <View style={[styles.groupBadge, { backgroundColor: '#04C4D5' }]}>
              <Ionicons name="body" size={24} color="white" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Daily Exercise Club</Text>
              <Text style={styles.groupMemberCount}>89 members</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Coming Soon Section */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <View style={styles.featureBox}>
            <Ionicons name="chatbubbles-outline" size={32} color="#04C4D5" />
            <Text style={styles.featureTitle}>Group Discussions</Text>
            <Text style={styles.featureDescription}>
              Join topic-based discussions with community members
            </Text>
          </View>
          
          <View style={styles.featureBox}>
            <Ionicons name="calendar-outline" size={32} color="#04C4D5" />
            <Text style={styles.featureTitle}>Community Events</Text>
            <Text style={styles.featureDescription}>
              Virtual and in-person wellness events near you
            </Text>
          </View>
          
          <View style={styles.featureBox}>
            <Ionicons name="trophy-outline" size={32} color="#04C4D5" />
            <Text style={styles.featureTitle}>Wellness Challenges</Text>
            <Text style={styles.featureDescription}>
              Participate in group challenges and earn rewards
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EC',
  },
  header: {
    backgroundColor: '#04C4D5',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Happy-Monkey',
    color: 'white',
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 20,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  groupBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  groupMemberCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#04C4D5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  comingSoonSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  featureBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CommunityScreen;
