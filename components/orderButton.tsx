import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { KDS_TOUCH, kdsFontSize } from '../constants/Screen';

const OrderButton = () => (
  <TouchableOpacity 
    style={[
      styles.button,
      {
        minWidth: KDS_TOUCH.minWidth,
        minHeight: KDS_TOUCH.minHeight,
        padding: KDS_TOUCH.padding
      }
    ]}
  >
    <Text style={styles.text}>
      FIRE APPETIZERS
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B35', // KDS orange
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: kdsFontSize(24),
    color: 'white',
    fontWeight: 'bold'
  }
});

export default OrderButton;