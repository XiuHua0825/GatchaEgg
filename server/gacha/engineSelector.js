/**
 * 引擎選擇器 - 根據環境變數選擇資料來源
 */

const useGoogleSheet = process.env.USE_GOOGLE_SHEET === 'true';

let engine;

if (useGoogleSheet) {
  engine = await import('./googleSheetEngine.js');
} else {
  engine = await import('./gachaEngine.js');
}

export const { 
  getEggs, 
  getPool, 
  getPoolByEggId, 
  performGacha, 
  calculateTotal 
} = engine;

