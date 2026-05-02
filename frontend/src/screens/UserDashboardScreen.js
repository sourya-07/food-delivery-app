import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { ShoppingBag, DollarSign, Store, ShoppingCart, List, Clock } from 'lucide-react-native';
import { getMyOrders } from '../api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function UserDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.warning;
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={theme.gradients.dark} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.gradients.dark} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.primary} />}
      >
        <Text style={styles.greeting}>Hello, {user?.name || 'there'} 👋</Text>
        <Text style={styles.subtitle}>Welcome back to your dashboard</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ShoppingBag size={22} color={theme.colors.primary} />
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={22} color={theme.colors.accent} />
            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total spent</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={22} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{memberSince}</Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
            <Store size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Cart')} activeOpacity={0.85}>
            <ShoppingCart size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Orders')} activeOpacity={0.85}>
            <List size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Recent orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No orders yet. Browse restaurants to get started!</Text>
          </View>
        ) : (
          orders.slice(0, 5).map((o) => (
            <View key={o.id} style={styles.orderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderName}>{o.restaurant?.name || `Order #${o.id}`}</Text>
                <Text style={styles.orderMeta}>
                  {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? '' : 's'} · {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>${o.totalPrice}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(o.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(o.status) }]}>{o.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: theme.spacing.m, paddingBottom: theme.spacing.xl },
  greeting: { ...theme.typography.h1, marginTop: theme.spacing.s },
  subtitle: { ...theme.typography.caption, marginBottom: theme.spacing.l },
  statsRow: { flexDirection: 'row', gap: theme.spacing.s, marginBottom: theme.spacing.l },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statValue: { ...theme.typography.h4, marginTop: theme.spacing.s },
  statLabel: { ...theme.typography.small, marginTop: theme.spacing.xs, textAlign: 'center' },
  sectionTitle: { ...theme.typography.h4, marginBottom: theme.spacing.m, marginTop: theme.spacing.s },
  actionsRow: { flexDirection: 'row', gap: theme.spacing.m, marginBottom: theme.spacing.l },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    paddingVertical: theme.spacing.l,
    alignItems: 'center',
    gap: theme.spacing.s,
    ...theme.shadows.small,
  },
  actionText: { ...theme.typography.bodyMedium },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  emptyText: { ...theme.typography.caption, textAlign: 'center' },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  orderName: { ...theme.typography.bodyBold },
  orderMeta: { ...theme.typography.caption, marginTop: theme.spacing.xs },
  orderRight: { alignItems: 'flex-end', gap: theme.spacing.xs },
  orderTotal: { ...theme.typography.h4, color: theme.colors.primary },
  statusBadge: { paddingHorizontal: theme.spacing.s, paddingVertical: 2, borderRadius: theme.borderRadius.round },
  statusText: { ...theme.typography.small, fontWeight: 'bold' },
});
