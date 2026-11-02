---
name: interview-system
description: 수시앱 면접 시스템(내 면접·면접 수업 예약·선생님 연결·내 수업)을 T메디로 가져온 구조 — 공용 서버, 한 폴더, 나중에 면접 앱으로 분리
type: project
updated: 2026-11-02
---

# 면접 시스템 — 수시앱에서 가져옴 (2026-11-02)

사용자 지시: "수시앱 면접에서 구현한 면접 시스템을 메디로 가져와라. 공용으로 쓸 수 있으면 쓰고, 어차피 나중에 면접으로 분리한다."

## 무엇이 들어왔나

| 수시앱(`Susi/susi-front/src/components/services/interview/`) | T메디 | 비고 |
|---|---|---|
| 면접 메뉴 4칸 「내 면접 · 대학별 면접 · AI 면접 · 면접 수업」 | `app/interview/layout.tsx` → `features/interview-system/menu.tsx` | 대학별 면접 = `/interview` 와 계열·대학·유형 페이지 전부 |
| 내 면접 `/susi/interview/me` | `/interview/me` (noindex) | 할 일 카드 → 내 지원 대학 → 내 수업 |
| 할 일 카드·휴대폰 고정 버튼 | `todo.tsx` + `hooks.ts useInterviewTodo` | 로그인 전 / 과제 / 수업 학생 / 선생님 / 그 밖 |
| 내 지원 대학(localStorage) | `my-univs.ts` (키 `medi-interview:my-univs`) | 의·치·한·약·수 79개 대학. 로그인 없이도 담는다 |
| 계좌이체 예약 | `/interview/class` (noindex) + `/interview` 비용 칸 버튼 | 상품 `iv_medi1`·`iv_medi3` |
| 선생님 초대 링크·코드·연결 끊기 | `class-connect.tsx` | `/interview/me?class=코드` |
| 내 수업(일정·줌·과제·보낸 결과) | `my-class.tsx` | |

## 공용으로 쓴 것 (복제하지 않음)

- **서버는 수시 서버(susi-back) 하나.** 예약·수업 일정·선생님 연결·과제·보낸 결과 장부가 같다 → 선생님은 같은 선생님앱에서 T메디 학생도 본다.
  T메디 토큰(Hub 발급)은 서버 학생용 라우트의 `@AcceptHubToken()` 으로 통과한다(Hub `/auth/verify-token` 확인, 5분 캐시).
- **선생님 과제는 공용 AI 면접 앱 T면접(tinterview.kr)에서 한다.** 예상문제 세트는 `/t/<코드>`, 제시문·문항 지정 과제는 `/susi/interview/ai?assign=`.
  T메디 AI 면접(`/interview/ai`, Interview 저장소 엔진 iframe)은 기기 안 분석이라 아직 과제·결과 보내기를 받지 못한다.
- 입금 확인 스크립트(susi-back `scripts/interview-class-deposits.cjs`)도 같은 것을 쓴다. 예약 메모 앞에 `[T메디]` 가 붙는다.

## T메디가 따로 가진 것

- 가격·환불 문장 = `lib/mmi-schedule.ts` `TUITION`. 서버 `bank-deposit.constants.ts` 의 `iv_medi1`(35만)·`iv_medi3`(99만)과 **같아야 한다** — 가격을 바꾸면 둘 다.
- 대학·전형·발표일·면접일 = 기존 SSOT(`lib/univ.ts`·`lib/field-registry.ts`). 페이지가 `features/interview-system/catalog.ts` 로 얇게 추려 props 로 넘긴다(클라이언트 묶음에 원본이 안 들어가게).
- 수시앱에 있고 T메디에 **넣지 않은 것**: 남은 횟수(AI 가격은 T메디가 따로), 관심대학 가져오기(T메디에 관심대학 없음), 사전 질문지·학생부(서류 기반 전용), 첫 화면 자동 이동.

## 정한 것 (사용자 확인 전 — 바꾸려면 말해 달라)

1. **입금 계좌는 수시앱과 같은 계좌**(`config.ts BANK`, 주식회사 거북스쿨). 같은 입금 장부를 쓰기 때문. T메디 전용 계좌가 따로 있으면 그 값만 바꾼다.
2. 서버 상품 track 은 `essay`(MMI·제시문형이 주라 사전 질문지를 띄우지 않음).
3. `/interview/me`·`/interview/class` 는 검색에 내지 않는다(개인 화면·예약 폼, 본문 중복 방지). 사이트맵(Hub `apps.json`)에 넣지 않았다.

## 면접 앱으로 분리할 때

`features/interview-system/` 폴더를 그대로 옮기고, 바꿀 것은 셋뿐이다 — `config.ts` 의 `INTERVIEW_API_URL`, `catalog.ts`(대학 데이터 출처), `lib/auth.ts` 의존(로그인).
