import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getMyOrders, getOrderStatus } from '../api';

export default function OrderStatusScreen({ route }) {
  const lastOrderId = route?.params?.lastOrderId;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
        if (lastOrderId) {
          await getOrderStatus(lastOrderId);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lastOrderId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: '600' }}>{item.restaurant?.name || 'Restaurant'}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ${Number(item.totalPrice).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}


