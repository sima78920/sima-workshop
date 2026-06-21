// 부트스트랩 + 해시 라우터 + 서비스워커 등록
import { $, el } from "./util.js";
import { subscribe } from "./state.js";
import { applyTheme } from "./views/settings.js";
import { renderHome } from "./views/home.js";
import { renderAgenda } from "./views/agenda.js";
import { renderSession } from "./views/session.js";
import { renderCheats } from "./views/cheats.js";
import { renderChecklist } from "./views/checklist.js";
import { renderSettings } from "./views/settings.js";

const app = $("#app");
let cleanup = null; // 현재 뷰의 정리 함수 (타이머 리스너 등)

const NAV = [
  { hash: "#/home", icon: "🏠", label: "오늘" },
  { hash: "#/agenda", icon: "🗓", label: "타임라인" },
  { hash: "#/cheats", icon: "⚡️", label: "치트시트" },
  { hash: "#/checklist", icon: "✅", label: "체크" },
  { hash: "#/settings", icon: "⚙️", label: "설정" },
];

function parseHash() {
  const raw = (location.hash || "#/home").slice(1); // "/session/s1?focus=x"
  const [path, qs] = raw.split("?");
  const parts = path.split("/").filter(Boolean); // ["session","s1"]
  const route = parts[0] || "home";
  let params = parts[1] || null;
  if (qs) params = (params ? params + "&" : "") + qs; // cheats?focus=...
  // cheats 에서 focus 쿼리만 있을 때
  if (route === "cheats" && qs) params = qs;
  return { route, params };
}

function navigate(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function render() {
  if (cleanup) {
    try {
      cleanup();
    } catch (e) {}
    cleanup = null;
  }
  const { route, params } = parseHash();
  app.innerHTML = "";
  app.scrollTop = 0;

  const ctx = { navigate, params, rerender: render };
  let result;
  switch (route) {
    case "home":
      result = renderHome(app, ctx);
      break;
    case "agenda":
      result = renderAgenda(app, ctx);
      break;
    case "session":
      result = renderSession(app, ctx);
      break;
    case "cheats":
      result = renderCheats(app, ctx);
      break;
    case "checklist":
      result = renderChecklist(app, ctx);
      break;
    case "settings":
      result = renderSettings(app, ctx);
      break;
    default:
      navigate("#/home");
      return;
  }
  if (typeof result === "function") cleanup = result;

  updateNav(route);
}

function updateNav(route) {
  const navEl = $("#nav");
  navEl.querySelectorAll(".nav-item").forEach((b) => {
    const active = b.dataset.route === route || (route === "session" && b.dataset.route === "agenda");
    b.classList.toggle("active", active);
  });
}

function buildNav() {
  const nav = el("nav", { id: "nav", class: "bottom-nav" });
  NAV.forEach((n) => {
    nav.appendChild(
      el("button", {
        class: "nav-item",
        dataset: { route: n.hash.split("/")[1] },
        onClick: () => navigate(n.hash),
        html: `<span class="nav-ico">${n.icon}</span><span class="nav-lbl">${n.label}</span>`,
      })
    );
  });
  document.body.appendChild(nav);
}

function boot() {
  applyTheme();
  buildNav();
  if (!location.hash) location.hash = "#/home";
  window.addEventListener("hashchange", render);
  // 프로필/설정 변경 시 현재 뷰가 설정 화면이 아니라면 가볍게 다시 그릴 필요는 없음;
  // 편집은 render(rerender)로 직접 갱신하므로 별도 구독 최소화.
  render();

  // 서비스워커 등록 (오프라인)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

boot();
