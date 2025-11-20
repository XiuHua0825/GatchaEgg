import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取資料
const eggs = JSON.parse(fs.readFileSync(path.join(__dirname, 'eggs.json'), 'utf8'));
const pools = JSON.parse(fs.readFileSync(path.join(__dirname, 'pools.json'), 'utf8'));

// ========== 固定循環池系統 ==========

// 循環池配置
const POOL_SIZE = 20000; // 每個循環池的大小

// 儲存每個獎池的循環池狀態
// 格式：{ poolName: { items: [], currentIndex: 0 } }
const cyclePoolStates = {};

/**
 * 生成固定循環池
 * @param {Array} poolConfig - 獎池配置（來自 pools.json）
 * @returns {Array} 循環池陣列
 */
function generateCyclePool(poolConfig) {
  if (!Array.isArray(poolConfig) || poolConfig.length === 0) {
    return [];
  }

  const cyclePool = [];
  
  // 步驟 1：保底 - 每個獎項至少加入一次
  poolConfig.forEach(item => {
    cyclePool.push({
      name: item.name,
      price: item.price,
      image: item.image,
      isJackpot: item.isJackpot || false
    });
  });

  // 步驟 2：計算剩餘空間
  const remainingSlots = POOL_SIZE - cyclePool.length;
  
  if (remainingSlots > 0) {
    // 步驟 3：根據權重分配剩餘空間
    const totalWeight = poolConfig.reduce((sum, item) => sum + item.prob, 0);
    
    poolConfig.forEach(item => {
      // 根據權重計算應該有多少個
      const count = Math.floor((item.prob / totalWeight) * remainingSlots);
      
      for (let i = 0; i < count; i++) {
        cyclePool.push({
          name: item.name,
          price: item.price,
          image: item.image,
          isJackpot: item.isJackpot || false
        });
      }
    });
  }

  // 步驟 4：如果還有空位（因為取整數導致），隨機填補
  while (cyclePool.length < POOL_SIZE) {
    const randomItem = poolConfig[Math.floor(Math.random() * poolConfig.length)];
    cyclePool.push({
      name: randomItem.name,
      price: randomItem.price,
      image: randomItem.image,
      isJackpot: randomItem.isJackpot || false
    });
  }

  // 步驟 5：洗亂（Fisher-Yates shuffle）
  for (let i = cyclePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cyclePool[i], cyclePool[j]] = [cyclePool[j], cyclePool[i]];
  }

  return cyclePool;
}

/**
 * 獲取或初始化循環池
 * @param {string} poolName - 獎池名稱
 * @returns {Object} 循環池狀態
 */
function getCyclePoolState(poolName) {
  // 如果循環池不存在或已抽完，重新生成
  if (!cyclePoolStates[poolName] || 
      cyclePoolStates[poolName].currentIndex >= cyclePoolStates[poolName].items.length) {
    
    const poolConfig = pools[poolName];
    if (!poolConfig) {
      throw new Error(`找不到獎池配置: ${poolName}`);
    }

    cyclePoolStates[poolName] = {
      items: generateCyclePool(poolConfig),
      currentIndex: 0
    };
    
    console.log(`[循環池] ${poolName} 已重新生成，共 ${cyclePoolStates[poolName].items.length} 個獎項`);
  }

  return cyclePoolStates[poolName];
}

/**
 * 從循環池中抽取一個獎項
 * @param {string} poolName - 獎池名稱
 * @returns {Object} 抽中的獎項
 */
function drawOneFromCyclePool(poolName) {
  const state = getCyclePoolState(poolName);
  
  // 取得當前位置的獎項
  const item = state.items[state.currentIndex];
  
  // 移動到下一個位置
  state.currentIndex++;
  
  // 如果抽完整個循環，記錄日誌
  if (state.currentIndex >= state.items.length) {
    console.log(`[循環池] ${poolName} 已完成一輪循環（${state.items.length} 抽）`);
  }
  
  return item;
}

/**
 * 執行 N 次抽卡（使用固定循環池）
 * @param {string} eggType - 蛋的 ID
 * @param {number} count - 抽卡次數
 * @returns {Array} 抽卡結果陣列
 */
export function performGacha(eggType, count) {
  const egg = eggs.find(e => e.id === eggType);
  if (!egg) {
    throw new Error(`找不到蛋類型: ${eggType}`);
  }

  const poolName = egg.pool;
  if (!pools[poolName]) {
    throw new Error(`找不到獎池: ${poolName}`);
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(drawOneFromCyclePool(poolName));
  }

  return results;
}

/**
 * 計算總價值
 * @param {Array} results - 抽卡結果
 * @returns {number} 總價值
 */
export function calculateTotal(results) {
  return results.reduce((sum, item) => sum + item.price, 0);
}

/**
 * 取得所有蛋的資訊
 * @returns {Array} 蛋的列表
 */
export function getEggs() {
  return eggs;
}

/**
 * 取得指定獎池的資訊
 * @param {string} poolName - 獎池名稱
 * @returns {Array} 獎池內容
 */
export function getPool(poolName) {
  return pools[poolName] || [];
}

/**
 * 根據扭蛋 ID 取得對應獎池
 * @param {string} eggId - 扭蛋 ID
 * @returns {Array} 獎池內容
 */
export function getPoolByEggId(eggId) {
  const egg = eggs.find(e => e.id === eggId);
  if (!egg) return [];
  return pools[egg.pool] || [];
}

