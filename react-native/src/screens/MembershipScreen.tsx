import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MembershipScreen = () => {
  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 19.99,
      period: 'month',
      features: [
        '10% discount on all services',
        'Priority booking',
        'Monthly newsletter',
        'Basic customer support',
      ],
      color: '#6b7280',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 39.99,
      period: 'month',
      features: [
        '25% discount on all services',
        'Priority booking',
        'Free monthly styling consultation',
        'Exclusive access to new services',
        'Premium customer support',
        '15% discount on products',
      ],
      color: '#2563eb',
      popular: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 79.99,
      period: 'month',
      features: [
        '35% discount on all services',
        'VIP priority booking',
        'Free weekly styling consultation',
        'Exclusive access to premium services',
        'Dedicated customer support',
        '25% discount on products',
        'Free home service once a month',
        'Complimentary grooming kit',
      ],
      color: '#d97706',
      popular: false,
    },
  ];

  const MembershipCard = ({ plan }: { plan: any }) => (
    <View style={[styles.membershipCard, plan.popular && styles.popularCard]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${plan.price}</Text>
          <Text style={styles.period}>/{plan.period}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={plan.color} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.subscribeButton,
          { backgroundColor: plan.color },
          plan.popular && styles.popularButton,
        ]}
      >
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Membership Plans</Text>
        <Text style={styles.subtitle}>
          Choose the perfect plan for your grooming needs
        </Text>
      </View>

      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why Join Our Membership?</Text>
        
        <View style={styles.benefitCard}>
          <Ionicons name="cut" size={24} color="#2563eb" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Exclusive Discounts</Text>
            <Text style={styles.benefitDescription}>
              Save up to 35% on all services and products
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="calendar" size={24} color="#059669" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Priority Booking</Text>
            <Text style={styles.benefitDescription}>
              Get first access to appointment slots
            </Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="star" size={24} color="#d97706" />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Premium Services</Text>
            <Text style={styles.benefitDescription}>
              Access to exclusive styling consultations
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        {membershipPlans.map((plan) => (
          <MembershipCard key={plan.id} plan={plan} />
        ))}
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I cancel my membership anytime?</Text>
          <Text style={styles.faqAnswer}>
            Yes, you can cancel your membership at any time. Your benefits will continue until the end of your current billing period.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Do discounts apply to all services?</Text>
          <Text style={styles.faqAnswer}>
            Yes, membership discounts apply to all regular services. Some special promotions may have different terms.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I upgrade or downgrade my plan?</Text>
          <Text style={styles.faqAnswer}>
            Absolutely! You can change your plan at any time. Changes will take effect at your next billing cycle.
          </Text>
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
  benefitsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitContent: {
    marginLeft: 16,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  plansSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  membershipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#2563eb',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  period: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  subscribeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#2563eb',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  faqSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default MembershipScreen;