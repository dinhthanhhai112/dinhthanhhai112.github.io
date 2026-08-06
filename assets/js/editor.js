/* Live Visual Inline Text Editor for dinhthanhhai112.github.io */
(function () {
  let isEditing = false;

  const toolbarHtml = `
    <div id="live-editor-toolbar" style="
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000;
      background: rgba(10,10,18,0.88); border: 1px solid rgba(192,132,252,0.35);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-radius: 100px; padding: 8px 20px; display: flex; align-items: center; gap: 12px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.8), 0 0 25px rgba(192,132,252,0.25);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    ">
      <span style="font-size: 13px; font-weight: 700; color: #c084fc; display: flex; align-items: center; gap: 6px;">
        ✏️ Visual Live Editor
      </span>
      <button id="btn-toggle-edit" style="
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
        color: #fff; border-radius: 100px; padding: 6px 14px; font-size: 12px; font-weight: 500; cursor: pointer;
        transition: all 0.2s ease;
      ">Bật Sửa Trực Tiếp</button>
      <button id="btn-save-edit" style="
        background: linear-gradient(135deg, #a78bfa, #60a5fa); border: none;
        color: #fff; border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 600; cursor: pointer;
        transition: opacity 0.2s ease;
      ">💾 Lưu Thay Đổi</button>
      <span id="editor-status" style="font-size: 12px; color: #34d399; font-weight: 600; display: none;">✓ Đã Lưu!</span>
    </div>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    const div = document.createElement("div");
    div.innerHTML = toolbarHtml;
    document.body.appendChild(div.firstElementChild);

    const toggleBtn = document.getElementById("btn-toggle-edit");
    const saveBtn = document.getElementById("btn-save-edit");
    const statusSpan = document.getElementById("editor-status");

    toggleBtn.addEventListener("click", () => {
      isEditing = !isEditing;
      if (isEditing) {
        enableInlineEdit();
        toggleBtn.style.background = "rgba(192,132,252,0.25)";
        toggleBtn.style.borderColor = "#c084fc";
        toggleBtn.textContent = "🔓 Đang Sửa Trực Tiếp...";
      } else {
        disableInlineEdit();
        toggleBtn.style.background = "rgba(255,255,255,0.08)";
        toggleBtn.style.borderColor = "rgba(255,255,255,0.18)";
        toggleBtn.textContent = "Bật Sửa Trực Tiếp";
      }
    });

    saveBtn.addEventListener("click", () => {
      saveInlineEdits();
      statusSpan.style.display = "inline";
      setTimeout(() => { statusSpan.style.display = "none"; }, 2500);
    });
  });

  function enableInlineEdit() {
    const elements = document.querySelectorAll("[data-i18n], h1, h2, h3, p, .hero-title, .section-title, .desc-text, .card-title, .card-desc");
    elements.forEach(el => {
      el.contentEditable = "true";
      el.style.outline = "1px dashed rgba(192,132,252,0.5)";
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
      el.style.cursor = "text";
    });
  }

  function disableInlineEdit() {
    const elements = document.querySelectorAll("[contenteditable]");
    elements.forEach(el => {
      el.contentEditable = "false";
      el.style.outline = "none";
      el.style.padding = "";
      el.style.cursor = "";
    });
  }

  function saveInlineEdits() {
    const lang = localStorage.getItem("dth_lang") || "vi";
    let customEdits = JSON.parse(localStorage.getItem("dth_custom_edits") || "{}");

    if (!customEdits[lang]) customEdits[lang] = {};

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        customEdits[lang][key] = el.innerHTML.trim();
      }
    });

    localStorage.setItem("dth_custom_edits", JSON.stringify(customEdits));

    // Also update current i18n engine live
    if (window.applyCustomEdits) {
      window.applyCustomEdits();
    }
  }
})();
