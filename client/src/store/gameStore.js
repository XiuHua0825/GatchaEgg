import { create } from 'zustand';

export const useGameStore = create((set) => ({
  // 玩家資訊
  playerName: '',
  setPlayerName: (name) => set({ playerName: name }),

  // 遊戲模式
  gameMode: null, // 'single' | 'battle'
  setGameMode: (mode) => set({ gameMode: mode }),

  // 房間資訊
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),

  // 抽卡紀錄
  drawHistory: [],
  addDrawHistory: (draw) => set((state) => ({
    drawHistory: [...state.drawHistory, { ...draw, timestamp: Date.now() }]
  })),
  clearDrawHistory: () => set({ drawHistory: [] }),

  // 冷卻狀態
  isOnCooldown: false,
  cooldownRemaining: 0,
  setIsOnCooldown: (value) => set({ isOnCooldown: value }),
  setCooldownRemaining: (value) => set({ cooldownRemaining: value }),

  // 對戰結果
  battleResult: null,
  setBattleResult: (result) => set({ battleResult: result }),

  // 全服廣播訊息
  jackpotMessages: [],
  addJackpotMessage: (message) => set((state) => ({
    jackpotMessages: [...state.jackpotMessages, message].slice(-10) // 保留最新 10 條
  })),

  // 蛋的資料
  eggs: [],
  setEggs: (eggs) => set({ eggs }),

  // 重置狀態
  reset: () => set({
    currentRoom: null,
    drawHistory: [],
    isOnCooldown: false,
    cooldownRemaining: 0,
    battleResult: null
  })
}));

