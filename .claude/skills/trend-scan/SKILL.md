---
name: trend-scan
description: 8플랫폼(유튜브쇼츠/틱톡/릴스/X/스레드/링크드인/네이버/인스타)×지역(KR/글로벌) 주간 트렌드 스캔을 실행해 studio/트렌드/에 리포트를 쌓는다. "트렌드 스캔", "이번 주 뭐가 떠", "주간 스캔" 요청 시 사용. 무료·읽기 전용 도구만 쓴다.
---

# /trend-scan — 주간 트렌드 스캔

## 시작 전 (필수)

1. `studio/코어.md`, `studio/자원대장.md`를 읽는다.
2. `studio/트렌드/트렌드로그.md` 마지막 행을 읽어 직전 스캔과의 비교 기준을 잡는다.

## 절차

1. **틱톡 음원**: `tiktok_accounts`로 연결 계정 확인 → 연결돼 있으면 `tiktok_music_trending`을 KR과 US 각각 최근 7일로 호출. 미연결이면 리포트에 "틱톡 계정 미연결 — 음원 섹션 생략" 명시.
2. **플랫폼×지역 스캔**: WebSearch로 영문+한글 쿼리를 병행한다 (WebSearch는 US 편향 — 한국은 한국 매체 기사·WebFetch 병행). 최소 커버: **영상(유튜브쇼츠/틱톡/릴스) + 텍스트/소셜(X/스레드/링크드인/네이버) × KR/글로벌**. 네이버는 검색어·블로그 트렌드, 링크드인은 AI·제작기 관점의 뜨는 콘텐츠 유형.
3. **AI 모델 동향**: `models_explore`(action:list, type:video) + WebSearch로 신규 영상 모델·기능을 확인, 해자 축 영향 한 줄.
4. **리포트 작성**: `studio/트렌드/_템플릿_트렌드리포트.md` 구조 그대로 `studio/트렌드/리포트/YYYY-MM-DD_주간트렌드.md` 생성. 모든 트렌드 항목에 근거 링크 필수.
5. **기회 후보 3개**: 코어.md 기회 필터 3종을 통과하는 것만. garamFitScore 가채점 포함 → /opportunity 인계.
6. **트렌드로그 append**: 요약 1행.
7. 다건 검색 정리는 haiku 서브에이전트에 위임한다.

## 금지

generate_* 등 크레딧 소모 도구, virality_predictor, tiktok_publish, 파일 삭제, studio/ 밖 수정. 이런 작업이 필요해 보이면 "승인 필요"라고 출력만 한다.

## 종료

- mirOps 연결 시 `record_work_log`. 미연결 시 `studio/_mirops_대기열.md`에 append.
- 보고: 결론 → 바뀐 것 → 미르가 할 것(복붙). 리포트 말미 검수 3줄. garamFitScore 20+ 예상 후보가 있으면 보고 첫 줄에 강조.
