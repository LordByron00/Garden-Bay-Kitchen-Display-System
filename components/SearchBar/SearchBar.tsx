import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KDS_SCREEN, kdsFontSize, KDS_TOUCH } from '../../constants/Screen';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = "Search..." }) => {
  return (
    <View style={styles.container}>
      <Feather 
        name="search" 
        size={kdsFontSize(20)} 
        color="#888" 
        style={styles.icon} 
      />
      <TextInput
        style={[styles.input, { fontSize: kdsFontSize(16) }]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        hitSlop={KDS_TOUCH.hitSlop}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={() => onChangeText('')}
          hitSlop={KDS_TOUCH.hitSlop}
          style={styles.clearButton}
        >
          <Feather name="x" size={kdsFontSize(18)} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: KDS_SCREEN.width * 0.02,
    marginVertical: KDS_SCREEN.height * 0.01,
    marginHorizontal: KDS_SCREEN.width * 0.02,
    height: KDS_SCREEN.height * 0.06,
    elevation: 2
  },
  icon: {
    marginRight: KDS_SCREEN.width * 0.015
  },
  input: {
    flex: 1,
    color: '#333'
  },
  clearButton: {
    padding: KDS_SCREEN.width * 0.005
  }
});

export default React.memo(SearchBar);