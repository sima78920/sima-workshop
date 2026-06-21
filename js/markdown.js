// 초경량 마크다운 → HTML 렌더러 (외부 의존성 없음)
// 지원: 제목(#~###), 굵게(**), 기울임(*), 인라인코드(`), 인용(>), 목록(- / 1.), 단락
import { escapeHtml } from "./util.js";

function inline(text) {
  let t = escapeHtml(text);
  // 인라인 코드 먼저
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  // 굵게
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 기울임 (굵게 처리 후 남은 단일 *)
  t = t.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  return t;
}

export function renderMarkdown(src = "") {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let listType = null; // "ul" | "ol" | null
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      flushPara();
      closeList();
      const lvl = m[1].length;
      out.push(`<h${lvl + 2}>${inline(m[2])}</h${lvl + 2}>`);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(m[1])}</blockquote>`);
    } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else {
      closeList();
      para.push(line.trim());
    }
  }
  flushPara();
  closeList();
  return out.join("\n");
}
