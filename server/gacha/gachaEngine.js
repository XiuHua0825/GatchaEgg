import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取資料
const eggs = JSON.parse(fs.readFileSync(path.join(__dirname, 'eggs.json'), 'utf8'));
const pools = JSON.parse(fs.readFileSync(path.join(__dirname, 'pools.json'), 'utf8'));

/**
 * 根據機率抽取一個品項
 * @param {Array} pool - 品項池
 * @returns {Object} 抽中的品項
 */
function drawOne(pool) {
  // 防止空陣列
  if (!Array.isArray(pool) || pool.length === 0) return null;

  // 將 prob 當作權重，先求總和，再用 random * total 來抽取
  const totalWeight = pool.reduce((sum, item) => sum + (typeof item.prob === 'number' ? item.prob : 0), 0);

  // 若總權重為 0，回傳最後一個作為保護機制
  if (totalWeight <= 0) {
    const lastItem = pool[pool.length - 1];
    return {
      name: lastItem.name,
      price: lastItem.price,
      image: lastItem.image,
      isJackpot: lastItem.isJackpot || false
    };
  }

  const random = Math.random() * totalWeight;
  let cumulative = 0;

  for (const item of pool) {
    cumulative += (typeof item.prob === 'number' ? item.prob : 0);
    if (random < cumulative) {
      return {
        name: item.name,
        price: item.price,
        image: item.image,
        isJackpot: item.isJackpot || false
      };
    }
  }

  // 因為數值誤差導致沒命中時，返回最後一個
  const lastItem = pool[pool.length - 1];
  return {
    name: lastItem.name,
    price: lastItem.price,
    image: lastItem.image,
    isJackpot: lastItem.isJackpot || false
  };
}

/**
 * 執行 N 次抽卡
 * @param {string} eggType - 蛋的 ID
 * @param {number} count - 抽卡次數
 * @returns {Array} 抽卡結果陣列
 */
export function performGacha(eggType, count) {
  const egg = eggs.find(e => e.id === eggType);
  if (!egg) {
    throw new Error(`找不到蛋類型: ${eggType}`);
  }

  const pool = pools[egg.pool];
  if (!pool) {
    throw new Error(`找不到獎池: ${egg.pool}`);
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(drawOne(pool));
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

