# 🎰 GachaEgg - 多人抽蛋對戰遊戲

一個基於 React + Socket.IO 的即時多人抽蛋對戰遊戲，支援單人抽蛋與雙人對戰模式，具備完整的獎池系統和精美的動畫效果。

**🌐 線上遊玩：** [https://gatcha-egg.vercel.app/](https://gatcha-egg.vercel.app/)

---

## ✨ 功能特色

### 🎲 單人模式
- ✅ 自由選擇扭蛋類型與抽取數量（1/5/10抽）
- ✅ 逐個彈出的開獎動畫效果
- ✅ 即時抽卡結果顯示（名稱、價值、圖片）
- ✅ 完整的抽卡歷史紀錄
- ✅ 抽卡冷卻機制（100抽後冷卻3秒）
- ✅ 大獎全服廣播通知
- ✅ 總價值統計與顯示

### ⚔️ 對戰模式
- ✅ 房間制雙人對戰系統
- ✅ 建立房間並取得 6 碼房間號
- ✅ 快速加入房間功能
- ✅ 3 秒倒數同步開始
- ✅ 同時抽卡公平競技
- ✅ 即時對戰結果展示
- ✅ 價值比拼勝負判定
- ✅ 雙方抽卡詳情完整顯示

### 📊 獎池查看器
- ✅ 主畫面即可預覽所有扭蛋內容
- ✅ 按機率自動分類（大獎/稀有/罕見/普通）
- ✅ 詳細獎品資訊（名稱、價值、機率、圖片）
- ✅ 精美的彈窗設計
- ✅ 響應式佈局支援

### 🌟 其他功能
- ✅ 全服大獎廣播跑馬燈
- ✅ Socket.IO 即時通訊
- ✅ 響應式 UI 設計（支援手機/平板/桌面）
- ✅ 流暢的動畫效果
- ✅ 連線狀態即時顯示
- ✅ 雲端部署（Render + Vercel）

---

## 🛠️ 技術棧

### 前端技術
| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2.0 | UI 框架，採用函數式組件與 Hooks |
| **Vite** | 5.1.4 | 建置工具，快速開發體驗 |
| **Zustand** | 4.5.0 | 輕量級狀態管理，管理全局狀態 |
| **Socket.IO Client** | 4.6.1 | WebSocket 客戶端，即時通訊 |
| **React Router** | 6.22.0 | 路由管理，頁面導航 |
| **CSS3** | - | 動畫效果、漸變、響應式設計 |

### 後端技術
| 技術 | 版本 | 用途 |
|------|------|------|
| **Node.js** | 18+ | JavaScript 運行環境 |
| **Express** | 4.18.2 | Web 框架，RESTful API |
| **Socket.IO** | 4.6.1 | WebSocket 伺服器，即時通訊 |
| **CORS** | 2.8.5 | 跨域資源共享 |
| **JSON** | - | 資料儲存格式 |

### 部署平台
| 平台 | 用途 | URL |
|------|------|-----|
| **Vercel** | 前端託管 | https://gatcha-egg.vercel.app/ |
| **Render** | 後端託管 | https://gatchaegg-backend.onrender.com/ |
| **GitHub** | 代碼管理 | https://github.com/XiuHua0825/GatchaEgg |

### 開發工具
- **Git** - 版本控制
- **npm** - 套件管理
- **ESM** - ES6 模組系統
- **Cursor** - AI 輔助開發

---

## 🎮 遊戲機制詳解

### 💰 扭蛋系統

#### 扭蛋類型
遊戲提供三種不同價位的扭蛋：

| 扭蛋 | 價格 | 獎池 | 特色 |
|------|------|------|------|
| 30元扭蛋 | $30 | 基礎獎池 | 適合新手，低風險 |
| 50元扭蛋 | $50 | 中級獎池 | 平衡選擇 |
| 100元扭蛋 | $100 | 高級獎池 | 高風險高回報 |

#### 抽卡次數選擇
- **1 抽** - 單次測試手氣
- **5 抽** - 平衡選擇
- **10 抽** - 最大連抽（更多獎品）

#### 機率系統
所有獎品的中獎機率完全透明，可在獎池查看器中查看。

每個獎池包含：
- **大獎（🌟）** - 極稀有，高價值，觸發全服廣播
- **稀有（💎）** - 機率 < 15%，中等偏高價值
- **罕見（✨）** - 機率 15-35%，中等價值
- **普通（📦）** - 機率 ≥ 35%，基礎價值

#### 抽卡演算法
- 使用累積機率算法（Cumulative Probability）
- 每次抽卡獨立計算，不受前次結果影響
- 隨機數生成：`Math.random()`
- 保證公平性與透明度

### 🎬 開獎動畫

#### 動畫流程
1. **點擊抽卡** → 發送請求到後端
2. **後端計算** → 執行抽卡演算法
3. **回傳結果** → 前端接收資料
4. **逐個顯示** → 每 200ms 彈出一個獎品
5. **彈出動畫** → 從小到大、略微彈跳
6. **總價值** → 所有獎品顯示完後出現

#### 視覺效果
- **普通獎品**：白色背景，平滑淡入
- **大獎**：金色漸變背景，持續脈動
- **總價值**：紫色漸變，放大效果

### ⏰ 冷卻機制

#### CD 規則
- **抽卡限制**：累計 100 抽觸發冷卻
- **冷卻時間**：3 秒
- **計數重置**：冷卻結束後重新計算

#### 設計目的
- 防止伺服器過載
- 鼓勵合理遊玩
- 避免惡意刷取

#### 顯示方式
- 冷卻期間按鈕變灰
- 顯示剩餘秒數
- 紅色警告提示

### ⚔️ 對戰系統

#### 房間機制
- **房間號**：隨機生成 6 碼英數字
- **房間容量**：2 人（1v1 對戰）
- **房間狀態**：等待中 → 倒數中 → 對戰中 → 已結束

#### 對戰流程
```
房主建立房間
   ↓
生成房間號（例如：A3X7K2）
   ↓
玩家 2 輸入房間號加入
   ↓
雙方就緒，3 秒倒數
   ↓
倒數結束，同時抽卡
   ↓
比較總價值
   ↓
判定勝負並顯示結果
```

#### 勝負判定
- **價值高者獲勝** → 顯示 🎉 你贏了！
- **價值相同** → 顯示 🤝 平手！
- **敗者** → 顯示 😢 你輸了

#### 結果展示
- 雙方抽卡詳情並排顯示
- 勝者標記皇冠 👑
- 總價值對比高亮
- 提供再來一局 / 返回首頁選項

### 📊 獎池查看器

#### 功能說明
在首頁即可查看所有扭蛋的完整獎池資訊，無需開始遊戲。

#### 顯示內容
每個獎品展示：
- **圖片** - 獎品圖示（如有）
- **名稱** - 獎品名稱
- **價值** - 💰 價值（綠色）
- **機率** - 📊 百分比（藍色）
- **大獎標籤** - 金色閃爍（僅大獎）

#### 分類系統
自動按機率分為四個區域：
- 🌟 **大獎區** - 最稀有獎品
- 💎 **稀有區** - 機率 < 15%
- ✨ **罕見區** - 機率 15-35%
- 📦 **普通區** - 機率 ≥ 35%

#### 使用方式
1. 進入首頁
2. 往下滾動到「📊 查看獎池」
3. 點擊任一扭蛋按鈕
4. 彈窗顯示完整獎池
5. 比較不同扭蛋
6. 做出選擇

### 🌐 全服廣播

#### 觸發條件
當任何玩家抽到標記為 `isJackpot: true` 的獎品時觸發。

#### 顯示方式
- 頁面頂部彈出金色跑馬燈
- 顯示內容：「{玩家名稱} 抽到了 {獎品名稱}！」
- 自動消失時間：5 秒
- 持續閃爍動畫

#### 覆蓋範圍
- 單人模式中抽到大獎
- 對戰模式中任一玩家抽到大獎
- 所有在線玩家都會看到

---

## 📁 專案結構

```
GachaEgg/
├── 📄 README.md                      # 專案說明文件
├── 📄 完整部署教學.md                 # 部署指南
├── 📄 遊戲內容管理教學.md             # 內容管理
├── 📄 package.json                   # 根專案配置
├── 📄 vercel.json                    # Vercel 部署配置
│
├── 📂 client/                        # 前端專案
│   ├── 📄 package.json               # 前端依賴
│   ├── 📄 vite.config.js             # Vite 配置
│   ├── 📄 index.html                 # HTML 入口
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx               # React 入口
│       ├── 📄 App.jsx                # 主應用組件
│       ├── 📄 index.css              # 全局樣式
│       │
│       ├── 📂 pages/                 # 頁面組件
│       │   ├── 📄 Home.jsx           # 首頁
│       │   ├── 📄 Home.css
│       │   ├── 📄 SinglePlay.jsx    # 單人模式
│       │   ├── 📄 SinglePlay.css
│       │   ├── 📄 BattleRoom.jsx    # 對戰模式
│       │   └── 📄 BattleRoom.css
│       │
│       ├── 📂 components/            # 通用組件
│       │   ├── 📄 GachaResult.jsx   # 抽卡結果展示
│       │   ├── 📄 GachaResult.css
│       │   ├── 📄 PoolViewer.jsx    # 獎池查看器
│       │   ├── 📄 PoolViewer.css
│       │   ├── 📄 RoomCreator.jsx   # 建立房間
│       │   ├── 📄 RoomCreator.css
│       │   ├── 📄 RoomJoiner.jsx    # 加入房間
│       │   ├── 📄 RoomJoiner.css
│       │   ├── 📄 Countdown.jsx     # 倒數計時器
│       │   ├── 📄 Countdown.css
│       │   ├── 📄 BroadcastView.jsx # 大獎廣播
│       │   └── 📄 BroadcastView.css
│       │
│       ├── 📂 hooks/                 # 自訂 Hooks
│       │   └── 📄 useSocket.js      # Socket.IO Hook
│       │
│       └── 📂 store/                 # 狀態管理
│           └── 📄 gameStore.js      # Zustand Store
│
└── 📂 server/                        # 後端專案
    ├── 📄 package.json               # 後端依賴
    ├── 📄 index.js                   # Express 主程式
    ├── 📄 render.yaml                # Render 部署配置
    │
    ├── 📂 gacha/                     # 抽卡系統
    │   ├── 📄 eggs.json              # 扭蛋類型定義
    │   ├── 📄 pools.json             # 獎池與機率配置
    │   └── 📄 gachaEngine.js         # 抽卡核心演算法
    │
    ├── 📂 socket/                    # Socket.IO 處理
    │   ├── 📄 socketManager.js       # Socket 管理器
    │   └── 📂 handlers/              # 事件處理器
    │       ├── 📄 roomHandler.js     # 房間與對戰邏輯
    │       ├── 📄 singlePlayHandler.js # 單人模式邏輯
    │       └── 📄 broadcastHandler.js  # 廣播邏輯
    │
    └── 📂 public/                    # 靜態資源
        └── 📂 items/                 # 獎品圖片
            └── 📄 .gitkeep
```

---

## 🚀 快速開始

### 環境需求
- Node.js 18 或以上
- npm 或 yarn
- Git

### 本地開發

#### 1. Clone 專案
```bash
git clone https://github.com/XiuHua0825/GatchaEgg.git
cd GatchaEgg
```

#### 2. 安裝後端依賴
```bash
cd server
npm install
```

#### 3. 啟動後端伺服器
```bash
npm start
# 伺服器運行於 http://localhost:3000
```

#### 4. 安裝前端依賴（開新終端）
```bash
cd client
npm install
```

#### 5. 啟動前端開發伺服器
```bash
npm run dev
# 前端運行於 http://localhost:5173
```

#### 6. 開啟瀏覽器
訪問 `http://localhost:5173` 開始遊戲！

---

## 📡 API 文檔

### RESTful API

#### 取得所有扭蛋類型
```http
GET /api/eggs
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "egg30",
      "price": 30,
      "pool": "pool30",
      "name": "30元扭蛋"
    }
  ]
}
```

#### 取得指定扭蛋的獎池
```http
GET /api/pool/:eggId
```

**範例：**
```http
GET /api/pool/egg30
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "name": "小魚乾",
      "prob": 0.50,
      "price": 10,
      "image": "/items/fish.png",
      "isJackpot": false
    }
  ]
}
```

#### 健康檢查
```http
GET /health
```

**回應：**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-19T..."
}
```

### Socket.IO 事件

#### 單人模式事件

| 事件名稱 | 方向 | 說明 | 資料格式 |
|---------|------|------|---------|
| `single-draw` | Client → Server | 執行抽卡 | `{playerName, eggType, drawCount}` |
| `single-result` | Server → Client | 抽卡結果 | `{draws, total, currentCount, isOnCooldown}` |
| `single-cooldown` | Server → Client | 冷卻通知 | `{message, remainingTime}` |
| `check-cooldown` | Client → Server | 查詢CD狀態 | - |
| `cooldown-status` | Server → Client | CD狀態回應 | `{isOnCooldown, remainingTime}` |

#### 對戰模式事件

| 事件名稱 | 方向 | 說明 | 資料格式 |
|---------|------|------|---------|
| `create-room` | Client → Server | 建立房間 | `{playerName, eggType, drawCount}` |
| `room-created` | Server → Client | 房間建立成功 | `{roomId, room}` |
| `join-room` | Client → Server | 加入房間 | `{roomId, playerName}` |
| `room-joined` | Server → Client | 加入成功 | `{room}` |
| `start-countdown` | Server → Client | 倒數開始 | `{countdown}` |
| `battle-start` | Server → Client | 對戰開始 | - |
| `battle-result` | Server → Client | 對戰結果 | `{player1, player2, winner}` |
| `room-error` | Server → Client | 房間錯誤 | `{message}` |
| `room-closed` | Server → Client | 房間關閉 | `{message}` |

#### 全服廣播事件

| 事件名稱 | 方向 | 說明 | 資料格式 |
|---------|------|------|---------|
| `global-jackpot` | Server → All | 大獎廣播 | `{playerName, itemName, eggType, timestamp}` |
| `global-message` | Server → All | 系統訊息 | `{message, type, timestamp}` |

---

## 📊 資料格式

### eggs.json - 扭蛋類型定義

```json
[
  {
    "id": "egg30",           // 唯一識別碼
    "price": 30,             // 扭蛋價格
    "pool": "pool30",        // 對應獎池
    "name": "30元扭蛋"       // 顯示名稱
  }
]
```

### pools.json - 獎池配置

```json
{
  "pool30": [
    {
      "name": "小魚乾",              // 獎品名稱
      "prob": 0.50,                 // 中獎機率（0-1）
      "price": 10,                  // 獎品價值
      "image": "/items/fish.png",   // 圖片路徑
      "isJackpot": false            // 是否為大獎
    }
  ]
}
```

**重要提示：**
- 每個獎池的所有機率總和必須等於 1.0
- `isJackpot: true` 的獎品會觸發全服廣播
- 圖片路徑相對於 `server/public/`

---

## 🌐 部署指南

### 完整部署教學

請參閱 [完整部署教學.md](./完整部署教學.md) 獲取詳細步驟。

### 快速部署步驟

#### 1. 後端部署到 Render

1. 註冊 [Render](https://render.com/)
2. 建立 Web Service
3. 連接 GitHub 倉庫
4. 設定：
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 環境變數：
   ```
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=*
   ```
6. 部署並記下 URL

#### 2. 前端部署到 Vercel

1. 註冊 [Vercel](https://vercel.com/)
2. 導入 GitHub 倉庫
3. 設定：
   - Framework: Vite
   - Root Directory: `client`
4. 環境變數：
   ```
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
5. 部署完成！

