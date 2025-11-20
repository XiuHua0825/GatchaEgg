/**
 * 廣播類型配置
 * 
 * 用於定義不同類型的廣播訊息樣式和行為
 * 可以輕鬆擴展新的廣播類型
 */

export const BROADCAST_TYPES = {
  // 大獎廣播
  JACKPOT: {
    id: 'jackpot',
    name: '大獎廣播',
    textColor: '#fff',
    displayDuration: 2500, // 停留時間（毫秒）
    repeat: false,
    repeatCount: 0,
    icon: '🎉'
  },
  
  // 對戰結果廣播
  BATTLE_RESULT: {
    id: 'battle_result',
    name: '對戰結果',
    textColor: '#fff',
    displayDuration: 3000,
    repeat: false,
    repeatCount: 0,
    icon: '⚔️'
  },

  // 系統公告（示例 - 未來可用）
  SYSTEM_ANNOUNCEMENT: {
    id: 'system_announcement',
    name: '系統公告',
    textColor: '#fff',
    displayDuration: 8000,
    repeat: false,
    repeatCount: 0,
    icon: '📢'
  },

  // 活動提醒（示例 - 未來可用）
  EVENT_NOTIFICATION: {
    id: 'event_notification',
    name: '活動提醒',
    textColor: '#fff',
    displayDuration: 7000,
    repeat: false,
    repeatCount: 0,
    icon: '🎊'
  },

  // 達成成就（示例 - 未來可用）
  ACHIEVEMENT: {
    id: 'achievement',
    name: '達成成就',
    textColor: '#fff',
    displayDuration: 6000,
    repeat: false,
    repeatCount: 0,
    icon: '🏆'
  }
};

/**
 * 獲取廣播類型配置
 * @param {string} type - 廣播類型 ID
 * @returns {object} 廣播配置物件
 */
export function getBroadcastConfig(type) {
  const normalizedType = type?.toUpperCase();
  return BROADCAST_TYPES[normalizedType] || BROADCAST_TYPES.JACKPOT;
}

/**
 * 廣播訊息結構說明
 * 
 * 所有廣播訊息應遵循以下結構：
 * {
 *   id: number,           // 唯一標識符
 *   type: string,         // 廣播類型 (jackpot, battle_result, 等)
 *   data: object,         // 訊息資料（根據類型不同而不同）
 *   timestamp: number     // 時間戳
 * }
 * 
 * 各類型的 data 結構：
 * 
 * JACKPOT:
 * {
 *   playerName: string,
 *   itemName: string,
 *   itemPrice: number,
 *   itemImage: string (可選)
 * }
 * 
 * BATTLE_RESULT:
 * {
 *   winner: string,
 *   loser: string,
 *   totalValue: number
 * }
 * 
 * SYSTEM_ANNOUNCEMENT (未來):
 * {
 *   title: string,
 *   message: string
 * }
 * 
 * EVENT_NOTIFICATION (未來):
 * {
 *   eventName: string,
 *   description: string,
 *   startTime: number
 * }
 * 
 * ACHIEVEMENT (未來):
 * {
 *   playerName: string,
 *   achievementName: string,
 *   description: string
 * }
 */

