# 강의 발표 도움툴 (Lecture Presenter)

아이패드에서 앱처럼 쓰는 **웹 기반 스탠드얼론 강의 발표 보조 도구**입니다. (PWA · 오프라인 지원)
강의 콘텐츠는 **데이터 파일**로 관리해, 이번 강의뿐 아니라 앞으로 추가되는 강의도 유연하게 담을 수 있습니다.

## 주요 기능

- **슬라이드/콘텐츠 뷰** — 제목·본문·리스트·이미지·코드·콜아웃·프롬프트 블록 렌더링, 좌우 스와이프 & 큰 이전/다음 버튼, 외부 키보드/프레젠터 리모컨(←/→) 지원
- **교시 타이머·진행바** — 시간표(10:00~16:00, 점심 포함) 기반으로 현재 교시를 자동 인식하고 진행률·남은 시간 표시 + 실시간 시계
- **실습용 카운트다운 타이머** — 3/5/10/15분 프리셋, 시작·일시정지·리셋, 종료 임박 시 색상 경고
- **프롬프트 레퍼런스(원탭 복사)** — Midjourney/ChatGPT/ComfyUI 등 예제 프롬프트를 도구 배지와 함께 카드로, 탭 한 번에 복사
- **강사 노트** — 슬라이드별 진행 메모를 강사 화면에만 토글 표시 (교시 프롬프트 모음도 함께)
- **평가 체크리스트** — 교시별 평가 항목을 탭으로 체크, 진행 상황 저장
- **상태 복원** — 마지막 위치·다크모드·체크 상태를 localStorage에 저장해 새로고침/재실행에도 유지
- **다크모드** — 강의장 조명에 맞춰 전환

## 개발 / 실행

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173/sima-workshop/)
npm run build     # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
```

> 아이패드에서 테스트하려면 가로 모드 권장. 배포 후 Safari에서 **공유 → 홈 화면에 추가**하면 앱처럼 전체화면·오프라인으로 실행됩니다.

## 새 강의 추가하기 (코드 수정 불필요)

1. `src/lectures/` 에 새 데이터 파일을 만든다 (`src/types.ts`의 `Lecture` 타입을 따른다).
2. `src/lectures/index.ts` 의 `lectures` 배열에 import해서 추가한다.

```ts
// src/lectures/index.ts
import { virtualModelAi } from './virtual-model-ai';
import { myNewLecture } from './my-new-lecture';

export const lectures: Lecture[] = [virtualModelAi, myNewLecture];
```

3. 끝. 시작 화면 목록에 자동으로 나타난다.

### 데이터 구조 요약 (`src/types.ts`)

```
Lecture
 ├─ id, title, subtitle, date
 ├─ summary { goal, audience, evaluation, materials }
 └─ sessions[]            // 교시 (또는 점심 등 isBreak)
     ├─ order, title, startTime, endTime, isBreak
     ├─ slides[]          // { title, blocks[], notes }
     ├─ prompts[]         // 복사용 예제 프롬프트
     └─ checklist[]       // 평가 항목
```

블록 타입: `heading` · `text` · `list` · `image` · `code` · `callout(tip/warn/key)` · `prompt`
이미지는 `public/lectures/<강의id>/...` 에 두고 `{ type:'image', src:'lectures/<id>/foo.jpg' }` 로 참조하면 오프라인 캐시됩니다.

## 배포 (GitHub Pages)

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml` 이 자동 빌드 후 GitHub Pages에 배포합니다.
저장소 **Settings → Pages → Build and deployment → Source 를 "GitHub Actions"** 로 한 번 설정해 주세요.
`base` 경로는 레포명으로 자동 설정됩니다(다른 곳에 배포 시 `BASE_PATH` 환경변수로 변경 가능).

## 기술 스택

Vite · React · TypeScript · Tailwind CSS · vite-plugin-pwa(Workbox). 백엔드 없는 정적 SPA.
