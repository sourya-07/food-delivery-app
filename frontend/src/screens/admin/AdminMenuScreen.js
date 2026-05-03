import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Pencil, Trash2 } from 'lucide-react-native';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../api';
import { theme } from '../../theme';

const empty = { name: '', description: '', price: '', imageUrl: '' };

export default function AdminMenuScreen({ route }) {
  const { restaurantId, restaurantName } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setItems(await getMenu(restaurantId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [restaurantId]);

  const openCreate = () => { setEditing(null); setForm(empty); setModalVisible(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name || '', description: m.description || '', price: String(m.price ?? ''), imageUrl: m.imageUrl || '' });
    setModalVisible(true);
  };

  const save = async () => {
    if (!form.name.trim()) { Alert.alert('Validation', 'Name is required'); return; }
    if (form.price === '' || isNaN(Number(form.price))) { Alert.alert('Validation', 'Valid price is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim(),
      };
      if (editing) await updateMenuItem(editing.id, payload);
      else await createMenuItem({ ...payload, restaurantId });
      setModalVisible(false);
      await load();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (m) => {
    Alert.alert('Delete item', `Delete "${m.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try { await deleteMenuItem(m.id); await load(); }
          catch (err) { Alert.alert('Error', err.response?.data?.message || 'Could not delete'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        {!!item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.iconActions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
          <Pencil size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => confirmDelete(item)}>
          <Trash2 size={18} color={theme.colors.error} />
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
        data={items}
        keyExtractor={(m) => m.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{restaurantName}</Text>
            <Text style={styles.subtitle}>{items.length} menu item{items.length === 1 ? '' : 's'}</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No menu items yet. Tap + to add one.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.85}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Item' : 'New Item'}</Text>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor={theme.colors.textTertiary} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
            <TextInput style={styles.input} placeholder="Description" placeholderTextColor={theme.colors.textTertiary} value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} />
            <TextInput style={styles.input} placeholder="Price" placeholderTextColor={theme.colors.textTertiary} keyboardType="decimal-pad" value={form.price} onChangeText={(t) => setForm({ ...form, price: t })} />
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
  title: { ...theme.typography.h2 },
  subtitle: { ...theme.typography.caption },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.l, padding: theme.spacing.m, marginBottom: theme.spacing.m, ...theme.shadows.small },
  name: { ...theme.typography.bodyBold },
  desc: { ...theme.typography.caption, marginTop: 2 },
  price: { ...theme.typography.h4, color: theme.colors.primary, marginTop: theme.spacing.s },
  iconActions: { gap: theme.spacing.s },
  iconBtn: { width: 40, height: 40, borderRadius: theme.borderRadius.m, backgroundColor: theme.colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...theme.typography.caption, textAlign: 'center', marginTop: theme.spacing.xl },
  fab: { position: 'absolute', right: theme.spacing.l, bottom: theme.spacing.l, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', ...theme.shadows.large },
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
