# mirOps 대기열

> mirOps MCP가 연결되지 않은 세션(원격 컨테이너 등)에서 record_work_log / update_task로 보냈어야 할 기록을 여기에 append한다.
> 미르 로컬 세션이 열리면 이 파일을 읽고 mirOps에 반영한 뒤 항목을 비운다.

형식:

```
## YYYY-MM-DD HH:MM (세션 요약)
- record_work_log: (task_id 또는 신규), 소요 N분, "한 줄 요약"
- update_task: (해당 시) status=..., notes="어디까지 했고 다음 행동"
```

---
