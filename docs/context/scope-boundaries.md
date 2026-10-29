---
name: scope-boundaries
description: T메디 리포가 맡는 것과 다른 리포(Hub·T수시/Susi·Interview·Music_College·형제 앱)가 맡는 것의 경계 — 어디를 고쳐야 하는지
type: project
updated: 2026-10-25
---

# 범위 경계 — 이건 이 리포에서 고치는가?

| 대상 | 주인 | T메디에서 할 일 |
|---|---|---|
| 페이지·데이터·면접 콘텐츠·가격 표시 | **T_Medi (여기)** | 직접 고친다 |
| `public/sitemap.xml`·`robots.txt`·브랜드 자산 | `Hub` (`brand/apps.json` → `python brand/sync_brand.py medi`) | 직접 고치지 않는다. `docs/medi-pages.json` 을 만들어 넘긴다([`../sitemap-handoff.md`](../sitemap-handoff.md)) |
| URL 표준·예약 접두사 | `Hub/docs/url-standard.md` | 따른다 |
| 로그인(SSO) | Hub 백엔드 | 자체 로그인·DB·API 금지(AGENTS.md) |
| 공통 위성앱 헤더 | `Music_College/packages/satellite-header` | 소스 복제 금지, `link:` 의존성([`satellite-header.md`](satellite-header.md)) |
| AI 모의면접 엔진·빌드 | `Interview` 리포 (`tools/sync-coach-to-tmedi.mjs` → `public/ai-interview/`) | 산출물만 받는다(gitignore). iframe 주소 `lib/ai-interview.ts` |
| 생기부 기반 면접 예상문항 기능 | **T수시**(`Susi` 리포 — `Susi/docs/context/면접예상문항-구현.md`) | T메디에 넣지 않는다. 학생부 처리·법적 위험(초·중등교육법 제25조의2)·결제 보류 결정은 그쪽 문서 |
| T수시 면접 수업 강사(문과 이수경 선생님 등) | T수시 | T메디 강사 SSOT(`lib/teachers.ts`)와 섞지 않는다 |
| 형제 앱 공통 코드(auth 등) | Kwakiwon·Sakwan·T_Medi 각각 | 한 곳을 고치면 셋 다 확인([`sibling-apps-drift.md`](sibling-apps-drift.md)) |

## AI MMI 모의면접 — T메디 vs T수시

- 화면은 **T메디 독자 앱**으로 보인다. T수시 화면에 걸치지 않는다.
- T수시 면접과 **같은 부분은 한 번만 구현해 두 곳에 붙이고**, 다른 부분만 각자 만든다. 공통 부분을 T메디 안에 복제해 넣지 말 것.
- 2026-10-29 구체화: **엔진(코치·MMI 실전)은 「면접 세트」를 받기만 하고, 세트(대학·전형·학과 + 방식 + 문항)와 선택 화면·가격·맛보기는 T메디가 만든다.**
  T메디 세트 원본은 기출 분석 데이터에서 만든다. 규격 설계: `Interview/docs/interview-set-spec.md`.

## 데이터 경계

- 학생 개인정보(생기부·연락처·상담 내용)는 이 리포에 들어오지 않는다. 이 리포는 정적 공개 사이트다.
- 원천 CSV·요강 PDF 는 리포 밖(`E:\Dev\_work\...`)에 있고, 리포에는 가공된 공개 데이터(`lib/**/*.ts`)만 둔다.
