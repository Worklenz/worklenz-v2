export const SOCKET_CONFIG = {
  url: process.env.NODE_ENV === 'production' ? 'wss://dev.worklenz.com' : 'ws://localhost:3000',
  options: {
    transports: ['websocket'],
    path: '/socket',
    upgrade: true,
  },
};
