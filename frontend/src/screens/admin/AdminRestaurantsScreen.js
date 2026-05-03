import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Pencil, Trash2, UtensilsCrossed, Star } from 'lucide-react-native';
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../api';
import { theme } from '../../theme';

const empty = { name: '', description: '', rating: '', imageUrl: '' };

export default function AdminRestaurantsScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setRestaurants(await getRestaurants());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const openCreate = () => { setEditing(null); setForm(empty); setModalVisible(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name || '', description: r.description || '', rating: String(r.rating ?? ''), imageUrl: r.imageUrl || '' });
    setModalVisible(true);
  };

  const save = async () => {
    if (!form.name.trim()) { Alert.alert('Validation', 'Name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        rating: form.rating === '' ? 0 : Number(form.rating),
        imageUrl: form.imageUrl.trim(),
      };
      if (editing) await updateRestaurant(editing.id, payload);
      else await createRestaurant(payload);
      setModalVisible(false);
      await load();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (r) => {
    Alert.alert('Delete restaurant', `Delete "${r.name}" and all its menu items?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try { await deleteRestaurant(r.id); await load(); }
          catch (err) { Alert.alert('Error', err.response?.data?.message || 'Could not delete'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          {!!item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
          <View style={styles.ratingRow}>
            <Star size={14} color={theme.colors.secondary} fill={theme.colors.secondary} />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AdminMenu', { restaurantId: item.id, restaurantName: item.name })}>
          <UtensilsCrossed size={16} color={theme.colors.primary} />
          <Text style={styles.actionText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(item)}>
          <Pencil size={16} color={theme.colors.text} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)}>
          <Trash2 size={16} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
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
        data={restaurants}
        keyExtractor={(r) => r.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={load}
        refreshing={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Restaurants</Text>
            <Text style={styles.subtitle}>{restaurants.length} total</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.85}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Restaurant' : 'New Restaurant'}</Text>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor={theme.colors.textTertiary} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
            <TextInput style={styles.input} placeholder="Description" placeholderTextColor={theme.colors.textTertiary} value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} />
            <TextInput style={styles.input} placeholder="Rating (0-5)" placeholderTextColor={theme.colors.textTertiary} keyboardType="decimal-pad" value={form.rating} onChangeText={(t) => setForm({ ...form, rating: t })} />
            <TextInput style={styles.input} placeholder="Image URL (optional)" placeholderTextColor={theme.colors.textTertiary} autoCapitalize="none" value={form.imageUrl} onChangeText={(t) => setForm({ ...form, imageUrl: t })} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={save} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{editing ? 'Save' : 'Create'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: theme.spacing.m, paddingBottom: 100 },
  headerContainer: { marginBottom: theme.spacing.l, marginTop: theme.spacing.s },
  title: { ...theme.typography.h1 },
  subtitle: { ...theme.typography.caption },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.l, padding: theme.spacing.m, marginBottom: theme.spacing.m, ...theme.shadows.small },
  cardTop: { flexDirection: 'row', marginBottom: theme.spacing.m },
  name: { ...theme.typography.h4 },
  desc: { ...theme.typography.caption, marginTop: theme.spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: theme.spacing.s },
  rating: { ...theme.typography.caption, color: theme.colors.secondary },
  actions: { flexDirection: 'row', gap: theme.spacing.s, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.m },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, paddingVertical: theme.spacing.s, borderRadius: theme.borderRadius.s, backgroundColor: theme.colors.surfaceElevated },
  actionText: { ...theme.typography.small, fontWeight: 'bold', color: theme.colors.primary },
  fab: {
    position: 'absolute', right: theme.spacing.l, bottom: theme.spacing.l,
    width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary,
    justifyContent: 'center', alignItems: 'center', ...theme.shadows.large,
  },
  modalOverlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl, padding: theme.spacing.l, gap: theme.spacing.m },
  modalTitle: { ...theme.typography.h3, marginBottom: theme.spacing.s },
  input: { backgroundColor: theme.colors.surfaceElevated, color: theme.colors.text, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, borderWidth: 1, borderColor: theme.colors.border, ...theme.typography.body },
  modalActions: { flexDirection: 'row', gap: theme.spacing.m, marginTop: theme.spacing.s },
  modalBtn: { flex: 1, paddingVertical: theme.spacing.m, borderRadius: theme.borderRadius.m, alignItems: 'center' },
  cancelBtn: { backgroundColor: theme.colors.surfaceElevated },
  cancelText: { ...theme.typography.bodyMedium },
  saveBtn: { backgroundColor: theme.colors.primary },
  saveText: { ...theme.typography.bodyBold, color: '#fff' },
});
