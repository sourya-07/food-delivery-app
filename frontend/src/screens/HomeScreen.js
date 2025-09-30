import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import { getRestaurants } from '../api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => navigation.navigate('Menu', { restaurantId: item.id, name: item.name })} />
        )}
      />
    </View>
  );
}


