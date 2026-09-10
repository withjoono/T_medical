---
name: site-structure
description: T_Medi 의 페이지 구조와 네비게이션 SSOT(PromoChrome), 그리고 링크가 깨진 죽은 navigation.tsx
type: project
---

# 사이트 구조

## 라우트 전체 (2026-09-03 실측)

```
/                       app/page.tsx        ← promo 홈(_home.tsx)을 PromoChrome 으로 감싼 것
/promo/susi             고3 의대 수시 허브 (교과·종합·논술 개관 + 지역 선발 + 수능최저 + 컨설팅)
/promo/susi/gyogwa      학생부교과전형
/promo/susi/jonghap     학생부종합전형
/promo/susi/nonsul      논술전형
/promo/jungsi           정시 전략
/promo/overseas         해외 의대 · 국내 면허 경유 루트
/promo/uidae-class      의대 진학반
/promo/interview        면접 수업 (MMI·인적성·제시문)
/promo/tamgu            탐구보고서
/promo/guide            사용법
/promo/blog             블로그
```

이게 전부다. 동적 라우트는 없다.

`/promo/susi/*` 3개는 `NAV_ITEMS` 의 `children` 으로 등록돼 **상단 네비에는 부모(`수시 전형`)만 노출되고 풋터에서 펼쳐진다.**
`/promo` 자체는 `firebase.json` 의 301 로 `/` 에 흡수된다(루트가 곧 promo 홈).

## 네비게이션 SSOT — `app/promo/_chrome.tsx`

`PromoChrome` 이 **상단 네비 + 풋터**를 담당하고, 두 곳에서 같은 컴포넌트를 쓴다:

- `app/page.tsx` — 루트에서 직접 `<PromoChrome><PromoHome /></PromoChrome>`
- `app/promo/layout.tsx` — `/promo/*` 하위 전체

파일 주석이 규칙을 명시한다:

> 상단 네비 = 사이트맵. **새 promo 페이지를 추가하면 여기(`NAV_ITEMS`)에도 등록한다.**
> 풋터 링크는 `NAV_ITEMS` 에서 홈을 뺀 목록(`FOOTER_LINKS`)을 그대로 사용한다.

상담 CTA 는 `export const CONTACT_ANCHOR = "#contact"` — 풋터 연락처 블록으로 스크롤한다. 모든 페이지가 같은 크롬을 쓰므로 어디서든 동작한다.

## ⚠️ `components/navigation.tsx` 는 죽은 코드다

2026-09-03 확인:

1. **어디에서도 import 되지 않는다.** `app/layout.tsx` 는 `{children}` 만 렌더한다.
2. 이 파일이 가리키는 라우트가 **하나도 존재하지 않는다**:
   `/medicine` `/dentistry` `/korean-medicine` `/pharmacy` `/veterinary` ·
   `/susi-strategy` `/jonghap-strategy` `/jungsi-strategy` `/nontong` ·
   `/consulting` `/success-cases`
3. 브랜드 표기도 다르다 — 이 파일만 **"TS 메디컬"**, 실제 사이트는 **"T Medi / T메디"**.
4. 이 앱에서 `useAuth()` 를 쓰는 유일한 파일이다 → **현재 화면에는 로그인 UI 가 노출되지 않는다.**

`firebase.json` 의 `**` → `/index.html` 리라이트 때문에 이 링크들을 눌러도 404 가 아니라 **홈이 뜬다** — 그래서 깨진 사실이 드러나지 않는다.

**대응:**

- 네비게이션을 고칠 일이 있으면 **`app/promo/_chrome.tsx` 를 고친다.** 이 파일을 되살리지 말 것.
- 로그인 UI 가 필요하면 `lib/use-auth.ts` 를 **`PromoChrome` 에 붙인다**(이 파일을 import 하는 게 아니라).
- 이 파일을 삭제할지 여부는 소유자 판단이 필요하다 — **확인 필요.**

## 메타데이터가 두 군데에 있다

