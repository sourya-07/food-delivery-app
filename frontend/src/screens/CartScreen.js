import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ShoppingBag } from 'lucide-react-native';
import { createOrder } from '../api';
import images from '../config/images';
import { theme } from '../theme';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    const cartStr = await AsyncStorage.getItem('cart');
    if (cartStr) {
      setCart(JSON.parse(cartStr));
    } else {
      setCart([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first.');
      return;
    }

    setLoading(true);
    try {
      const restaurantId = cart[0].restaurantId;
      const itemsMap = {};
      cart.forEach(item => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += 1;
        } else {
          itemsMap[item.id] = { menuItemId: item.id, quantity: 1 };
        }
      });
      const items = Object.values(itemsMap);

      await createOrder(restaurantId, items);
      await AsyncStorage.removeItem('cart');
      setCart([]);
      navigation.navigate('OrderSuccess');
    } catch (err) {
      Alert.alert('Order Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('cart');
            setCart([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const imageSource = images[item.name] || images.logo;
    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      </View>
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  if (cart.length === 0) {
    return (
      <LinearGradient colors={theme.gradients.dark} style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <ShoppingBag size={64} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious items to get started</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.gradients.dark} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSubtitle}>{cart.length} item{cart.length > 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.orderButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.orderButtonText}>Place Order</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    paddingTop: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  clearButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  clearText: {
    color: theme.colors.error,
    ...theme.typography.bodyMedium,
  },
  list: {
    padding: theme.spacing.m,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  image: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'space-between',
  },
  name: {
    ...theme.typography.bodyBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...theme.typography.h4,
    color: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  emptyTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
  },
  emptySubtitle: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.large,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  totalLabel: {
    ...theme.typography.h3,
  },
  totalValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  orderButton: {
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  orderButtonGradient: {
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
  orderButtonText: {
    ...theme.typography.h4,
    color: '#fff',
  },
});