### 環境變數說明

#### 後端環境變數
| 變數名 | 說明 | 範例 |
|--------|------|------|
| `PORT` | 伺服器埠號 | `3000` |
| `NODE_ENV` | 執行環境 | `production` |
| `CORS_ORIGIN` | CORS 設定 | `*` 或前端 URL |

#### 前端環境變數
| 變數名 | 說明 | 範例 |
|--------|------|------|
| `VITE_SOCKET_URL` | 後端 API URL | `https://backend.onrender.com` |

---

## 🎨 自訂遊戲內容

### 修改扭蛋類型

編輯 `server/gacha/eggs.json`：

```json
{
  "id": "egg200",
  "price": 200,
  "pool": "pool200",
  "name": "200元豪華扭蛋"
}
```

### 修改獎品與機率

編輯 `server/gacha/pools.json`：

```json
"pool200": [
  {
    "name": "新獎品",
    "prob": 0.30,           // 30% 機率
    "price": 150,
    "image": "/items/new.png",
    "isJackpot": false
  }
]
```

**記得確保所有機率總和為 1.0！**

### 添加圖片

1. 將圖片放入 `server/public/items/`
2. 建議格式：PNG（支援透明）
3. 建議尺寸：200x200 像素
4. 在 `pools.json` 中引用：`"/items/your-image.png"`

