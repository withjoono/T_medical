---
name: static-export-and-deploy
description: T_Medi 의 Next.js 정적 내보내기 제약, main push 자동 배포 워크플로와 수동 배포 절차, firebase.json 의 SPA 리라이트 효과
type: project
---

# 정적 내보내기와 배포

## 빌드 형태

`next.config.mjs` (2026-09-03 확인, 형제 앱 3개와 바이트 단위로 동일):

```js
{ eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'export' }
```

`pnpm build` → **`out/`** 에 순수 정적 파일. `out/` 은 `.gitignore` 대상(커밋 금지).

## 쓸 수 없는 것

Route Handler(`app/api/**`) · Server Action · `middleware.ts` · ISR/`revalidate` · `cookies()`/`headers()` · `next.config` 의 `redirects()`/`rewrites()` — **전부 정적 export 에서 동작하지 않는다.**
`images.unoptimized: true` 라 `next/image` 최적화도 없다.

현재 이 리포에는 **동적 라우트가 하나도 없다.** 새로 만들면 `generateStaticParams()` 가 필수다(누락 시 페이지가 생성되지 않는다).

## 타입·린트 게이트 없음

`ignoreBuildErrors` + `ignoreDuringBuilds` 가 켜져 있다. **타입 에러로 빌드가 깨지지 않는다.**
`npx tsc --noEmit` 을 따로 돌린다(리포에 `type-check` 스크립트는 없다).

## Firebase Hosting — 이 앱만의 SPA 리라이트

```json
{ "hosting": {
    "site": "medical-front",
    "public": "out",
    "cleanUrls": true,
    "trailingSlash": false,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "redirects": [{ "source": "/promo", "destination": "/", "type": 301 }],
    "rewrites":  [{ "source": "**",     "destination": "/index.html" }]
} }
```

형제 앱(`Kwakiwon`·`Sakwan`)에는 `redirects`/`rewrites` 가 없다. 두 규칙의 실제 효과:

- **`/promo` → `/` 301.** 루트가 곧 promo 홈이라 중복 URL 을 없애는 처리다. `/promo/<하위>` 는 영향 없다.
- **`**` → `/index.html` 리라이트.** 정적 파일이 먼저 매칭되고, 매칭되지 않은 경로가 여기로 떨어진다 → **존재하지 않는 경로가 404 대신 홈 페이지를 반환한다.** Next 가 만든 `out/404.html` 은 사실상 쓰이지 않는다.
  → 오타 링크·삭제된 라우트가 조용히 홈으로 흡수되어 **링크 오류가 눈에 띄지 않는다.** 라우트를 바꿀 때 링크를 직접 확인할 것. (죽은 `components/navigation.tsx` 의 깨진 링크들이 이 리라이트에 가려져 있다 → `site-structure.md`)

## 배포 — main push 자동 배포

`.github/workflows/deploy.yml` (2026-09-10 도입). `main` push(문서 전용 커밋 제외)와 `workflow_dispatch` 에서 실행된다:

```
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit          # build 가 타입 에러를 무시하므로 별도 게이트
pnpm build                      # out/ 정적 내보내기
firebase-tools deploy --only hosting:medical-front --project ts-front-479305
```

→ **`main` 에 푸시하면 프로덕션(https://tmedi.kr)까지 반영된다.** 도입 전에는 CI 가 없어
main 의 내용과 실제 서빙 사이트가 어긋나 있었다.

- 필요한 Secret: **`FIREBASE_TOKEN`** (형제 앱 `StudyPlanner` 와 같은 방식, 같은 Firebase 프로젝트).
- `concurrency` 로 마지막 푸시만 배포하되 **배포 중 취소는 하지 않는다** — releasing 단계에서
  잘리면 어중간한 버전이 남을 수 있다.

CI 를 우회해 급히 내보내야 할 때의 수동 절차는 그대로 유효하다:

```bash
pnpm install
pnpm build
npx firebase-tools deploy --only hosting:medical-front --project ts-front-479305
```

`.firebaserc` 는 `projects.default = ts-front-479305` 만 있고 **`targets` 매핑이 없다** → `hosting:` 뒤에는 **site 이름 `medical-front`** 를 쓴다.

### `--only hosting` 단독 금지

2026-05-16, 생기북 앱이 target 없는 `firebase deploy --only hosting` 으로 Hub 의 `ts-front-479305` site 를 덮어써 `www.tskool.kr` 이 생기북을 서빙한 사고가 있었다. Firebase site ↔ 앱은 1:1 고정이다.
이 리포가 안전한 이유는 hosting 블록이 하나뿐이고 `site` 가 박혀 있기 때문이다 → **블록을 늘리지 말고 `site` 키를 지우지 말 것.**

## 환경변수

이 앱이 쓰는 `NEXT_PUBLIC_*` 은 4개다: `NEXT_PUBLIC_HUB_URL`, `NEXT_PUBLIC_HUB_API_URL`, `NEXT_PUBLIC_STUDYPLANNER_URL`, `NEXT_PUBLIC_SANGGIBOOK_URL`.
`.env*` 는 `.gitignore` 대상이라 CI 러너에는 없다. **`.env.local` 이 없으면 코드에 박힌 기본값**이 그대로 프로덕션에 나간다:

- `https://tskool.kr` / `https://ts-back-nest-479305.du.r.appspot.com` / `https://studyplanner.tskool.kr` / `https://sanggibook.tskool.kr`

**기본값이 곧 프로덕션 설정**이다. 기본값 변경은 프로덕션 변경으로 취급한다.
워크플로는 이 4개를 리포 **Variables**(Secret 아님 — 공개 URL 이다)에서 주입하도록 배선해 두었다.
Variables 가 비어 있으면 위 기본값이 쓰인다. Hub SSO 를 실제로 붙이는 시점에 값을 채울 것.
(참고로 이 4개는 현재 모두 죽은 `components/navigation.tsx` 와 `lib/auth.ts` 에서만 쓰인다.)

## 리포에 남은 잔재

- `build-out.txt` — 2026-04 의 `next build` 로그(UTF-16, `/` 와 `/_not-found` 만 있던 시절). `.gitignore` 에 등재돼 있다. 현재 구조와 무관하니 근거로 쓰지 말 것.
