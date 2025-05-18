// context/OrdersContext.tsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useSound } from '../utils/sound';


export type Order = {
  orderId: number;
  items: { name: string; quantity: number }[];
  status: 'new' | 'priority' | 'completed';
  arrivalTime: string;
  tableNumber: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  urgent?: boolean;
  completedTime: string;
};

type OrdersContextType = {
  allOrders: Order[];
  priorityOrders: Order[];
  readyOrders: Order[];
  addOrder: (order: Order) => void;
  prioritizeOrder: (orderId: Number) => void;
  markAsReady: (orderId: Number) => void;
  searchOrders: (query: string, tab: number) => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Generate sample orders with realistic data
  // const generateSampleOrders = (): Order[] => {
  //   const menuItems = [
  //     'Cheeseburger', 'Chicken Sandwich', 'Caesar Salad', 
  //     'Margherita Pizza', 'Steak', 'Fish & Chips',
  //     'Vegetable Soup', 'Chocolate Cake', 'Iced Tea'
  //   ];
    
  //   const sampleOrders: Order[] = [];
  //   const now = new Date();
    
  //   for (let i = 0; i < 10; i++) {
  //     const orderTime = new Date(now.getTime() - (i * 15 * 60 * 1000));
  //     const orderType = ['dine-in', 'takeout', 'delivery'][Math.floor(Math.random() * 3)];
  //     const tableNum = orderType === 'dine-in' ? `T${Math.floor(Math.random() * 20) + 1}` : 'N/A';
      
  //     sampleOrders.push({
  //       orderId: `100${i}`,
  //       items: [
  //         {
  //           name: menuItems[Math.floor(Math.random() * menuItems.length)],
  //           quantity: Math.floor(Math.random() * 3) + 1
  //         },
  //         {
  //           name: menuItems[Math.floor(Math.random() * menuItems.length)],
  //           quantity: Math.floor(Math.random() * 2) + 1
  //         }
  //       ],
  //       status: ['new', 'preparing', 'ready'][Math.floor(Math.random() * 3)] as 'new' | 'preparing' | 'ready',
  //       arrivalTime: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       tableNumber: tableNum,
  //       orderType: orderType as 'dine-in' | 'takeout' | 'delivery',
  //       urgent: Math.random() > 0.8 // 20% chance of being urgent
  //     });
  //   }
    
  //   return sampleOrders;
  // };

  // Initialize state with sample data
  // const initialOrders = generateSampleOrders();
  // const [allOrders, setAllOrders] = useState<Order[]>(initialOrders.filter(o => !o.urgent && o.status !== 'ready'));
  // const [priorityOrders, setPriorityOrders] = useState<Order[]>(initialOrders.filter(o => o.urgent));
  // const [readyOrders, setReadyOrders] = useState<Order[]>(initialOrders.filter(o => o.status === 'ready'));

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [priorityOrders, setPriorityOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const prevOrderCountRef = useRef(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const { playSound } = useSound();
  
  const newOrders = async () => {
    await playSound('new_order');

  }
  // Rest of your context functions remain the same
  const addOrder = (order: Order) => {
    setAllOrders(prev => [...prev, order]);
  };

  const prioritizeOrder = (orderId: Number) => {
    const order = allOrders.find(o => o.orderId === orderId);
    if (order) {
      markAsPriority(orderId);
      setPriorityOrders(prev => [...prev, {...order, status: 'priority', urgent: true}]);
      setAllOrders(prev => prev.filter(o => o.orderId !== orderId));
    }
  };

  const markAsReady = (orderId: Number) => {
    const order = allOrders.find(o => o.orderId === orderId) || 
                  priorityOrders.find(o => o.orderId === orderId);
    if (order) {
      markAsCompleted(orderId);
      setReadyOrders(prev => [...prev, {...order, status: 'completed'}]);
      setAllOrders(prev => prev.filter(o => o.orderId !== orderId));
      setPriorityOrders(prev => prev.filter(o => o.orderId !== orderId));
    }
  };

  const searchOrders = (query: string, tab: number) => {
    let curList : Order[];
    const newOrders = allOrders.filter(e => e.status.toLowerCase() === 'new');
      switch (tab) {
        case 0:
          curList = newOrders;
          break;
        case 1:
          curList = priorityOrders;
          break;
        case 2:
          curList = readyOrders;
          break;
        default:
          curList = newOrders;
      }

      return curList.filter(order =>
        order.items.some(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        ) ||
        order.orderId.includes(query)
      );
    // return allOrders.concat(priorityOrders).concat(readyOrders).filter(order =>
    //   order.items.some(item => 
    //     item.name.toLowerCase().includes(query.toLowerCase())
    //   ) ||
    //   order.orderId.includes(query)
    // );

  };

  function formatTimestamp(timestamp: Date) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Uses your local timezone and format
  }

  const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8000/kds/orders');
    const apiOrders = await response.json();

    const transformedOrders: Order[] = apiOrders.map((apiOrder: any) => {
      return {
        orderId: apiOrder.id.toString(),
        items: apiOrder.order_items.map((item: any) => ({
          name: item.menu_item.name,
          quantity: item.quantity
        })),
        // status: apiOrder.status === 'pending' ? 'new' : apiOrder.status, // Map backend status to frontend
        status: apiOrder.status, // Map backend status to frontend
        arrivalTime: new Date(apiOrder.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        tableNumber: '2', // You can update this when your backend provides it
        orderType: 'dine-in', // Same here; adjust based on backend support
        urgent: apiOrder.status === 'priority' ? true : false,
        completedTime: formatTimestamp(apiOrder.updated_at),
      };
    });

    const currentOrderCount = transformedOrders.length;
    
    // Compare with previous count
    if (currentOrderCount > prevOrderCountRef.current) {
      // Play sound alert for new order
      newOrders()
      console.log('New order arrived!');
    }
    
    // Update the ref with the current count for next comparison
    prevOrderCountRef.current = currentOrderCount;

    console.log('Previous order count:', prevOrderCountRef.current);
    console.log('Current order count:', currentOrderCount);

    setAllOrders(transformedOrders.filter(o => !o.urgent && o.status !== 'completed'));
    setPriorityOrders(transformedOrders.filter(o => o.urgent));
    setReadyOrders(transformedOrders.filter(o => o.status === 'completed'));

  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

  useEffect(() => {
    const handleFirstInteraction = () => {
      // Play a silent sound to warm up the audio context
      newOrders().catch(() => {});
      setAudioEnabled(true);
      
      // Remove the event listener after the first interaction
      document.removeEventListener('mousemove', handleFirstInteraction);
    };

    document.addEventListener('mousemove', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('mousemove', handleFirstInteraction);
    };
  }, []);

const markAsCompleted = async (id: Number) => {
  try {
    await getCRSF();
    const xsrfToken = getCRSFSaved();

    const response = await fetch(`http://localhost:8000/kds/orders/completed/${id}`, {
      method: "POST",
      credentials: 'include',  
      headers: {
        'Content-Type': 'application/json', // Add this
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const contentType = response.headers.get("Content-Type");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status}\n${errorText}`);
    }

    if (contentType && contentType.includes("application/json")) {
      fetchOrders();
      const data = await response.json();
      console.log("Success:", data);
    } else {
      const text = await response.text();
      console.warn("Received non-JSON response:", text);
    }

  } catch (error) {
    console.error("Error:", error);
  }
};

const markAsPriority = async (id: Number) => {
  try {
    await getCRSF();
    const xsrfToken = getCRSFSaved();

    const response = await fetch(`http://localhost:8000/kds/orders/priority/${id}`, {
      method: "POST",
      credentials: 'include',  
      headers: {
        'Content-Type': 'application/json', // Add this
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const contentType = response.headers.get("Content-Type");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status}\n${errorText}`);
    }

    if (contentType && contentType.includes("application/json")) {
      fetchOrders();
      const data = await response.json();
      console.log("Success:", data);
    } else {
      const text = await response.text();
      console.warn("Received non-JSON response:", text);
    }

  } catch (error) {
    console.error("Error:", error);
  }
};

const getCRSF = async () => {
  const csrfResponse = await fetch('//localhost:8000/sanctum/csrf-cookie', {
    credentials: 'include',
    mode: 'cors',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
  }); 

  if (!csrfResponse.ok) throw new Error('CSRF fetch failed');
};

const getCRSFSaved = () => {
  const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
  if (!rawXsrfToken) {
      console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
      throw new Error('CSRF Token not found in cookies.');
  }
  const xsrfToken = decodeURIComponent(rawXsrfToken); 
  console.log('XSRF Token:', xsrfToken);
  return xsrfToken;
}

  useEffect(() => {
    getCRSF();
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