'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  lastMessage: any;
  setLastMessage: React.Dispatch<React.SetStateAction<any>>;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null, lastMessage: null, isConnected: false, setLastMessage: () => {} });

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('[WebSocket] Initializing connection...');
    
    const socketInstance = io('', {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    socketInstance.on('connect', () => {
      console.log('[WebSocket] Connected successfully');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('ws', (data) => {
      console.log('[WebSocket] Received OCR progress:', data);
      setLastMessage(data);
    });

    setSocket(socketInstance);

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      socketInstance.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, lastMessage, setLastMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
