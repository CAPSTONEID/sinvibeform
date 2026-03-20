// ============================================================
// Google Apps Script - 스프레드시트 연동 웹앱
// 이 코드를 Google Apps Script에 붙여넣고 웹앱으로 배포하세요.
// ============================================================

const SHEET_NAME = "문의폼 응답"; // 시트 이름 (없으면 자동 생성)

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // 시트가 없으면 새로 생성
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // 헤더 행 추가
      sheet.appendRow([
        "제출일시",
        "이름",
        "이메일주소",
        "궁금한 분야",
        "유입 채널"
      ]);
      // 헤더 스타일 적용
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.name,
      data.email,
      Array.isArray(data.fields) ? data.fields.join(", ") : data.fields,
      data.channel
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// GET 요청 테스트용
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: "success", message: "웹앱이 정상 작동 중입니다." }))
    .setMimeType(ContentService.MimeType.JSON);
}
