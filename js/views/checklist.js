// 평가 체크리스트: 전체 평가자 체크 + 교시별 실습 체크 종합
import { el } from "../util.js";
import { getLecture, toggleChecklistItem } from "../state.js";

export function renderChecklist(root, { navigate }) {
  const lec = getLecture();

  const wrap = el("section", { class: "view view-checklist" });
  wrap.appendChild(el("h1", { class: "view-h1", text: "평가 체크리스트" }));

  // 전체 진행 카운트
  const allItems = [
    ...(lec.checklist || []),
    ...lec.sessions.flatMap((s) => s.checklist || []),
  ];
  const done = allItems.filter((i) => i.done).length;
  const pct = allItems.length ? Math.round((done / allItems.length) * 100) : 0;
  wrap.appendChild(
    el("div", { class: "progress-block" }, [
      el("div", { class: "row between" }, [
        el("span", { class: "muted", text: "전체 완료" }),
        el("span", { class: "muted", text: `${done}/${allItems.length} · ${pct}%` }),
      ]),
      el("div", { class: "bar" }, [el("div", { class: "bar-fill", style: `width:${pct}%` })]),
    ])
  );

  // 전체 평가자 체크리스트
  if ((lec.checklist || []).length) {
    wrap.appendChild(el("h2", { class: "section-h", text: "평가자 체크리스트" }));
    const cl = el("div", { class: "checklist" });
    lec.checklist.forEach((item) =>
      cl.appendChild(buildRow(item, () => toggleChecklistItem("global", item.id)))
    );
    wrap.appendChild(cl);
  }

  // 교시별 실습 체크
  lec.sessions.forEach((s) => {
    if (!(s.checklist || []).length) return;
    wrap.appendChild(
      el("div", { class: "row between section-h-row" }, [
        el("h2", { class: "section-h", text: `${s.label} · ${s.title}` }),
        el("button", {
          class: "link-btn",
          text: "열기",
          onClick: () => navigate(`#/session/${s.id}`),
        }),
      ])
    );
    const cl = el("div", { class: "checklist" });
    s.checklist.forEach((item) =>
      cl.appendChild(buildRow(item, () => toggleChecklistItem(s.id, item.id)))
    );
    wrap.appendChild(cl);
  });

  root.appendChild(wrap);
}

function buildRow(item, onToggle) {
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
