# 📊 Google Sheet 整合說明

本專案支援從 Google Sheet 讀取扭蛋和獎池資料，圖片使用連結方式。

---

## 🎯 功能特色

- ✅ 從 Google Sheet 讀取扭蛋設定
- ✅ 從 Google Sheet 讀取獎池資料
- ✅ 圖片使用連結（支援任何圖床）
- ✅ 5 分鐘自動緩存
- ✅ 自動備援到本地 JSON
- ✅ 無需重新部署即可更新內容

---

## 📋 前置準備

### 1. 建立 Google Sheet

1. 前往 [Google Sheets](https://sheets.google.com/)
2. 建立新試算表
3. 命名為「扭蛋遊戲資料」或您喜歡的名稱

### 2. 設定分頁

建立以下分頁（Sheet）：

- **扭蛋設定** - 定義扭蛋類型
- **獎池30元** - 30元扭蛋的獎池
- **獎池50元** - 50元扭蛋的獎池
- **獎池100元** - 100元扭蛋的獎池

---

## 📊 Sheet 格式規範

### 分頁 1：扭蛋設定

| A (id) | B (name) | C (price) | D (pool) |
|--------|----------|-----------|----------|
| egg30  | 30元扭蛋  | 30        | pool30   |
| egg50  | 50元扭蛋  | 50        | pool50   |
| egg100 | 100元扭蛋 | 100       | pool100  |

**欄位說明：**
- **id**: 唯一識別碼（英文）
- **name**: 顯示名稱（中文）
- **price**: 扭蛋價格（數字）
- **pool**: 對應的獎池名稱（需與配置一致）

### 分頁 2-4：獎池資料

每個獎池分頁格式相同：

| A (name) | B (prob) | C (price) | D (image) | E (isJackpot) |
|----------|----------|-----------|-----------|---------------|
| 小魚乾     | 0.50     | 10        | https://... | FALSE |
| 貓薄荷     | 0.30     | 25        | https://... | FALSE |
| 貓罐頭     | 0.15     | 50        | https://... | FALSE |
| 黃金貓罐   | 0.05     | 300       | https://... | TRUE  |

**欄位說明：**
- **name**: 獎品名稱
- **prob**: 中獎機率（0-1 之間，所有機率總和必須為 1）
- **price**: 獎品價值
- **image**: 圖片連結（完整 URL）
- **isJackpot**: 是否為大獎（TRUE/FALSE）

---

## 🌐 圖片連結來源

### 推薦的圖床服務

#### 1. Imgur（推薦）
- 網址：https://imgur.com/
- 免費、穩定、支援直連
- 上傳後右鍵複製圖片網址

**範例：**
```
https://i.imgur.com/xxxxx.png
```

#### 2. ImgBB
- 網址：https://imgbb.com/
- 免費、無需註冊
- 提供直連 URL

**範例：**
```
https://i.ibb.co/xxxxx/image.png
```

#### 3. Google Drive（需公開）
- 上傳圖片到 Google Drive
- 右鍵 → 取得連結 → 設定為「知道連結的任何人」
- 使用以下格式：

**原始連結：**
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

**轉換為直連：**
```
https://drive.google.com/uc?export=view&id=FILE_ID
```

#### 4. GitHub（開發者推薦）
- 放在 GitHub 倉庫的 public 資料夾
- 使用 raw.githubusercontent.com

**範例：**
```
https://raw.githubusercontent.com/username/repo/main/images/fish.png
```

### 測試圖片連結

確保圖片 URL：
- ✅ 直接指向圖片檔案（.png, .jpg, .gif, .webp）
- ✅ 不需要登入即可訪問
- ✅ 沒有防盜鏈限制
- ✅ HTTPS 協議

---

## 🔑 設定 API 金鑰

### 1. 取得 Google API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用「Google Sheets API」
   - 前往「API 和服務」→「程式庫」
   - 搜尋「Google Sheets API」
   - 點擊「啟用」
4. 建立憑證
   - 前往「API 和服務」→「憑證」
   - 點擊「建立憑證」→「API 金鑰」
   - 複製 API 金鑰

### 2. 限制 API 金鑰（建議）

1. 點擊剛建立的 API 金鑰
2. 應用程式限制：選擇「HTTP 參照網址」
3. 新增您的網域：
   ```
   https://gatchaegg-backend.onrender.com/*
   ```
4. API 限制：選擇「限制金鑰」
5. 勾選「Google Sheets API」
6. 儲存

### 3. 公開 Google Sheet

1. 開啟您的 Google Sheet
2. 點擊右上角「共用」
3. 變更為「知道連結的任何人」
4. 權限設為「檢視者」
5. 完成

---

## ⚙️ 配置設定

### 1. 取得 Spreadsheet ID

從 Google Sheet URL 中取得：

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
                                        ^^^^^^^^^^^^^^^^
```

複製這段 ID。

### 2. 修改配置檔案

編輯 `server/gacha/googleSheetConfig.json`：

```json
{
  "spreadsheetId": "YOUR_SPREADSHEET_ID",
  "sheets": {
    "eggs": {
      "range": "扭蛋設定!A2:D",
      "columns": ["id", "name", "price", "pool"]
    },
    "pools": {
      "pool30": "獎池30元!A2:E",
      "pool50": "獎池50元!A2:E",
      "pool100": "獎池100元!A2:E"
    }
  },
  "poolColumns": ["name", "prob", "price", "image", "isJackpot"]
}
```

**重要：** 將 `YOUR_SPREADSHEET_ID` 替換成您的 Spreadsheet ID

### 3. 設定環境變數

#### 本地開發

在 `server/.env` 添加：

```env
USE_GOOGLE_SHEET=true
GOOGLE_API_KEY=your_api_key_here
```

#### Render 部署

1. 前往 Render Dashboard
2. 選擇您的服務
3. Settings → Environment
4. 添加環境變數：

| Key | Value |
|-----|-------|
| `USE_GOOGLE_SHEET` | `true` |
| `GOOGLE_API_KEY` | 您的 API 金鑰 |

5. Save Changes（會自動重新部署）

---

## 🚀 啟用功能

### 方法一：環境變數（推薦）

設定 `USE_GOOGLE_SHEET=true` 即啟用。

### 方法二：切換模式

- `USE_GOOGLE_SHEET=true` - 使用 Google Sheet
- `USE_GOOGLE_SHEET=false` 或未設定 - 使用本地 JSON

### 啟動伺服器

```bash
cd server

# 使用 Google Sheet
USE_GOOGLE_SHEET=true GOOGLE_API_KEY=your_key npm start

# 使用本地 JSON
npm start
```

---

## 🧪 測試

### 1. 檢查伺服器日誌

啟動時應該看到：

```
📊 使用 Google Sheet 作為資料來源
✅ Google Sheets API 已初始化
✅ 從 Google Sheet 讀取 3 個扭蛋類型
✅ 從 Google Sheet 讀取 pool30 (4 個獎品)
```

### 2. 測試 API

```bash
# 測試扭蛋列表
curl https://your-backend-url.com/api/eggs

# 測試獎池
curl https://your-backend-url.com/api/pool/egg30
```

### 3. 前端測試

1. 訪問遊戲網址
2. 查看「查看獎池」功能
3. 確認圖片正確顯示
4. 測試抽卡功能

---

## 🔄 更新資料

### 即時更新流程

1. 編輯 Google Sheet
2. 修改扭蛋或獎池資料
3. 等待 5 分鐘（緩存過期）
4. 或重啟伺服器立即生效
5. **無需重新部署！**

### 手動清除緩存

如需立即生效，可以重啟 Render 服務：

1. Render Dashboard → 選擇服務
2. Manual Deploy → Deploy latest commit

---

## 💡 Google Sheet 範本

### 複製範本

我們提供了完整的範本供您使用：

**範本連結：** [建立中...]

**使用方式：**
1. 開啟範本
2. 檔案 → 建立副本
3. 修改內容
4. 設定為公開（檢視者）
5. 複製 Spreadsheet ID
6. 更新配置檔案

---

## 🔧 進階設定

### 自訂分頁名稱

修改 `googleSheetConfig.json`：

```json
{
  "sheets": {
    "eggs": {
      "range": "您的分頁名稱!A2:D",
      "columns": ["id", "name", "price", "pool"]
    }
  }
}
```

### 新增扭蛋類型

1. 在 Google Sheet 新增分頁（例如：獎池200元）
2. 填入獎品資料
3. 更新配置檔案：

```json
{
  "pools": {
    "pool30": "獎池30元!A2:E",
    "pool50": "獎池50元!A2:E",
    "pool100": "獎池100元!A2:E",
    "pool200": "獎池200元!A2:E"
  }
}
```

4. 在「扭蛋設定」分頁新增對應扭蛋

### 調整緩存時間

修改 `googleSheetEngine.js`：

```javascript
const CACHE_DURATION = 10 * 60 * 1000; // 改為 10 分鐘
```

---

## ❓ 常見問題

### Q: 為什麼選擇圖片連結而不是上傳？

**A:** 使用連結的優點：
- ✅ 無需處理文件上傳
- ✅ 可使用任何圖床服務
- ✅ 更換圖片只需修改連結
- ✅ 不佔用伺服器空間
- ✅ CDN 加速載入

### Q: Google Sheet 更新後多久生效？

**A:** 最長 5 分鐘（緩存時間），或重啟伺服器立即生效。

### Q: 如果 Google Sheet API 失敗會怎樣？

**A:** 自動備援到本地 JSON 檔案，遊戲繼續運行。

### Q: 需要付費嗎？

**A:** Google Sheets API 免費配額：
- 每分鐘 100 次請求
- 每天 500 次請求
- 足夠個人專案使用

### Q: 可以不公開 Google Sheet 嗎？

**A:** 使用 API Key 方式需要公開為「知道連結的任何人」。

如需私密：
- 使用 Service Account（較複雜）
- 參考 [Google Sheets API 文檔](https://developers.google.com/sheets/api)

### Q: 圖片顯示叉叉怎麼辦？

**A:** 檢查：
1. 圖片連結是否可直接訪問
2. 是否為 HTTPS
3. 是否有防盜鏈
4. 使用瀏覽器開發者工具查看錯誤

---

## 📚 相關資源

- [Google Sheets API 文檔](https://developers.google.com/sheets/api)
- [Imgur API 文檔](https://apidocs.imgur.com/)
- [ImgBB API 文檔](https://api.imgbb.com/)

---

## ✅ 檢查清單

部署前確認：

- [ ] Google Sheet 已建立並填入資料
- [ ] 所有分頁名稱與配置檔案一致
- [ ] 機率總和為 1.0
- [ ] 圖片連結可直接訪問
- [ ] Google Sheet 已設為公開
- [ ] 已取得 Spreadsheet ID
- [ ] 已取得 Google API Key
- [ ] 環境變數已設定
- [ ] 配置檔案已更新
- [ ] 測試 API 正常

---

## 🎉 完成！

現在您可以：
- 📊 在 Google Sheet 管理遊戲資料
- 🖼️ 使用圖床服務管理圖片
- 🔄 即時更新無需部署
- 📱 分享 Sheet 連結給團隊

享受便捷的資料管理！✨

