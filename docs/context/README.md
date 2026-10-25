# docs/context 색인

코드 작업 전에 이 표에서 필요한 문서만 연다. 규칙(반드시 지킬 것)은 루트 `AGENTS.md`, 배경과 결정은 여기.

## 결정·정책

| 파일 | 언제 읽나 |
|---|---|
| [`business-decisions.md`](business-decisions.md) | 수업 절차·가격·강사 배정·AI 모의면접 범위를 건드릴 때, 상품 문구를 쓸 때 |
| [`interview-2session-curriculum.md`](interview-2session-curriculum.md) | 선생님 2회 + AI 구조의 화면·문구·기능을 설계할 때 |
| [`data-rules.md`](data-rules.md) | 입결·요강·면접 데이터를 추가·수정할 때 (실측만, 원천 위치, 필터, 분류 두 축) |
| [`uiye-db-cleanup.md`](uiye-db-cleanup.md) | `lib/ipkyul/uiye.ts` 전형 행을 정리할 때 |
| [`scope-boundaries.md`](scope-boundaries.md) | "이걸 이 리포에서 고치나?"가 애매할 때 (Hub·Susi·Interview·Music_College) |

## 운영·교훈

| 파일 | 언제 읽나 |
|---|---|
| [`lessons-learned.md`](lessons-learned.md) | 배포·렌더링·이미지 생성·원격 셸 작업 전 — 실제로 겪은 함정 |
| [`seo-indexing.md`](seo-indexing.md) | 서치콘솔·네이버·IndexNow, 배포 후 색인 작업 |
| [`static-export-and-deploy.md`](static-export-and-deploy.md) | 정적 export 제약, 수동 배포 |
| [`satellite-header.md`](satellite-header.md) | 공통 헤더, CI Secret(`SATELLITE_HEADER_TOKEN`) |
| [`site-structure.md`](site-structure.md) | 네비게이션·죽은 `navigation.tsx` |
| [`sibling-apps-drift.md`](sibling-apps-drift.md) | 형제 앱(Kwakiwon·Sakwan)과 공유하는 코드를 고칠 때 |

## docs/ 의 다른 문서

| 파일 | 내용 |
|---|---|
| [`../interview-ia-plan.md`](../interview-ia-plan.md) | 면접 영역 정보구조 재설계(/mmi → /interview/mmi 통합, 2층 동선) |
| [`../sitemap-handoff.md`](../sitemap-handoff.md) | 사이트맵 갱신 절차(Hub 연동), 정렬 순서 |
| [`../keywords/README.md`](../keywords/README.md) | 네이버 검색광고 키워드 생성 방식 |
| `../medi-pages.json` | Hub 에 넘길 실제 경로 목록 |
| `scripts/interview-og/README.md` | 면접 카드 이미지 생성기와 함정 |

## ⚠️ 낡은 내용 — 코드가 우선 (2026-10-25 확인)

- `AGENTS.md`: 형제 앱 표의 "CI 자동 배포 ❌"·명령어 절의 "CI 가 없으므로 수동"은 낡았다 — `.github/workflows/deploy.yml` 이 있다.
  "`app/mmi/[slug]` 하나가 동적 라우트"도 낡았다 — `/mmi` 는 삭제되고 301(`/mmi/:slug` → `/interview/uidae/:slug`). 지금 동적 라우트는 `/univ/[slug]`·`/interview/*/[slug]`·`/ipkyul/...` 등 여럿.
  "`PromoChrome` 에 붙여야" → 현재 이름은 `SiteChrome`(`app/_site/chrome.tsx`).
- `site-structure.md`: `/promo/*` 시절 구조. 현재 경로는 `docs/medi-pages.json` 과 `app/` 을 본다.
- `static-export-and-deploy.md`: `**` → `/index.html` 리라이트 설명은 낡았다(제거됨, 다시 넣지 말 것).
- 메모상 수업 "150분·38만원"은 낡았다 — 현재 값은 `lib/mmi-schedule.ts`.

새 결정이 생기면 해당 파일에 한 줄 넣고, 새 파일을 만들면 이 색인에 줄을 추가한다.
