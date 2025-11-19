import { Server } from 'socket.io';
import { handleRoomEvents } from './handlers/roomHandler.js';
import { handleBroadcastEvents } from './handlers/broadcastHandler.js';
import { handleSinglePlayEvents } from './handlers/singlePlayHandler.js';

export function initializeSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // 全域狀態：房間列表
  const rooms = new Map();
  
  // 玩家抽卡計數（用於 CD 管理）
  const playerDrawCounts = new Map();

  io.on('connection', (socket) => {
    console.log(`玩家連線: ${socket.id}`);

    // 註冊事件處理器
    handleRoomEvents(socket, io, rooms);
    handleBroadcastEvents(socket, io);
    handleSinglePlayEvents(socket, io, playerDrawCounts);

    socket.on('disconnect', () => {
      console.log(`玩家斷線: ${socket.id}`);
      
      // 清理房間
      for (const [roomId, room] of rooms.entries()) {
        if (room.player1?.socketId === socket.id || room.player2?.socketId === socket.id) {
          rooms.delete(roomId);
          io.to(roomId).emit('room-closed', { message: '房間已關閉' });
          console.log(`房間 ${roomId} 已清理`);
        }
      }

      // 清理 CD 計數
      playerDrawCounts.delete(socket.id);
    });
  });

  return io;
}

