// 교시 상세: 목표 · 발표자 메모 · 실습 체크 · 치트시트 · 타이머
import { el, fmtClock } from "../util.js";
import { renderMarkdown } from "../markdown.js";
import { getLecture, getSession, getCheatsheet, toggleChecklistItem } from "../state.js";
import { timer } from "../timer.js";

export function renderSession(root, { navigate, params }) {
  const lec = getLecture();
  const sessionId = params;
  const s = getSession(sessionId);

  const wrap = el("section", { class: "view view-session" });

  if (!s) {
    wrap.appendChild(el("p", { class: "empty", text: "교시를 찾을 수 없습니다." }));
    root.appendChild(wrap);
    return;
  }

  const idx = lec.sessions.findIndex((x) => x.id === s.id);
  const prev = lec.sessions[idx - 1];
  const next = lec.sessions[idx + 1];

  // 헤더
  wrap.appendChild(
    el("div", { class: "sess-head" }, [
      el("div", { class: "row between" }, [
        el("span", { class: "tl-label big", text: s.label }),
        el("span", { class: "muted", text: `${s.start}–${s.end}` }),
      ]),
      el("h1", { class: "view-h1", text: s.title }),
    ])
  );

  // 타이머(컴팩트)
  const tCard = el("div", { class: "timer-card compact" });
  const tDisp = el("div", { class: "timer-display", text: "00:00" });
  const tCtrl = el("div", { class: "timer-controls" }, [
    el("button", { class: "btn", id: "ts-toggle", text: "시작", onClick: () => timer.toggle() }),
    el("button", { class: "btn ghost", text: "리셋", onClick: () => timer.reset() }),
  ]);
  tCard.append(tDisp, tCtrl);
  wrap.appendChild(tCard);

  // 이 교시 시간으로 타이머 설정
  timer.setDuration(s.durationMin || 50, `${s.label} ${s.title}`);

  // 목표
  if ((s.objectives || []).length) {
    wrap.append(
      el("h2", { class: "section-h", text: "학습 목표" }),
      el("ul", { class: "obj-list big" }, s.objectives.map((o) => el("li", { text: o })))
    );
  }

  // 발표자 메모
  if (s.notes && s.notes.trim()) {
    wrap.append(
      el("h2", { class: "section-h", text: "발표자 메모" }),
      el("div", { class: "md card", html: renderMarkdown(s.notes) })
    );
  }

  // 실습 체크리스트
  if ((s.checklist || []).length) {
    wrap.appendChild(el("h2", { class: "section-h", text: "실습 체크" }));
    const cl = el("div", { class: "checklist" });
    s.checklist.forEach((item) => {
      cl.appendChild(buildCheckRow(item, () => {
        toggleChecklistItem(s.id, item.id);
      }));
    });
    wrap.appendChild(cl);
  }

  // 연결된 치트시트
  const sheets = (s.cheatsheetIds || []).map(getCheatsheet).filter(Boolean);
  if (sheets.length) {
    wrap.appendChild(el("h2", { class: "section-h", text: "관련 치트시트" }));
    const chips = el("div", { class: "chip-row" });
    sheets.forEach((sh) => {
      chips.appendChild(
        el("button", {
          class: "chip tappable",
          onClick: () => navigate(`#/cheats?focus=${sh.id}`),
          html: `<span class="chip-tool">${sh.tool}</span> ${sh.title}`,
        })
      );
    });
    wrap.appendChild(chips);
  }

  // 이전/다음 이동
  wrap.appendChild(
    el("div", { class: "nav-prev-next" }, [
      prev
        ? el("button", {
            class: "btn ghost",
            onClick: () => navigate(`#/session/${prev.id}`),
            text: `← ${prev.label}`,
          })
        : el("span"),
      next
        ? el("button", {
            class: "btn ghost",
            onClick: () => navigate(`#/session/${next.id}`),
            text: `${next.label} →`,
          })
        : el("span"),
    ])
  );

  root.appendChild(wrap);

  // 타이머 페인트
  const paint = (st) => {
    tDisp.textContent = fmtClock(st.remainingSec);
    tCard.dataset.level = st.level;
    const b = tCard.querySelector("#ts-toggle");
    if (b) b.textContent = st.running ? "일시정지" : st.remainingSec <= 0 ? "다시" : "시작";
  };
  paint(timer.state());
  const off = timer.onTick(paint);
  return () => off();
}

function buildCheckRow(item, onToggle) {
  const row = el("label", { class: `check-row ${item.done ? "done" : ""}` });
  const box = el("input", { type: "checkbox" });
  box.checked = item.done;
  box.addEventListener("change", () => {
    onToggle();
    row.classList.toggle("done", box.checked);
  });
  row.append(box, el("span", { class: "check-text", text: item.text }));
  return row;
}
