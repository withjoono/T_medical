# 공통 위성앱 헤더

- 원본: Hub 리포 `packages/satellite-header` (README 먼저 확인). 2026-10-29 Music_College에서 이관됐다.
- `package.json`: `"@tskool/satellite-header": "npm:@withjoono/satellite-header@^0.2.0"` (GitHub Packages, import 이름은 그대로). 컴포넌트/CSS 소스는 복제하지 않는다.
- `.npmrc` 가 `@withjoono` 스코프를 `npm.pkg.github.com` 으로 보내고 `NODE_AUTH_TOKEN`(read:packages PAT)을 읽는다. 로컬에서도 이 환경변수가 있어야 `pnpm install` 이 된다.
- 앱별 설정: `app/_site/medi-header.tsx`. 콘텐츠 메뉴는 `chrome.tsx`의 `NAV_ITEMS`를 전달한다.
- 전역 CSS는 layout에서 한 번 import하고 Next의 `transpilePackages`로 TSX를 처리한다.
  별칭 설치라 실제 경로는 `@withjoono/satellite-header` 이므로 **두 이름을 모두** 넣는다(빠지면 `Module parse failed`).
- 공통 헤더는 `.site-shell` 밖에서 렌더하여 기존 본문 디자인의 header 선택자 영향을 받지 않는다.
- 기존 Hub SSO 훅을 사용한다. 도토리 조회 API와 개인 알림 구현은 없으므로 잔액을 0으로 꾸미지 않는다.

## 설치 및 CI 주의

CI는 더 이상 Music_College를 체크아웃하지 않는다(`SATELLITE_HEADER_TOKEN` 불필요).
대신 설치 단계에 리포 Secret **`NODE_AUTH_TOKEN`**(read:packages PAT, Hub·geobuk-shared 와 같은 값)이 필요하다.
배포에는 `FIREBASE_TOKEN`도 필요하다. 2026-10-29 기준 이 리포에는 Secret이 하나도 없어 CI 는 43회 전부 실패했다.
또 `public/ai-interview/` 는 gitignore 대상이라 CI 에 없고, `scripts/check-ai-interview.mjs` 가 빌드를 멈춘다.
자격증명을 임의로 생성하거나 다른 앱의 운영 브랜치를 변경하지 않는다.

외부 연결 주소는 T음대 앱 레지스트리와 대조했고 공개 주소 11개에 HTTP 200을 확인했다.
소개 페이지로 표시한 서비스는 준비 중 기능이며 의약학 지원 범위를 보장하지 않는다.
