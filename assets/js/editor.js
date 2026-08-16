/* Private Owner-Only Live Visual Editor for dinhthanhhai112.github.io - Edit ALL Text */
(function () {
  const SECRET_PASS = "thanhhai2003";

  // Check if owner is authenticated (via URL ?edit=thanhhai2003 or stored admin session)
  const urlParams = new URLSearchParams(window.location.search);
  const editParam = urlParams.get("edit");

  if (editParam === SECRET_PASS) {
    sessionStorage.setItem("dth_owner_admin", "true");
  }

  const isOwner = sessionStorage.getItem("dth_owner_admin") === "true";

  // If NOT owner, listen for secret hotkey Ctrl + Shift + E
  if (!isOwner) {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
        const pass = prompt("Nhập mật khẩu Admin để bật Chế độ Sửa:");
        if (pass === SECRET_PASS) {
          sessionStorage.setItem("dth_owner_admin", "true");
          location.reload();
        } else if (pass) {
          alert("Mật khẩu không đúng!");
        }
      }
    });
    return;
  }

  let isEditing = false;

  const toolbarHtml = `
    <div id="live-editor-toolbar" style="
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000;
      background: rgba(10,10,18,0.95); border: 1px solid rgba(192,132,252,0.45);
      backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
      border-radius: 100px; padding: 8px 20px; display: flex; align-items: center; gap: 12px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.9), 0 0 25px rgba(192,132,252,0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    ">
      <span style="font-size: 13px; font-weight: 700; color: #c084fc; display: flex; align-items: center; gap: 6px;">
        🔒 Admin Edit All Text (Sửa Tất Cả Chữ)
      </span>
      <button id="btn-toggle-edit" style="
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
        color: #fff; border-radius: 100px; padding: 6px 14px; font-size: 12px; font-weight: 500; cursor: pointer;
        transition: all 0.2s ease;
      ">Bật Sửa Tất Cả Chữ</button>
      <button id="btn-save-edit" style="
        background: linear-gradient(135deg, #a78bfa, #60a5fa); border: none;
        color: #fff; border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; cursor: pointer;
      ">💾 Lưu Thay Đổi</button>
      <button id="btn-exit-admin" style="
        background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4);
        color: #fca5a5; border-radius: 100px; padding: 6px 12px; font-size: 11px; cursor: pointer;
      ">Thoát Admin</button>
      <span id="editor-status" style="font-size: 12px; color: #34d399; font-weight: 600; display: none;">✓ Đã Lưu Toàn Bộ!</span>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    // Restore any saved page text overrides
    restoreAllEdits();

    const div = document.createElement("div");
    div.innerHTML = toolbarHtml;
    document.body.appendChild(div.firstElementChild);

    const toggleBtn = document.getElementById("btn-toggle-edit");
    const saveBtn = document.getElementById("btn-save-edit");
    const exitBtn = document.getElementById("btn-exit-admin");
    const statusSpan = document.getElementById("editor-status");

    toggleBtn.addEventListener("click", () => {
      isEditing = !isEditing;
      if (isEditing) {
        enableAllTextEditing();
        toggleBtn.style.background = "rgba(192,132,252,0.25)";
        toggleBtn.style.borderColor = "#c084fc";
        toggleBtn.textContent = "🔓 Đang Sửa Tất Cả Chữ...";
      } else {
        disableAllTextEditing();
        toggleBtn.style.background = "rgba(255,255,255,0.08)";
        toggleBtn.style.borderColor = "rgba(255,255,255,0.18)";
        toggleBtn.textContent = "Bật Sửa Tất Cả Chữ";
      }
    });

    saveBtn.addEventListener("click", () => {
      saveAllEdits();
      statusSpan.style.display = "inline";
      setTimeout(() => { statusSpan.style.display = "none"; }, 2500);
    });

    exitBtn.addEventListener("click", () => {
      sessionStorage.removeItem("dth_owner_admin");
      location.href = location.pathname;
    });
  });

  function getTargetElements() {
    const all = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, div, a, li, td, th, strong, em, b, i, button, [data-i18n]");
    const valid = [];
    all.forEach(el => {
      // Ignore toolbar elements
      if (el.closest("#live-editor-toolbar") || el.id === "live-editor-toolbar") return;
      if (el.children.length === 0 || Array.from(el.childNodes).some(n => n.nodeType === 3 && n.nodeValue.trim().length > 0)) {
        if (el.innerText && el.innerText.trim().length > 0) {
          valid.push(el);
        }
      }
    });
    return valid;
  }

  function enableAllTextEditing() {
    const elements = getTargetElements();
    elements.forEach((el, idx) => {
      el.contentEditable = "true";
      el.dataset.editableIdx = idx;
      el.style.outline = "1px dashed rgba(192,132,252,0.6)";
      el.style.borderRadius = "4px";
      el.style.cursor = "text";
    });
  }

  function disableAllTextEditing() {
    const elements = document.querySelectorAll("[contenteditable]");
    elements.forEach(el => {
      el.contentEditable = "false";
      el.style.outline = "none";
      el.style.cursor = "";
    });
  }

  function saveAllEdits() {
    const pageKey = "dth_page_edits_" + window.location.pathname;
    const lang = localStorage.getItem("dth_lang") || "vi";
    const customEdits = JSON.parse(localStorage.getItem("dth_custom_edits") || "{}");
    if (!customEdits[lang]) customEdits[lang] = {};

    const pageData = {};

    document.querySelectorAll("[data-editable-idx]").forEach(el => {
      const idx = el.dataset.editableIdx;
      const htmlVal = el.innerHTML.trim();
      pageData[idx] = htmlVal;

      const i18nKey = el.getAttribute("data-i18n");
      if (i18nKey) {
        customEdits[lang][i18nKey] = htmlVal;
      }
    });

    localStorage.setItem(pageKey, JSON.stringify(pageData));
    localStorage.setItem("dth_custom_edits", JSON.stringify(customEdits));

    if (window.applyCustomEdits) {
      window.applyCustomEdits();
    }
  }

  function restoreAllEdits() {
    const pageKey = "dth_page_edits_" + window.location.pathname;
    const pageData = JSON.parse(localStorage.getItem(pageKey) || "{}");
    const elements = getTargetElements();

    elements.forEach((el, idx) => {
      if (pageData[idx] !== undefined) {
        el.innerHTML = pageData[idx];
      }
    });
  }
})();
