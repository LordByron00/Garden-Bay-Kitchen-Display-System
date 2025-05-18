import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import OrderCard from '../components/OrderCard/OrderCard';
import { KDS_SCREEN, kdsFontSize } from '../constants/Screen';
import SearchBar from '../components/SearchBar/SearchBar';
import React, { useState } from 'react';

const ReadyOrdersScreen = () => {
  const { readyOrders, searchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOrders = searchQuery ? searchOrders(searchQuery, 2) : readyOrders;

  // Simple print function that works with your existing context
  // const printAllReadyOrders = () => {
  //   console.log('Printing all ready orders:', readyOrders);
  //   // In a real app, you would connect to your printer API here
  //   readyOrders.forEach(order => {
  //     const printContent = `
  //       Order #${order.orderId}
  //       Table: ${order.tableNumber}
  //       Type: ${order.orderType}
  //       Items:
  //       ${order.items.map(item => `- ${item.quantity}x ${item.name}`).join('\n')}
  //       Status: READY
  //       Time: ${new Date().toLocaleTimeString()}
  //     `;
  //     console.log(printContent);
  //   });
  // };

  if (readyOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Ready Orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* <TouchableOpacity 
        style={styles.printAllButton}
        onPress={printAllReadyOrders}
      >
        <Text style={styles.printAllText}>PRINT ALL ({readyOrders.length})</Text>
      </TouchableOpacity> */}

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
                showActions={false} // Disable buttons for ready orders
                arrivalTime={''} tableNumber={''} orderType={''} 
                showReadyButton = {false}
                 />
        )}
        keyExtractor={item => item.orderId}
        contentContainerStyle={styles.listContent}
        numColumns={Math.floor(KDS_SCREEN.width / 400)}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: KDS_SCREEN.width * 0.02,
    backgroundColor: '#f0fff0' // Light green background for ready section
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
  },
  printAllButton: {
    backgroundColor: '#2c454c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15
  },
  printAllText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: kdsFontSize(16)
  }
});

export default ReadyOrdersScreen;