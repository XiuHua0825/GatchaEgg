import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('✅ Socket 已連線');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket 已斷線');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket 連線錯誤:', error);
      });
    }

    return () => {
      // 不要在這裡斷開連線，保持全局連線
    };
  }, []);

  return { socket, isConnected };
}

export function getSocket() {
  return socket;
}

