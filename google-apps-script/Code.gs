// =================================================================
// ระบบหลังบ้าน SIS Car Booking System (Google Apps Script)
// Version: v.2026.09.21.0910
// =================================================================

// 1. ตั้งค่า Telegram Bot และ Webhook
var TELEGRAM_TOKEN = "8232899917:AAGL6nl13xIF3U6kHNIA0hlnPAo__bALH0c";
var TELEGRAM_CHAT_ID = "-5435344787";
var WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxFDhxfRoLMyLQu7aQjy3eTNGFHvKhgX02Z_BeRaE2RRVZWtNRwTLIXs50JGm1ujAPICA/exec";

// =================================================================
// 2. ระบบ API สำหรับดึงข้อมูล (GET)
// =================================================================
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (e.parameter && e.parameter.action === 'get_all') {
    var historyData = getSheetData(ss, "ตารางบันทึกการใช้รถ", true);
    var usersData = getSheetData(ss, "รายชื่อพนักงาน", false);
    var carsData = getSheetData(ss, "ฐานข้อมูลรถ", false);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      history: historyData, 
      users: usersData, 
      cars: carsData
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (e.parameter && e.parameter.action === 'get_history') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success', 
      data: getSheetData(ss, "ตารางบันทึกการใช้รถ", true)
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

  // --- ถ้าเป็นการส่งข้อมูลมาจากหน้าเว็บแอป ---
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
    var messageText = "🚗 <b>มีคำขอจองรถใหม่ (คิวที่ " + newRowIndex + ")</b>

" +
                      "👤 <b>ผู้จอง:</b> " + payload.email + "
" +
                      "🚙 <b>ทะเบียนรถ:</b> " + payload.plate + "
" +
                      "📅 <b>เดินทาง:</b> " + payload.fromDate + " ถึง " + payload.toDate + " (" + payload.days + ")
" +
                      "🎯 <b>จุดประสงค์:</b> " + payload.purpose + "
" +
                      "📍 <b>สถานที่:</b> " + payload.destination + "
" +
                      "⏱ <b>เวลาทำรายการ:</b> " + Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss") + "

" +
                      "<i>กรุณาพิจารณาอนุมัติหรือปฏิเสธคำขอด้านล่างนี้:</i>";

    var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage";
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": messageText,
        "parse_mode": "HTML",
        "reply_markup": {
          "inline_keyboard": [
            [
              {"text": "✅ อนุมัติ", "callback_data": "approve_" + newRowIndex},
              {"text": "❌ ปฏิเสธ", "callback_data": "reject_" + newRowIndex}
            ]
          ]
        }
      }),
      "muteHttpExceptions": true
    };
    try { UrlFetchApp.fetch(telegramUrl, options); } catch(err) {}

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
      var conflictMsg = "⚠️ <b>ไม่สามารถอนุมัติคิวที่ " + rowIndex + " ได้!</b>

" +
                        "รถทะเบียน <b>" + thisPlate + "</b> ได้รับการอนุมัติให้ " + conflictingUser + " ในช่วงเวลาเดียวกันไปแล้ว!
" +
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
  var updatedText = emoji + " <b>รายการจองคิวที่ " + rowIndex + " ถูกดำเนินการแล้ว!</b>

" +
                    "สถานะปัจจุบัน: <b>" + statusTh + "</b>
" +
                    "ผู้ดำเนินการ: " + fromName + "
" +
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
// 5. เครื่องมือติดตั้ง Webhook (รันแค่ครั้งเดียว)
// =================================================================
function setupTelegramWebhook() {
  var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/setWebhook?url=" + WEB_APP_URL;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
  SpreadsheetApp.getUi().alert("เชื่อมต่อ Webhook สำเร็จ:
" + response.getContentText());
}
