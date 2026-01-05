import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMenu } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../config/images';
import { theme } from '../theme';

export default function MenuScreen({ route, navigation }) {
  const { restaurantId, restaurantName } = route.params;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMenu(restaurantId);
        setMenu(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  const addToCart = async (item) => {
    const cartStr = await AsyncStorage.getItem('cart');
    let cart = cartStr ? JSON.parse(cartStr) : [];

    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
      cart = [];
    }

    cart.push({ ...item, restaurantId, restaurantName });
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  };

  const renderItem = ({ item }) => {
    const imageSource = images[item.name] || images.logo;

    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(item)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.dark}
      style={styles.container}
    >
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{restaurantName}</Text>
            <Text style={styles.subtitle}>Choose your favorite dishes</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
  headerContainer: {
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.s,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  info: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  name: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.caption,
    lineHeight: 18,
  },
  priceContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
  },
  price: {
    ...theme.typography.h4,
    color: theme.colors.primary,
  },
  addButton: {
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  addButtonGradient: {
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
  addButtonText: {
    ...theme.typography.bodyBold,
    color: '#fff',
  },
});
