import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Shield, ShieldOff, UserCircle } from 'lucide-react-native';
import { getAdminUsers, updateUserRole } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export default function AdminUsersScreen() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setUsers(await getAdminUsers());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const toggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    setBusyId(u.id);
    try {
      const updated = await updateUserRole(u.id, nextRole);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: updated.role } : x)));
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not update role');
    } finally {
      setBusyId(null);
    }
  };

  const renderItem = ({ item }) => {
    const isAdmin = item.role === 'admin';
    const isSelf = me?.id === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <UserCircle size={28} color={theme.colors.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}{isSelf ? ' (you)' : ''}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.roleBadge, { backgroundColor: (isAdmin ? theme.colors.primary : theme.colors.textSecondary) + '20' }]}>
              <Text style={[styles.roleText, { color: isAdmin ? theme.colors.primary : theme.colors.textSecondary }]}>{item.role}</Text>
            </View>
            <Text style={styles.orders}>{item._count?.orders ?? 0} orders</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.roleBtn, isAdmin ? styles.demoteBtn : styles.promoteBtn, isSelf && styles.disabledBtn]}
          onPress={() => toggleRole(item)}
          disabled={isSelf || busyId === item.id}
          activeOpacity={0.8}
        >
          {busyId === item.id ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : isAdmin ? (
            <ShieldOff size={18} color={isSelf ? theme.colors.textTertiary : theme.colors.error} />
          ) : (
            <Shield size={18} color={theme.colors.success} />
          )}
        </TouchableOpacity>
      </View>
    );
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
      <FlatList
        data={users}
        keyExtractor={(u) => u.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={load}
        refreshing={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Users</Text>
            <Text style={styles.subtitle}>{users.length} registered · tap the shield to change role</Text>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.l, padding: theme.spacing.m, marginBottom: theme.spacing.m, gap: theme.spacing.m, ...theme.shadows.small },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  name: { ...theme.typography.bodyBold },
  email: { ...theme.typography.caption, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.m, marginTop: theme.spacing.s },
  roleBadge: { paddingHorizontal: theme.spacing.s, paddingVertical: 2, borderRadius: theme.borderRadius.round },
  roleText: { ...theme.typography.small, fontWeight: 'bold', textTransform: 'capitalize' },
  orders: { ...theme.typography.small },
  roleBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  promoteBtn: { borderColor: theme.colors.success },
  demoteBtn: { borderColor: theme.colors.error },
  disabledBtn: { borderColor: theme.colors.border, opacity: 0.5 },
});
