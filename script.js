// ============================================================
// script.js - 폼 로직 및 Google Sheets 연동
// ============================================================

// ★★★ 여기에 Google Apps Script 웹앱 URL을 입력하세요 ★★★
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywH8IiqlMS6ZvuUvyAziTCNzhnQ-0CjSCv1eXw9iEi3SFD48j48q9PX2l3OmPD5OAEvA/exec";

// ============================================================
// 초기화
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initAgreeToggle();
  initEmailValidation();
  initCheckboxProgress();
  initChannelCards();
  initFormSubmit();
});

// ============================================================
// 진행률 업데이트 (터미널 스타일 바)
// ============================================================
function updateProgress() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const fieldsChecked = document.querySelectorAll('input[name="fields"]:checked').length > 0;
  const channelSelected = document.querySelector('input[name="channel"]:checked');
  const agreed = document.getElementById("agree").checked;

  const steps = [
    name !== "",
    email !== "" && emailValid,
    fieldsChecked,
    channelSelected !== null,
    agreed
  ];

  const filled = steps.filter(Boolean).length;
  const total = steps.length;
  const percent = Math.round((filled / total) * 100);

  // 퍼센트 텍스트 업데이트
  const pctEl = document.getElementById("prog-pct");
  if (pctEl) pctEl.textContent = percent + "%";

  // 터미널 스타일 진행 바: [=====>........]
  const barEl = document.getElementById("prog-bar");
  if (barEl) {
    const barWidth = 30;
    const filled30 = Math.round((percent / 100) * barWidth);
    const empty30 = barWidth - filled30;
    const arrow = filled30 > 0 ? ">" : "";
    const bar = "=".repeat(Math.max(0, filled30 - 1)) + arrow + ".".repeat(empty30);
    barEl.textContent = bar;
    barEl.style.color = percent === 100 ? "var(--green)" : "var(--green-dim)";
  }
}

// ============================================================
// 이메일 유효성 검사 (실시간)
// ============================================================
function initEmailValidation() {
  const emailInput = document.getElementById("email");
  const errorMsg = document.getElementById("email-error");

  emailInput.addEventListener("input", () => {
    const val = emailInput.value.trim();

    if (val === "") {
      emailInput.classList.remove("error", "valid");
      errorMsg.classList.remove("show");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      emailInput.classList.add("error");
      emailInput.classList.remove("valid");
      errorMsg.classList.add("show");
    } else {
      emailInput.classList.remove("error");
      emailInput.classList.add("valid");
      errorMsg.classList.remove("show");
    }

    updateProgress();
  });

  document.getElementById("name").addEventListener("input", updateProgress);
}

// ============================================================
// 체크박스 진행률 연동
// ============================================================
function initCheckboxProgress() {
  document.querySelectorAll('input[name="fields"]').forEach(cb => {
    cb.addEventListener("change", updateProgress);
  });
  document.querySelectorAll('input[name="channel"]').forEach(r => {
    r.addEventListener("change", updateProgress);
  });
}

// ============================================================
// 채널 카드 - 선택 마크 처리
// ============================================================
function initChannelCards() {
  document.querySelectorAll('input[name="channel"]').forEach(radio => {
    radio.addEventListener("change", () => {
      // 모든 마크 숨기기
      document.querySelectorAll(".channel-selected-mark").forEach(mark => {
        mark.style.opacity = "0";
      });
      // 선택된 마크 보이기
      const selectedMark = radio.parentElement.querySelector(".channel-selected-mark");
      if (selectedMark) selectedMark.style.opacity = "1";
      updateProgress();
    });
  });
}

// ============================================================
// 동의 체크박스 커스텀 토글
// ============================================================
function initAgreeToggle() {
  const agreeWrap = document.getElementById("agree-wrap");
  const agreeCheckbox = document.getElementById("agree");

  agreeWrap.addEventListener("click", () => {
    agreeCheckbox.checked = !agreeCheckbox.checked;
    agreeWrap.classList.toggle("checked", agreeCheckbox.checked);
    updateProgress();
  });
}

// ============================================================
// 폼 유효성 검사
// ============================================================
function validateForm() {
  let valid = true;
  const errors = [];

  const name = document.getElementById("name").value.trim();
  if (!name) {
    errors.push("이름을 입력해주세요.");
    document.getElementById("name").classList.add("error");
    valid = false;
  }

  const email = document.getElementById("email").value.trim();
  if (!email) {
    errors.push("이메일 주소를 입력해주세요.");
    document.getElementById("email").classList.add("error");
    document.getElementById("email-error").classList.add("show");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("올바른 이메일 형식을 입력해주세요.");
    document.getElementById("email").classList.add("error");
    document.getElementById("email-error").classList.add("show");
    valid = false;
  }

  const fields = Array.from(document.querySelectorAll('input[name="fields"]:checked')).map(cb => cb.value);
  if (fields.length === 0) {
    errors.push("궁금한 분야를 최소 하나 선택해주세요.");
    valid = false;
  }

  const channel = document.querySelector('input[name="channel"]:checked');
  if (!channel) {
    errors.push("유입 채널을 선택해주세요.");
    valid = false;
  }

  const agreed = document.getElementById("agree").checked;
  if (!agreed) {
    errors.push("내용을 확인하고 동의해주세요.");
    valid = false;
  }

  return { valid, errors, data: { name, email, fields, channel: channel?.value || "" } };
}

// ============================================================
// 폼 제출
// ============================================================
function initFormSubmit() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { valid, errors, data } = validateForm();

    if (!valid) {
      // 첫 번째 오류 스크롤
      const firstError = document.querySelector(".error, .error-msg.show");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // 간단한 알림 (선택된 분야/채널 없는 경우)
      const missingAlert = errors.filter(e => e.includes("분야") || e.includes("채널") || e.includes("동의"));
      if (missingAlert.length > 0) {
        showInlineError(missingAlert[0]);
      }
      return;
    }

    // 로딩 상태
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.result === "success") {
        showSuccessPopup();
        form.reset();
        document.getElementById("agree-wrap").classList.remove("checked");
        document.querySelectorAll(".channel-selected-mark").forEach(m => m.style.opacity = "0");
        document.querySelectorAll(".form-input").forEach(i => i.classList.remove("error", "valid"));
        updateProgress();
      } else {
        throw new Error(result.message || "서버 오류");
      }
    } catch (err) {
      console.error("제출 오류:", err);
      showInlineError("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
}

// ============================================================
// 인라인 오류 표시 (폼 하단)
// ============================================================
function showInlineError(message) {
  let errorEl = document.getElementById("form-inline-error");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "form-inline-error";
    errorEl.style.cssText = `
      color: #EF4444; font-size: 0.85rem; text-align: center;
      margin-top: 0.75rem; padding: 0.6rem 1rem;
      background: #FEF2F2; border-radius: 8px; border: 1px solid #FCA5A5;
    `;
    document.getElementById("submit-btn").after(errorEl);
  }
  errorEl.textContent = "⚠️ " + message;
  errorEl.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    if (errorEl) errorEl.textContent = "";
  }, 4000);
}

// ============================================================
// 성공 팝업
// ============================================================
function showSuccessPopup() {
  const overlay = document.getElementById("success-popup");
  overlay.classList.add("show");

  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
}

function closePopup() {
  const overlay = document.getElementById("success-popup");
  overlay.classList.remove("show");
}
