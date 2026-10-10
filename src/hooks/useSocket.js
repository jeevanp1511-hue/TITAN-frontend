import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = ({ networkId, onAllocationUpdate }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('titan_token');
    if (!token) return;

    // Connect to Socket.IO server with auth token
    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      if (networkId) {
        socket.emit('network:join', { networkId });
      }
    });

    socket.on('allocation:updated', (data) => {
      if (onAllocationUpdate) {
        onAllocationUpdate(data);
      }
    });

    socket.on('error', (err) => {
      console.warn('[Socket Error]:', err.message);
    });

    return () => {
      if (networkId) {
        socket.emit('network:leave', { networkId });
      }
      socket.disconnect();
    };
  }, [networkId, onAllocationUpdate]);

  return socketRef.current;
};
