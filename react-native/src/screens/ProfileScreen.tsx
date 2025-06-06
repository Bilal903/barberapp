import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../services/supabase';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    email: user?.email || '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Profile updated successfully');
        setEditing(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: 'calendar-outline',
      title: 'My Appointments',
      subtitle: 'View and manage appointments',
      onPress: () => {
        navigation.navigate('Appointments');
      },
    },
    {
      icon: 'bag-outline',
      title: 'Order History',
      subtitle: 'View past orders',
      onPress: () => {
        navigation.navigate('Orders');
      },
    },
    {
      icon: 'diamond-outline',
      title: 'Membership',
      subtitle: 'Manage your membership',
      onPress: () => {
        navigation.navigate('Main', { screen: 'Membership' });
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => {
        Alert.alert('Coming Soon', 'Notification settings will be available soon');
      },
    },
    {
      icon: isDark ? 'sunny-outline' : 'moon-outline',
      title: 'Dark Mode',
      subtitle: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      onPress: toggleTheme,
      showToggle: true,
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {
        Alert.alert('Support', 'Contact us at support@barberapp.com');
      },
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => {
        Alert.alert('About', 'BarberApp v1.0.0\nYour grooming companion');
      },
    },
  ];

  const MenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.colors.surface }]} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={24} color={theme.colors.textSecondary} />
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
      {item.showToggle ? (
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#e5e7eb', true: theme.colors.primary }}
          thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="person" size={32} color={theme.colors.textSecondary} />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Ionicons
                name={editing ? 'close' : 'pencil'}
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileForm}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background, 
                    color: theme.colors.text,
                    borderColor: theme.colors.border 
                  },
                  !editing && styles.inputDisabled
                ]}
                value={profile.full_name}
                onChangeText={(text) => setProfile({ ...profile, full_name: text })}
                editable={editing}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background, 
                    color: theme.colors.text,
                    borderColor: theme.colors.border 
                  },
                  styles.inputDisabled
                ]}
                value={profile.email}
                editable={false}
                placeholder="Email address"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Phone</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background, 
                    color: theme.colors.text,
                    borderColor: theme.colors.border 
                  },
                  !editing && styles.inputDisabled
                ]}
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                editable={editing}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {editing && (
              <TouchableOpacity
                style={[
                  styles.saveButton, 
                  { backgroundColor: theme.colors.primary },
                  loading && styles.saveButtonDisabled
                ]}
                onPress={updateProfile}
                disabled={loading}
              >
                <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </View>

      {/* Sign Out */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={[styles.signOutMenuItem, { backgroundColor: theme.colors.surface }]} onPress={signOut}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
            <Text style={[styles.menuItemTitle, { color: theme.colors.error }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  signOutButton: {
    padding: 8,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  signOutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  signOutMenuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProfileScreen;