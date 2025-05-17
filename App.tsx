import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, LogBox } from 'react-native';
import { OrdersProvider } from './context/OrdersContext';
import AppNavigator from './navigation/AppNavigator';
import { KDS_SCREEN } from './constants/Screen';
import { useSound } from './utils/sound'; // Import the hook instead
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import OrderCard from './components/OrderCard/OrderCard';


// Ignore specific warnings
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted'
]);

export default function App() {
  const { playSound } = useSound(); // Initialize sound hook
  useEffect(() => {
  }, []);
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <OrdersProvider>
          <AppNavigator />
        </OrdersProvider>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: KDS_SCREEN.width,
    height: KDS_SCREEN.height,
    backgroundColor: '#f5f5f5'
  }
});