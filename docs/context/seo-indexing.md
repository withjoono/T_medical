---
name: seo-indexing
description: 구글 서치콘솔·네이버·IndexNow 운영 절차와 2026-10 색인 현황 요약, 배포 후 할 일
type: project
updated: 2026-10-24
---

# 검색 노출 운영

사이트맵·robots 갱신 절차는 [`../sitemap-handoff.md`](../sitemap-handoff.md) (SSOT = `Hub/brand/apps.json` medi `pages`).
URL 규칙은 `Hub/docs/url-standard.md`.

## 도구 상태

| | 상태 | 위치 |
|---|---|---|
| 구글 서치콘솔 | URL 접두어 속성 `https://tmedi.kr/`, HTML 태그로 소유 확인 완료. 사이트맵 제출됨 | `app/layout.tsx` `verification.google` |
| 네이버 서치어드바이저 | **미등록.** Claude 브라우저로는 접속 차단 → 사용자가 직접 등록 | 받은 코드를 `app/layout.tsx` `verification.other` 에 `naver-site-verification` 으로 |
| IndexNow (네이버·Bing) | 키 파일 `public/<키>.txt`, 제출 `scripts/indexnow.mjs` | 배포 후 **수동** 실행. CI 에 넣지 않는다(반복 제출 방지) |

- HTML 파일 방식 확인은 `cleanUrls` 때문에 `.html` → 확장자 없는 주소로 301 이 걸려 쓰지 않는다. 태그 방식을 쓴다.
- 구글 URL 검사 색인 요청은 **하루 3건 안팎**이 한도다. 요청한 페이지는 하루 만에 색인됐다(효과 있음).

## 현황 요약 (2026-10-24)

- 사이트맵 259개. 구글 site: 약 111개. 네이버는 `/univ` 39/39, 의대 면접 페이지 39/39.
- 치·한·약·수 대학 면접 페이지 50개는 양쪽 거의 미색인 — 원인은 본문 중복(고유 문장 40%대)과 부모 페이지 미색인.
  10/24 밤 중복 축소 작업(`lib/field-crosslinks.ts`, `app/interview/_crossfield.tsx`)으로 고유 비율 65~75%.
- 상세 점검 기록은 claude.ai 프로젝트 문서(`seo-univ-index-audit-2026-10-21`, `seo-index-status-2026-10-23`, `seo-interview-pages-index-2026-10-24`)에 있다.

## 배포 후 할 일 (남은 것)

1. `node scripts/indexnow.mjs <바뀐 경로…>` — 바뀐 페이지만 제출(전체 재제출 반복 금지)
2. 구글 색인 요청 순서: `/interview/uidae/` korea → cau → skku → ulsan → `/interview/hanuidae`·`yakdae` 허브 → 치·한·약 주요 대학
3. 네이버 서치어드바이저 등록 → 사이트맵 제출 → 웹 페이지 수집 요청 (사용자)
4. 1주 뒤 재점검. 라우트·title 이 바뀌면 Hub 사이트맵 재생성(lastmod)
