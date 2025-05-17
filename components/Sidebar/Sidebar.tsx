import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { KDS_SCREEN, kdsFontSize } from '../../constants/Screen';
import { useOrders } from '../../context/OrdersContext';

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, onLogout }) => {
  const { allOrders, priorityOrders, readyOrders } = useOrders();

  if (!visible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { fontSize: kdsFontSize(20) }]}>
            Kitchen Dashboard
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { fontSize: kdsFontSize(24) }]}>
              {allOrders.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: kdsFontSize(14) }]}>
              Pending
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { fontSize: kdsFontSize(24) }]}>
              {priorityOrders.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: kdsFontSize(14) }]}>
              Priority
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { fontSize: kdsFontSize(24) }]}>
              {readyOrders.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: kdsFontSize(14) }]}>
              Ready
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {/* Add menu items here */}
        </View>

        <TouchableOpacity 
          onPress={onLogout}
          style={styles.logoutButton}
        >
          <Text style={[styles.logoutText, { fontSize: kdsFontSize(16) }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: KDS_SCREEN.width * 0.25,
    backgroundColor: '#2c3e50',
    zIndex: 2,
    padding: KDS_SCREEN.width * 0.02
  },
  sidebarHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
    paddingBottom: KDS_SCREEN.height * 0.02,
    marginBottom: KDS_SCREEN.height * 0.02
  },
  sidebarTitle: {
    color: '#fff',
    fontWeight: 'bold'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: KDS_SCREEN.height * 0.03
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#bdc3c7'
  },
  menuContainer: {
    flex: 1
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: KDS_SCREEN.height * 0.015,
    alignItems: 'center'
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default React.memo(Sidebar);