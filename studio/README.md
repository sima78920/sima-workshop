# 콘텐츠 인텔리전스 스튜디오

분석 우선 콘텐츠 시스템. 트렌드를 추적하고(트렌드/), 터진 영상을 해부하고(벤치마크/), 코어 가치관×보유 자원과 교차해 "지금 할 것"을 뽑는다(기회/). 제작(채널/, OSMU/)은 그 다음이다.

## 구조

| 폴더/파일 | 역할 |
|---|---|
| `코어.md` | 가치 판정 기준 + garamFitScore 채점표 — 모든 스킬이 시작 시 읽음 |
| `자원대장.md` | 보유 자산 인벤토리 — 기회 매칭의 원천 |
| `트렌드/` | 주간 트렌드 리포트 누적 + 트렌드로그(시계열 원장) |
| `벤치마크/` | 영상 해부 리포트 + 채널벤치마크.csv |
| `기회/` | 주제백로그.csv + garamFitScore 스코어카드 |
| `채널/` | A 속이궁금해사전 · B 만약에연구소 · 에피소드 템플릿 |
| `OSMU/` | 1소스 → 쇼츠/틱톡/릴스 변환 규칙 |
| `_mirops_대기열.md` | mirOps 미연결 세션의 작업 기록 대기열 |

## 스킬 (`.claude/skills/`)

- `/trend-scan` — 플랫폼×지역 주간 스캔 → 리포트 + 기회 후보 3개
- `/benchmark <URL>` — 영상 장면 해부 → 리포트 + CSV 행
- `/opportunity` — 리포트×자원대장×코어 교차 → garamFitScore 랭킹
- `/new-episode <채널> <주제>` — 에피소드 기획서 생성
- `/osmu <에피소드>` — 3플랫폼 변환 명세 (발행은 승인 필요)

## 자동화

- 주간 트렌드 스캔 Routine: 매주 월 06:00 KST (일 21:00 UTC), fresh session, 결과는 이 폴더에 커밋·푸시 + 푸시 알림
- Routine ID: `(등록 후 기록)`

## 미르 로컬로 이관하기

```bash
mv studio ~/dev/docs/mir-os-core/studio
mv .claude/skills/{trend-scan,benchmark,opportunity,new-episode,osmu} ~/dev/docs/mir-os-core/.claude/skills/
```

이관 후 Routine 프롬프트의 경로만 mir-os-core 기준으로 갱신하면 된다.

## 규칙 (mirOS 계약 상속)

- 태스크 관리는 mirOps로 — 이 폴더에 자체 todo/칸반을 만들지 않는다 (백로그 CSV는 데이터, 태스크 아님)
- 산출물 말미 검수 3줄: "무엇이 달라지나: / 왜: / 리스크: 낮음·중간·높음 — 근거"
- 보고: 결론 → 바뀐 것 → 미르가 직접 할 것(복붙 명령)
- 발행·과금·삭제는 언제나 승인 필요
