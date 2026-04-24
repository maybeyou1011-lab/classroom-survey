# 課堂即時問卷

純 HTML 的課堂問卷，學員手機填、老師投影幕即時看分布。
不用裝任何東西，兩個檔案直接丟到 Cloudflare Pages 或任何靜態空間就能跑。資料存在 Google 試算表。

## 架構

```
index.html（學員填寫）──POST──▶ Google Apps Script ──寫入──▶ Google 試算表
                                                                │
live.html（老師投影）  ◀──每 2 秒讀 CSV────────────────────────┘
```

## 一次性設定（約 10 分鐘）

### 1. 建立 Google 試算表

- 到 https://sheets.google.com 建一份新試算表
- **第一列（標題列）請照順序填**：
  ```
  submittedAt  |  slug  |  name  |  typeName  |  typeCode  |  answers
  ```
- 命名隨意，例如「心學院課堂問卷資料庫」

### 2. 貼 Apps Script

- 試算表選單：**擴充功能 → Apps Script**
- 刪掉預設 `Code.gs` 全部內容，把 `apps-script.gs` 整段貼進去
- 按存檔 → 右上「**部署 → 新增部署作業**」
  - 類型：**網頁應用程式**
  - 執行身分：**我**
  - 有權存取：**任何人**
- 按「部署」→ 第一次會要授權，同意即可
- 複製「**網頁應用程式網址**」

### 3. 發布試算表 CSV

- 回試算表 → **檔案 → 分享 → 發布到網路**
- 選要發布的工作表，格式選 **逗號分隔值 (.csv)**
- 按「發布」→ 複製網址（會是 `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`）

### 4. 填進 config.js

打開 `config.js`，把兩個網址貼進去：

```js
window.SURVEY_CONFIG = {
  WEBHOOK_URL: "Apps Script 網頁應用程式網址",
  SHEET_CSV_URL: "試算表發布的 CSV 網址",
};
```

## 上課流程

1. 老師電腦：把 `live.html` 打開投影（全螢幕）
2. 學員手機：用 QR Code 開 `index.html`，填名字 → 選答 → 送出
3. 學員送出後，投影幕在 2 秒內會更新人數與分布條
4. 學員手機也會看到自己的類型與分析

## 部署上線（可選）

最簡單：直接把整個 `課堂問卷/` 資料夾拖進 **Cloudflare Pages** 就有公開網址。或在本機用 Python 起站：

```bash
cd 課堂問卷
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000/
```

## 換題目

題目、類型名稱、分析文字全在 `questions.js`，改這個檔就好，不用動 HTML。
換題目時 **不用重新部署 Apps Script**——它只負責收 JSON 寫試算表。

## 同一份試算表放多份問卷

`questions.js` 裡的 `slug` 會寫進試算表的 `slug` 欄，`live.html` 會自動過濾只顯示當前 slug 的資料。所以多份問卷可以共用同一個試算表。

## 檔案清單

| 檔案 | 作用 |
| --- | --- |
| `index.html` | 學員填寫頁 |
| `live.html` | 老師投影幕即時結果 |
| `questions.js` | 題目與類型資料（要改題目改這） |
| `config.js` | 存 Apps Script URL 和 CSV URL |
| `apps-script.gs` | 貼進 Google Apps Script 的 webhook 程式 |
