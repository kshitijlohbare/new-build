import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Mock user data
  const user = {
    name: 'Emma Watson',
    email: 'emma@caktuscoco.com',
    memberSince: 'January 2023',
    streak: 24,
    completedPractices: 87,
  };

  // Toggle switches
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Profile information */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
        </View>
        
        {/* Stats section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.completedPractices}</Text>
            <Text style={styles.statLabel}>Practices Completed</Text>
          </View>
        </View>
        
        {/* Settings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: '#04C4D5' }}
              thumbColor="#fff"
              onValueChange={toggleNotifications}
              value={notifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="moon-outline" size={22} color="#333" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: '#04C4D5' }}
              thumbColor="#fff"
              onValueChange={toggleDarkMode}
              value={darkMode}
            />
          </View>
        </View>
        
        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuTextContainer}>
              <Ionicons name="person-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AEAEB2" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuTextContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AEAEB2" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuTextContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AEAEB2" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuTextContainer}>
              <Ionicons name="information-circle-outline" size={22} color="#333" />
              <Text style={styles.menuText}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AEAEB2" />
          </TouchableOpacity>
        </View>
        
        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#04C4D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#04C4D5',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
