// =================================================================
// ระบบหลังบ้าน SIS Car Booking System (Google Apps Script)
// Version: v.2026.09.21.1015
// =================================================================

// 1. ตั้งค่า Telegram Bot และ Webhook
var TELEGRAM_TOKEN = "8232899917:AAGL6nl13xIF3U6kHNIA0hlnPAo__bALH0c";
var TELEGRAM_CHAT_ID = "-5435344787";
var WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxFDhxfRoLMyLQu7aQjy3eTNGFHvKhgX02Z_BeRaE2RRVZWtNRwTLIXs50JGm1ujAPICA/exec";

// Master Data ค่าเริ่มต้นสำหรับกรณีเปิดใช้งานชีตใหม่
var DEFAULT_TAX_ROWS = [
  ["1ฒม3823", "D-Max", "นาย วิษณุ วงษ์คำ", "2026-11-15", "2026-11-15", "2026-11-15", "ชั้น 1", "วิริยะประกันภัย", "VIR-2025-8831", 900, 16500, "ดูแลเรียบร้อย"],
  ["7กฌ2554", "Yamaha", "นาย ประพัฒน์ สกุลรัตนกุลชัย", "2026-10-30", "2026-10-30", "2026-10-30", "พ.ร.บ. เท่านั้น", "กลางคุ้มครองผู้ประสบภัย", "NVP-2025-1120", 150, 645, "มอเตอร์ไซค์"],
  ["4ขข7395", "Civic EHEV", "นาย สมคิด เอี่ยมสำอางค์", "2026-12-20", "2026-12-20", "2026-12-20", "ชั้น 1", "โตเกียวมารีน", "TKM-88921-A", 1800, 22000, "รถประจำตำแหน่ง"],
  ["ฮฐ1300", "Toyota", "นาย ประพัฒน์ สกุลรัตนกุลชัย", "2026-10-10", "2026-10-10", "2026-10-10", "ชั้น 2+", "ทิพยประกันภัย", "TIP-55421-B", 1200, 8900, "ใกล้ครบกำหนด"],
  ["3ฒจ4298", "Toyota Revo", "นาย วันจักรี เนียมพุ่มพวง", "2027-01-25", "2027-01-25", "2027-01-25", "ชั้น 1", "กรุงเทพประกันภัย", "BKI-99321", 950, 17500, ""],
  ["5ขจ9318", "Yaris Cross", "นาย ประพัฒน์ สกุลรัตนกุลชัย", "2027-02-18", "2027-02-18", "2027-02-18", "ชั้น 1", "วิริยะประกันภัย", "VIR-2026-0041", 1450, 19000, ""],
  ["3ฒฮ8017", "Hilux Champ", "นาย ธนเดช อินช่วย", "2026-11-05", "2026-11-05", "2026-11-05", "ชั้น 1", "เมืองไทยประกันภัย", "MTI-44120-C", 900, 15500, ""],
  ["2ฆณ 2556", "Yadea GS70", "-", "2026-10-01", "2026-10-01", "-", "พ.ร.บ. เท่านั้น", "กลางคุ้มครองผู้ประสบภัย", "NVP-2025-9981", 100, 324, "รถมอเตอร์ไซค์ไฟฟ้า EV"]
];

var DEFAULT_MAINT_ROWS = [
  ["MNT-202609-001", "2026-09-10", "1ฒม3823", "เช็คระยะตามรอบ", "เปลี่ยนถ่ายน้ำมันเครื่อง สังเคราะห์แท้ + ไส้กรองน้ำมันเครื่อง", 95000, 105000, "ศูนย์ Isuzu ตรีเพชร", 2450, "นาย วิษณุ วงษ์คำ", "เสร็จสิ้น", "RC-69021"],
  ["MNT-202609-002", "2026-09-12", "3ฒจ4298", "เปลี่ยนอะไหล่", "สลับยาง ถ่วงล้อ 4 เส้น + ตั้งศูนย์", 48200, 58200, "B-Quik สาขามีนบุรี", 850, "นาย วันจักรี เนียมพุ่มพวง", "เสร็จสิ้น", "BQ-8812"],
  ["MNT-202609-003", "2026-09-15", "4ขข7395", "เช็คระยะตามรอบ", "เช็คระยะ 40,000 กม. เปลี่ยนน้ำมันเบรก และกรองแอร์ PM2.5", 41200, 51200, "ศูนย์ Honda สุขาภิบาล 3", 3890, "นาย สมคิด เอี่ยมสำอางค์", "เสร็จสิ้น", "HD-44390"]
];

