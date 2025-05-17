// context/OrdersContext.tsx
import React, { createContext, useState, useContext } from 'react';

export type Order = {
  orderId: string;
  items: { name: string; quantity: number }[];
  status: 'new' | 'preparing' | 'ready';
  arrivalTime: string;
  tableNumber: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  urgent?: boolean;
};

type OrdersContextType = {
  allOrders: Order[];
  priorityOrders: Order[];
  readyOrders: Order[];
  addOrder: (order: Order) => void;
  prioritizeOrder: (orderId: string) => void;
  markAsReady: (orderId: string) => void;
  searchOrders: (query: string) => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Generate sample orders with realistic data
  const generateSampleOrders = (): Order[] => {
    const menuItems = [
      'Cheeseburger', 'Chicken Sandwich', 'Caesar Salad', 
      'Margherita Pizza', 'Steak', 'Fish & Chips',
      'Vegetable Soup', 'Chocolate Cake', 'Iced Tea'
    ];
    
    const sampleOrders: Order[] = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const orderTime = new Date(now.getTime() - (i * 15 * 60 * 1000));
      const orderType = ['dine-in', 'takeout', 'delivery'][Math.floor(Math.random() * 3)];
      const tableNum = orderType === 'dine-in' ? `T${Math.floor(Math.random() * 20) + 1}` : 'N/A';
      
      sampleOrders.push({
        orderId: `100${i}`,
        items: [
          {
            name: menuItems[Math.floor(Math.random() * menuItems.length)],
            quantity: Math.floor(Math.random() * 3) + 1
          },
          {
            name: menuItems[Math.floor(Math.random() * menuItems.length)],
            quantity: Math.floor(Math.random() * 2) + 1
          }
        ],
        status: ['new', 'preparing', 'ready'][Math.floor(Math.random() * 3)] as 'new' | 'preparing' | 'ready',
        arrivalTime: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tableNumber: tableNum,
        orderType: orderType as 'dine-in' | 'takeout' | 'delivery',
        urgent: Math.random() > 0.8 // 20% chance of being urgent
      });
    }
    
    return sampleOrders;
  };

  // Initialize state with sample data
  const initialOrders = generateSampleOrders();
  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders.filter(o => !o.urgent && o.status !== 'ready'));
  const [priorityOrders, setPriorityOrders] = useState<Order[]>(initialOrders.filter(o => o.urgent));
  const [readyOrders, setReadyOrders] = useState<Order[]>(initialOrders.filter(o => o.status === 'ready'));

  // Rest of your context functions remain the same
  const addOrder = (order: Order) => {
    setAllOrders(prev => [...prev, order]);
  };

  const prioritizeOrder = (orderId: string) => {
    const order = allOrders.find(o => o.orderId === orderId);
    if (order) {
      setPriorityOrders(prev => [...prev, {...order, urgent: true}]);
      setAllOrders(prev => prev.filter(o => o.orderId !== orderId));
    }
  };

  const markAsReady = (orderId: string) => {
    const order = allOrders.find(o => o.orderId === orderId) || 
                  priorityOrders.find(o => o.orderId === orderId);
    if (order) {
      setReadyOrders(prev => [...prev, {...order, status: 'ready'}]);
      setAllOrders(prev => prev.filter(o => o.orderId !== orderId));
      setPriorityOrders(prev => prev.filter(o => o.orderId !== orderId));
    }
  };

  const searchOrders = (query: string) => {
    return allOrders.concat(priorityOrders).concat(readyOrders).filter(order =>
      order.items.some(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ) ||
      order.orderId.includes(query)
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        allOrders,
        priorityOrders,
        readyOrders,
        addOrder,
        prioritizeOrder,
        markAsReady,
        searchOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};