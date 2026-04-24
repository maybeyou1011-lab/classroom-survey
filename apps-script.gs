// 貼進 Google 試算表 → 擴充功能 → Apps Script
// 刪掉預設的 Code.gs 全部內容，把這一段貼進去，存檔。
// 然後：部署 → 新增部署作業 → 類型「網頁應用程式」→ 執行身分「我」→ 有權存取「任何人」→ 部署
// 第一次部署會要授權，同意即可。複製拿到的「網頁應用程式網址」貼進 config.js 的 WEBHOOK_URL。

// 接收學員填寫的資料，寫進試算表
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const raw = (e.parameter && e.parameter.payload)
    ? e.parameter.payload
    : (e.postData && e.postData.contents) || "{}";
  const data = JSON.parse(raw);
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

// 老師投影頁讀資料用：回傳試算表所有列的 JSON
// 呼叫方式：GET <webhook_url>?slug=emotion-flow
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const wantedSlug = (e && e.parameter && e.parameter.slug) ? e.parameter.slug : "";
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    const slug = String(r[1] || "");
    if (wantedSlug && slug !== wantedSlug) continue;
    rows.push({
      submittedAt: String(r[0] || ""),
      slug: slug,
      name: String(r[2] || "匿名"),
      typeName: String(r[3] || ""),
      typeCode: String(r[4] || ""),
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, rows: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
