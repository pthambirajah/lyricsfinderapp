import React,{ useState,useEffect  } from 'react';
import { StyleSheet, Text,TextInput, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ChartScreen from './ChartScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-search'
                : 'ios-search-outline';
            } else if (route.name === 'Charts') {
              iconName = focused ? 'ios-trophy' : 'ios-trophy';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Charts" component={ChartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

