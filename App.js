import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import HomeScreen from './src/screens/Home/HomeScreen';
import ImmigrationScreen from './src/screens/Immigration/ImmigrationScreen';
import BudgetScreen from './src/screens/Budget/BudgetScreen';
import RatesScreen from './src/screens/Rates/RatesScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#161B22',
              borderTopColor: '#2D333B',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 65,
            },
            tabBarActiveTintColor: '#FF9933',
            tabBarInactiveTintColor: '#484F58',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              marginTop: 2,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text> }}
          />
          <Tab.Screen
            name="Immigration"
            component={ImmigrationScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🛂</Text> }}
          />
          <Tab.Screen
            name="Budget"
            component={BudgetScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>💰</Text> }}
          />
          <Tab.Screen
            name="Rates"
            component={RatesScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>💸</Text> }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>👤</Text> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
