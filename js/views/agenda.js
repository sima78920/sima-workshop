// 타임라인 / 교시 목록
import { el } from "../util.js";
import { getLecture } from "../state.js";
import { computeSessionStatus } from "./home.js";

const STATUS_LABEL = { done: "완료", current: "진행 중", upcoming: "예정" };

export function renderAgenda(root, { navigate }) {
  const lec = getLecture();
  const { annotated } = computeSessionStatus(lec.sessions);

  const wrap = el("section", { class: "view view-agenda" });
  wrap.appendChild(el("h1", { class: "view-h1", text: "타임라인" }));

  if (!annotated.length) {
    wrap.appendChild(el("p", { class: "empty", text: "교시가 없습니다. 설정 > 편집에서 추가하세요." }));
    root.appendChild(wrap);
    return;
  }

  const list = el("div", { class: "timeline" });
  let lunchInserted = false;
  annotated.forEach((s, i) => {
    // 점심시간 표시 (이전 종료~이번 시작 간 공백이 있고 정오 부근이면)
    const prev = annotated[i - 1];
    if (
      !lunchInserted &&
      prev &&
      prev._end != null &&
      s._start != null &&
      s._start - prev._end >= 30 &&
      prev._end <= 13 * 60 &&
      s._start >= 12 * 60
    ) {
      list.appendChild(
        el("div", { class: "lunch-row", html: `🍱 점심시간 · ${prev.end}–${s.start}` })
      );
      lunchInserted = true;
    }

    const card = el("button", {
      class: `tl-card tappable ${s._status}`,
      onClick: () => navigate(`#/session/${s.id}`),
    });
    const checkDone = (s.checklist || []).filter((c) => c.done).length;
    const checkTotal = (s.checklist || []).length;
    card.append(
      el("div", { class: "tl-time" }, [
        el("span", { class: "tl-start", text: s.start || "--:--" }),
        el("span", { class: "tl-end", text: s.end || "" }),
      ]),
      el("div", { class: "tl-body" }, [
        el("div", { class: "row between" }, [
          el("span", { class: "tl-label", text: s.label }),
          el("span", { class: `pill ${s._status}`, text: STATUS_LABEL[s._status] }),
        ]),
        el("div", { class: "tl-title", text: s.title }),
        checkTotal
          ? el("div", { class: "muted small", text: `실습 체크 ${checkDone}/${checkTotal}` })
          : null,
      ])
    );
    list.appendChild(card);
  });

  wrap.appendChild(list);
  root.appendChild(wrap);
}
