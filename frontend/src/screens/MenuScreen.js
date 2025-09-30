import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
import { getMenu, createOrder } from '../api';

export default function MenuScreen({ route, navigation }) {
  const { restaurantId, name } = route.params;
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({}); // id -> qty

  useEffect(() => {
    navigation.setOptions({ title: name || 'Menu' });
  }, [name]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMenu(restaurantId);
        setMenu(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart((c) => {
    const qty = (c[id] || 0) - 1;
    const next = { ...c };
    if (qty <= 0) delete next[id]; else next[id] = qty;
    return next;
  });

  const placeOrder = async () => {
    const items = Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId: Number(menuItemId), quantity }));
    if (items.length === 0) return;
    const res = await createOrder(restaurantId, items);
    navigation.navigate('Orders', { lastOrderId: res.orderId });
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={menu}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
            {item.description ? <Text style={{ color: '#666' }}>{item.description}</Text> : null}
            <Text style={{ marginVertical: 6 }}>${Number(item.price).toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="-" onPress={() => remove(item.id)} />
              <Text style={{ alignSelf: 'center', minWidth: 24, textAlign: 'center' }}>{cart[item.id] || 0}</Text>
              <Button title="+" onPress={() => add(item.id)} />
            </View>
          </View>
        )}
      />
      <View style={{ paddingVertical: 12 }}>
        <Button title="Place Order" onPress={placeOrder} />
      </View>
    </View>
  );
}


