import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getRestaurants } from '../api';
import images from '../config/images';
import { theme } from '../theme';

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }) => {
    const imageSource = images[item.name] || images.logo;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate('Menu', { restaurantId: item.id, restaurantName: item.name })}
        activeOpacity={0.9}
      >
        <View style={styles.card}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageGradient}
          />
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
            </View>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Explore Restaurants</Text>
            <Text style={styles.subtitle}>Discover amazing food near you</Text>
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
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
  },
  cardContainer: {
    marginBottom: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  content: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  name: {
    ...theme.typography.h3,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  ratingBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.small,
  },
  rating: {
    ...theme.typography.bodyBold,
    fontSize: 14,
  },
  description: {
    ...theme.typography.caption,
    lineHeight: 20,
  },
});
