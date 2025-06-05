import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { Service, Barber } from '../types';
import { useFocusEffect } from '@react-navigation/native';

const BookScreen = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      console.log('BookScreen: Starting to fetch data...');
      
      const [servicesResponse, barbersResponse] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('barbers').select('*').eq('is_active', true),
      ]);

      console.log('BookScreen: Services response:', servicesResponse);
      console.log('BookScreen: Barbers response:', barbersResponse);

      if (servicesResponse.error) {
        console.error('Services error:', servicesResponse.error);
      }
      if (barbersResponse.error) {
        console.error('Barbers error:', barbersResponse.error);
      }

      setServices(servicesResponse.data || []);
      setBarbers(barbersResponse.data || []);
      
      console.log('BookScreen: Data set successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const bookAppointment = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('appointments').insert({
        customer_id: user?.id,
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'scheduled',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Appointment booked successfully!');
        // Reset form
        setSelectedService(null);
        setSelectedBarber(null);
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>Choose your service and preferred time</Text>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.selectionCard,
              selectedService?.id === service.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedService(service)}
          >
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <View style={styles.serviceDetail}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.serviceDetailText}>{service.duration} min</Text>
                </View>
                <View style={styles.serviceDetail}>
                  <Ionicons name="cash-outline" size={16} color="#6b7280" />
                  <Text style={styles.serviceDetailText}>${service.price}</Text>
                </View>
              </View>
            </View>
            {selectedService?.id === service.id && (
              <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Barbers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Barber</Text>
        {barbers.map((barber) => (
          <TouchableOpacity
            key={barber.id}
            style={[
              styles.selectionCard,
              selectedBarber?.id === barber.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedBarber(barber)}
          >
            <View style={styles.barberInfo}>
              <Text style={styles.barberName}>{barber.name}</Text>
              <Text style={styles.barberSpecialties}>
                Specialties: {barber.specialties?.join(', ') || 'General'}
              </Text>
            </View>
            {selectedBarber?.id === barber.id && (
              <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {getNextWeekDates().map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateCard,
                selectedDate === date && styles.selectedDateCard,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dateText,
                selectedDate === date && styles.selectedDateText,
              ]}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedTimeCard,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Book Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedService || !selectedBarber || !selectedDate || !selectedTime) && styles.bookButtonDisabled,
          ]}
          onPress={bookAppointment}
          disabled={!selectedService || !selectedBarber || !selectedDate || !selectedTime}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  selectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  barberSpecialties: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedDateText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTimeCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedTimeText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookScreen;