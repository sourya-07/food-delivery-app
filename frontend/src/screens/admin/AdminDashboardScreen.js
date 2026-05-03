import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Store, UtensilsCrossed, ClipboardList, Users, DollarSign, LogOut } from 'lucide-react-native';
import { getAdminStats } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const STATUS_COLORS = {
  pending: theme.colors.warning,
  preparing: theme.colors.secondary,
  on_the_way: theme.colors.primary,
  delivered: theme.colors.success,
  cancelled: theme.colors.error,
};

export default function AdminDashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setStats(await getAdminStats());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  if (loading) {
    return (
      <LinearGradient colors={theme.gradients.dark} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  const cards = [
    { label: 'Restaurants', value: stats.restaurants, icon: Store, color: theme.colors.primary, target: 'Restaurants' },
    { label: 'Menu Items', value: stats.menuItems, icon: UtensilsCrossed, color: theme.colors.secondary, target: 'Restaurants' },
    { label: 'Orders', value: stats.orders, icon: ClipboardList, color: theme.colors.accent, target: 'Orders' },
    { label: 'Users', value: stats.users, icon: Users, color: theme.colors.primaryLight, target: 'Users' },
  ];

  return (
    <LinearGradient colors={theme.gradients.dark} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.primary} />}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <LogOut size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        {/* Revenue banner */}
        <LinearGradient colors={theme.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.revenueCard}>
          <View>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueValue}>${Number(stats.revenue).toFixed(2)}</Text>
          </View>
          <DollarSign size={40} color="#fff" />
        </LinearGradient>

        {/* Stat cards */}
        <View style={styles.grid}>
          {cards.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={styles.statCard}
              onPress={() => navigation.navigate(c.target)}
              activeOpacity={0.85}
            >
              <c.icon size={26} color={c.color} />
              <Text style={styles.statValue}>{c.value}</Text>
              <Text style={styles.statLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders by status */}
        <Text style={styles.sectionTitle}>Orders by Status</Text>
        <View style={styles.statusCard}>
          {Object.entries(stats.ordersByStatus).map(([status, count], idx, arr) => (
            <View key={status} style={[styles.statusRow, idx < arr.length - 1 && styles.statusDivider]}>
              <View style={styles.statusLeft}>
                <View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] || theme.colors.textSecondary }]} />
                <Text style={styles.statusName}>{status.replace(/_/g, ' ')}</Text>
              </View>
              <Text style={styles.statusCount}>{count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: theme.spacing.m, paddingBottom: theme.spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.s, marginBottom: theme.spacing.l },
  title: { ...theme.typography.h1 },
  subtitle: { ...theme.typography.caption },
  logoutBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.error,
  },
  revenueCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: theme.borderRadius.l, padding: theme.spacing.l, marginBottom: theme.spacing.l,
    ...theme.shadows.medium,
  },
  revenueLabel: { ...theme.typography.bodyMedium, color: '#fff', opacity: 0.9 },
  revenueValue: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: theme.spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.m, marginBottom: theme.spacing.l },
  statCard: {
    width: '47%', flexGrow: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l, padding: theme.spacing.l,
    alignItems: 'center', gap: theme.spacing.xs,
    ...theme.shadows.small,
  },
  statValue: { ...theme.typography.h2, marginTop: theme.spacing.xs },
  statLabel: { ...theme.typography.caption },
  sectionTitle: { ...theme.typography.h4, marginBottom: theme.spacing.m },
  statusCard: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.l, padding: theme.spacing.m, ...theme.shadows.small },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.m },
  statusDivider: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.s },
  dot: { width: 10, height: 10, borderRadius: 5 },
  statusName: { ...theme.typography.body, textTransform: 'capitalize' },
  statusCount: { ...theme.typography.bodyBold, color: theme.colors.primary },
});
