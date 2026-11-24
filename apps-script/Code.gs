/**
 * RSVP + Ucapan untuk undangan pernikahan.
 * Tempel seluruh kode ini di Extensions > Apps Script pada Google Sheet Anda.
 *
 * Sheet "RSVP" dibuat otomatis dengan kolom:
 * A Timestamp | B Nama | C Kehadiran | D Jumlah Tamu | E Ucapan
 */
var SHEET_NAME = "RSVP";
var MAX_WISHES = 100; // jumlah ucapan terbaru yang ditampilkan di website

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Timestamp", "Nama", "Kehadiran", "Jumlah Tamu", "Ucapan"]);
    sh.setFrozenRows(1);
    sh.getRange("A1:E1").setFontWeight("bold");
  }
  return sh;
}

// Cegah sel diawali = + - @ dibaca sebagai rumus (formula injection)
function safe_(v, max) {
  var s = String(v == null ? "" : v).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Website mengirim RSVP ke sini
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse(e.postData.contents);
    var name = safe_(d.name, 80);
    if (!name) return json_({ ok: false, error: "Nama kosong" });

    var attendance = d.attendance === "Hadir" ? "Hadir" : "Tidak Hadir";
    var guests = attendance === "Hadir" ? Math.min(Math.max(parseInt(d.guests, 10) || 1, 1), 20) : 0;
    var message = safe_(d.message, 500);

    getSheet_().appendRow([new Date(), name, attendance, guests, message]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Website membaca ucapan dari sini: ?action=wishes
function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action !== "wishes") return json_({ ok: true, service: "rsvp" });

  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, wishes: [] });

  var rows = sh.getRange(2, 1, last - 1, 5).getValues();
  var wishes = [];
  for (var i = rows.length - 1; i >= 0 && wishes.length < MAX_WISHES; i--) {
    var msg = String(rows[i][4] || "").replace(/^'/, "");
    if (!msg) continue; // hanya tampilkan yang menulis ucapan
    wishes.push({
      name: String(rows[i][1]).replace(/^'/, ""),
      message: msg,
      time: rows[i][0] instanceof Date ? rows[i][0].toISOString() : String(rows[i][0])
    });
  }
  return json_({ ok: true, wishes: wishes });
}
