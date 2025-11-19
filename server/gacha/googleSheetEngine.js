import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取配置
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'googleSheetConfig.json'), 'utf8'));

// Google Sheets API 認證
let sheets = null;
let cachedEggs = null;
let cachedPools = {};
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘緩存

/**
 * 初始化 Google Sheets API
 */
async function initializeSheets() {
  if (sheets) return sheets;

  try {
    // 使用 API Key 認證（公開唯讀）
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  未設定 GOOGLE_API_KEY，將使用本地 JSON 文件作為備援');
      return null;
    }

    const auth = new google.auth.GoogleAuth({
      apiKey: apiKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API 已初始化');
    return sheets;
  } catch (error) {
    console.error('❌ Google Sheets API 初始化失敗:', error.message);
    return null;
  }
}

/**
 * 從 Google Sheet 讀取資料
 */
async function fetchFromSheet(range) {
  const api = await initializeSheets();
  if (!api) return null;

  try {
    const response = await api.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`❌ 讀取 Google Sheet 失敗 (${range}):`, error.message);
    return null;
  }
}

/**
 * 將 Sheet 行轉換為物件
 */
function rowToObject(row, columns) {
  const obj = {};
  columns.forEach((col, index) => {
    let value = row[index] || '';
    
    // 轉換資料型別
    if (col === 'price' || col === 'prob') {
      value = parseFloat(value) || 0;
    } else if (col === 'isJackpot') {
      value = value.toLowerCase() === 'true' || value === '1' || value === 'TRUE';
    }
    
    obj[col] = value;
  });
  return obj;
}

/**
 * 從 Google Sheet 或本地 JSON 讀取扭蛋資料
 */
export async function getEggs() {
  // 檢查緩存
  if (cachedEggs && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return cachedEggs;
  }

  try {
    // 嘗試從 Google Sheet 讀取
    const rows = await fetchFromSheet(config.sheets.eggs.range);
    
    if (rows && rows.length > 0) {
      cachedEggs = rows.map(row => rowToObject(row, config.sheets.eggs.columns));
      cacheTimestamp = Date.now();
      console.log(`✅ 從 Google Sheet 讀取 ${cachedEggs.length} 個扭蛋類型`);
      return cachedEggs;
    }
  } catch (error) {
    console.error('讀取 Google Sheet 扭蛋資料失敗:', error.message);
  }

  // 備援：從本地 JSON 讀取
  try {
    const eggsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'eggs.json'), 'utf8'));
    console.log('⚠️  使用本地 eggs.json 作為備援');
    return eggsJson;
  } catch (error) {
    console.error('讀取本地 eggs.json 失敗:', error);
    return [];
  }
}

/**
 * 從 Google Sheet 或本地 JSON 讀取獎池資料
 */
export async function getPool(poolName) {
  // 檢查緩存
  if (cachedPools[poolName] && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return cachedPools[poolName];
  }

  try {
    // 嘗試從 Google Sheet 讀取
    const range = config.sheets.pools[poolName];
    
    if (range) {
      const rows = await fetchFromSheet(range);
      
      if (rows && rows.length > 0) {
        cachedPools[poolName] = rows.map(row => rowToObject(row, config.poolColumns));
        cacheTimestamp = Date.now();
        console.log(`✅ 從 Google Sheet 讀取 ${poolName} (${cachedPools[poolName].length} 個獎品)`);
        return cachedPools[poolName];
      }
    }
  } catch (error) {
    console.error(`讀取 Google Sheet 獎池 ${poolName} 失敗:`, error.message);
  }

  // 備援：從本地 JSON 讀取
  try {
    const poolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'pools.json'), 'utf8'));
    console.log(`⚠️  使用本地 pools.json 的 ${poolName} 作為備援`);
    return poolsJson[poolName] || [];
  } catch (error) {
    console.error('讀取本地 pools.json 失敗:', error);
    return [];
  }
}

/**
 * 根據扭蛋 ID 取得對應獎池
 */
export async function getPoolByEggId(eggId) {
  const eggs = await getEggs();
  const egg = eggs.find(e => e.id === eggId);
  if (!egg) return [];
  return await getPool(egg.pool);
}

/**
 * 根據機率抽取一個品項
 */
function drawOne(pool) {
  const random = Math.random();
  let cumulative = 0;

  for (const item of pool) {
    cumulative += item.prob;
    if (random <= cumulative) {
      return {
        name: item.name,
        price: item.price,
        image: item.image,
        isJackpot: item.isJackpot || false
      };
    }
  }

  // 如果因為浮點數誤差沒抽到，返回最後一個
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
 */
export async function performGacha(eggType, count) {
  const eggs = await getEggs();
  const egg = eggs.find(e => e.id === eggType);
  
  if (!egg) {
    throw new Error(`找不到蛋類型: ${eggType}`);
  }

  const pool = await getPool(egg.pool);
  
  if (!pool || pool.length === 0) {
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
 */
export function calculateTotal(results) {
  return results.reduce((sum, item) => sum + item.price, 0);
}

/**
 * 清除緩存（用於手動刷新資料）
 */
export function clearCache() {
  cachedEggs = null;
  cachedPools = {};
  cacheTimestamp = null;
  console.log('🔄 Google Sheet 緩存已清除');
}

