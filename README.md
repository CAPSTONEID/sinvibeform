# CAPSTONE 바이브코딩 레퍼런스

> 터미널 스타일 문의 폼 — Google Sheets 실시간 연동

**라이브 URL** → [https://capstoneid.github.io/sinvibeform/](https://capstoneid.github.io/sinvibeform/)
**응답 시트** → [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1aTP7_QfJ1anHzeAxwjzkmoI13QSwoe0NyqeB8rNLN3M/edit?usp=sharing)

---

## 파일 구성

```
sinvibeform/
├── index.html   ← 메인 폼 페이지 (터미널 UI)
├── style.css    ← 터미널 스타일 디자인
├── script.js    ← 폼 유효성 검사 & Google Sheets 전송
└── README.md
```

---

## 폼 항목

| # | 항목 | 타입 |
|---|------|------|
| 01 | 이름 | 텍스트 입력 |
| 02 | 이메일 주소 | 텍스트 입력 (정규표현식 검증) |
| 03 | 궁금한 분야 | 멀티 선택 (AI / 마케팅 / 기획 / 협업툴 도입 / 콘텐츠 기획 및 제작 / 기타) |
| 04 | 유입 채널 | 단일 선택 — 이미지 카드 (유튜브 / 인스타그램 / 노션 템플릿 / 블로그 / 기타) |
| 05 | 내용 확인 | 동의 체크 |

---

## Google Sheets 연동

- **Apps Script URL** — `script.js` 상단에 적용 완료
- **응답 시트** — 제출 시 자동으로 `문의폼 응답` 시트에 기록

| 제출일시 | 이름 | 이메일주소 | 궁금한 분야 | 유입 채널 |
|----------|------|------------|-------------|-----------|
| 자동 입력 | 텍스트 | 텍스트 | 콤마 구분 | 단일값 |

---

## 주의사항

- 본 양식은 **수집 목적이 아닌 예시용** 사이트입니다.
- 이름과 이메일은 실제 정보를 입력하지 않아도 됩니다. (예: `aaa@aa.aa`)
- 제출 완료 후 팝업에서 구글 스프레드시트로 바로 이동할 수 있습니다.
