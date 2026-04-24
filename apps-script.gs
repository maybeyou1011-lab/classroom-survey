// 貼進 Google 試算表 → 擴充功能 → Apps Script
// 刪掉預設的 Code.gs 全部內容，把這一段貼進去，存檔。
// 然後：部署 → 新增部署作業 → 類型「網頁應用程式」→ 執行身分「我」→ 有權存取「任何人」→ 部署
// 第一次部署會要授權，同意即可。複製拿到的「網頁應用程式網址」貼進 config.js 的 WEBHOOK_URL。

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.slug || "",
    data.name || "匿名",
    data.typeName || "",
    data.typeCode || "",
    JSON.stringify(data.answers || []),
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("OK");
}
