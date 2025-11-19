import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initializeSocketIO } from './socket/socketManager.js';
import { getEggs, getPoolByEggId } from './gacha/gachaEngine.js';

const app = express();
const httpServer = createServer(app);

// 中介軟體
app.use(cors());
app.use(express.json());

// 靜態資源（圖片）
app.use('/items', express.static('public/items'));

// REST API 路由
app.get('/', (req, res) => {
  res.json({ 
    message: '多人抽蛋對戰遊戲 API',
    version: '1.0.0',
    status: 'running'
  });
});

// 取得蛋的資訊
app.get('/api/eggs', (req, res) => {
  try {
    const eggs = getEggs();
    res.json({ success: true, data: eggs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 取得指定扭蛋的獎池資訊
app.get('/api/pool/:eggId', (req, res) => {
  try {
    const { eggId } = req.params;
    const pool = getPoolByEggId(eggId);
    
    if (pool.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pool not found for this egg type' 
      });
    }
    
    res.json({ success: true, data: pool });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 初始化 Socket.IO
const io = initializeSocketIO(httpServer);

// 啟動伺服器
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 伺服器運行於 http://localhost:${PORT}`);
  console.log(`📡 Socket.IO 已啟用`);
});

export { app, io };

