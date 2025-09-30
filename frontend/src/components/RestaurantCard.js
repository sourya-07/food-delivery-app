import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function RestaurantCard({ restaurant, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
      {restaurant.imageUrl ? (
        <Image source={{ uri: restaurant.imageUrl }} style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }} />
      ) : (
        <View style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 12 }} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{restaurant.name}</Text>
        {restaurant.description ? <Text style={{ color: '#666' }} numberOfLines={2}>{restaurant.description}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}


