import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../services/supabase';
import { Appointment } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch next appointment
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          *,
          barbers (name),
          services (name, duration, price)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(1);

      if (appointments && appointments.length > 0) {
        setNextAppointment(appointments[0] as Appointment);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const QuickActionCard = ({ icon, title, subtitle, onPress, color }: any) => (
    <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]} onPress={onPress}>
      <Ionicons name={icon} size={32} color={color} style={styles.quickActionIcon} />
      <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
    </TouchableOpacity>
  );

  const ServiceCard = ({ name, duration, price, rating }: any) => (
    <View style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.serviceInfo}>
        <Text style={[styles.serviceName, { color: theme.colors.text }]}>{name}</Text>
        <View style={styles.serviceDetails}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.serviceDetailText, { color: theme.colors.textSecondary }]}>{duration} min</Text>
        </View>
      </View>
      <View style={styles.servicePricing}>
        <Text style={[styles.servicePrice, { color: theme.colors.primary }]}>${price}</Text>
        <View style={styles.serviceRating}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>{rating}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.colors.white }]}>Welcome back!</Text>
            <Text style={[styles.subtitle, { color: theme.colors.white }]}>Ready for your next grooming session?</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActions}>
          <QuickActionCard
            icon="calendar"
            title="Book Now"
            subtitle="Schedule appointment"
            color="#2563eb"
            onPress={() => navigation.navigate('Book' as never)}
          />
          <QuickActionCard
            icon="bag"
            title="Shop"
            subtitle="Hair products"
            color="#059669"
            onPress={() => navigation.navigate('Shop' as never)}
          />
        </View>
      </View>

      {/* Next Appointment */}
      {nextAppointment && (
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Next Appointment</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentRow}>
                <Text style={[styles.appointmentService, { color: theme.colors.text }]}>{nextAppointment.services?.name}</Text>
                <Text style={[styles.appointmentDuration, { color: theme.colors.textSecondary }]}>{nextAppointment.services?.duration} min</Text>
              </View>
              <View style={styles.appointmentRow}>
                <Text style={[styles.appointmentBarber, { color: theme.colors.textSecondary }]}>with {nextAppointment.barbers?.name}</Text>
                <Text style={[styles.appointmentDateTime, { color: theme.colors.textSecondary }]}>
                  {new Date(nextAppointment.appointment_date).toLocaleDateString()} at {nextAppointment.appointment_time}
                </Text>
              </View>
              <TouchableOpacity style={[styles.viewDetailsButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.viewDetailsText, { color: theme.colors.white }]}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Membership Upsell */}
      <View style={styles.section}>
        <View style={[styles.card, styles.membershipCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.membershipContent}>
            <View>
              <View style={styles.membershipHeader}>
                <Ionicons name="diamond" size={16} color="#d97706" />
                <Text style={[styles.membershipTitle, { color: theme.colors.text }]}>Premium Membership</Text>
              </View>
              <Text style={[styles.membershipSubtitle, { color: theme.colors.textSecondary }]}>Save up to 25% on all services</Text>
            </View>
            <TouchableOpacity
              style={[styles.membershipButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Membership' as never)}
            >
              <Text style={[styles.membershipButtonText, { color: theme.colors.white }]}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Featured Services */}
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Popular Services</Text>
          <View style={styles.servicesContainer}>
            <ServiceCard
              name="Classic Haircut"
              duration={45}
              price="25.00"
              rating="4.8"
            />
            <ServiceCard
              name="Premium Cut & Style"
              duration={60}
              price="40.00"
              rating="4.9"
            />
          </View>
          <TouchableOpacity
            style={[styles.bookServiceButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Book' as never)}
          >
            <Text style={[styles.bookServiceText, { color: theme.colors.white }]}>Book a Service</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  signOutButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  appointmentDetails: {
    gap: 12,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  appointmentDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentBarber: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentDateTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  membershipCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
  },
  membershipContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  membershipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
  membershipSubtitle: {
    fontSize: 14,
    color: '#b45309',
  },
  membershipButton: {
    backgroundColor: '#d97706',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  membershipButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  servicesContainer: {
    gap: 12,
    marginTop: 16,
  },
  serviceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  servicePricing: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  bookServiceButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  bookServiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;