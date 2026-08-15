# 콘텐츠 인텔리전스 스튜디오

분석 우선 콘텐츠 시스템. 4레이어: **수집**(트렌드/벤치마크/출처) → **판단**(garamFitScore 기회 랭킹) → **제작**(출처 기반 대본 + 0.1초 스토리보드) → **배포**(1소스→8플랫폼 OSMU).

## 구조

| 폴더/파일 | 역할 |
|---|---|
| `코어.md` | 가치 판정 기준 + garamFitScore 채점표 — 모든 스킬이 시작 시 읽음 |
| `자원대장.md` | 보유 자산 인벤토리 — 기회 매칭의 원천 |
| `출처/` | 출처대장.csv + 자료노트 — 억대뷰쇼츠·논문·학술지·도서·뉴스. **여기 없는 사실은 대본 진입 불가** |
| `트렌드/` | 주간 트렌드 리포트(8플랫폼×KR/글로벌) + 트렌드로그(시계열) |
| `벤치마크/` | 영상 해부 리포트 + 채널벤치마크.csv |
| `기회/` | 주제백로그.csv + garamFitScore 스코어카드 |
| `채널/` | **IP 단위** 폴더 (플랫폼 아님 — 플랫폼은 채널.md 배포처 표 1행). 접은 채널은 `_보관/` |
| `OSMU/` | 플랫폼가이드.md(8종 규격, 전 채널 공용 1개) + EP별 변환 명세 |
| `에셋/` | 미디어 원본 — .gitignore, git 밖 (Drive 백업 권장) |
| `_mirops_대기열.md` | mirOps 미연결 세션의 작업 기록 대기열 |

## 스킬 (`.claude/skills/`)

- `/research <주제>` — 바이럴·학술·뉴스·도서 자료 수집 → 출처대장 등록
- `/trend-scan` — 8플랫폼×지역 주간 스캔 → 리포트 + 기회 후보 3개
- `/benchmark <URL>` — 영상 장면 해부 → 리포트 + CSV + 출처대장 자동 등록
- `/opportunity` — 리포트×출처×자원대장×코어 → garamFitScore 랭킹
- `/new-episode <채널> <주제>` — 출처 게이트 + 0.1초 스토리보드 기획서
- `/osmu <에피소드>` — 8플랫폼 네이티브 변환 (발행은 승인 필요)

## 스케일 규칙

새 플랫폼 진출 = 채널.md 배포처 표 1행 (폴더 +0) · 새 IP = `_템플릿_채널.md` 복사 폴더 1개 · 분석 레이어와 스킬은 전 채널 공유.

## 자동화

- 주간 트렌드 스캔 Routine: 매주 월 06:00 KST (일 21:00 UTC), fresh session, 결과 커밋·푸시 + 푸시 알림
- Routine ID: `trig_01MSKiJV6skbFpWoxYmnVjZv` (2026-08-15 등록, 다음 실행 월 06:08 KST)
- 주의: 루틴 세션에는 MCP 커넥터가 붙지 않아 tiktok_music_trending은 생략되고 WebSearch 기반으로 동작한다. 틱톡 음원 트렌드까지 자동화하려면 claude.ai 루틴 UI에서 커넥터를 붙여 재생성.

## 미르 로컬로 이관 (별도 루트 — mir-os-core와 분리)

```bash
git clone -b claude/video-analysis-290m-6it8jw https://github.com/sima78920/sima-workshop.git /tmp/sw
mkdir -p ~/dev/studio && cp -r /tmp/sw/studio/. ~/dev/studio/ && mkdir -p ~/dev/studio/.claude && cp -r /tmp/sw/.claude/skills ~/dev/studio/.claude/
cd ~/dev/studio && git init && git add -A && git commit -m "스튜디오: 초기 이관"
```

이관 후: ① 시스템맵에 `~/dev/studio` 1줄 등록 ② Routine 프롬프트의 저장소 경로 갱신.

분리 이유: 미디어가 docs 저장소를 비대화시키지 않게, 주간 자동 커밋이 OS 이력을 오염시키지 않게, 자동화 push 경계를 studio로 한정해 OS 본체를 보호.

## 규칙 (mirOS 계약 상속)

- 태스크 관리는 mirOps로 — 자체 todo/칸반 금지 (백로그 CSV는 데이터)
- 출처 없는 사실은 대본 금지 · 스토리보드는 0.1초 단위
- 산출물 말미 검수 3줄: "무엇이 달라지나: / 왜: / 리스크: 낮음·중간·높음 — 근거"
- 보고: 결론 → 바뀐 것 → 미르가 직접 할 것(복붙 명령)
- 발행·과금·삭제는 언제나 [미르] 승인
