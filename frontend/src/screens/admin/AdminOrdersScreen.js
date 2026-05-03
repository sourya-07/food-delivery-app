import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Package } from 'lucide-react-native';
import { getAdminOrders, updateOrderStatus } from '../../api';
import { theme } from '../../theme';

const STATUSES = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: theme.colors.warning,
  preparing: theme.colors.secondary,
  on_the_way: theme.colors.primary,
  delivered: theme.colors.success,
  cancelled: theme.colors.error,
};

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      setOrders(await getAdminOrders());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const changeStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>Order #{item.id} · {item.restaurant?.name}</Text>
          <Text style={styles.meta}>
            {item.user?.name || 'Guest'} · {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <Text style={styles.total}>${item.totalPrice}</Text>
      </View>

      <Text style={styles.itemsLine} numberOfLines={2}>
        {(item.items || []).map((it) => `${it.quantity}× ${it.menuItem?.name}`).join(', ')}
      </Text>

      <View style={styles.chips}>
        {STATUSES.map((s) => {
          const active = item.status === s;
          return (
            <TouchableOpacity
              key={s}
              disabled={active || updatingId === item.id}
              onPress={() => changeStatus(item.id, s)}
              style={[
                styles.chip,
                { borderColor: STATUS_COLORS[s] },
                active && { backgroundColor: STATUS_COLORS[s] },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, { color: active ? '#000' : STATUS_COLORS[s] }]}>
                {s.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={theme.gradients.dark} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.gradients.dark} style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={load}
        refreshing={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Manage Orders</Text>
            <Text style={styles.subtitle}>{orders.length} order{orders.length === 1 ? '' : 's'} · tap a status to update</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Package size={56} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: theme.spacing.m, paddingBottom: theme.spacing.xl },
  headerContainer: { marginBottom: theme.spacing.l, marginTop: theme.spacing.s },
  title: { ...theme.typography.h1 },
  subtitle: { ...theme.typography.caption },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.l, padding: theme.spacing.m, marginBottom: theme.spacing.m, ...theme.shadows.small },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.s },
  orderId: { ...theme.typography.bodyBold },
  meta: { ...theme.typography.caption, marginTop: 2 },
  total: { ...theme.typography.h4, color: theme.colors.primary },
  itemsLine: { ...theme.typography.caption, marginBottom: theme.spacing.m },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.s },
  chip: { borderWidth: 1, borderRadius: theme.borderRadius.round, paddingHorizontal: theme.spacing.m, paddingVertical: theme.spacing.xs },
  chipText: { ...theme.typography.small, fontWeight: 'bold', textTransform: 'capitalize' },
  empty: { alignItems: 'center', padding: theme.spacing.xxl, gap: theme.spacing.m },
  emptyText: { ...theme.typography.h4, color: theme.colors.textSecondary },
});
