// socket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8386/ws';

export const createStompClient = (token) => {
  const client = new Client({
    // Đính kèm token qua query-param
    webSocketFactory: () => new SockJS(`${SOCKET_URL}?token=${token}`),
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP]', str),
  });

  // Bật kết nối ngay
  client.activate();

  return client;
};
