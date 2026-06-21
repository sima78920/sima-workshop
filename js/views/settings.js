// 설정 + 편집기 + Import/Export + 프로필 전환
import { el, uid, toast, copyText } from "../util.js";
import {
  getLecture,
  getSettings,
  getProfiles,
  getActiveId,
  updateSettings,
  updateLecture,
  setActive,
  addProfile,
  duplicateActiveProfile,
  deleteProfile,
  resetActiveToDefault,
  exportActive,
  importProfile,
} from "../state.js";

export function renderSettings(root, { navigate, rerender }) {
  const wrap = el("section", { class: "view view-settings" });
  wrap.appendChild(el("h1", { class: "view-h1", text: "설정 · 편집" }));

  wrap.appendChild(buildAppSettings(rerender));
  wrap.appendChild(buildProfiles(rerender));
  wrap.appendChild(buildImportExport(rerender));
  wrap.appendChild(buildEditor(rerender));

  root.appendChild(wrap);
}

/* ---------- 앱 설정 ---------- */
function buildAppSettings(rerender) {
  const s = getSettings();
  const box = el("div", { class: "card settings-group" });
  box.appendChild(el("h2", { class: "section-h", text: "앱 설정" }));

  // 테마
  box.appendChild(
    field("테마", [
      toggleBtns(
        [
          ["dark", "다크"],
          ["light", "라이트"],
        ],
        s.theme,
        (v) => {
          updateSettings({ theme: v });
          applyTheme();
          rerender();
        }
      ),
    ])
  );

  // 폰트 크기
  box.appendChild(
    field("글자 크기", [
      toggleBtns(
        [
          [0.9, "작게"],
          [1, "보통"],
          [1.15, "크게"],
          [1.3, "아주 크게"],
        ],
        s.fontScale,
        (v) => {
          updateSettings({ fontScale: Number(v) });
          applyTheme();
          rerender();
        }
      ),
    ])
  );

  // 기본 교시 길이
  const dur = el("input", { type: "number", class: "inp narrow", value: s.defaultDurationMin, min: "1" });
  dur.addEventListener("change", () => updateSettings({ defaultDurationMin: Number(dur.value) || 50 }));
  box.appendChild(field("기본 교시 길이(분)", [dur]));

  return box;
}

/* ---------- 프로필 ---------- */
function buildProfiles(rerender) {
  const box = el("div", { class: "card settings-group" });
  box.appendChild(el("h2", { class: "section-h", text: "강의 프로필" }));

  const profiles = getProfiles();
  const activeId = getActiveId();
  const sel = el("select", { class: "inp" });
  profiles.forEach((p) =>
    sel.appendChild(el("option", { value: p.id, text: p.title, selected: p.id === activeId }))
  );
  sel.addEventListener("change", () => {
    setActive(sel.value);
    rerender();
  });
  box.appendChild(field("활성 강의", [sel]));

  box.appendChild(
    el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn",
        text: "새 강의",
        onClick: () => {
          const name = prompt("새 강의 이름", "새 강의");
          if (name != null) {
            addProfile(name);
            rerender();
          }
        },
      }),
      el("button", {
        class: "btn",
        text: "복제",
        onClick: () => {
          duplicateActiveProfile();
          toast("복제됨");
          rerender();
        },
      }),
      el("button", {
        class: "btn ghost",
        text: "기본값 복원",
        onClick: () => {
          if (confirm("활성 강의를 기본 워크숍 내용으로 되돌립니다. 계속할까요?")) {
            resetActiveToDefault();
            toast("기본값으로 복원됨");
            rerender();
          }
        },
      }),
      el("button", {
        class: "btn danger",
        text: "삭제",
        onClick: () => {
          if (getProfiles().length <= 1) {
            toast("마지막 프로필은 삭제할 수 없습니다");
            return;
          }
          if (confirm("이 강의 프로필을 삭제할까요?")) {
            deleteProfile(getActiveId());
            rerender();
          }
        },
      }),
    ])
  );
  return box;
}

