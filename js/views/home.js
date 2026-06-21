// 홈 / 오늘 대시보드: 현재 교시, 대형 타이머, 진행률, 빠른 이동
import { el, fmtClock, hmToMinutes, nowMinutes } from "../util.js";
import { getLecture } from "../state.js";
import { timer } from "../timer.js";

// 현재 시각 기준으로 진행 중/다음 교시 추정
export function computeSessionStatus(sessions) {
  const now = nowMinutes();
  let current = null;
  let next = null;
  const annotated = sessions.map((s) => {
    const start = hmToMinutes(s.start);
    const end = hmToMinutes(s.end);
    let status = "upcoming";
    if (start != null && end != null) {
      if (now >= end) status = "done";
      else if (now >= start) status = "current";
    }
    return { ...s, _start: start, _end: end, _status: status };
  });
  current = annotated.find((s) => s._status === "current") || null;
  next = annotated.find((s) => s._status === "upcoming") || null;
  return { annotated, current, next, now };
}

export function renderHome(root, { navigate }) {
  const lec = getLecture();
  const { annotated, current, next } = computeSessionStatus(lec.sessions);
  const doneCount = annotated.filter((s) => s._status === "done").length;
  const total = annotated.length || 1;
  const focus = current || next || annotated[0];

  const wrap = el("section", { class: "view view-home" });

  // 헤더
  wrap.appendChild(
    el("div", { class: "home-head" }, [
      el("h1", { class: "lec-title", text: lec.title }),
      lec.subtitle ? el("p", { class: "lec-sub", text: lec.subtitle }) : null,
    ])
  );

  // 대형 타이머 카드
  const timerCard = el("div", { class: "timer-card", id: "home-timer" });
  const timerLabel = el("div", { class: "timer-label" });
  const timerDisplay = el("div", { class: "timer-display", text: "00:00" });
  const timerSub = el("div", { class: "timer-sub" });
  const controls = el("div", { class: "timer-controls" }, [
    el("button", {
      class: "btn big",
      id: "t-toggle",
      text: "시작",
      onClick: () => timer.toggle(),
    }),
    el("button", {
      class: "btn ghost",
      text: "리셋",
      onClick: () => timer.reset(),
    }),
  ]);
  timerCard.append(timerLabel, timerDisplay, timerSub, controls);
  wrap.appendChild(timerCard);

  // 현재/포커스 교시 카드
  if (focus) {
    const card = el("button", {
      class: "session-focus card tappable",
      onClick: () => navigate(`#/session/${focus.id}`),
    });
    card.append(
      el("div", { class: "row between" }, [
        el("span", { class: `pill ${current ? "live" : ""}`, text: current ? "진행 중" : "다음" }),
        el("span", { class: "muted", text: `${focus.start}–${focus.end}` }),
      ]),
      el("div", { class: "session-focus-title", text: `${focus.label}. ${focus.title}` }),
      el(
        "ul",
        { class: "obj-list" },
        (focus.objectives || []).slice(0, 3).map((o) => el("li", { text: o }))
      )
    );
    wrap.appendChild(card);
  }

  // 다음 교시 미리보기
  if (current && next) {
    wrap.appendChild(
      el("button", {
        class: "next-preview tappable",
        onClick: () => navigate(`#/session/${next.id}`),
        html: `<span class="muted">다음</span> <strong>${next.label}. ${next.title}</strong> <span class="muted">${next.start}–${next.end}</span>`,
      })
    );
  }

  // 하루 진행률
  const pct = Math.round((doneCount / total) * 100);
  wrap.appendChild(
    el("div", { class: "progress-block" }, [
      el("div", { class: "row between" }, [
        el("span", { class: "muted", text: "오늘 진행률" }),
        el("span", { class: "muted", text: `${doneCount}/${total} 교시 · ${pct}%` }),
      ]),
      el("div", { class: "bar" }, [el("div", { class: "bar-fill", style: `width:${pct}%` })]),
    ])
  );

  // 교시 빠른 이동
  const quick = el("div", { class: "quick-grid" });
  annotated.forEach((s) => {
    quick.appendChild(
      el("button", {
        class: `quick-cell tappable ${s._status}`,
        onClick: () => navigate(`#/session/${s.id}`),
        html: `<span class="q-label">${s.label}</span><span class="q-time">${s.start}</span>`,
      })
    );
  });
  wrap.append(el("h2", { class: "section-h", text: "교시 빠른 이동" }), quick);

  root.appendChild(wrap);

  // 타이머 표시 갱신 + 포커스 교시 시간으로 초기화
  if (focus && (timer.label !== `${focus.label} ${focus.title}` && timer.state().status === "ready")) {
    timer.setDuration(focus.durationMin || 50, `${focus.label} ${focus.title}`);
  }
  const paint = (st) => {
    timerLabel.textContent = st.label || "타이머";
    timerDisplay.textContent = fmtClock(st.remainingSec);
    timerCard.dataset.level = st.level;
    timerSub.textContent =
      st.status === "done" ? "시간 종료" : st.running ? "진행 중" : st.status === "paused" ? "일시정지" : "대기";
    const toggleBtn = timerCard.querySelector("#t-toggle");
    if (toggleBtn) toggleBtn.textContent = st.running ? "일시정지" : st.remainingSec <= 0 ? "다시" : "시작";
  };
  paint(timer.state());
  const off = timer.onTick(paint);
  // 뷰 교체 시 정리
  return () => off();
}
