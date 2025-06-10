import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types/navigation';

import { useAuth } from '../hooks/useAuth';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import BookScreen from '../screens/BookScreen';
import ShopScreen from '../screens/ShopScreen';
import MembershipScreen from '../screens/MembershipScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import LoadingScreen from '../screens/LoadingScreen';
import AdminScreen from '../screens/AdminScreen';
import ServicesScreen from '../screens/ServicesScreen';
import NotificationPreferencesScreen from '../screens/NotificationPreferencesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import CustomerManagementScreen from '../screens/CustomerManagementScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Membership') {
            iconName = focused ? 'diamond' : 'diamond-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Book" component={BookScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Membership" component={MembershipScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{
            tabBarLabel: 'Admin',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Appointments" component={AppointmentsScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="CustomerManagement" component={CustomerManagementScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;