### 更多教學

完整的內容管理教學請參閱 [遊戲內容管理教學.md](./遊戲內容管理教學.md)

---

## 🔧 開發指南

### 技術架構

```
用戶瀏覽器
    ↓ HTTP
Vercel CDN（前端靜態文件）
    ↓ WebSocket (Socket.IO)
Render Server（後端 API）
    ↓
JSON Files（資料儲存）
```

### 狀態管理

使用 Zustand 管理全局狀態：
- `playerName` - 玩家名稱
- `eggs` - 扭蛋類型列表
- `drawHistory` - 抽卡歷史
- `currentRoom` - 當前房間資訊
- `battleResult` - 對戰結果
- `jackpotMessages` - 廣播訊息

### 抽卡演算法

```javascript
function drawOne(pool) {
  const random = Math.random(); // 0-1 隨機數
  let cumulative = 0;
  
  for (const item of pool) {
    cumulative += item.prob;
    if (random <= cumulative) {
      return item; // 中獎！
    }
  }
}
```

### Git 工作流程

```bash
# 開發新功能
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"

# 合併到主分支
git checkout main
git merge feature/new-feature
git push origin main

# 自動觸發 Render + Vercel 部署！
```

---

## 📝 更新日誌

### v1.3.0 (2025-11-19)
- ✨ 新增：獎池查看器功能
- ✨ 新增：按機率自動分類獎品
- ✨ 新增：獎品詳細資訊預覽
- 🎨 改進：精美的彈窗設計

