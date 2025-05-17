import { useEffect, useState } from 'react';
import { useOrders } from '../context/OrdersContext';
import { Order } from '../context/OrdersContext'; // For the type

const useWebSocket = (url: string) => {
  const { addOrder } = useOrders(); // Use the hook to get addOrder function
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ORDER') {
        const newOrder: Order = {
          orderId: data.orderId,
          items: data.items,
          status: 'new',
          arrivalTime: new Date().toLocaleTimeString(),
          tableNumber: data.tableNumber || '',
          orderType: data.orderType || 'dine-in'
        };
        addOrder(newOrder);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [url, addOrder]);

  return socket;
};

export default useWebSocket;