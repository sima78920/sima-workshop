import type { Lecture } from '../types';

// 첫 강의: "AI 가상모델 제작 실무" (1일 6시간)
// 강의계획서(이미지) 내용을 시드로 채워 즉시 사용 가능하게 함.
// 슬라이드 세부 문구/이미지는 강사가 이 파일에서 자유롭게 보강하면 된다.

export const virtualModelAi: Lecture = {
  id: 'virtual-model-ai',
  title: 'AI 가상모델 제작 실무',
  subtitle: '생성형 AI로 가상모델 기획부터 제품 합성까지',
  date: '1일 6시간 과정',
  summary: {
    goal: 'AI를 활용해 가상모델을 만들고 프로젝트의 디자인 콘셉트를 구체화하여 시각적으로 디자인·적용하는 실무 능력 향상',
    audience:
      '가상모델과 생성형 AI에 대한 이해를 기반으로 실습 중심 학습을 통해 콘텐츠 및 가상모델을 기획·시각화하고, 일관성 유지를 위한 제작기법을 활용해 이미지를 완성하고 싶은 디자이너 및 관련 분야 재직자',
    evaluation: '평가자 체크리스트',
    materials: '이드저니 마스터 바이블 (조남경 / 비엘북스)',
  },
  sessions: [
    {
      id: 's1',
      order: 1,
      title: '가상모델의 이해와 AI 소개',
      startTime: '10:00',
      endTime: '10:50',
      slides: [
        {
          id: 's1-1',
          title: '가상모델이란?',
          blocks: [
            { type: 'heading', text: '가상모델(Virtual Human/Model)의 개념' },
            {
              type: 'list',
              items: [
                '실존하지 않지만 실제처럼 보이는 AI 기반 디지털 인물',
                '광고·커머스·SNS 콘텐츠에서 모델·인플루언서로 활용',
                '촬영 비용·시간·섭외 제약 없이 일관된 비주얼 생산',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: '핵심 가치 = 일관성(Consistency) + 통제 가능성(Control) + 확장성(Scale)',
            },
          ],
          notes: '도입. 수강생에게 "알고 있는 버추얼 휴먼 사례?" 질문으로 시작. 약 10분.',
        },
        {
          id: 's1-2',
          title: '국내외 사례 & 기업 활용',
          blocks: [
            { type: 'heading', text: '국내외 가상모델 사례 분석' },
            {
              type: 'list',
              items: [
                '국내: 로지(ROZY), 루이 등 버추얼 인플루언서',
                '해외: Lil Miquela 등 글로벌 사례',
                '패션/뷰티 브랜드의 가상모델 캠페인 활용 흐름',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: '기업이 가상모델을 도입하는 이유(비용·리스크·IP 소유)를 사례로 연결해 설명.',
            },
          ],
          notes: '실제 캠페인 이미지를 보여주며 비교. 이미지 자료는 추후 추가.',
        },
        {
          id: 's1-3',
          title: '오늘 만들 결과물 (Overview)',
          blocks: [
            { type: 'text', text: '오늘 6시간 동안 진행할 제작 파이프라인 미리보기' },
            {
              type: 'list',
              ordered: true,
              items: [
                '페르소나 기획 (ChatGPT)',
                '얼굴 생성 (Midjourney)',
                '얼굴 일관성 확보 → 3가지 컨셉 모델',
                'ComfyUI / LoRA로 일관성 고도화',
                '제품 합성 + Photoshop 디테일 보정',
              ],
            },
          ],
          notes: '전체 그림을 먼저 보여줘 수강생이 길을 잃지 않게 함.',
        },
      ],
      checklist: [
        { id: 's1-c1', text: '가상모델 개념과 활용 분야를 설명할 수 있다' },
        { id: 's1-c2', text: '국내외 사례를 1개 이상 제시할 수 있다' },
      ],
    },
    {
      id: 's2',
      order: 2,
      title: 'ChatGPT로 콘텐츠 & 페르소나 스토리텔링 구축',
      startTime: '11:00',
      endTime: '11:50',
      slides: [
        {
          id: 's2-1',
          title: '페르소나 설계',
          blocks: [
            { type: 'heading', text: '가상모델 페르소나 구성요소' },
            {
              type: 'list',
              items: [
                '이름 / 나이 / 직업 / 성격',
                '외형 키워드(헤어·피부·분위기)',
                '브랜드 톤 & 타깃 고객',
                '스토리텔링(배경 서사)',
              ],
            },
          ],
          notes: '페르소나가 뒤 단계 프롬프트의 기준이 됨을 강조.',
        },
        {
          id: 's2-2',
          title: 'ChatGPT 실습 프롬프트',
          blocks: [
            { type: 'text', text: '아래 프롬프트로 페르소나 초안을 함께 생성.' },
            {
              type: 'prompt',
              label: '페르소나 생성',
              tool: 'chatgpt',
              text: '너는 브랜드 마케팅 디렉터야. 20대 후반 여성 가상모델의 페르소나를 만들어줘. 이름, 성격, 외형 키워드, 라이프스타일, 브랜드 톤앤매너, 타깃 고객, 한 문단 배경 스토리를 표로 정리해줘.',
            },
            {
              type: 'prompt',
              label: '외형 키워드 → 이미지 프롬프트 변환',
              tool: 'chatgpt',
              text: '위 페르소나의 외형 키워드를 Midjourney용 영어 이미지 프롬프트로 변환해줘. 사진 스타일, 조명, 카메라 렌즈, 분위기를 포함해서 한 줄로 작성해줘.',
            },
          ],
          notes: 'ChatGPT 출력 → 다음 교시 Midjourney 입력으로 바로 연결.',
        },
      ],
      prompts: [
        {
          id: 's2-p1',
          label: '페르소나 생성',
          tool: 'chatgpt',
          text: '너는 브랜드 마케팅 디렉터야. 20대 후반 여성 가상모델의 페르소나를 만들어줘. 이름, 성격, 외형 키워드, 라이프스타일, 브랜드 톤앤매너, 타깃 고객, 한 문단 배경 스토리를 표로 정리해줘.',
        },
        {
          id: 's2-p2',
          label: '이미지 프롬프트 변환',
          tool: 'chatgpt',
          text: '위 페르소나의 외형 키워드를 Midjourney용 영어 이미지 프롬프트로 변환해줘. 사진 스타일, 조명, 카메라 렌즈, 분위기를 포함해서 한 줄로 작성해줘.',
        },
      ],
      checklist: [
        { id: 's2-c1', text: '페르소나 핵심 요소를 구성할 수 있다' },
        { id: 's2-c2', text: 'ChatGPT로 이미지 프롬프트를 도출할 수 있다' },
      ],
    },
    {
      id: 'lunch',
      order: 0,
      title: '점심시간',
      startTime: '12:00',
      endTime: '13:00',
      isBreak: true,
      slides: [
        {
          id: 'lunch-1',
          blocks: [
            { type: 'heading', text: '점심시간 (12:00 ~ 13:00)' },
            { type: 'text', text: '13:00에 3교시 Midjourney 실습으로 이어집니다.' },
          ],
        },
      ],
    },
    {
      id: 's3',
      order: 3,
      title: '이미지 생성형 AI 기초 & 캐릭터 얼굴 생성 실습',
      startTime: '13:00',
      endTime: '13:50',
      slides: [
        {
          id: 's3-1',
          title: 'Midjourney 사용법 & 프롬프트 기초',
          blocks: [
            { type: 'heading', text: '프롬프트 구조' },
            {
              type: 'list',
              items: [
                '주제(Subject) + 디테일 + 스타일 + 조명/카메라 + 파라미터',
                '파라미터: --ar 비율, --style, --s(stylize), --v 버전',
                '레퍼런스 활용: 이미지 프롬프트 / --sref 스타일 참조',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: '레퍼런스 이미지(ref) 적극 활용 — 원하는 분위기/구도를 빠르게 수렴.',
            },
          ],
          notes: '손글씨 메모 반영: ref 이미지 활용, 6mm 등 렌즈 표현 팁 소개.',
        },
        {
          id: 's3-2',
          title: '얼굴 생성 실습',
          blocks: [
            { type: 'text', text: '페르소나 기반 얼굴 프롬프트로 생성 시작.' },
            {
              type: 'prompt',
              label: '기본 얼굴 생성',
              tool: 'midjourney',
              text: 'portrait of a 27-year-old korean woman, natural makeup, soft studio lighting, 85mm lens, photorealistic, clean background --ar 3:4 --style raw --v 6',
            },
            {
              type: 'callout',
              tone: 'warn',
              text: '실사화 품질: 과한 stylize는 인공적인 느낌 → --s 값 조절로 자연스러움 확보.',
            },
          ],
          notes: '실습 위주. 수강생 결과물 1~2개 즉석 피드백.',
        },
      ],
      prompts: [
        {
          id: 's3-p1',
          label: '기본 얼굴 생성',
          tool: 'midjourney',
          text: 'portrait of a 27-year-old korean woman, natural makeup, soft studio lighting, 85mm lens, photorealistic, clean background --ar 3:4 --style raw --v 6',
        },
        {
          id: 's3-p2',
          label: '분위기 변형',
          tool: 'midjourney',
          text: 'cinematic portrait, golden hour backlight, shallow depth of field, film grain, korean female model --ar 3:4 --style raw --v 6',
        },
      ],
      checklist: [
        { id: 's3-c1', text: 'Midjourney 프롬프트 구조를 이해한다' },
        { id: 's3-c2', text: '페르소나 기반 얼굴을 생성할 수 있다' },
      ],
    },
    {
      id: 's4',
      order: 4,
      title: '캐릭터 얼굴 일관성 구현 & 3가지 컨셉 모델 생성',
      startTime: '14:00',
      endTime: '14:50',
      slides: [
        {
          id: 's4-1',
          title: '얼굴 일관성 확보 기법',
          blocks: [
            { type: 'heading', text: '같은 인물 유지하기' },
            {
              type: 'list',
              items: [
                'Character Reference(--cref) 활용 + --cw 가중치 조절',
                '시드(seed) 고정으로 변화 최소화',
                '동일 얼굴로 의상/배경/포즈만 변경',
              ],
            },
          ],
          notes: '일관성은 가상모델의 생명. --cref/--cw 시연.',
        },
        {
          id: 's4-2',
          title: '3가지 컨셉으로 확장',
          blocks: [
            { type: 'text', text: '동일 인물로 서로 다른 3개 컨셉(예: 캐주얼/포멀/스트릿) 생성 실습.' },
            {
              type: 'prompt',
              label: '캐릭터 레퍼런스 적용',
              tool: 'midjourney',
              text: 'same woman, casual street fashion, urban background, full body shot --cref [이전_이미지_URL] --cw 80 --ar 3:4 --v 6',
            },
          ],
          notes: '컨셉 3종은 다음 교시 ComfyUI/LoRA 학습 데이터로도 연결 가능.',
        },
      ],
      prompts: [
        {
          id: 's4-p1',
          label: '캐릭터 레퍼런스 적용',
          tool: 'midjourney',
          text: 'same woman, casual street fashion, urban background, full body shot --cref [이전_이미지_URL] --cw 80 --ar 3:4 --v 6',
        },
      ],
      checklist: [
        { id: 's4-c1', text: '얼굴 일관성 기법을 적용할 수 있다' },
        { id: 's4-c2', text: '동일 인물로 3개 컨셉을 만들 수 있다' },
      ],
    },
    {
      id: 's5',
      order: 5,
      title: 'ComfyUI로 일관성 얼굴 생성기법 습득 & 실습',
      startTime: '15:00',
      endTime: '15:50',
      slides: [
        {
          id: 's5-1',
          title: 'ComfyUI 개요',
          blocks: [
            { type: 'heading', text: '노드 기반 생성 워크플로우' },
            {
              type: 'list',
              items: [
                '체크포인트/노드 구성 기본 이해',
                'IPAdapter / FaceID로 얼굴 일관성 강화',
                'LoRA 활용으로 특정 인물 스타일 고정',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: '손글씨 메모 반영: LoRA 제작으로 "나만의 가상모델"을 재현 가능하게.',
            },
          ],
          notes: 'Midjourney 대비 ComfyUI의 통제력 차이를 강조. 워크플로우 화면 시연.',
        },
        {
          id: 's5-2',
          title: 'LoRA & 실사화',
          blocks: [
            {
              type: 'list',
              items: [
                '앞 교시 생성 이미지 → 학습 데이터셋 구성',
                'LoRA 학습 개념과 적용 흐름',
                '실사화(photorealistic) 보정으로 자연스러움 향상',
              ],
            },
            {
              type: 'callout',
              tone: 'warn',
              text: '실습 환경/GPU에 따라 학습 시간이 길 수 있음 → 사전 준비된 LoRA로 시연 대체 가능.',
            },
          ],
          notes: '시간 관리 주의. 학습은 시연, 적용은 실습으로 분리.',
        },
      ],
      checklist: [
        { id: 's5-c1', text: 'ComfyUI 워크플로우 기본을 이해한다' },
        { id: 's5-c2', text: 'LoRA/IPAdapter로 일관성을 높일 수 있다' },
      ],
    },
    {
      id: 's6',
      order: 6,
      title: '제품과 가상모델 융합 & Photoshop 디테일 보정',
      startTime: '16:00',
      endTime: '16:50',
      slides: [
        {
          id: 's6-1',
          title: '제품 합성',
          blocks: [
            { type: 'heading', text: '가상모델 + 제품 결합' },
            {
              type: 'list',
              items: [
                '제품 컷과 모델 컷 합성(구도·원근 맞추기)',
                '조명/그림자 일치로 자연스러운 합성',
                '커머스용 최종 비주얼 기획',
              ],
            },
          ],
          notes: '손글씨 메모 반영: 벡터화/Freepik 등 소스 활용 팁 안내.',
        },
        {
          id: 's6-2',
          title: 'Photoshop 디테일 보정 & 마무리',
          blocks: [
            {
              type: 'list',
              items: [
                '피부·손·디테일 보정(생성 아티팩트 제거)',
                '색감/톤 통일, 브랜드 톤 적용',
                '최종 이미지 제작 및 결과물 정리',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: '평가: 결과물을 평가자 체크리스트로 점검하며 마무리.',
            },
          ],
          notes: '오늘 결과물 회고 + 질의응답으로 종료.',
        },
      ],
      checklist: [
        { id: 's6-c1', text: '제품과 가상모델을 자연스럽게 합성할 수 있다' },
        { id: 's6-c2', text: 'Photoshop으로 디테일 보정·마무리를 할 수 있다' },
        { id: 's6-c3', text: '완성 이미지를 결과물로 정리할 수 있다' },
      ],
    },
  ],
};