/* ---------- Import / Export ---------- */
function buildImportExport(rerender) {
  const box = el("div", { class: "card settings-group" });
  box.appendChild(el("h2", { class: "section-h", text: "가져오기 / 내보내기 (JSON)" }));
  box.appendChild(
    el("p", { class: "muted small", text: "다른 강의에서 재사용하려면 내보낸 JSON을 저장해 두었다가 가져오세요." })
  );

  const ta = el("textarea", { class: "json-area", rows: "6", spellcheck: "false" });

  box.appendChild(
    el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn",
        text: "현재 강의 내보내기",
        onClick: () => {
          ta.value = exportActive();
          toast("아래 칸에 JSON 생성됨");
        },
      }),
      el("button", {
        class: "btn",
        text: "클립보드 복사",
        onClick: async () => {
          if (!ta.value) ta.value = exportActive();
          const ok = await copyText(ta.value);
          toast(ok ? "복사됨" : "복사 실패");
        },
      }),
      el("button", {
        class: "btn",
        text: "파일로 저장",
        onClick: () => {
          const blob = new Blob([exportActive()], { type: "application/json" });
          const a = el("a", {
            href: URL.createObjectURL(blob),
            download: `${getLecture().title || "lecture"}.json`,
          });
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      }),
    ])
  );

  box.appendChild(ta);

  const fileInput = el("input", { type: "file", accept: "application/json,.json", class: "hidden-file" });
  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importProfile(reader.result);
        toast("가져오기 완료");
        rerender();
      } catch (e) {
        toast("가져오기 실패: " + e.message);
      }
    };
    reader.readAsText(f);
  });

  box.appendChild(
    el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn",
        text: "텍스트에서 가져오기",
        onClick: () => {
          try {
            importProfile(ta.value);
            toast("가져오기 완료");
            rerender();
          } catch (e) {
            toast("가져오기 실패: " + e.message);
          }
        },
      }),
      el("button", { class: "btn", text: "파일에서 가져오기", onClick: () => fileInput.click() }),
      fileInput,
    ])
  );
  return box;
}

/* ---------- 편집기 ---------- */
function buildEditor(rerender) {
  const lec = getLecture();
  const box = el("div", { class: "card settings-group" });
  box.appendChild(el("h2", { class: "section-h", text: "강의 내용 편집" }));

  // 기본 정보
  box.append(
    textField("강의 제목", lec.title, (v) => updateLecture((l) => (l.title = v))),
    textField("부제목", lec.subtitle, (v) => updateLecture((l) => (l.subtitle = v))),
    textField("날짜", lec.date, (v) => updateLecture((l) => (l.date = v)), "예: 2026-06-21")
  );

  // 과정 요약 meta
  const m = lec.meta || {};
  const metaDetails = el("details", { class: "edit-details" }, [
    el("summary", { text: "과정 요약 (목표/대상/평가/교재)" }),
  ]);
  metaDetails.append(
    textArea("훈련 목표", m.goal, (v) => updateLecture((l) => (l.meta.goal = v))),
    textField("훈련 기간", m.period, (v) => updateLecture((l) => (l.meta.period = v))),
    textArea("훈련 대상", m.audience, (v) => updateLecture((l) => (l.meta.audience = v))),
    textField("평가 방법", m.evaluation, (v) => updateLecture((l) => (l.meta.evaluation = v))),
    textField("활용 교재", m.materials, (v) => updateLecture((l) => (l.meta.materials = v)))
  );
  box.appendChild(metaDetails);

  // 교시 편집
  const sessDetails = el("details", { class: "edit-details" }, [
    el("summary", { text: `교시 (${lec.sessions.length})` }),
  ]);
  lec.sessions.forEach((s) => sessDetails.appendChild(sessionEditor(s, rerender)));
  sessDetails.appendChild(
    el("button", {
      class: "btn full",
      text: "+ 교시 추가",
      onClick: () => {
        updateLecture((l) => {
          const order = l.sessions.length + 1;
          l.sessions.push({
            id: uid("s"),
            order,
            label: `${order}교시`,
            title: "새 교시",
            start: "",
            end: "",
            durationMin: getSettings().defaultDurationMin,
            objectives: [],
            notes: "",
            checklist: [],
            cheatsheetIds: [],
          });
        });
        rerender();
      },
    })
  );
  box.appendChild(sessDetails);

  // 치트시트 편집
  const chDetails = el("details", { class: "edit-details" }, [
    el("summary", { text: `치트시트 (${lec.cheatsheets.length})` }),
  ]);
  lec.cheatsheets.forEach((c) => chDetails.appendChild(cheatEditor(c, rerender)));
  chDetails.appendChild(
    el("button", {
      class: "btn full",
      text: "+ 치트시트 추가",
      onClick: () => {
        updateLecture((l) => {
          l.cheatsheets.push({ id: uid("ch"), tool: "기타", title: "새 치트시트", body: "", prompts: [] });
        });
        rerender();
      },
    })
  );
  box.appendChild(chDetails);

  // 전체 평가 체크리스트 편집
  const clDetails = el("details", { class: "edit-details" }, [
    el("summary", { text: `평가자 체크리스트 (${lec.checklist.length})` }),
  ]);
  clDetails.appendChild(checklistEditor(lec.checklist, "global", rerender));
  box.appendChild(clDetails);

  return box;
}

