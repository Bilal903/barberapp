import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { Order } from '../types';

const OrdersScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
      .from('orders')
      .select(`
      *,
      order_items (
        *,
        products (name, price)
      )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

      setOrders(data as Order[] || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#2563eb';
      case 'shipped':
        return '#7c3aed';
      case 'delivered':
        return '#059669';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'build-outline';
      case 'shipped':
        return 'airplane-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const isExpanded = expandedOrders.has(order.id);

    return (
      <View style={styles.orderCard}>
      <TouchableOpacity
      style={styles.orderHeader}
      onPress={() => toggleOrderExpansion(order.id)}
      >
      <View style={styles.orderInfo}>
      <Text style={styles.orderNumber}>Order #{order.id.slice(-8)}</Text>
      <Text style={styles.orderDate}>
      {new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
      </Text>
      </View>
      <View style={styles.orderHeaderRight}>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
      <Ionicons
      name={getStatusIcon(order.status)}
      size={16}
      color="white"
      />
      <Text style={styles.statusText}>{order.status}</Text>
      </View>
      <Ionicons
      name={isExpanded ? 'chevron-up' : 'chevron-down'}
      size={20}
      color="#6b7280"
      style={styles.expandIcon}
      />
      </View>
      </TouchableOpacity>

      {/* Quick Summary */}
      <View style={styles.orderSummary}>
      <Text style={styles.itemCount}>
      {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
      </Text>
      <Text style={styles.totalAmount}>${order.total_amount.toFixed(2)}</Text>
      </View>

      {/* Expanded Details */}
      {isExpanded && (
        <View style={styles.expandedContent}>
        <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
        <Ionicons name="receipt-outline" size={16} color="#6b7280" />
        <Text style={styles.detailLabel}>Order ID:</Text>
        <Text style={styles.detailValue}>{order.id}</Text>
        </View>

        <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text style={styles.detailLabel}>Placed:</Text>
        <Text style={styles.detailValue}>
        {new Date(order.created_at).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
        </Text>
        </View>

        <View style={styles.detailRow}>
        <Ionicons name="card-outline" size={16} color="#6b7280" />
        <Text style={styles.detailLabel}>Payment:</Text>
        <Text style={styles.detailValue}>Card ending in ****</Text>
        </View>
        </View>

        <View style={styles.orderItems}>
        <Text style={styles.itemsHeader}>Items Ordered:</Text>
        {order.order_items?.map((item, index) => (
          <View key={index} style={styles.orderItem}>
          <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.products?.name}</Text>
          <Text style={styles.itemDescription}>
          {item.products?.description || 'Premium barber product'}
          </Text>
          </View>
          <View style={styles.itemDetails}>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
          </View>
        ))}
        </View>

        <View style={styles.orderFooter}>
        <View style={styles.totalBreakdown}>
        <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal:</Text>
        <Text style={styles.totalValue}>
        ${(order.total_amount * 0.9).toFixed(2)}
        </Text>
        </View>
        <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tax:</Text>
        <Text style={styles.totalValue}>
        ${(order.total_amount * 0.1).toFixed(2)}
        </Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotal]}>
        <Text style={styles.finalTotalLabel}>Total:</Text>
        <Text style={styles.finalTotalAmount}>${order.total_amount.toFixed(2)}</Text>
        </View>
        </View>

        <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="download-outline" size={16} color="#2563eb" />
        <Text style={styles.actionButtonText}>Download Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="refresh-outline" size={16} color="#059669" />
        <Text style={styles.actionButtonText}>Reorder</Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>
      )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
    >
    <Ionicons name="arrow-back" size={24} color="#1f2937" />
    </TouchableOpacity>
    <View style={styles.headerContent}>
    <Text style={styles.title}>Order History</Text>
    <Text style={styles.subtitle}>Track your purchases</Text>
    </View>
    </View>

    <ScrollView
    style={styles.ordersList}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
    {loading ? (
      <View style={styles.loadingContainer}>
      <Text>Loading orders...</Text>
      </View>
    ) : orders.length === 0 ? (
      <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptySubtitle}>
      You haven't placed any orders yet. Start shopping to see your orders here.
      </Text>
      </View>
    ) : (
      orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))
    )}
    </ScrollView>
    </View>
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
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
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
  ordersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  orderHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: {
    marginLeft: 4,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  expandedContent: {
    paddingTop: 16,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  totalBreakdown: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 14,
    color: '#374151',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  finalTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});

export default OrdersScreen;
