---
name: lessons-learned
description: T메디에서 실제로 겪은 사고·함정과 재발 방지 규칙 — 빌드·배포·데이터 처리·이미지 생성·원격 셸
type: project
updated: 2026-10-25
---

# 사고 교훈 — 다시 밟지 말 것

AGENTS.md 에 이미 있는 것(target 없는 Firebase 배포로 Hub 덮어씀, DB 신원 게이트, 5433 포트, SPA 리라이트 제거)은 거기서 본다. 여기는 그 밖의 것.

## 배포·호스팅

- **청크 404 → "Application error" 색인 (2026-10).** Firebase 배포는 파일 세트를 통째로 바꿔 옛 해시 청크가 즉시 사라진다.
  옛 HTML 을 렌더한 구글봇이 청크 404 → `/univ/cau` 가 "제목없음 / Application error" 로 색인됐다.
  → `deploy.yml` 이 지난 `_next/static` 을 14일 보관해 함께 올린다. **수동 배포는 이 단계를 건너뛰므로** 위험이 그대로다. CI 로 배포할 것.
- **CI 가 한 번도 성공한 적 없다(2026-10-29 기준 43회).** 원인 셋: 리포 Secret `NODE_AUTH_TOKEN`(공통 헤더 패키지)·`FIREBASE_TOKEN` 미등록, gitignore 된 `public/ai-interview/` 부재. (`SATELLITE_HEADER_TOKEN` 은 헤더가 GitHub Packages 로 옮겨져 더는 필요 없다.) 푸시 후 Actions 탭에서 성공 여부를 확인한다.
- `serve out` 으로 검증할 때 **`-s` 금지** — SPA 리라이트라 모든 경로가 홈으로 뜬다.
- 301 은 1단으로. `/promo/mmi`→`/mmi`→`/univ` 처럼 체인이 생기면 구체 규칙을 일반 `/promo` 규칙보다 **앞에** 둔다(`firebase.json`).

## 렌더링·데이터 코드

- **`Math.random()` 금지.** 빌드마다 숫자가 바뀌고 hydration 이 어긋난다. 예약 현황 등은 `hash01(seed)`(FNV-1a)로 결정적으로 만든다.
- **`diffDays(a, b)` 는 b − a.** 범위 상한은 `diffDays(d, end) >= 0`. `<= 0` 으로 써서 일정표가 통째로 사라진 적이 있다.
- 슬롯은 대학별이 아니라 **날짜별**(`slotsForDate`) — 같은 날짜는 어느 대학 페이지에서도 같은 잔여가 나와야 한다. `univDays()` 는 그 대학의 어떤 면접일이든 제외한다(캘린더와 일정표 불일치 방지).
- 숫자가 HTML 에 박혀야 색인된다 → 데이터 표는 서버 컴포넌트로. 탭 안 내용은 색인되지 않으므로 키워드별 노출이 필요하면 **하위 페이지로 분리**한다.
- 모집단위 필터·수능최저 텍스트·xlsx 모집인원 함정은 [`data-rules.md`](data-rules.md) §2–3.
- 경희대 배점처럼 **모집단위 추출본에 없다고 "근거 없음"으로 판단하지 말 것** — 전형 단위 추출본을 먼저 본다(한 번 잘못 판단했다가 정정).

## 면접 카드 이미지 (`scripts/interview-og/`)

자세한 건 그 폴더 README. 요지: 헤드리스 Chrome 은 뷰포트 아래를 칠하지 않는데 PNG 크기는 `--window-size` 를 따른다 → 630 으로 찍으면 **푸터가 빠진 PNG가 에러 없이** 나온다(900 으로 찍고 자른다). 고정 높이 캔버스에서 flex 는 넘칠 때 아래부터 눌린다 → 절대배치. **요강 데이터가 바뀌면 카드도 다시 생성**한다.

## 검색 노출

- 템플릿 페이지를 대량으로 찍으면 구글이 '발견됨 - 색인 안 됨'에 묶어 둔다. 치·한·약·수 대학 면접 페이지는 공통 블록(수업·가격·강사) 때문에 고유 문장 40%대였다.
  → 공통 블록은 한 줄(`FieldClassLine`)로 줄이고, 데이터에서 **계산한** 대학 고유 문장(`lib/field-crosslinks.ts`)을 넣는다. 새 계열·템플릿 페이지를 만들 때 고유 문장 비율을 먼저 본다.
- URL·title 을 자주 바꾸면 막 색인된 노출을 잃는다(/univ title 5일 새 3번 변경). 정착된 URL·title 은 고정한다.

## 원격 셸(Claude 데스크톱 연결)로 작업할 때

- 마운트에서 pnpm 심볼릭 링크를 못 읽는다(`Input/output error`) → `tsc`·`pnpm build` 는 로컬 셸 직접 실행이나 클라우드 사본에서.
  클라우드 사본에서는 `NODE_AUTH_TOKEN` 이 없으면 `@tskool/satellite-header` 설치가 안 되므로 검증용으로만 스텁한다.
- git 명령 후 `.git/index.lock` 이 지워지지 않고 남을 수 있다 → `GIT_OPTIONAL_LOCKS=0`, 남으면 지운다.
- 루트에 검증 증거 파일(`tmedi-*.png/json/csv/dom.txt`, `.verification-evidence/`)이 많이 깔려 있다. **`git add -A` 금지** — 바꾼 파일만 지정해서 커밋한다.
