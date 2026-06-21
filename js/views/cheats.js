// 치트시트: 툴별 탭 + 프롬프트 카드(한 번 탭 복사) + 검색
import { el, copyText, toast, escapeHtml } from "../util.js";
import { renderMarkdown } from "../markdown.js";
import { getLecture } from "../state.js";

let activeTool = null;
let query = "";

export function renderCheats(root, { params }) {
  const lec = getLecture();
  const sheets = lec.cheatsheets || [];

  // params 형태: "focus=ID" (교시 상세에서 진입)
  let focusId = null;
  if (params && params.startsWith("focus=")) focusId = params.slice(6);

  const tools = [...new Set(sheets.map((s) => s.tool))];
  if (focusId) {
    const f = sheets.find((s) => s.id === focusId);
    if (f) activeTool = f.tool;
  }
  if (!activeTool || !tools.includes(activeTool)) activeTool = tools[0] || null;

  const wrap = el("section", { class: "view view-cheats" });
  wrap.appendChild(el("h1", { class: "view-h1", text: "치트시트" }));

  if (!sheets.length) {
    wrap.appendChild(el("p", { class: "empty", text: "치트시트가 없습니다. 설정 > 편집에서 추가하세요." }));
    root.appendChild(wrap);
    return;
  }

  // 검색
  const search = el("input", {
    class: "search",
    type: "search",
    placeholder: "프롬프트/내용 검색…",
    value: query,
  });
  search.addEventListener("input", () => {
    query = search.value.trim();
    paintList();
  });
  wrap.appendChild(search);

  // 툴 탭
  const tabs = el("div", { class: "tabs" });
  tools.forEach((t) => {
    tabs.appendChild(
      el("button", {
        class: `tab ${t === activeTool ? "active" : ""}`,
        text: t,
        onClick: () => {
          activeTool = t;
          query = "";
          search.value = "";
          paintTabs();
          paintList();
        },
      })
    );
  });
  wrap.appendChild(tabs);

  const listWrap = el("div", { class: "cheat-list" });
  wrap.appendChild(listWrap);
  root.appendChild(wrap);

  function paintTabs() {
    Array.from(tabs.children).forEach((b) =>
      b.classList.toggle("active", b.textContent === activeTool)
    );
  }

  function matches(sh) {
    if (!query) return true;
    const q = query.toLowerCase();
    if ((sh.title || "").toLowerCase().includes(q)) return true;
    if ((sh.body || "").toLowerCase().includes(q)) return true;
    return (sh.prompts || []).some(
      (p) => (p.label || "").toLowerCase().includes(q) || (p.text || "").toLowerCase().includes(q)
    );
  }

  function paintList() {
    listWrap.innerHTML = "";
    const shown = sheets.filter((s) => (query ? matches(s) : s.tool === activeTool));
    if (!shown.length) {
      listWrap.appendChild(el("p", { class: "empty", text: "결과가 없습니다." }));
      return;
    }
    shown.forEach((sh) => listWrap.appendChild(buildSheet(sh)));
    if (focusId) {
      const target = listWrap.querySelector(`[data-sheet="${focusId}"]`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      focusId = null;
    }
  }

  paintList();
}

function buildSheet(sh) {
  const card = el("div", { class: "card sheet", dataset: { sheet: sh.id } });
  card.append(
    el("div", { class: "row between" }, [
      el("h3", { class: "sheet-title", text: sh.title }),
      el("span", { class: "chip-tool", text: sh.tool }),
    ])
  );
  if (sh.body && sh.body.trim()) {
    card.appendChild(el("div", { class: "md small-md", html: renderMarkdown(sh.body) }));
  }
  (sh.prompts || []).forEach((p) => {
    const block = el("div", { class: "prompt-block" });
    const head = el("div", { class: "row between" }, [
      el("span", { class: "prompt-label", text: p.label || "프롬프트" }),
      el("button", {
        class: "btn copy",
        text: "복사",
        onClick: async (e) => {
          const ok = await copyText(p.text);
          toast(ok ? "복사됨" : "복사 실패");
          if (ok) {
            e.target.textContent = "✓ 복사됨";
            setTimeout(() => (e.target.textContent = "복사"), 1200);
          }
        },
      }),
    ]);
    const pre = el("pre", { class: "prompt-text", html: escapeHtml(p.text) });
    block.append(head, pre);
    card.appendChild(block);
  });
  return card;
}
