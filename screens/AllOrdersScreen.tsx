import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import OrderCard from '../components/OrderCard/OrderCard';
import SearchBar from '../components/SearchBar/SearchBar';
import { KDS_SCREEN } from '../constants/Screen';

const AllOrdersScreen = () => {
  const { allOrders, prioritizeOrder, markAsReady, searchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = searchQuery ? searchOrders(searchQuery) : allOrders;

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
            onPriorityPress={() => prioritizeOrder(item.orderId)}
            onReadyPress={() => markAsReady(item.orderId)} arrivalTime={''} tableNumber={''} orderType={''}          />
        )}
        keyExtractor={item => item.orderId}
        contentContainerStyle={styles.listContent}
        numColumns={Math.floor(KDS_SCREEN.width / 400)} // Adjust based on card width
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: KDS_SCREEN.width * 0.02,
  },
  listContent: {
    paddingBottom: 20
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15
  }
});

export default AllOrdersScreen;