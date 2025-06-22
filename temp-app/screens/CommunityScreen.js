import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen() {
  // Mock community posts data
  const communityPosts = [
    {
      id: '1',
      author: 'Sarah Johnson',
      content: 'Just completed a 30-day meditation challenge! Feeling so much more centered and focused.',
      likes: 24,
      comments: 5,
      timeAgo: '2h ago'
    },
    {
      id: '2',
      author: 'Michael Chen',
      content: 'Found a great new hiking trail this morning. Nature is the best medicine!',
      likes: 18,
      comments: 3,
      timeAgo: '5h ago'
    },
    {
      id: '3',
      author: 'Emma Davis',
      content: 'Tried the breathing exercise from yesterday\'s workshop. Really helped with my anxiety before a big presentation!',
      likes: 32,
      comments: 7,
      timeAgo: '1d ago'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Community stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>423</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>52</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>New Posts</Text>
          </View>
        </View>

        {/* Create post button */}
        <TouchableOpacity style={styles.createPostButton}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.createPostText}>Create Post</Text>
        </TouchableOpacity>

        {/* Community posts */}
        <View style={styles.postsContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {communityPosts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorInitial}>{post.author[0]}</Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.timeAgo}</Text>
                </View>
              </View>
              
              <Text style={styles.postContent}>{post.content}</Text>
              
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={20} color="#666" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#666" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#04C4D5',
    padding: 12,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  createPostText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  postsContainer: {
    padding: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginLeft: 5,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#04C4D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  authorInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorName: {
    fontWeight: '600',
    fontSize: 14,
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
  }
});
