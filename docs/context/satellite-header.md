# 공통 위성앱 헤더

- 원본: `../Music_College/packages/satellite-header` (README 먼저 확인).
- `package.json`의 `link:` 로컬 의존성으로 연결. 컴포넌트/CSS 소스는 복제하지 않는다.
- 앱별 설정: `app/_site/medi-header.tsx`. 콘텐츠 메뉴는 `chrome.tsx`의 `NAV_ITEMS`를 전달한다.
- 전역 CSS는 layout에서 한 번 import하고 Next의 `transpilePackages`로 TSX를 처리한다.
- 공통 헤더는 `.site-shell` 밖에서 렌더하여 기존 본문 디자인의 header 선택자 영향을 받지 않는다.
- 기존 Hub SSO 훅을 사용한다. 도토리 조회 API와 개인 알림 구현은 없으므로 잔액을 0으로 꾸미지 않는다.

## 설치 및 CI 주의

공통 패키지는 Music_College의 `codex/satellite-header` 브랜치에 있으며,
CI는 커밋 `8b245ee0532f5a2474983feb0cc7f38b463b7a1b`를 형제 폴더에 체크아웃한다.
Music_College는 비공개 저장소이므로 해당 저장소 contents 읽기 권한을 가진
`SATELLITE_HEADER_TOKEN` Secret이 필요하다. 배포에는 `FIREBASE_TOKEN`도 필요하다.
2026-09-18 확인 당시 두 Secret이 없어 자동 배포는 사용할 수 없었다.
자격증명을 임의로 생성하거나 다른 앱의 운영 브랜치를 변경하지 않는다.

외부 연결 주소는 T음대 앱 레지스트리와 대조했고 공개 주소 11개에 HTTP 200을 확인했다.
소개 페이지로 표시한 서비스는 준비 중 기능이며 의약학 지원 범위를 보장하지 않는다.
