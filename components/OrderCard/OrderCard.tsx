import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KDS_SCREEN, kdsFontSize, KDS_TOUCH } from '../../constants/Screen';
import { Order, useOrders } from '../../context/OrdersContext';

type OrderCardProps = {
  order: Order;
  onPriorityPress?: () => void;
  onReadyPress?: () => void;
  arrivalTime: string;
  tableNumber: string;
  orderType: string;
  showActions?: boolean;
  showPriorityButton?: boolean;
  showReadyButton?: boolean;
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPriorityPress = () => {},
  onReadyPress = () => {},
  arrivalTime,
  tableNumber,
  orderType,
  showActions = true,
  showPriorityButton = true,
  showReadyButton = true
}) => {
  const statusColors = {
    new: '#f39c12',
    pending: '#f39c12',
    preparing: '#3498db',
    ready: '#2ecc71'
  };

  return (
    <View style={[
      styles.card,
      order.urgent && styles.urgentCard,
      { width: KDS_SCREEN.width * 0.3,
        height: KDS_SCREEN.height * 0.4
       }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: kdsFontSize(18) }]}>
          #{order.orderId}
           {/* • {tableNumber} */}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Order Details */}
      {/* <View style={styles.details}>
        <Text style={[styles.detailText, { fontSize: kdsFontSize(12) }]}>
          {arrivalTime} • {orderType.toUpperCase()}
        </Text>
      </View> */}

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <Text 
            key={`${order.orderId}-${index}`}
            style={[styles.itemText, { fontSize: kdsFontSize(14) }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.buttonContainer}>
          {showPriorityButton && (
            <TouchableOpacity
              onPress={onPriorityPress}
              style={[styles.button, styles.priorityButton]}
              hitSlop={KDS_TOUCH.hitSlop}
            >
              <Text style={styles.buttonText}>PRIORITIZE</Text>
            </TouchableOpacity>
          )}
          {showReadyButton && (
            <TouchableOpacity
              onPress={onReadyPress}
              style={[styles.button, styles.readyButton]}
              hitSlop={KDS_TOUCH.hitSlop}
            >
              <Text style={styles.buttonText}>READY</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: KDS_TOUCH.padding * 1.5,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent: 'space-between',
  },
  urgentCard: {
    borderWidth: 2,
    borderColor: '#e74c3c',
    backgroundColor: '#fff0f0'
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8
  },
  title: {
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 5,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: kdsFontSize(10)
  },
  details: {
    marginBottom: 8
  },
  detailText: {
    color: '#7f8c8d'
  },
  itemsContainer: {
    flex: 1,
    marginVertical: 8
  },
  itemText: {
    marginVertical: 2,
    color: '#34495e'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  button: {
    paddingVertical: KDS_TOUCH.padding,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: KDS_TOUCH.minWidth
  },
  priorityButton: {
    backgroundColor: '#f1c40f'
  },
  readyButton: {
    backgroundColor: '#2ecc71'
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: kdsFontSize(12)
  }
});

export default React.memo(OrderCard);