// =================================================================
// 2. ระบบ API สำหรับดึงข้อมูล (GET)
// =================================================================
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (e.parameter && e.parameter.action === 'get_all') {
    var historyData = getSheetData(ss, "ตารางบันทึกการใช้รถ", true);
    var usersData = getSheetData(ss, "รายชื่อพนักงาน", false);
    var carsData = getSheetData(ss, "ฐานข้อมูลรถ", false);
    var maintData = getOrCreateSheet(ss, "ประวัติซ่อมบำรุง", [
      "รหัสรายการ", "วันที่เข้าซ่อม", "ทะเบียนรถ", "ประเภทงาน", "รายการซ่อม/เช็คระยะ", 
      "เลขไมล์เข้าซ่อม", "เลขไมล์รอบถัดไป", "อู่หรือศูนย์บริการ", "ค่าใช้จ่าย", "ผู้ส่งซ่อม", "สถานะ", "หมายเหตุ/เลขที่ใบเสร็จ"
    ], DEFAULT_MAINT_ROWS);
    var taxData = getOrCreateSheet(ss, "ประกันและภาษีรถ", [
      "ทะเบียนรถ", "รุ่น", "ผู้ดูแล", "วันหมดอายุภาษี", "วันหมดอายุพรบ", "วันหมดอายุประกัน", 
      "ประเภทประกัน", "บริษัทประกัน", "เลขที่กรมธรรม์", "ค่าใช้จ่ายภาษีล่าสุด", "ค่าเบี้ยประกันล่าสุด", "หมายเหตุ"
    ], DEFAULT_TAX_ROWS);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      history: historyData, 
      users: usersData, 
      cars: carsData,
      maintenance: maintData,
      taxInsurance: taxData
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (e.parameter && e.parameter.action === 'get_history') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      data: getSheetData(ss, "ตารางบันทึกการใช้รถ", true)
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter && e.parameter.action === 'get_maintenance') {
    var mData = getOrCreateSheet(ss, "ประวัติซ่อมบำรุง", [
      "รหัสรายการ", "วันที่เข้าซ่อม", "ทะเบียนรถ", "ประเภทงาน", "รายการซ่อม/เช็คระยะ", 
      "เลขไมล์เข้าซ่อม", "เลขไมล์รอบถัดไป", "อู่หรือศูนย์บริการ", "ค่าใช้จ่าย", "ผู้ส่งซ่อม", "สถานะ", "หมายเหตุ/เลขที่ใบเสร็จ"
    ], DEFAULT_MAINT_ROWS);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      data: mData
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter && e.parameter.action === 'get_tax_insurance') {
    var tData = getOrCreateSheet(ss, "ประกันและภาษีรถ", [
      "ทะเบียนรถ", "รุ่น", "ผู้ดูแล", "วันหมดอายุภาษี", "วันหมดอายุพรบ", "วันหมดอายุประกัน", 
      "ประเภทประกัน", "บริษัทประกัน", "เลขที่กรมธรรม์", "ค่าใช้จ่ายภาษีล่าสุด", "ค่าเบี้ยประกันล่าสุด", "หมายเหตุ"
    ], DEFAULT_TAX_ROWS);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      data: tData
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput("SIS Car Booking API - Active & Protected against duplicate bookings");
}

function getSheetData(ss, sheetName, includeRowIndex) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; 
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0] === "") continue; 
    var obj = {};
    if (includeRowIndex) obj._rowIndex = i + 1;
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

// สร้างแผ่นชีตให้อัตโนมัติหากยังไม่มี
function getOrCreateSheet(ss, sheetName, defaultHeaders, defaultRows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (defaultHeaders && defaultHeaders.length > 0) {
      sheet.appendRow(defaultHeaders);
      sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#f1f5f9");
    }
    if (defaultRows && defaultRows.length > 0) {
      for (var r = 0; r < defaultRows.length; r++) {
        sheet.appendRow(defaultRows[r]);
      }
    }
  }
  return getSheetData(ss, sheetName, true);
}

// Helper แปลงวันที่ให้อยู่ในฟอร์แมต YYYY-MM-DD ตามเขตเวลาประเทศไทย
function formatBangkokYMD(val) {
  if (!val) return "";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return val.trim();
  }
  try {
    var d = (val instanceof Date) ? val : new Date(val);
    if (isNaN(d.getTime())) return "";
    return Utilities.formatDate(d, "Asia/Bangkok", "yyyy-MM-dd");
  } catch(e) {
    return "";
  }
}

