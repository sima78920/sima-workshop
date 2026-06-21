// 강의 발표 도움툴 데이터 스키마.
// 강의 1개 = 데이터 파일 1개. 새 강의는 이 타입을 따르는 파일을 추가하고
// src/lectures/index.ts 레지스트리에 등록하기만 하면 된다. (코드 수정 불필요)

export type PromptTool = 'midjourney' | 'chatgpt' | 'comfyui' | 'photoshop' | 'etc';

/** 슬라이드 본문을 구성하는 콘텐츠 블록 */
export type Block =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'callout'; tone: 'tip' | 'warn' | 'key'; text: string }
  | { type: 'prompt'; label: string; tool: PromptTool; text: string };

/** 복사 가능한 예제 프롬프트 (실습용) */
export interface Prompt {
  id: string;
  label: string;
  tool: PromptTool;
  text: string;
  note?: string;
}

/** 평가자 체크리스트 항목 (체크 상태는 localStorage에 저장) */
export interface ChecklistItem {
  id: string;
  text: string;
}

/** 한 장의 슬라이드 */
export interface Slide {
  id: string;
  title?: string;
  blocks: Block[];
  /** 강사 화면에만 노출되는 진행 메모 */
  notes?: string;
}

/** 교시(또는 쉬는시간) */
export interface Session {
  id: string;
  order: number;
  title: string;
  /** "10:00" 형식. 타이머가 현재 교시를 자동 인식하는 데 사용 */
  startTime?: string;
  endTime?: string;
  /** 점심시간 등 쉬는시간이면 true */
  isBreak?: boolean;
  slides: Slide[];
  prompts?: Prompt[];
  checklist?: ChecklistItem[];
}

/** 강의 1개 전체 */
export interface Lecture {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  summary: {
    goal: string;
    audience: string;
    evaluation: string;
    materials: string;
  };
  sessions: Session[];
}
