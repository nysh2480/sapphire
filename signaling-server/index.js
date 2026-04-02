import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
const rooms = new Map(); // roomId → Set<ws>

console.log('🚀 Sapphire WebRTC Signaling Server started');

wss.on('connection', (ws) => {
  console.log('✅ Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      const roomId = data.roomId;
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(ws);
      ws.roomId = roomId;
      ws.send(JSON.stringify({ type: 'joined', roomId }));
      console.log(`📌 ${roomId} に参加`);
    }

    else if (data.type === 'offer' || data.type === 'answer' || data.type === 'ice-candidate') {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.forEach(client => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(data));
          }
        });
      }
    }

    else if (data.type === 'leave') {
      if (ws.roomId && rooms.has(ws.roomId)) {
        rooms.get(ws.roomId).delete(ws);
        if (rooms.get(ws.roomId).size === 0) rooms.delete(ws.roomId);
      }
    }
  });

  ws.on('close', () => {
    if (ws.roomId && rooms.has(ws.roomId)) {
      rooms.get(ws.roomId).delete(ws);
      if (rooms.get(ws.roomId).size === 0) rooms.delete(ws.roomId);
    }
    console.log('❌ Client disconnected');
  });
});