function sessionEditor(s, rerender) {
  const blk = el("div", { class: "sub-edit" });
  blk.append(
    el("div", { class: "row between" }, [
      el("strong", { text: s.label || "교시" }),
      el("button", {
        class: "btn danger small",
        text: "삭제",
        onClick: () => {
          if (confirm(`${s.label} 삭제?`)) {
            updateLecture((l) => (l.sessions = l.sessions.filter((x) => x.id !== s.id)));
            rerender();
          }
        },
      }),
    ]),
    textField("라벨", s.label, (v) => updateLecture((l) => (find(l.sessions, s.id).label = v))),
    textField("제목", s.title, (v) => updateLecture((l) => (find(l.sessions, s.id).title = v))),
    el("div", { class: "row gap" }, [
      textField("시작(HH:MM)", s.start, (v) => updateLecture((l) => (find(l.sessions, s.id).start = v))),
      textField("종료(HH:MM)", s.end, (v) => updateLecture((l) => (find(l.sessions, s.id).end = v))),
    ]),
    numField("길이(분)", s.durationMin, (v) => updateLecture((l) => (find(l.sessions, s.id).durationMin = v))),
    textArea("학습 목표 (줄바꿈으로 구분)", (s.objectives || []).join("\n"), (v) =>
      updateLecture((l) => (find(l.sessions, s.id).objectives = splitLines(v)))
    ),
    textArea("발표자 메모 (마크다운)", s.notes, (v) => updateLecture((l) => (find(l.sessions, s.id).notes = v)))
  );

  // 실습 체크리스트
  blk.append(el("div", { class: "mini-h", text: "실습 체크" }));
  blk.appendChild(checklistEditor(s.checklist, s.id, rerender));

  // 치트시트 연결
  const lec = getLecture();
  if (lec.cheatsheets.length) {
    const chips = el("div", { class: "chip-row wrap" });
    lec.cheatsheets.forEach((sh) => {
      const on = (s.cheatsheetIds || []).includes(sh.id);
      chips.appendChild(
        el("button", {
          class: `chip toggle ${on ? "on" : ""}`,
          text: `${sh.tool}: ${sh.title}`,
          onClick: () => {
            updateLecture((l) => {
              const ss = find(l.sessions, s.id);
              ss.cheatsheetIds = ss.cheatsheetIds || [];
              if (ss.cheatsheetIds.includes(sh.id))
                ss.cheatsheetIds = ss.cheatsheetIds.filter((x) => x !== sh.id);
              else ss.cheatsheetIds.push(sh.id);
            });
            rerender();
          },
        })
      );
    });
    blk.append(el("div", { class: "mini-h", text: "연결 치트시트" }), chips);
  }

  return blk;
}

