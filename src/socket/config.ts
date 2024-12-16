export const SOCKET_CONFIG = {
  url: process.env.NODE_ENV === 'production' ? '' : 'ws://localhost:3000',
  options: {
    transports: ['websocket'],
    path: '/socket.io',
    upgrade: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
};
