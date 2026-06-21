// 기본 강의 프로필 시드: "AI 가상모델 제작 워크숍"
// 커리큘럼 이미지를 기반으로 미리 채워둔 내용입니다.
// 앱 최초 실행 시 localStorage 로 복사되며, 설정에서 편집/초기화할 수 있습니다.

export const DEFAULT_LECTURE = {
  id: "ai-virtual-model-workshop",
  title: "AI 가상모델 제작 워크숍",
  subtitle: "가상모델 기획부터 일관성·합성까지 1일 실무 과정",
  date: "",
  locale: "ko",
  meta: {
    goal:
      "AI로 가상모델을 만들고 프로젝트의 디자인 콘셉트를 구체화하여 시각적으로 표현하고 적용하는 실무 능력 함양",
    period: "1일 (6시간) 과정",
    audience:
      "가상모델과 생성형 AI에 대한 이해를 기반으로, 실습 중심 학습을 통해 콘텐츠 및 가상모델을 기획·시각화하고 일관성 유지를 위한 제작기법으로 이미지를 완성하고 싶은 디자이너 및 관련분야 재직자",
    evaluation: "평가자 체크리스트",
    materials: "미드저니 마스터 바이블 (조남헌 / 비엘북스)",
  },

  sessions: [
    {
      id: "s1",
      order: 1,
      label: "1교시",
      title: "가상모델의 이해와 AI 소개",
      start: "10:00",
      end: "10:50",
      durationMin: 50,
      objectives: [
        "가상모델(버추얼 휴먼)의 개념과 산업 활용 사례 이해",
        "국내외 가상모델 사례 분석 및 기업 활용 흐름 파악",
        "이미지 생성형 AI의 종류와 강의 전체 흐름 소개",
      ],
      notes:
        "## 도입\n- 자기소개 + 오늘 6시간 흐름 한눈에 보여주기\n- **가상모델이 왜 지금 뜨는가**: 비용·일관성·24시간 활용\n\n## 사례\n- 국내외 버추얼 인플루언서/광고 모델 사례\n- 패션·커머스에서의 활용 포인트\n\n> 실습 환경(ChatGPT / Midjourney / ComfyUI) 준비 상태 확인",
      checklist: [
        { id: "s1c1", text: "실습 계정/환경 접속 확인 (전원)", done: false },
        { id: "s1c2", text: "가상모델 개념 이해 점검", done: false },
      ],
      cheatsheetIds: [],
    },
    {
      id: "s2",
      order: 2,
      label: "2교시",
      title: "ChatGPT로 콘텐츠·가상모델 기획",
      start: "11:00",
      end: "11:50",
      durationMin: 50,
      objectives: [
        "ChatGPT로 콘텐츠 및 가상모델 콘셉트 도출",
        "컨셉노트 / 페르소나 / 스토리텔링 구축",
        "이미지 생성에 쓸 프롬프트 시드 텍스트 만들기",
      ],
      notes:
        "## 실습 흐름\n1. 가상모델 페르소나 정의 (나이·분위기·세계관)\n2. **컨셉노트** 작성 → 키워드 추출\n3. 키워드를 Midjourney 프롬프트로 변환\n\n> 다음 교시(Midjourney)로 바로 이어지도록 키워드를 정리해 두기",
      checklist: [
        { id: "s2c1", text: "가상모델 페르소나 1개 도출", done: false },
        { id: "s2c2", text: "컨셉노트 → 프롬프트 키워드 정리", done: false },
      ],
      cheatsheetIds: ["ch-chatgpt"],
    },
    {
      id: "s3",
      order: 3,
      label: "3교시",
      title: "이미지 생성 AI 기초 + Midjourney 프롬프트",
      start: "13:00",
      end: "13:50",
      durationMin: 50,
      objectives: [
        "이미지 생성형 AI의 기초 원리 이해",
        "Midjourney 사용법과 프롬프트 작성법 학습",
        "캐릭터 얼굴 생성 실습 시작",
      ],
      notes:
        "## 점심 후 워밍업\n- 짧게 오전 키워드 리마인드\n\n## Midjourney 기초\n- `/imagine` 기본 구조: 주제 + 디테일 + 스타일 + 파라미터\n- 핵심 파라미터: `--ar`, `--s`, `--niji`, `--cref`, `--sref`\n- **캐릭터 얼굴 생성** 첫 시도 → 결과 비교",
      checklist: [
        { id: "s3c1", text: "Midjourney 기본 프롬프트 1회 생성", done: false },
        { id: "s3c2", text: "얼굴 클로즈업 결과 확보", done: false },
      ],
      cheatsheetIds: ["ch-midjourney"],
    },
    {
      id: "s4",
      order: 4,
      label: "4교시",
      title: "캐릭터 얼굴 생성 + 3가지 컨셉 가상모델",
      start: "14:00",
      end: "14:50",
      durationMin: 50,
      objectives: [
        "캐릭터 얼굴 생성 실습 심화",
        "3가지 컨셉으로 가상모델 생성 실습",
        "컨셉별 룩/분위기 차별화",
      ],
      notes:
        "## 실습\n- 한 페르소나로 **3가지 컨셉**(예: 캐주얼/시크/스포티) 전개\n- `--ar` 비율 바꿔가며 활용처별 컷 확보\n- 마음에 드는 베이스 얼굴 1장 선정 → 5교시 일관성 작업용",
      checklist: [
        { id: "s4c1", text: "3가지 컨셉 이미지 각 1장 이상", done: false },
        { id: "s4c2", text: "일관성 작업용 베이스 얼굴 선정", done: false },
      ],
      cheatsheetIds: ["ch-midjourney"],
    },
    {
      id: "s5",
      order: 5,
      label: "5교시",
      title: "캐릭터 일관성 + ComfyUI·LoRA",
      start: "15:00",
      end: "15:50",
      durationMin: 50,
      objectives: [
        "캐릭터 일관성 구현 및 베리에이션 실습",
        "ComfyUI로 일관성 있는 얼굴 생성 기법 습득",
        "LoRA 개념과 활용 흐름 이해",
      ],
      notes:
        "## 일관성의 핵심\n- 같은 인물을 여러 컷에서 유지하는 법\n- Midjourney `--cref` vs ComfyUI 워크플로 비교\n- **ComfyUI**: 노드 구조 + 일관성 얼굴 파이프라인\n- **LoRA**: 얼굴 고정용 활용 개념 (제작/적용 흐름)\n\n> 참고: Freepik 등 레퍼런스, 6mm 등 렌즈/촬영 느낌 키워드",
      checklist: [
        { id: "s5c1", text: "동일 인물 베리에이션 2컷 이상", done: false },
        { id: "s5c2", text: "ComfyUI 일관성 워크플로 1회 실행", done: false },
      ],
      cheatsheetIds: ["ch-comfyui"],
    },
    {
      id: "s6",
      order: 6,
      label: "6교시",
      title: "제품 합성 + Photoshop 디테일 보정",
      start: "16:00",
      end: "16:50",
      durationMin: 50,
      objectives: [
        "제품과 가상모델 합성 실습",
        "Photoshop으로 디테일 보정",
        "최종 이미지 제작 및 마무리",
      ],
      notes:
        "## 마무리 실습\n- 가상모델 + 제품 **합성** (착장/배치)\n- Photoshop: 경계·조명·색감 디테일 보정 체크리스트 따라가기\n- 최종 결과물 정리 + 간단 공유/피드백\n\n> 시간 관리: 보정에 너무 오래 매이지 않게 16:40부터 정리",
      checklist: [
        { id: "s6c1", text: "제품 합성 결과물 1장 완성", done: false },
        { id: "s6c2", text: "Photoshop 디테일 보정 적용", done: false },
        { id: "s6c3", text: "최종 이미지 제출/공유", done: false },
      ],
      cheatsheetIds: ["ch-photoshop"],
    },
  ],

  cheatsheets: [
    {
      id: "ch-chatgpt",
      tool: "ChatGPT",
      title: "컨셉노트 · 페르소나 · 프롬프트 시드",
      body:
        "가상모델의 **페르소나**와 **컨셉노트**를 먼저 잡고, 그 키워드를 이미지 프롬프트로 옮깁니다. 결과는 곧바로 Midjourney에 붙여넣을 수 있게 영문 키워드로 받으세요.",
      prompts: [
        {
          label: "가상모델 페르소나 설계",
          text:
            "너는 브랜드 크리에이티브 디렉터야. 다음 조건으로 가상모델(버추얼 휴먼) 페르소나를 만들어줘. 산업: [패션 커머스]. 타깃 고객: [20-30대]. 분위기 키워드 3개, 이름, 나이대, 성격, 세계관, 대표 스타일을 표로 정리해줘.",
        },
        {
          label: "컨셉노트 → 프롬프트 키워드",
          text:
            "위 페르소나를 바탕으로 이미지 생성용 영문 프롬프트 키워드를 만들어줘. (1) 얼굴/외형 (2) 헤어/메이크업 (3) 의상 스타일 (4) 조명/분위기 (5) 카메라/렌즈 느낌. 각 항목당 쉼표로 구분된 영문 키워드로.",
        },
        {
          label: "3가지 컨셉 변주",
          text:
            "같은 인물을 유지하면서 캐주얼/시크/스포티 3가지 컨셉으로 의상·배경·분위기만 바꾼 영문 프롬프트 3개를 만들어줘.",
        },
      ],
    },
    {
      id: "ch-midjourney",
      tool: "Midjourney",
      title: "얼굴·스타일 프롬프트 + 핵심 파라미터",
      body:
        "기본 구조: **주제 + 디테일 + 스타일 + 파라미터**.\n\n핵심 파라미터\n- `--ar 3:4` 세로 인물 / `--ar 16:9` 와이드\n- `--s 250` 스타일 강도(0~1000)\n- `--cref [URL]` 캐릭터 일관성(같은 인물) / `--cw 0~100` 반영 강도\n- `--sref [URL]` 스타일 레퍼런스\n- `--niji 6` 애니풍",
      prompts: [
        {
          label: "사실적 얼굴 클로즈업",
          text:
            "portrait of a young east-asian virtual model, natural makeup, soft studio lighting, 85mm lens, photorealistic, ultra detailed skin --ar 3:4 --s 250",
        },
        {
          label: "전신 룩북 컷",
          text:
            "full body fashion lookbook photo of a virtual model, minimal studio background, editorial styling, soft daylight --ar 3:4 --s 200",
        },
        {
          label: "캐릭터 일관성(cref)",
          text:
            "same model, new outfit, street style, golden hour --cref [이미지URL] --cw 100 --ar 3:4",
        },
      ],
    },
    {
      id: "ch-comfyui",
      tool: "ComfyUI",
      title: "일관성 얼굴 워크플로 · LoRA",
      body:
        "ComfyUI는 노드 기반으로 **재현 가능한 파이프라인**을 만듭니다. 일관성 얼굴은 동일 시드 + 얼굴 고정(IPAdapter/얼굴 LoRA) 조합이 핵심.\n\n체크 포인트\n- Checkpoint / VAE 로드 확인\n- 동일 인물: 얼굴 임베딩 또는 LoRA 사용\n- 시드 고정으로 재현성 확보\n- 업스케일 노드로 디테일 보강",
      prompts: [
        {
          label: "긍정 프롬프트 예시",
          text:
            "(masterpiece, best quality), portrait of consistent virtual model, detailed face, natural skin texture, soft lighting",
        },
        {
          label: "부정 프롬프트 예시",
          text:
            "lowres, deformed, extra fingers, bad anatomy, watermark, text, blurry",
        },
        {
          label: "LoRA 적용 메모",
          text:
            "얼굴 LoRA를 0.6~0.8 가중치로 적용 → 시드 고정 → 의상/배경만 프롬프트로 변주하면 동일 인물 유지",
        },
      ],
    },
    {
      id: "ch-photoshop",
      tool: "Photoshop",
      title: "제품 합성 · 디테일 보정 체크",
      body:
        "합성의 자연스러움은 **경계 + 조명 + 색감** 3가지가 좌우합니다. 보정에 시간 과투입하지 말고 체크리스트로 빠르게.",
      prompts: [
        {
          label: "합성 순서",
          text:
            "1) 제품 누끼 따기  2) 모델 위에 배치/원근 맞추기  3) 경계 마스크 다듬기  4) 그림자 추가  5) 색감/조명 매칭  6) 전체 톤 보정",
        },
        {
          label: "디테일 보정 체크",
          text:
            "경계 자연스러움 / 그림자 방향 일치 / 화이트밸런스 / 피부 질감 보존 / 노이즈·선명도 / 최종 톤",
        },
      ],
    },
  ],

  checklist: [
    { id: "g1", text: "가상모델 페르소나/컨셉노트 완성", done: false },
    { id: "g2", text: "Midjourney로 캐릭터 얼굴 생성", done: false },
    { id: "g3", text: "3가지 컨셉 가상모델 이미지 제작", done: false },
    { id: "g4", text: "동일 인물 일관성 베리에이션 구현", done: false },
    { id: "g5", text: "ComfyUI/LoRA 일관성 기법 실습", done: false },
    { id: "g6", text: "제품 합성 + Photoshop 보정 최종본 완성", done: false },
  ],
};
