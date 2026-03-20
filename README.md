# 문의 폼 - Google Sheets 연동 설정 가이드

## 파일 구성

```
폼 바이브코딩/
├── index.html              ← 메인 폼 페이지
├── style.css               ← 스타일
├── script.js               ← 폼 로직 & Sheets 연동
├── google-apps-script.gs   ← Google Apps Script 코드
└── README.md               ← 이 파일
```

---

## 구글 스프레드시트 연동 방법 (3단계)

### Step 1. 스프레드시트 만들기

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 스프레드시트 이름을 원하는 대로 설정

---

### Step 2. Apps Script 웹앱 배포

1. 스프레드시트 상단 메뉴 → **확장 프로그램** → **Apps Script** 클릭
2. 기존 코드를 모두 지우고, `google-apps-script.gs` 파일의 내용을 붙여넣기
3. 상단 메뉴 → **배포** → **새 배포** 클릭
4. 설정:
   - 유형: **웹 앱**
   - 설명: 문의폼 연동 (자유 입력)
   - 다음 사용자로 실행: **나 (내 Google 계정)**
   - 액세스 권한: **모든 사용자**
5. **배포** 클릭 → Google 계정 권한 허용
6. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfy.../exec`)

---

### Step 3. script.js에 URL 입력

`script.js` 파일을 열어 상단의 URL을 교체하세요:

```js
// 변경 전
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/여기에_웹앱_URL_입력/exec";

// 변경 후 (복사한 URL로 교체)
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

---

## 완료 후 동작 확인

1. `index.html`을 브라우저에서 열기
2. 폼 작성 후 **내용 전달하기** 클릭
3. "정상적으로 문의 되셨습니다." 팝업 확인
4. Google Sheets에서 **"문의폼 응답"** 시트에 데이터 저장 확인

---

## 스프레드시트 컬럼 구조

| 제출일시 | 이름 | 이메일주소 | 궁금한 분야 | 유입 채널 |
|----------|------|------------|-------------|-----------|
| 자동 입력 | 텍스트 | 텍스트 | 콤마 구분 | 단일값 |

---

## 주의사항

- Apps Script 코드를 수정하면 **재배포** 필요 (새 배포 또는 기존 배포 업데이트)
- 로컬 파일(`file://`)에서 열면 CORS 오류가 날 수 있음 → 웹서버 또는 GitHub Pages 등에 배포 권장
- 무료 Google 계정 기준 Apps Script 실행 제한: 일 6분 (대용량 아니면 충분)
