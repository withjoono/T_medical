# T메디 sitemap 등록 — 처리 완료 (2026-09-26)

`public/sitemap.xml` 은 `Hub/brand/sync_brand.py` 산출물입니다. **직접 고치지 마세요.**
SSOT 는 `Hub/brand/apps.json` 의 medi `pages` 입니다.

## 처리 결과

| | 전 | 후 |
|---|---|---|
| 등록 URL | 28개 | **101개** |
| `/mmi` 계열 | 16개 등록 | **0개** (경로 삭제 · 301 이관) |
| 누락 | 89개 | 0개 |

2026-09-20 시점의 누락 89개(`/ipkyul` 44 · `/univ` 40 · `/interview` 하위 · `/jiyeok-uisa`)를 모두 등록했고,
같은 날 정보구조 개편으로 사라진 `/mmi` · `/mmi/[slug]` 16개를 제거했습니다.

구주소는 `firebase.json` 의 301 이 받습니다.

```
/mmi          → /interview/mmi
/mmi/:slug    → /univ/:slug
```

## 앞으로 라우트를 추가·삭제하면

1. 빌드 산출물에서 실제 경로 목록을 뽑습니다.

   ```bash
   cd E:\Dev\github\T_Medi
   pnpm build
   # out/ 의 .html 을 경로로 환산해 docs/medi-pages.json 을 갱신
   ```

2. `docs/medi-pages.json` 의 내용을 `Hub/brand/apps.json` 의 medi `pages` 에 그대로 넣습니다.

3. Hub 에서 동기화합니다.

   ```powershell
   cd E:\Dev\github\Hub
   python brand/sync_brand.py medi
   node scripts/check-standard.mjs medi
   ```

`sync_brand.py` 는 `apps.json` 의 `root`(`E:/Dev/github/T_Medi`)를 그대로 읽으므로
**Windows 셸에서 실행**해야 합니다. 경로가 다른 환경에서 돌리면 `경로 없음` 으로 건너뜁니다.

## 정렬 순서

사이트맵은 알파벳순이 아니라 사이트 구조 순으로 넣습니다.

```
/ → 수시(+지역의사) → 정시 → 해외 → 진학반
  → 면접(허브 → MMI → 인적성 → 제시문 → 시즌)
  → 대학(/univ → 대학별 39)
  → 입결(/ipkyul → 계열 5 → 계열별 대학)
  → 탐구 → 사용법 → 블로그
```

## 주의

- `public/sitemap.xml` · `public/robots.txt` 를 손으로 고치면 다음 `sync_brand.py` 실행 때 덮어써집니다.
- `check-standard.mjs` 의 `⚠ 루트 본문` 경고는 Next 앱에서는 오탐입니다. 체커가 빌드 산출물을 못 읽어서 나는 것이고, 실측 루트 본문은 2,636자입니다.