// Helper ส่งข้อความแจ้งเตือนเข้า Telegram
function sendTelegram(text, inlineKeyboard) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage";
  var payloadObj = {
    "chat_id": TELEGRAM_CHAT_ID,
    "text": text,
    "parse_mode": "HTML"
  };
  if (inlineKeyboard) {
    payloadObj.reply_markup = { "inline_keyboard": inlineKeyboard };
  }
  try {
    UrlFetchApp.fetch(telegramUrl, {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payloadObj),
      "muteHttpExceptions": true
    });
  } catch(err) {
    Logger.log("Telegram send error: " + err);
  }
}

// =================================================================
// 3. ระบบ API สำหรับรับและประมวลผลข้อมูล (POST)
// =================================================================
function doPost(e) {
  var payloadStr = e.postData.contents;
  var payload = JSON.parse(payloadStr);

  // --- ถ้าระบบตรวจพบว่าเป็นการกดปุ่มมาจาก Telegram ---
  if (payload.callback_query) {
    return handleTelegramClick(payload.callback_query);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ----------------------------------------------------
  // ACTION: บันทึกงานซ่อมบำรุงใหม่ (create_maintenance)
  // ----------------------------------------------------
  if (payload.action === "create_maintenance") {
    var maintSheet = ss.getSheetByName("ประวัติซ่อมบำรุง");
    if (!maintSheet) {
      getOrCreateSheet(ss, "ประวัติซ่อมบำรุง", [
        "รหัสรายการ", "วันที่เข้าซ่อม", "ทะเบียนรถ", "ประเภทงาน", "รายการซ่อม/เช็คระยะ", 
        "เลขไมล์เข้าซ่อม", "เลขไมล์รอบถัดไป", "อู่หรือศูนย์บริการ", "ค่าใช้จ่าย", "ผู้ส่งซ่อม", "สถานะ", "หมายเหตุ/เลขที่ใบเสร็จ"
      ], DEFAULT_MAINT_ROWS);
      maintSheet = ss.getSheetByName("ประวัติซ่อมบำรุง");
    }
    
    var mHeaders = maintSheet.getRange(1, 1, 1, maintSheet.getLastColumn()).getValues()[0];
    var mId = payload.id || ("MNT-" + Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyyMMdd-HHmm"));
    var newMaintRow = [];
    for (var mi = 0; mi < mHeaders.length; mi++) {
      var mh = mHeaders[mi].toString().trim();
      if (mh === "รหัสรายการ") newMaintRow.push(mId);
      else if (mh === "วันที่เข้าซ่อม") newMaintRow.push(payload.serviceDate || "");
      else if (mh === "ทะเบียนรถ") newMaintRow.push(payload.plate || "");
      else if (mh === "ประเภทงาน") newMaintRow.push(payload.category || "");
      else if (mh === "รายการซ่อม/เช็คระยะ") newMaintRow.push(payload.items || "");
      else if (mh === "เลขไมล์เข้าซ่อม") newMaintRow.push(payload.mileage || "");
      else if (mh === "เลขไมล์รอบถัดไป") newMaintRow.push(payload.nextMileage || "");
      else if (mh === "อู่หรือศูนย์บริการ") newMaintRow.push(payload.garage || "");
      else if (mh === "ค่าใช้จ่าย") newMaintRow.push(payload.cost || 0);
      else if (mh === "ผู้ส่งซ่อม") newMaintRow.push(payload.requester || "");
      else if (mh === "สถานะ") newMaintRow.push(payload.status || "เสร็จสิ้น");
      else if (mh === "หมายเหตุ/เลขที่ใบเสร็จ") newMaintRow.push(payload.notes || "");
      else newMaintRow.push("");
    }
    maintSheet.appendRow(newMaintRow);
    
    // ส่ง Telegram แจ้งเตือนงานซ่อม
    var costNum = Number(payload.cost || 0);
    var maintMsg = "🔧 <b>บันทึกงานซ่อมบำรุงยานพาหนะ</b>\n\n" +
                   "🚙 <b>ทะเบียนรถ:</b> " + (payload.plate || "-") + "\n" +
                   "📅 <b>วันที่:</b> " + (payload.serviceDate || "-") + "\n" +
                   "⚙️ <b>ประเภท:</b> " + (payload.category || "-") + "\n" +
                   "📝 <b>รายการ:</b> " + (payload.items || "-") + "\n" +
                   "🚗 <b>เลขไมล์:</b> " + (payload.mileage ? Number(payload.mileage).toLocaleString() + " กม." : "-") + "\n" +
                   "🏢 <b>อู่/ศูนย์บริการ:</b> " + (payload.garage || "-") + "\n" +
                   "💰 <b>ค่าใช้จ่าย:</b> " + (costNum > 0 ? costNum.toLocaleString() + " บาท" : "0 บาท") + "\n" +
                   "👤 <b>ผู้บันทึก/ส่งซ่อม:</b> " + (payload.requester || "-") + "\n" +
                   "📌 <b>สถานะ:</b> " + (payload.status || "เสร็จสิ้น");
    sendTelegram(maintMsg);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: mId }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ----------------------------------------------------
  // ACTION: อัปเดตการต่อภาษี / ประกันภัย (renew_tax_insurance)
  // ----------------------------------------------------
  if (payload.action === "renew_tax_insurance") {
    var taxSheet = ss.getSheetByName("ประกันและภาษีรถ");
    if (!taxSheet) {
      getOrCreateSheet(ss, "ประกันและภาษีรถ", [
        "ทะเบียนรถ", "รุ่น", "ผู้ดูแล", "วันหมดอายุภาษี", "วันหมดอายุพรบ", "วันหมดอายุประกัน", 
        "ประเภทประกัน", "บริษัทประกัน", "เลขที่กรมธรรม์", "ค่าใช้จ่ายภาษีล่าสุด", "ค่าเบี้ยประกันล่าสุด", "หมายเหตุ"
      ], DEFAULT_TAX_ROWS);
      taxSheet = ss.getSheetByName("ประกันและภาษีรถ");
    }
    var tHeaders = taxSheet.getRange(1, 1, 1, taxSheet.getLastColumn()).getValues()[0];
    var plateIdx = tHeaders.indexOf("ทะเบียนรถ");
    var taxExpIdx = tHeaders.indexOf("วันหมดอายุภาษี");
    var prbExpIdx = tHeaders.indexOf("วันหมดอายุพรบ");
    var insExpIdx = tHeaders.indexOf("วันหมดอายุประกัน");
    var insTypeIdx = tHeaders.indexOf("ประเภทประกัน");
    var compIdx = tHeaders.indexOf("บริษัทประกัน");
    var policyIdx = tHeaders.indexOf("เลขที่กรมธรรม์");
    var taxCostIdx = tHeaders.indexOf("ค่าใช้จ่ายภาษีล่าสุด");
    var insCostIdx = tHeaders.indexOf("ค่าเบี้ยประกันล่าสุด");
    var remarkIdx = tHeaders.indexOf("หมายเหตุ");

    var tData = taxSheet.getDataRange().getValues();
    var targetRow = -1;
    for (var tr = 1; tr < tData.length; tr++) {
      if ((tData[tr][plateIdx] || "").toString().trim() === (payload.plate || "").toString().trim()) {
        targetRow = tr + 1;
        break;
      }
    }

    if (targetRow !== -1) {
      if (payload.renewType === "tax" || payload.renewType === "all") {
        if (payload.taxExpiry && taxExpIdx !== -1) taxSheet.getRange(targetRow, taxExpIdx + 1).setValue(payload.taxExpiry);
        if (payload.taxCost && taxCostIdx !== -1) taxSheet.getRange(targetRow, taxCostIdx + 1).setValue(payload.taxCost);
      }
      if (payload.renewType === "prb" || payload.renewType === "all") {
        if (payload.prbExpiry && prbExpIdx !== -1) taxSheet.getRange(targetRow, prbExpIdx + 1).setValue(payload.prbExpiry);
      }
      if (payload.renewType === "insurance" || payload.renewType === "all") {
        if (payload.insExpiry && insExpIdx !== -1) taxSheet.getRange(targetRow, insExpIdx + 1).setValue(payload.insExpiry);
        if (payload.insCost && insCostIdx !== -1) taxSheet.getRange(targetRow, insCostIdx + 1).setValue(payload.insCost);
        if (payload.insType && insTypeIdx !== -1) taxSheet.getRange(targetRow, insTypeIdx + 1).setValue(payload.insType);
        if (payload.insCompany && compIdx !== -1) taxSheet.getRange(targetRow, compIdx + 1).setValue(payload.insCompany);
        if (payload.policyNo && policyIdx !== -1) taxSheet.getRange(targetRow, policyIdx + 1).setValue(payload.policyNo);
      }
      if (payload.notes && remarkIdx !== -1) {
        var prevNote = taxSheet.getRange(targetRow, remarkIdx + 1).getValue();
        var newNote = payload.notes + (prevNote ? " | " + prevNote : "");
        taxSheet.getRange(targetRow, remarkIdx + 1).setValue(newNote);
      }
    } else {
      var newTRow = [];
      for (var ti = 0; ti < tHeaders.length; ti++) {
        var th = tHeaders[ti].toString().trim();
        if (th === "ทะเบียนรถ") newTRow.push(payload.plate || "");
        else if (th === "รุ่น") newTRow.push(payload.model || "");
        else if (th === "ผู้ดูแล") newTRow.push(payload.manager || "");
        else if (th === "วันหมดอายุภาษี") newTRow.push(payload.taxExpiry || "");
        else if (th === "วันหมดอายุพรบ") newTRow.push(payload.prbExpiry || "");
        else if (th === "วันหมดอายุประกัน") newTRow.push(payload.insExpiry || "");
        else if (th === "ประเภทประกัน") newTRow.push(payload.insType || "");
        else if (th === "บริษัทประกัน") newTRow.push(payload.insCompany || "");
        else if (th === "เลขที่กรมธรรม์") newTRow.push(payload.policyNo || "");
        else if (th === "ค่าใช้จ่ายภาษีล่าสุด") newTRow.push(payload.taxCost || 0);
        else if (th === "ค่าเบี้ยประกันล่าสุด") newTRow.push(payload.insCost || 0);
        else if (th === "หมายเหตุ") newTRow.push(payload.notes || "");
        else newTRow.push("");
      }
      taxSheet.appendRow(newTRow);
    }

    var typeLabel = (payload.renewType === "tax") ? "ภาษีประจำปี" : (payload.renewType === "prb") ? "พ.ร.บ." : (payload.renewType === "insurance") ? "ประกันภัยภาคสมัครใจ" : "ภาษีและประกันภัย";
    var costVal = Number(payload.cost || payload.taxCost || payload.insCost || 0);
    var taxMsg = "🛡️ <b>บันทึกการต่ออายุ" + typeLabel + "</b>\n\n" +
                 "🚙 <b>ทะเบียนรถ:</b> " + (payload.plate || "-") + " (" + (payload.model || "") + ")\n" +
                 "📋 <b>ประเภท:</b> " + typeLabel + "\n" +
                 "📅 <b>วันหมดอายุรอบใหม่:</b> " + (payload.newExpiry || payload.taxExpiry || payload.insExpiry || payload.prbExpiry || "-") + "\n" +
                 "💰 <b>ยอดเงิน/เบี้ย:</b> " + (costVal > 0 ? costVal.toLocaleString() + " บาท" : "-") + "\n" +
                 "🏢 <b>บริษัท/ผู้ให้บริการ:</b> " + (payload.insCompany || "-") + "\n" +
                 "📄 <b>เลขที่กรมธรรม์/อ้างอิง:</b> " + (payload.policyNo || "-") + "\n" +
                 "⏱ <b>เวลาทำรายการ:</b> " + Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");
    sendTelegram(taxMsg);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // --- ถ้าเป็นการส่งข้อมูลมาจากหน้าเว็บแอป (ระบบจองรถเดิม) ---
  var sheet = ss.getSheetByName("ตารางบันทึกการใช้รถ");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ไม่พบแผ่นชีต ตารางบันทึกการใช้รถ" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // ----------------------------------------------------
  // ACTION: สร้างคำขอจองรถใหม่ (พร้อมระบบตรวจการจองซ้ำฝั่งเซิร์ฟเวอร์ 100%)
  // ----------------------------------------------------
  if (payload.action === "create") {
    var plate = (payload.plate || "").toString().trim();
    var fromDateStr = (payload.fromDate || "").toString().trim();
    var toDateStr = (payload.toDate || fromDateStr).toString().trim();

    var newStartYMD = formatBangkokYMD(fromDateStr);
    var newEndYMD = formatBangkokYMD(toDateStr) || newStartYMD;

    // ตรวจสอบกับข้อมูลทั้งหมดใน Sheet
    var data = sheet.getDataRange().getValues();
    var plateIndex = headers.indexOf("ทะเบียนรถที่จอง");
    var fromIndex = headers.indexOf("จากวันที่");
    var toIndex = headers.indexOf("ถึงวันที่");
    var statusIndex = headers.indexOf("สถานะ");
    var userIndex = headers.indexOf("คนจอง(Gmail)");

    if (plateIndex !== -1 && fromIndex !== -1) {
      for (var r = 1; r < data.length; r++) {
        var row = data[r];
        var rPlate = (row[plateIndex] || "").toString().trim();
        var rStatus = (row[statusIndex] || "").toString().trim().toLowerCase();

        // ตรวจเฉพาะรถคันเดียวกัน
        if (rPlate !== plate) continue;

        // ถ้ารถคืนแล้ว (completed) หรือถูกปฏิเสธ (rejected) ถือว่าว่าง
        if (rStatus.indexOf("reject") !== -1 || rStatus.indexOf("ปฏิเสธ") !== -1 || 
            rStatus.indexOf("complete") !== -1 || rStatus.indexOf("คืนรถ") !== -1) {
          continue;
        }

        var rStartYMD = formatBangkokYMD(row[fromIndex]);
        var rEndYMD = formatBangkokYMD(row[toIndex]) || rStartYMD;

        if (!rStartYMD) continue;

        // ตรวจสอบการทับซ้อนของช่วงวัน: (StartA <= EndB && EndA >= StartB)
        if (newStartYMD <= rEndYMD && newEndYMD >= rStartYMD) {
          var existUser = (userIndex !== -1 ? row[userIndex] : "ผู้ใช้อื่น");
          return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            message: "รถทะเบียน " + plate + " มีการจองค้างอยู่แล้วในช่วงวันที่ " + rStartYMD + " ถึง " + rEndYMD + " โดย " + existUser + " (ยังไม่ได้คืนรถ)"
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // ผ่านการตรวจสอบ -> บันทึกแถวใหม่
    var newRow = [];
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().trim();
      if (header === "วันที่ เวลา ที่จอง") newRow.push(payload.bookingDatetime || new Date().toISOString());
      else if (header === "คนจอง(Gmail)") newRow.push(payload.email || "");
      else if (header === "จากวันที่") newRow.push(payload.fromDate || "");
      else if (header === "ถึงวันที่") newRow.push(payload.toDate || "");
      else if (header === "จำนวนกี่วัน") newRow.push(payload.days || "");
      else if (header === "ไปทำอะไร") newRow.push(payload.purpose || "");
      else if (header === "ไปที่ไหน") newRow.push(payload.destination || "");
      else if (header === "ทะเบียนรถที่จอง") newRow.push(payload.plate || "");
      else if (header === "เลขไมล์ออก") newRow.push(payload.mileageOut || "");
      else if (header === "เลขไมล์เข้า") newRow.push("");
      else if (header === "ค่าทางด่วน") newRow.push("");
      else if (header === "บัตรทางด่วนคงเหลือ") newRow.push("");
      else if (header === "สถานะ") newRow.push("รออนุมัติ");
      else if (header === "หมายเหตุ") newRow.push("");
      else newRow.push("");
    }

    sheet.appendRow(newRow);
    var newRowIndex = sheet.getLastRow();

    // ส่งแจ้งเตือนเข้า Telegram พร้อมปุ่ม อนุมัติ / ปฏิเสธ
    var messageText = "🚗 <b>มีคำขอจองรถใหม่ (คิวที่ " + newRowIndex + ")</b>\n\n" +
                      "👤 <b>ผู้จอง:</b> " + payload.email + "\n" +
                      "🚙 <b>ทะเบียนรถ:</b> " + payload.plate + "\n" +
                      "📅 <b>เดินทาง:</b> " + payload.fromDate + " ถึง " + payload.toDate + " (" + payload.days + ")\n" +
                      "🎯 <b>จุดประสงค์:</b> " + payload.purpose + "\n" +
                      "📍 <b>สถานที่:</b> " + payload.destination + "\n" +
                      "⏱ <b>เวลาทำรายการ:</b> " + Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss") + "\n\n" +
                      "<i>กรุณาพิจารณาอนุมัติหรือปฏิเสธคำขอด้านล่างนี้:</i>";

    var keyboard = [
      [
        {"text": "✅ อนุมัติ", "callback_data": "approve_" + newRowIndex},
        {"text": "❌ ปฏิเสธ", "callback_data": "reject_" + newRowIndex}
      ]
    ];
    sendTelegram(messageText, keyboard);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", rowIndex: newRowIndex }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ----------------------------------------------------
  // ACTION: บันทึกข้อมูลคืนรถ
  // ----------------------------------------------------
  if (payload.action === "update") {
    var mailInIndex = headers.indexOf("เลขไมล์เข้า");
    var mailOutIndex = headers.indexOf("เลขไมล์ออก");
    var tollIndex = headers.indexOf("ค่าทางด่วน");
    var tollBalIndex = headers.indexOf("บัตรทางด่วนคงเหลือ");
    var statusIndex = headers.indexOf("สถานะ");
    var targetRowIndex = payload.rowIndex; 

    if (!targetRowIndex && payload.searchPlate) {
      var data = sheet.getDataRange().getValues();
      var plateIndex = headers.indexOf("ทะเบียนรถที่จอง");
      for (var i = data.length - 1; i >= 1; i--) {
        if (data[i][plateIndex] == payload.searchPlate && data[i][mailInIndex] === "") {
           targetRowIndex = i + 1; break;
        }
      }
    }
    if (targetRowIndex) {
      if(mailOutIndex !== -1 && payload.mileageOut) sheet.getRange(targetRowIndex, mailOutIndex + 1).setValue(payload.mileageOut);
      if(mailInIndex !== -1 && payload.mileageIn) sheet.getRange(targetRowIndex, mailInIndex + 1).setValue(payload.mileageIn);
      if(tollIndex !== -1 && payload.tollFee) sheet.getRange(targetRowIndex, tollIndex + 1).setValue(payload.tollFee);
      if(tollBalIndex !== -1 && payload.tollBalance) sheet.getRange(targetRowIndex, tollBalIndex + 1).setValue(payload.tollBalance);
      if(statusIndex !== -1) sheet.getRange(targetRowIndex, statusIndex + 1).setValue("completed");
      return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "ไม่พบข้อมูลที่ต้องการอัปเดต" })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ----------------------------------------------------
  // ACTION: ปรับสถานะคำขอ
  // ----------------------------------------------------
  if (payload.action === "update_status") {
    if (!payload.rowIndex) return ContentService.createTextOutput(JSON.stringify({status: "error", message: "ไม่มีเลขแถวระบุมา"})).setMimeType(ContentService.MimeType.JSON);
    var statusIndex = headers.indexOf("สถานะ");
    var remarkIndex = headers.indexOf("หมายเหตุ");
    if (statusIndex !== -1) sheet.getRange(payload.rowIndex, statusIndex + 1).setValue(payload.status);
    if (remarkIndex !== -1 && payload.rejectReason) sheet.getRange(payload.rowIndex, remarkIndex + 1).setValue(payload.rejectReason); 
    else if (remarkIndex !== -1 && payload.remark) sheet.getRange(payload.rowIndex, remarkIndex + 1).setValue(payload.remark); 
    return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  }
}

// =================================================================
// 4. ฟังก์ชันประมวลผลเมื่อผู้อนุมัติ "กดปุ่ม" ใน Telegram
// =================================================================
function handleTelegramClick(callbackQuery) {
  var data = callbackQuery.data; // e.g. "approve_15"
  var chatId = callbackQuery.message.chat.id;
  var messageId = callbackQuery.message.message_id;
  var fromName = callbackQuery.from.first_name || "Admin";

  var parts = data.split("_");
  var action = parts[0];
  var rowIndex = parseInt(parts[1]);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ตารางบันทึกการใช้รถ");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var statusIndex = headers.indexOf("สถานะ");
  var remarkIndex = headers.indexOf("หมายเหตุ");
  var plateIndex = headers.indexOf("ทะเบียนรถที่จอง");
  var fromIndex = headers.indexOf("จากวันที่");
  var toIndex = headers.indexOf("ถึงวันที่");

  // ตรวจสอบการกดอนุมัติซ้ำ หรือชนกับรายการที่อนุมัติไปแล้ว
  if (action === "approve") {
    var thisRow = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
    var thisPlate = (thisRow[plateIndex] || "").toString().trim();
    var thisStart = formatBangkokYMD(thisRow[fromIndex]);
    var thisEnd = formatBangkokYMD(thisRow[toIndex]) || thisStart;

    var allData = sheet.getDataRange().getValues();
    var hasConflict = false;
    var conflictingUser = "";

    for (var r = 1; r < allData.length; r++) {
      if (r + 1 === rowIndex) continue; // ข้ามแถวตัวเอง
      var row = allData[r];
      var rPlate = (row[plateIndex] || "").toString().trim();
      var rStatus = (row[statusIndex] || "").toString().trim().toLowerCase();

      if (rPlate !== thisPlate) continue;
      if (rStatus !== "approved") continue; // ตรวจเฉพาะรายการที่ได้รับอนุมัติไปแล้ว

      var rStart = formatBangkokYMD(row[fromIndex]);
      var rEnd = formatBangkokYMD(row[toIndex]) || rStart;

      if (thisStart <= rEnd && thisEnd >= rStart) {
        hasConflict = true;
        conflictingUser = (row[headers.indexOf("คนจอง(Gmail)")] || "รายการอื่น");
        break;
      }
    }

    if (hasConflict) {
      var conflictMsg = "⚠️ <b>ไม่สามารถอนุมัติคิวที่ " + rowIndex + " ได้!</b>\n\n" +
                        "รถทะเบียน <b>" + thisPlate + "</b> ได้รับการอนุมัติให้ " + conflictingUser + " ในช่วงเวลาเดียวกันไปแล้ว!\n" +
                        "ผู้พยายามดำเนินการ: " + fromName;
      editTelegramMessage(chatId, messageId, conflictMsg);
      return ContentService.createTextOutput("CONFLICT");
    }
  }

  var newStatus = (action === "approve") ? "Approved" : "Rejected";
  var statusTh = (action === "approve") ? "อนุมัติแล้ว" : "ปฏิเสธการจอง";
  var emoji = (action === "approve") ? "✅" : "❌";
  var remarkText = (action === "approve") ? ("Approved โดย " + fromName) : ("Rejected โดย " + fromName);

  // อัปเดตข้อมูลลง Google Sheet
  if (statusIndex !== -1) {
    sheet.getRange(rowIndex, statusIndex + 1).setValue(newStatus);
  }
  if (remarkIndex !== -1) {
    sheet.getRange(rowIndex, remarkIndex + 1).setValue(remarkText);
  }

  // อัปเดตข้อความใน Telegram ให้ปุ่มหายไป
  var updatedText = emoji + " <b>รายการจองคิวที่ " + rowIndex + " ถูกดำเนินการแล้ว!</b>\n\n" +
                    "สถานะปัจจุบัน: <b>" + statusTh + "</b>\n" +
                    "ผู้ดำเนินการ: " + fromName + "\n" +
                    "เวลา: " + Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");

  editTelegramMessage(chatId, messageId, updatedText);
  return ContentService.createTextOutput("OK");
}

function editTelegramMessage(chatId, messageId, text) {
  var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/editMessageText";
  UrlFetchApp.fetch(url, {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify({
      "chat_id": chatId,
      "message_id": messageId,
      "text": text,
      "parse_mode": "HTML"
    }),
    "muteHttpExceptions": true
  });
}

// =================================================================
// 5. ฟังก์ชันแจ้งเตือนภาษี / ประกันภัย ใกล้หมดอายุอัตโนมัติ (ตั้ง Trigger ได้)
// =================================================================
function checkExpiringNotifications() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ประกันและภาษีรถ");
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  var headers = data[0];
  var plateIdx = headers.indexOf("ทะเบียนรถ");
  var modelIdx = headers.indexOf("รุ่น");
  var managerIdx = headers.indexOf("ผู้ดูแล");
  var taxExpIdx = headers.indexOf("วันหมดอายุภาษี");
  var prbExpIdx = headers.indexOf("วันหมดอายุพรบ");
  var insExpIdx = headers.indexOf("วันหมดอายุประกัน");

  var now = new Date();
  var todayYMD = Utilities.formatDate(now, "Asia/Bangkok", "yyyy-MM-dd");
  var todayMs = new Date(todayYMD).getTime();

  var alerts = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var plate = row[plateIdx];
    var model = row[modelIdx];
    var manager = row[managerIdx];

    var checkItems = [
      { name: "ภาษีประจำปี", dateStr: row[taxExpIdx] },
      { name: "พ.ร.บ.", dateStr: row[prbExpIdx] },
      { name: "ประกันภัย", dateStr: row[insExpIdx] }
    ];

    for (var k = 0; k < checkItems.length; k++) {
      var item = checkItems[k];
      var expYMD = formatBangkokYMD(item.dateStr);
      if (!expYMD) continue;
      var expMs = new Date(expYMD).getTime();
      var diffDays = Math.ceil((expMs - todayMs) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        alerts.push("🔴 <b>" + plate + "</b> (" + model + "): " + item.name + " <b>หมดอายุแล้ว</b> (" + expYMD + ") ผู้ดูแล: " + manager);
      } else if (diffDays <= 30) {
        alerts.push("🟡 <b>" + plate + "</b> (" + model + "): " + item.name + " จะหมดอายุในอีก <b>" + diffDays + " วัน</b> (" + expYMD + ") ผู้ดูแล: " + manager);
      }
    }
  }

  if (alerts.length > 0) {
    var summaryMsg = "📢 <b>แจ้งเตือนกำหนดภาษีและประกันภัยรถยนต์ SIS</b>\n\n" +
                     alerts.join("\n\n") + "\n\n" +
                     "<i>กรุณาประสานงานเพื่อดำเนินการต่ออายุก่อนครบกำหนด</i>";
    sendTelegram(summaryMsg);
  }
}

// =================================================================
// 6. เครื่องมือติดตั้ง Webhook (รันแค่ครั้งเดียว)
// =================================================================
function setupTelegramWebhook() {
  var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/setWebhook?url=" + WEB_APP_URL;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
  SpreadsheetApp.getUi().alert("เชื่อมต่อ Webhook สำเร็จ:\n" + response.getContentText());
}