function cheatEditor(c, rerender) {
  const blk = el("div", { class: "sub-edit" });
  blk.append(
    el("div", { class: "row between" }, [
      el("strong", { text: c.title || "치트시트" }),
      el("button", {
        class: "btn danger small",
        text: "삭제",
        onClick: () => {
          if (confirm("치트시트 삭제?")) {
            updateLecture((l) => {
              l.cheatsheets = l.cheatsheets.filter((x) => x.id !== c.id);
              l.sessions.forEach((s) => {
                if (s.cheatsheetIds) s.cheatsheetIds = s.cheatsheetIds.filter((x) => x !== c.id);
              });
            });
            rerender();
          }
        },
      }),
    ]),
    textField("툴", c.tool, (v) => updateLecture((l) => (findC(l, c.id).tool = v)), "ChatGPT / Midjourney / ComfyUI / Photoshop"),
    textField("제목", c.title, (v) => updateLecture((l) => (findC(l, c.id).title = v))),
    textArea("설명 (마크다운)", c.body, (v) => updateLecture((l) => (findC(l, c.id).body = v)))
  );

  blk.append(el("div", { class: "mini-h", text: "프롬프트" }));
  (c.prompts || []).forEach((p, i) => {
    blk.append(
      el("div", { class: "prompt-edit" }, [
        textField("라벨", p.label, (v) => updateLecture((l) => (findC(l, c.id).prompts[i].label = v))),
        textArea("내용", p.text, (v) => updateLecture((l) => (findC(l, c.id).prompts[i].text = v))),
        el("button", {
          class: "btn danger small",
          text: "프롬프트 삭제",
          onClick: () => {
            updateLecture((l) => findC(l, c.id).prompts.splice(i, 1));
            rerender();
          },
        }),
      ])
    );
  });
  blk.appendChild(
    el("button", {
      class: "btn small",
      text: "+ 프롬프트 추가",
      onClick: () => {
        updateLecture((l) => {
          const cc = findC(l, c.id);
          cc.prompts = cc.prompts || [];
          cc.prompts.push({ label: "프롬프트", text: "" });
        });
        rerender();
      },
    })
  );
  return blk;
}

function checklistEditor(list, owner, rerender) {
  const box = el("div", { class: "checklist-edit" });
  (list || []).forEach((item, i) => {
    box.appendChild(
      el("div", { class: "row gap" }, [
        textInput(item.text, (v) =>
          updateLecture((l) => (targetList(l, owner)[i].text = v))
        ),
        el("button", {
          class: "btn danger small",
          text: "✕",
          onClick: () => {
            updateLecture((l) => targetList(l, owner).splice(i, 1));
            rerender();
          },
        }),
      ])
    );
  });
  box.appendChild(
    el("button", {
      class: "btn small",
      text: "+ 항목 추가",
      onClick: () => {
        updateLecture((l) => targetList(l, owner).push({ id: uid("c"), text: "새 항목", done: false }));
        rerender();
      },
    })
  );
  return box;
}

/* ---------- 헬퍼 ---------- */
function find(arr, id) {
  return arr.find((x) => x.id === id);
}
function findC(l, id) {
  return l.cheatsheets.find((x) => x.id === id);
}
function targetList(l, owner) {
  if (owner === "global") {
    l.checklist = l.checklist || [];
    return l.checklist;
  }
  const s = find(l.sessions, owner);
  s.checklist = s.checklist || [];
  return s.checklist;
}
function splitLines(v) {
  return v.split("\n").map((x) => x.trim()).filter(Boolean);
}

function field(label, controls) {
  return el("div", { class: "field" }, [el("label", { class: "field-label", text: label }), el("div", { class: "field-ctrl" }, controls)]);
}
function textField(label, value, onChange, ph = "") {
  return field(label, [textInput(value, onChange, ph)]);
}
function numField(label, value, onChange) {
  const inp = el("input", { type: "number", class: "inp narrow", value: value ?? "" });
  inp.addEventListener("change", () => onChange(Number(inp.value) || 0));
  return field(label, [inp]);
}
function textInput(value, onChange, ph = "") {
  const inp = el("input", { type: "text", class: "inp", value: value ?? "", placeholder: ph });
  inp.addEventListener("change", () => onChange(inp.value));
  return inp;
}
function textArea(label, value, onChange) {
  const ta = el("textarea", { class: "inp ta", rows: "3" });
  ta.value = value ?? "";
  ta.addEventListener("change", () => onChange(ta.value));
  return field(label, [ta]);
}
function toggleBtns(options, current, onPick) {
  const row = el("div", { class: "seg" });
  options.forEach(([val, lbl]) => {
    row.appendChild(
      el("button", {
        class: `seg-btn ${String(val) === String(current) ? "active" : ""}`,
        text: lbl,
        onClick: () => onPick(val),
      })
    );
  });
  return row;
}

// 테마/폰트 적용 (app.js에서도 호출)
export function applyTheme() {
  const s = getSettings();
  document.documentElement.dataset.theme = s.theme;
  document.documentElement.style.setProperty("--font-scale", s.fontScale);
}
