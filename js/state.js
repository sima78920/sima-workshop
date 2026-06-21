// 앱 상태 스토어: localStorage 영속, 프로필 CRUD, import/export, 시드 폴백
import { DEFAULT_LECTURE } from "../data/default-lecture.js";
import { uid } from "./util.js";

const LS_KEY = "lecture-tool/v1";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const DEFAULT_SETTINGS = {
  theme: "dark", // "dark" | "light"
  fontScale: 1, // 0.9 ~ 1.3
  defaultDurationMin: 50,
};

function freshDB() {
  const seed = deepClone(DEFAULT_LECTURE);
  return {
    activeId: seed.id,
    profiles: [seed],
    settings: { ...DEFAULT_SETTINGS },
  };
}

let db = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return freshDB();
    const parsed = JSON.parse(raw);
    if (!parsed.profiles || !parsed.profiles.length) return freshDB();
    parsed.settings = { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) };
    return parsed;
  } catch (e) {
    console.warn("상태 로드 실패, 기본값 사용", e);
    return freshDB();
  }
}

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("상태 저장 실패", e);
  }
}

// 변경 알림
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit() {
  persist();
  listeners.forEach((fn) => fn());
}

// ---- 조회 ----
export function getSettings() {
  return db.settings;
}
export function getProfiles() {
  return db.profiles;
}
export function getActiveId() {
  return db.activeId;
}
export function getLecture() {
  return db.profiles.find((p) => p.id === db.activeId) || db.profiles[0];
}
export function getSession(sessionId) {
  return getLecture().sessions.find((s) => s.id === sessionId);
}
export function getCheatsheet(id) {
  return getLecture().cheatsheets.find((c) => c.id === id);
}

// ---- 변경 ----
// updater(lecture) 안에서 활성 프로필을 직접 수정
export function updateLecture(updater) {
  const lec = getLecture();
  updater(lec);
  emit();
}

export function updateSettings(patch) {
  Object.assign(db.settings, patch);
  emit();
}

export function setActive(id) {
  if (db.profiles.some((p) => p.id === id)) {
    db.activeId = id;
    emit();
  }
}

export function toggleChecklistItem(listOwner, itemId) {
  updateLecture((lec) => {
    const list = listOwner === "global" ? lec.checklist : getSession(listOwner)?.checklist;
    const item = list?.find((i) => i.id === itemId);
    if (item) item.done = !item.done;
  });
}

// 프로필 관리
export function addProfile(name) {
  const p = {
    id: uid("lec"),
    title: name || "새 강의",
    subtitle: "",
    date: "",
    locale: "ko",
    meta: { goal: "", period: "", audience: "", evaluation: "", materials: "" },
    sessions: [],
    cheatsheets: [],
    checklist: [],
  };
  db.profiles.push(p);
  db.activeId = p.id;
  emit();
  return p;
}

export function duplicateActiveProfile() {
  const copy = deepClone(getLecture());
  copy.id = uid("lec");
  copy.title = copy.title + " (복사본)";
  db.profiles.push(copy);
  db.activeId = copy.id;
  emit();
  return copy;
}

export function deleteProfile(id) {
  if (db.profiles.length <= 1) return false;
  db.profiles = db.profiles.filter((p) => p.id !== id);
  if (db.activeId === id) db.activeId = db.profiles[0].id;
  emit();
  return true;
}

export function resetActiveToDefault() {
  // 활성 프로필을 기본 시드 내용으로 되돌림 (id는 유지)
  const idx = db.profiles.findIndex((p) => p.id === db.activeId);
  if (idx < 0) return;
  const seed = deepClone(DEFAULT_LECTURE);
  seed.id = db.profiles[idx].id;
  db.profiles[idx] = seed;
  emit();
}

// Import / Export
export function exportActive() {
  return JSON.stringify(getLecture(), null, 2);
}

export function importProfile(jsonText) {
  const data = JSON.parse(jsonText);
  if (!data || !Array.isArray(data.sessions)) {
    throw new Error("올바른 강의 프로필 JSON 이 아닙니다.");
  }
  // id 충돌 방지
  if (!data.id || db.profiles.some((p) => p.id === data.id)) {
    data.id = uid("lec");
  }
  data.meta = data.meta || {};
  data.cheatsheets = data.cheatsheets || [];
  data.checklist = data.checklist || [];
  db.profiles.push(data);
  db.activeId = data.id;
  emit();
  return data;
}
