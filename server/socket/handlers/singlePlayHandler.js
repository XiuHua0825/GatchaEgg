import { performGacha, calculateTotal } from '../../gacha/engineSelector.js';

const DRAW_LIMIT = 100; // 抽卡上限
const COOLDOWN_TIME = 3000; // CD 時間（毫秒）

/**
 * 處理單人模式事件
 */
export function handleSinglePlayEvents(socket, io, playerDrawCounts) {
  
  // 單人抽卡
  socket.on('single-draw', (data) => {
    const { playerName, eggType, drawCount } = data;
    
    // 檢查 CD 狀態
    const playerData = playerDrawCounts.get(socket.id) || {
      count: 0,
      cooldownUntil: 0
    };

    const now = Date.now();

    // 檢查是否在冷卻中
    if (now < playerData.cooldownUntil) {
      const remainingTime = Math.ceil((playerData.cooldownUntil - now) / 1000);
      socket.emit('single-cooldown', {
        message: '你抽太多了！請稍後再試',
        remainingTime
      });
      return;
    }

    // 重置計數（冷卻結束）
    if (now >= playerData.cooldownUntil && playerData.count >= DRAW_LIMIT) {
      playerData.count = 0;
      playerData.cooldownUntil = 0;
    }

    // 檢查是否會超過上限
    const newCount = playerData.count + parseInt(drawCount);
    if (newCount > DRAW_LIMIT) {
      socket.emit('single-cooldown', {
        message: `抽卡次數不可超過 ${DRAW_LIMIT} 次！`,
        remainingDraws: DRAW_LIMIT - playerData.count
      });
      return;
    }

    try {
      // 執行抽卡
      const results = performGacha(eggType, parseInt(drawCount));
      const total = calculateTotal(results);

      // 更新計數
      playerData.count = newCount;
      
      // 如果達到上限，啟動冷卻
      if (playerData.count >= DRAW_LIMIT) {
        playerData.cooldownUntil = now + COOLDOWN_TIME;
        playerData.count = 0; // 重置計數，下次冷卻結束後可再抽
      }

      playerDrawCounts.set(socket.id, playerData);

      // 發送結果
      socket.emit('single-result', {
        draws: results,
        total,
        currentCount: playerData.count,
        isOnCooldown: playerData.count >= DRAW_LIMIT,
        cooldownTime: playerData.count >= DRAW_LIMIT ? COOLDOWN_TIME / 1000 : 0
      });

      // 檢查大獎並廣播
      const jackpots = results.filter(item => item.isJackpot);
      jackpots.forEach(item => {
        io.emit('global-jackpot', {
          playerName,
          itemName: item.name,
          eggType,
          timestamp: Date.now()
        });
      });

      console.log(`${playerName} 抽了 ${drawCount} 次，當前計數: ${playerData.count}`);

    } catch (error) {
      console.error('單人抽卡錯誤:', error);
      socket.emit('single-error', { message: '抽卡過程發生錯誤' });
    }
  });

  // 查詢 CD 狀態
  socket.on('check-cooldown', () => {
    const playerData = playerDrawCounts.get(socket.id);
    
    if (!playerData) {
      socket.emit('cooldown-status', {
        isOnCooldown: false,
        remainingTime: 0,
        currentCount: 0
      });
      return;
    }

    const now = Date.now();
    const isOnCooldown = now < playerData.cooldownUntil;
    const remainingTime = isOnCooldown 
      ? Math.ceil((playerData.cooldownUntil - now) / 1000)
      : 0;

    socket.emit('cooldown-status', {
      isOnCooldown,
      remainingTime,
      currentCount: isOnCooldown ? 0 : playerData.count
    });
  });
}