### v1.2.0 (2025-11-19)
- ✨ 新增：逐個彈出的開獎動畫
- ✨ 新增：總價值延遲顯示效果
- 🔧 調整：CD 限制從 10 抽改為 100 抽
- 🔧 調整：冷卻時間從 5 秒改為 3 秒

### v1.1.0 (2025-11-19)
- 🐛 修復：API 請求路徑問題
- 🚀 部署：完成線上部署到 Render + Vercel
- 📝 文檔：新增完整部署教學

### v1.0.0 (2025-11-19)
- 🎉 初始版本發布
- ✅ 單人抽蛋模式
- ✅ 雙人對戰模式
- ✅ 全服大獎廣播
- ✅ Socket.IO 即時通訊

---

## 🐛 已知問題

- 若後端休眠（Render 免費方案），首次訪問需等待 30-60 秒喚醒
- 圖片資源目前使用佔位圖，需替換為實際圖片
- 對戰房間僅支援 2 人，多人模式待開發

---

## 🚧 未來計劃

### 短期計劃
- [ ] 添加音效與背景音樂
- [ ] 新增更多扭蛋類型
- [ ] 優化圖片資源
- [ ] 添加載入動畫

### 中期計劃
- [ ] 玩家等級與經驗系統
- [ ] 成就系統
- [ ] 每日簽到獎勵
- [ ] 排行榜功能

### 長期計劃
- [ ] 多人房間（3人以上）
- [ ] 觀戰模式
- [ ] Google Sheet 資料整合
- [ ] 玩家數據持久化（資料庫）
- [ ] 手機 App 版本

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下步驟：

1. Fork 本倉庫
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 提交變更：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

### 貢獻類型
- 🐛 Bug 修復
- ✨ 新功能
- 📝 文檔改進
- 🎨 UI/UX 改進
- ⚡ 效能優化

---

## 📄 授權

MIT License

Copyright (c) 2025 XiuHua0825

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

## 📞 聯絡方式

- **GitHub**: [@XiuHua0825](https://github.com/XiuHua0825)
- **專案 Issues**: [GitHub Issues](https://github.com/XiuHua0825/GatchaEgg/issues)

---

## 🙏 致謝

- React 團隊 - 優秀的 UI 框架
- Socket.IO 團隊 - 強大的即時通訊庫
- Vercel & Render - 免費的部署平台
- 所有貢獻者和玩家

---

<div align="center">

**🎰 開始遊玩：[https://gatcha-egg.vercel.app/](https://gatcha-egg.vercel.app/)**

**祝您遊戲愉快！🎉**

Made with ❤️ by XiuHua0825

</div>
