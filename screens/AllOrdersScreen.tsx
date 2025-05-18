import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import OrderCard from '../components/OrderCard/OrderCard';
import SearchBar from '../components/SearchBar/SearchBar';
import { KDS_SCREEN } from '../constants/Screen';
import { useSound } from '../utils/sound';


const AllOrdersScreen = () => {
  const { allOrders, prioritizeOrder, markAsReady, searchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const { playSound } = useSound();

  const filteredOrders = searchQuery ? searchOrders(searchQuery, 0) : allOrders;


    const handleReadyPress = async (orderId: number) => {
    markAsReady(orderId);
    await playSound('ready');
  };

  const handlePriorityPress = async (orderId: number) => {
    prioritizeOrder(orderId);
    await playSound('priority');
  };
  
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
            onPriorityPress={() => handlePriorityPress(item.orderId)}
            onReadyPress={() => handleReadyPress(item.orderId)} arrivalTime={''} tableNumber={''} orderType={''}          />
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
     justifyContent: 'flex-start',
    // justifyContent: 'space-between',
    marginBottom: 15
    
  }
});

export default AllOrdersScreen;