- `app/layout.tsx` — `metadataBase: https://tmedi.kr`, `title: "T메디 - 의·치·한·약·수 입시"`, OG/twitter, `icons`.
- `app/page.tsx` — **루트 페이지가 자체 `metadata` 를 export 해서 위 title/description 을 덮는다** (`"T Medi | 의치한약수 진학 전문 포털 — 의대·치대·한의대·약대·수의대"`).
- `/promo/*` 각 페이지도 자체 `metadata` 를 export 한다.

→ 홈 문구를 바꿀 때는 **`app/layout.tsx` 와 `app/page.tsx` 를 함께** 봐야 한다. 두 곳의 브랜드 표기("T메디" vs "T Medi")가 이미 갈라져 있다.

## 브랜드 자산

`public/` 에는 `favicon.ico` · `logo.png` · `og-image.png` 세 개뿐이다. 전부 Hub 의 `brand/` 가 배포한 **사본**이다.

- `brand/sync_brand.py` 는 **자산 파일만 복사**한다. **메타데이터는 위 `metadata` 블록에서 수동 관리**한다(Vite 앱의 `index.html` 마커 블록 자동 치환과 다르다).
- 교체는 Hub `brand/apps.json` 수정 → `python brand/sync_brand.py medi`. `public/` 직접 교체 금지.
- 자산 URL 에 캐시 무효화용 `?v=2` 가 붙어 있다. 교체 시 숫자를 올리고 카카오/페이스북 OG 캐시를 초기화한다.

## 규모

`app/` + `components/` + `lib/`(shadcn `components/ui/` 제외) 약 **2,300행**. 형제 앱 중 가장 작고, 기능(모의고사·데이터 파일)은 없다.
`components/` 에는 `navigation.tsx`(죽은 코드)와 `ui/`(shadcn) 뿐이다.


## 공통 프로모 컴포넌트 — `app/promo/_components.tsx`

의대 특화 페이지를 추가하면서 컴포넌트가 늘었다. **새 페이지는 여기 있는 것부터 조합해서 만든다.**

| 컴포넌트 | 용도 |
|---|---|
| `PromoHero` | 다크 히어로(배지·타이틀·하이라이트·스탯 칩) |
| `PromoSection` | 섹션 래퍼(eyebrow/title/subtitle, `tone="muted"` 로 배경 교대) |
| `FeatureGrid` | 아이콘 카드 그리드 |
| `StepList` | 번호가 붙은 단계 목록 |
| `CheckList` | 체크 아이콘 2열 목록 |
| `PriceCard` | 가격 카드 |
| `StatBand` | 히어로 직후 핵심 수치 4칸 밴드 |
| `CompareTable` | 비교표(모바일 가로 스크롤) |
| `NoteBox` | 안내/주의 박스 (`tone="info" | "warn"`) |
| `RouteTimeline` | 세로 경로 타임라인(해외 의대 경유 루트용) |
| `LinkCards` | 다른 페이지로 보내는 링크 카드 그리드 |
| `SourceNote` | 데이터 기준·유의사항 각주 |
| `FinalCTA` | 하단 다크 CTA |

⚠️ `globals.css` 의 semantic 토큰(`--primary` 등)은 rgb() 래핑이 없어 `bg-primary` 류가 렌더되지 않는다. **plain Tailwind 팔레트 클래스만 사용**하고, 클래스명은 정적 리터럴로 유지한다(v4 JIT 스캔).

## 입시 데이터가 들어간 페이지 — 갱신 주기

`/promo/susi*`, `/promo/jungsi`, `/promo/overseas` 는 **연도 의존 수치**(2027학년도 모집인원·수능최저·예비시험 통계)를 담고 있다.

- 각 페이지 하단 `SourceNote` 에 기준 시점과 유의사항을 적어 뒀다. **수치를 고치면 이 각주도 함께 고친다.**
- 학년도가 바뀌면 모집인원·비율·전형명 변경 사례를 전수 재확인해야 한다.
- 대학별 개별 수치(논술 실시 대학, 최저 기준 등)는 집계 기준에 따라 달라진다 — 단정적으로 쓰지 말고 "최종 모집요강 기준" 문구를 유지할 것.
