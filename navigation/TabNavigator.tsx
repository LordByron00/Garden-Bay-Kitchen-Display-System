import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { KDS_SCREEN, kdsFontSize } from '../constants/Screen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import PriorityOrdersScreen from '../screens/PriorityOrdersScreen';
import ReadyOrdersScreen from '../screens/ReadyOrdersScreen';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: kdsFontSize(14),
          fontWeight: 'bold',
          textTransform: 'none'
        },
        tabBarItemStyle: {
          width: KDS_SCREEN.width / 3,
        },
        tabBarStyle: {
          backgroundColor: '#2c454c',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
        tabBarIndicatorStyle: {
          backgroundColor: '#f1c40f',
          height: 4
        }
      }}
    >
      <Tab.Screen name="All" component={AllOrdersScreen} />
      <Tab.Screen name="Priority" component={PriorityOrdersScreen} />
      <Tab.Screen name="Ready" component={ReadyOrdersScreen} />
    </Tab.Navigator>
  );
}