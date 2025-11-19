import { performGacha, calculateTotal } from '../../gacha/gachaEngine.js';

/**
 * 產生隨機房間號（6 碼）
 */
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * 處理房間相關事件
 */
export function handleRoomEvents(socket, io, rooms) {
  
  // 建立房間
  socket.on('create-room', (data) => {
    const { playerName, eggType, drawCount } = data;
    
    const roomId = generateRoomId();
    
    const room = {
      id: roomId,
      eggType,
      drawCount: parseInt(drawCount),
      player1: {
        socketId: socket.id,
        name: playerName,
        ready: true
      },
      player2: null,
      status: 'waiting' // waiting, countdown, playing, finished
    };

    rooms.set(roomId, room);
    socket.join(roomId);

    socket.emit('room-created', { 
      roomId,
      room: {
        ...room,
        yourRole: 'player1'
      }
    });

    console.log(`房間已建立: ${roomId}, 房主: ${playerName}`);
  });

  // 加入房間
  socket.on('join-room', (data) => {
    const { roomId, playerName } = data;
    
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('room-error', { message: '房間不存在' });
      return;
    }

    if (room.player2) {
      socket.emit('room-error', { message: '房間已滿' });
      return;
    }

    if (room.status !== 'waiting') {
      socket.emit('room-error', { message: '房間遊戲已開始' });
      return;
    }

    room.player2 = {
      socketId: socket.id,
      name: playerName,
      ready: true
    };

    socket.join(roomId);

    // 通知雙方玩家加入成功
    io.to(roomId).emit('room-joined', {
      room: {
        ...room,
        yourRole: socket.id === room.player1.socketId ? 'player1' : 'player2'
      }
    });

    console.log(`玩家 ${playerName} 加入房間: ${roomId}`);

    // 雙方都準備好，開始倒數
    if (room.player1 && room.player2) {
      room.status = 'countdown';
      startCountdown(roomId, room, io, rooms);
    }
  });

  // 玩家準備
  socket.on('player-ready', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('room-error', { message: '房間不存在' });
      return;
    }

    // 更新玩家準備狀態
    if (room.player1?.socketId === socket.id) {
      room.player1.ready = true;
    } else if (room.player2?.socketId === socket.id) {
      room.player2.ready = true;
    }

    // 檢查是否雙方都準備好
    if (room.player1?.ready && room.player2?.ready && room.status === 'waiting') {
      room.status = 'countdown';
      startCountdown(roomId, room, io, rooms);
    }
  });
}

/**
 * 開始倒數
 */
function startCountdown(roomId, room, io, rooms) {
  let countdown = 3;

  io.to(roomId).emit('start-countdown', { countdown });

  const timer = setInterval(() => {
    countdown--;
    
    if (countdown > 0) {
      io.to(roomId).emit('start-countdown', { countdown });
    } else {
      clearInterval(timer);
      startBattle(roomId, room, io, rooms);
    }
  }, 1000);
}

/**
 * 開始對戰
 */
function startBattle(roomId, room, io, rooms) {
  room.status = 'playing';

  io.to(roomId).emit('battle-start');

  try {
    // 為雙方執行抽卡
    const player1Draws = performGacha(room.eggType, room.drawCount);
    const player2Draws = performGacha(room.eggType, room.drawCount);

    const player1Total = calculateTotal(player1Draws);
    const player2Total = calculateTotal(player2Draws);

    // 判定勝負
    let winner = 'draw';
    if (player1Total > player2Total) {
      winner = 'player1';
    } else if (player2Total > player1Total) {
      winner = 'player2';
    }

    const result = {
      player1: {
        name: room.player1.name,
        draws: player1Draws,
        total: player1Total
      },
      player2: {
        name: room.player2.name,
        draws: player2Draws,
        total: player2Total
      },
      winner
    };

    // 檢查大獎並廣播
    checkAndBroadcastJackpots(player1Draws, room.player1.name, room.eggType, io);
    checkAndBroadcastJackpots(player2Draws, room.player2.name, room.eggType, io);

    // 發送對戰結果
    io.to(roomId).emit('battle-result', result);

    // 清理房間
    room.status = 'finished';
    setTimeout(() => {
      rooms.delete(roomId);
      console.log(`房間 ${roomId} 已清理`);
    }, 30000); // 30 秒後清理房間

  } catch (error) {
    console.error('對戰錯誤:', error);
    io.to(roomId).emit('room-error', { message: '對戰過程發生錯誤' });
  }
}

/**
 * 檢查並廣播大獎
 */
function checkAndBroadcastJackpots(draws, playerName, eggType, io) {
  const jackpots = draws.filter(item => item.isJackpot);
  
  jackpots.forEach(item => {
    io.emit('global-jackpot', {
      playerName,
      itemName: item.name,
      eggType,
      timestamp: Date.now()
    });
  });
}

