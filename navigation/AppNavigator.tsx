import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KDS_SCREEN } from '../constants/Screen';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import TabNavigator from './TabNavigator';

const AppNavigator = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('User logged out');
    setSidebarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={toggleSidebar} />
      <TabNavigator />
      <Sidebar 
        visible={sidebarVisible} 
        onClose={toggleSidebar} 
        onLogout={handleLogout} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: KDS_SCREEN.width,
    height: KDS_SCREEN.height
  }
});

export default AppNavigator;