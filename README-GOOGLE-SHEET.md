# 🎯 Google Sheet 功能分支說明

目前在 **feature/google-sheet** 分支，此功能允許從 Google Sheet 動態讀取遊戲資料。

---

## ✨ 新增功能

✅ **從 Google Sheet 讀取扭蛋設定**  
✅ **從 Google Sheet 讀取獎池資料**  
✅ **圖片使用連結（支援任何圖床）**  
✅ **5 分鐘自動緩存機制**  
✅ **自動備援到本地 JSON**  
✅ **無需重新部署即可更新內容**

---

## 📁 新增檔案

```
server/gacha/
├── googleSheetEngine.js      # Google Sheet 資料讀取引擎
├── googleSheetConfig.json    # Google Sheet 配置檔案
├── engineSelector.js         # 自動選擇資料來源
├── GOOGLE_SHEET_TEMPLATE.md  # Sheet 範本格式
└── gachaEngine.js            # 原本的 JSON 引擎（保留）

Google-Sheet整合說明.md        # 完整使用教學
```

---

## 🔄 修改檔案

- `server/index.js` - 使用 engineSelector
- `server/socket/handlers/singlePlayHandler.js` - 使用 engineSelector
- `server/socket/handlers/roomHandler.js` - 使用 engineSelector
- `server/package.json` - 新增 googleapis 依賴

---

## 🚀 如何使用

### 1. 查看完整教學

請閱讀：[Google-Sheet整合說明.md](./Google-Sheet整合說明.md)

### 2. 快速設定

#### 本地測試

```bash
# 使用 Google Sheet
cd server
USE_GOOGLE_SHEET=true GOOGLE_API_KEY=your_key npm start

# 使用本地 JSON（預設）
npm start
```

#### Render 部署

在環境變數設定：
- `USE_GOOGLE_SHEET` = `true`
- `GOOGLE_API_KEY` = 您的 API 金鑰

---

## 📊 Google Sheet 設定步驟

### 步驟 1：建立 Google Sheet

1. 前往 https://sheets.google.com/
2. 建立新試算表
3. 建立以下分頁：
   - **扭蛋設定**
   - **獎池30元**
   - **獎池50元**
   - **獎池100元**

### 步驟 2：填入資料

參考：[server/gacha/GOOGLE_SHEET_TEMPLATE.md](./server/gacha/GOOGLE_SHEET_TEMPLATE.md)

### 步驟 3：公開 Sheet

1. 點擊「共用」
2. 變更為「知道連結的任何人」
3. 權限設為「檢視者」

### 步驟 4：取得 Spreadsheet ID

從 URL 複製：
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

### 步驟 5：取得 API Key

1. 前往 https://console.cloud.google.com/
2. 啟用 Google Sheets API
3. 建立 API 金鑰
4. 複製金鑰

### 步驟 6：更新配置

編輯 `server/gacha/googleSheetConfig.json`：

```json
{
  "spreadsheetId": "YOUR_SPREADSHEET_ID"
}
```

### 步驟 7：設定環境變數

Render Dashboard → Environment：
- `USE_GOOGLE_SHEET` = `true`
- `GOOGLE_API_KEY` = 您的金鑰

---

## 🖼️ 圖片連結設定

### 推薦圖床

1. **Imgur** - https://imgur.com/
   ```
   https://i.imgur.com/xxxxx.png
   ```

2. **ImgBB** - https://imgbb.com/
   ```
   https://i.ibb.co/xxxxx/image.png
   ```

3. **GitHub**
   ```
   https://raw.githubusercontent.com/user/repo/main/images/xxx.png
   ```

### 圖片要求

- ✅ 完整 URL（包含 https://）
- ✅ 直接指向圖片檔案
- ✅ 公開可訪問
- ✅ 無防盜鏈

---

## 🧪 測試功能

### 1. 檢查伺服器啟動

應該看到：
```
📊 使用 Google Sheet 作為資料來源
✅ Google Sheets API 已初始化
```

### 2. 測試 API

```bash
curl https://your-backend.com/api/eggs
curl https://your-backend.com/api/pool/egg30
```

### 3. 前端測試

- 開啟遊戲網站
- 查看「查看獎池」
- 確認圖片顯示
- 測試抽卡功能

---

## 🔀 分支操作

### 切換回主分支

```bash
git checkout main
```

### 切換到功能分支

```bash
git checkout feature/google-sheet
```

### 合併到主分支（測試完成後）

```bash
git checkout main
git merge feature/google-sheet
git push origin main
```

---

## ⚙️ 雙模式支援

此功能**不會影響現有系統**：

| 模式 | 啟用方式 | 資料來源 |
|------|----------|----------|
| JSON 模式 | `USE_GOOGLE_SHEET=false` 或不設定 | 本地 JSON 檔案 |
| Google Sheet 模式 | `USE_GOOGLE_SHEET=true` | Google Sheet |

- 預設使用 **JSON 模式**（向下相容）
- 設定環境變數即可切換
- Google Sheet 讀取失敗時自動備援到 JSON

---

## 📝 更新遊戲內容

### 使用 Google Sheet 模式

1. 編輯 Google Sheet
2. 等待 5 分鐘（緩存時間）
3. 或重啟服務立即生效
4. **無需重新部署！**

### 使用 JSON 模式

1. 編輯 JSON 檔案
2. 提交到 Git
3. 自動部署

---

## 🎯 優勢比較

| 特性 | JSON 模式 | Google Sheet 模式 |
|------|-----------|------------------|
| 設定難度 | ⭐ 簡單 | ⭐⭐ 中等 |
| 更新速度 | 需部署（2-3分鐘） | 即時（5分鐘緩存） |
| 圖片管理 | 需部署 | 外部連結 |
| 團隊協作 | 需 Git 權限 | 分享 Sheet 連結 |
| 技術要求 | 無 | Google API Key |
| 穩定性 | ⭐⭐⭐ 高 | ⭐⭐ 中（有備援） |

---

## ✅ 完成檢查清單

部署前確認：

- [ ] Google Sheet 已建立
- [ ] 所有資料已填入
- [ ] 機率總和為 1.0
- [ ] 圖片連結可訪問
- [ ] Sheet 已公開為檢視者
- [ ] 取得 Spreadsheet ID
- [ ] 取得 Google API Key
- [ ] 更新 googleSheetConfig.json
- [ ] 設定 Render 環境變數
- [ ] 測試 API 正常
- [ ] 前端顯示正確

---

## 📚 相關文件

- [Google-Sheet整合說明.md](./Google-Sheet整合說明.md) - 詳細教學
- [server/gacha/GOOGLE_SHEET_TEMPLATE.md](./server/gacha/GOOGLE_SHEET_TEMPLATE.md) - 範本格式
- [README.md](./README.md) - 主要專案說明

---

## 🆘 需要幫助？

遇到問題請參考：
1. [Google-Sheet整合說明.md](./Google-Sheet整合說明.md) 的常見問題章節
2. 檢查伺服器日誌
3. 確認環境變數設定
4. 測試 Google Sheet 是否公開
5. 驗證 API Key 是否正確

---

## 🎉 準備好了嗎？

現在您可以：
- ✅ 在 Google Sheet 管理遊戲資料
- ✅ 使用圖床服務管理圖片
- ✅ 即時更新無需部署
- ✅ 輕鬆與團隊協作

開始使用 Google Sheet 管理您的扭蛋遊戲吧！🚀

