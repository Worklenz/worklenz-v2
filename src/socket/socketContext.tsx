import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from './config';
import logger from '@/utils/errorLogger';
import { Modal } from 'antd';
import { SocketEvents } from '@/shared/socket-events';
import { getUserSession } from '@/utils/session-helper';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  modalContextHolder: React.ReactElement<any>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const profile = getUserSession(); // Adjust based on your Redux structure

  // Initialize socket connection
  useEffect(() => {
    // Only create a new socket if one doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_CONFIG.url, {
        ...SOCKET_CONFIG.options,
        autoConnect: false, // Prevent auto connection
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    const socket = socketRef.current;

    // Set up event listeners before connecting
    socket.on('connect', () => {
      logger.info('Socket connected');
      setConnected(true);
    });

    // Emit login event
    if (profile && profile.id) {
      socket.emit(SocketEvents.LOGIN.toString(), profile.id);
      socket.once(SocketEvents.LOGIN.toString(), () => {
        logger.info('Socket login success');
      });
    }

    socket.on('connect_error', error => {
      logger.error('Connection error', { error });
      setConnected(false);
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected');
      setConnected(false);

      // Emit logout event
      if (profile && profile.id) {
        socket.emit(SocketEvents.LOGOUT.toString(), profile.id);
      }
    });

    // Add team-related socket events
    socket.on(SocketEvents.INVITATIONS_UPDATE.toString(), (message: string) => {
      logger.info(message);
    });

    socket.on(
      SocketEvents.TEAM_MEMBER_REMOVED.toString(),
      (data: { teamId: string; message: string }) => {
        if (!data) return;

        if (profile && profile.team_id === data.teamId) {
          modal.confirm({
            title: 'You no longer have permissions to stay on this team!',
            content: data.message,
            closable: false,
            cancelButtonProps: { disabled: true },
            onOk: () => window.location.reload(),
          });
        }
      }
    );

    // Connect after setting up listeners
    socket.connect();

    // Cleanup function
    return () => {
      if (socket) {
        // Remove all listeners first
        socket.off('connect');
        socket.off('connect_error');
        socket.off('disconnect');
        socket.off(SocketEvents.INVITATIONS_UPDATE.toString());
        socket.off(SocketEvents.TEAM_MEMBER_REMOVED.toString());
        socket.removeAllListeners();

        // Then close the connection
        socket.close();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

  const value = {
    socket: socketRef.current,
    connected,
    modalContextHolder: contextHolder,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
