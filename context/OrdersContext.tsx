// context/OrdersContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Order = {
  orderId: string;
  items: { name: string; quantity: number }[];
  status: 'new' | 'pending' | 'preparing' | 'ready';
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

  const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8000/kds/orders');
    const apiOrders = await response.json();
    
    // Transform API data to frontend format
    const transformedOrders = apiOrders.reduce((acc: any[], apiItem: any) => {
      // Find existing order or create new one
      let order = acc.find((o: { orderId: string; }) => o.orderId === apiItem.order_id.toString());
      
      if (!order) {
        order = {
          orderId: apiItem.order_id.toString(),
          // tableNumber: apiItem.order.table_number || 'take-out', // Add appropriate field
          tableNumber: '2', // Add appropriate field
          orderType: 'dine-in',  // Add appropriate field
          items: [],
          status: apiItem.status,
          // status: 'new',
          createdAt: new Date(apiItem.order.created_at),
          totalPrice: apiItem.order.total_price,
          priority: false // Initial priority state
        };
        acc.push(order);
      }

      // Add menu item to order
      order.items.push({
        id: apiItem.menu_item.id.toString(),
        name: apiItem.menu_item.name,
        quantity: apiItem.quantity,
        price: apiItem.price,
        notes: apiItem.special_instructions || '', // Add if available
        imageUrl: apiItem.menu_item.image_url
      });

      return acc;
    }, []);

    setAllOrders(transformedOrders);
    // Update other states based on transformed data
    setPriorityOrders(transformedOrders.filter((order: { priority: any; }) => order.priority));
    setReadyOrders(transformedOrders.filter((order: { status: string; }) => order.status === 'ready'));

  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
    console.log('allOrders')
    console.log(allOrders)
  }, [allOrders]);

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