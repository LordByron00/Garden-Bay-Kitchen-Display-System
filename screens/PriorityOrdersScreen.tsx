import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import OrderCard from '../components/OrderCard/OrderCard';
import { KDS_SCREEN } from '../constants/Screen';
import { useSound } from '../utils/sound';
import SearchBar from '../components/SearchBar/SearchBar';

const PriorityOrdersScreen = () => {
const { priorityOrders, markAsReady, searchOrders } = useOrders();
const { playSound } = useSound();
const [searchQuery, setSearchQuery] = useState('');
const filteredOrders = searchQuery ? searchOrders(searchQuery, 1) : priorityOrders;

  

  const handleReadyPress = async (orderId: number) => {
    markAsReady(orderId);
    await playSound('ready');
  };

  if (priorityOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Priority Orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search orders..."
      />

      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <OrderCard
                order={item}
                onReadyPress={() => handleReadyPress(item.orderId)}
                showPriorityButton={false} arrivalTime={''} tableNumber={''} orderType={''}          />
        )}
        keyExtractor={item => item.orderId}
        contentContainerStyle={styles.listContent}
        numColumns={Math.floor(KDS_SCREEN.width / 400)} // Responsive column count
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: KDS_SCREEN.width * 0.02,
    backgroundColor: '#fff8f0' // Light orange background for priority section
  },
  listContent: {
    paddingBottom: 20
  },
  columnWrapper: {
    // justifyContent: 'space-between',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d'
  }
});

export default PriorityOrdersScreen;