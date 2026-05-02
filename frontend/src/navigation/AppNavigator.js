import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Home, ShoppingCart, List, User, LayoutDashboard, Store, Users } from 'lucide-react-native';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { theme } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderStatusScreen from '../screens/OrderStatusScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminRestaurantsScreen from '../screens/admin/AdminRestaurantsScreen';
import AdminMenuScreen from '../screens/admin/AdminMenuScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const tabScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.text,
  tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.textSecondary,
};

function makeTabIcon(IconComponent) {
  return ({ color, size }) => <IconComponent color={color} size={size} />;
}

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Dashboard" component={UserDashboardScreen} options={{ tabBarIcon: makeTabIcon(LayoutDashboard) }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: makeTabIcon(Home) }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: makeTabIcon(ShoppingCart) }} />
      <Tab.Screen name="Orders" component={OrderStatusScreen} options={{ tabBarIcon: makeTabIcon(List) }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: makeTabIcon(User) }} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ tabBarIcon: makeTabIcon(LayoutDashboard) }} />
      <Tab.Screen name="Orders" component={AdminOrdersScreen} options={{ tabBarIcon: makeTabIcon(List) }} />
      <Tab.Screen name="Restaurants" component={AdminRestaurantsScreen} options={{ tabBarIcon: makeTabIcon(Store) }} />
      <Tab.Screen name="Users" component={AdminUsersScreen} options={{ tabBarIcon: makeTabIcon(Users) }} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background }
      }}>
        {user ? (
          isAdmin ? (
            <>
              <Stack.Screen name="AdminMain" component={AdminTabs} options={{ headerShown: false }} />
              <Stack.Screen name="AdminMenu" component={AdminMenuScreen} options={{ title: 'Manage Menu' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={UserTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
            </>
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
