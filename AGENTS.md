# AGENTS.md — T_Medi (T메디)

> Codex가 이 파일을 자동으로 읽는다. **여기 적힌 것은 링크가 아니라 규칙이다.**
> 세부 배경은 `docs/context/` 에 있고, 아래 색인에서 필요한 것만 열어 본다.

## 이 리포는 무엇인가

**T메디** — 의·치·한·약·수(의대·치대·한의대·약대·수의대) 입시 정보 사이트.
세 특화대학 앱 중 **가장 작다**(앱 코드 약 2,300행, `components/ui/` 제외). 실질적으로 **`/` + `/promo/*` 프로모 사이트**다.

- **Next.js 15.2.4 App Router + React 19 + Tailwind v4 + shadcn/ui**, `output: 'export'` **정적 사이트**
- **자체 백엔드가 없다.** 인증은 Hub SSO에 위임하고, 호출하는 서버 API는 **Hub 백엔드 두 개(SSO)뿐**이다.
- Firebase Hosting site `medical-front` (프로젝트 `ts-front-479305`) → 프로덕션 **https://tmedi.kr**
- 로컬 개발 포트 **3023** (전역 레지스트리)
- 패키지 매니저 **pnpm**(`pnpm-lock.yaml`)
- 형제 앱: `Kwakiwon`(T과기원)·`Sakwan`(T사관). 같은 v0 템플릿에서 복제됐다 — `docs/context/sibling-apps-drift.md` 참조.

## 🚨 생태계 공통 규칙 (읽지 않고 작업 금지)

이 5개는 링크가 아니라 본문이다. 전 리포 공통이며, 위반 시 프로덕션 데이터가 깨진다.

### 1. DB 접속 직후 신원 게이트 — 생략 금지

**"접속 성공"은 prod에 붙었다는 증거가 전혀 아니다.** 로컬에도 `geobukschool_prod` 라는 **같은 이름의 DB**가 있고 `tsuser` 자격증명까지 통과하므로, 포트·DB명·유저·비밀번호가 **전 단계 모두 통과**하면서도 엉뚱한 DB를 보게 된다.

> 실제 사고 (2026-08-19): `cloud-sql-proxy --port 5433` 이 로컬 postgres의 5433 점유로 기동 실패했는데 `netstat` LISTENING만 보고 떴다고 오인. prod를 "환산식 0행 / susi_unit 없음"으로 보고했으나 실제 prod는 formula 1,267행·susi_unit 33,770행으로 정상 가동 중이었다. 멀쩡한 작업 메모를 거짓으로 판정할 뻔했다.

접속 직후 **무조건** 이 쿼리부터 실행한다:

```sql
SELECT current_database(), inet_server_port(), version();
--  prod  = "PostgreSQL 14.x on x86_64-pc-linux-gnu"
--  로컬  = "PostgreSQL 18.x on x86_64-windows"   ← 즉시 중단

SELECT count(*) FROM susi.susi_calculation_formula;  -- prod ≈ 1,267 (year 2027)
SELECT count(*) FROM susi.susi_unit;                 -- prod ≈ 33,770
```

행 수가 기대치와 다르면 **그건 prod가 아니다.** 스키마 존재 여부만으로 판정하지 말 것 — 로컬에도 같은 스키마가 있다.

- **5433을 프록시 포트로 쓰지 말 것.** 로컬 Windows postgres 상시 점유 대역이다. 15432·15433 등 비어 있는 포트를 쓴다.
- 프록시는 **분리 실행**하고 기동 성공을 프로세스/로그로 확인한다. `netstat` LISTENING은 근거가 안 된다(누가 듣고 있는지 알 수 없음).
- `app.yaml` 은 Secret에서 재생성되므로 그 파일의 접속 정보를 신뢰하지 말 것.
- 메모에 "prod 실측 확인"이라 적을 때는 **위 게이트 출력을 함께 붙인다.** 출력이 없으면 미확인으로 취급한다.
- 저장된 메모와 실측이 충돌하면 **메모보다 접속 대상을 먼저 의심한다.**

### 2. 척도 3컬럼 — `max_score` / `real_max_score` / `score_scale`

`susi.susi_calculation_formula` 의 세 컬럼은 서로 다른 척도다. 혼동하면 환산점수가 통째로 틀린다.

| 컬럼 | 의미 |
|---|---|
| `max_score` | **환산식 내부 만점.** 대학마다 제각각(1·10·100·125·400·720…). 시드 JSON 유래. |
| `real_max_score` | **대학별 실제 환산 만점**(유웨이 크롤값). `rescale-formulas.py` 의 `UW_MAXSCORE` 딕셔너리가 원본. |
| `score_scale` | `real_max_score / max_score`. 엔진 raw 점수를 **입결 척도로 올리는 배율**. |

적용 지점:

- **저장** — 엔진 원점수(raw) 그대로 저장한다. 척도 보정을 하지 않는다.
- **조회** — `convertedScore = raw × score_scale`. **조회 시점 적용**이므로 값을 바꿔도 `susi_user_factor_score` 재계산·캐시 무효화가 필요 없다.
- **백분율 분모** — `real_max_score` 우선, 없으면 `max_score` 폴백. 내 환산점수와 예상컷(환산 50컷/70컷)이 **둘 다 입결 척도**이므로 분모도 입결 척도여야 한다.
- 엔진이 실척도를 직접 산출하는 경우 `score_scale` 은 **반드시 1** — 이중 보정 금지.

### 3. 권위 테이블은 `susi.susi_unit`

- `susi.susi_unit` — **2027 모집단위 권위 테이블** (prod 33,770행). `conversion_factor_id` 가 이미 붙어 있다.
- `hub.susi_kyokwa_recruitment` — **비어 있는 레거시.** 개념 중복이 아니라 그냥 빈 테이블이다.

→ `susi_unit` 생성·적재·크로스워크 작업은 **전부 불필요하다.** 이 테이블을 "만들어야 한다"고 판단했다면 잘못된 DB를 보고 있는 것이다(규칙 1로 돌아갈 것).

### 4. DRY-RUN 기본, 쓰기는 `--apply` 명시

DB를 수정하는 모든 스크립트는 **인자 없이 실행하면 DRY-RUN**이어야 한다.

- 기본 동작: 변경 대상과 before/after를 출력만 하고 **커밋하지 않는다**(`conn.rollback()`).
- 실제 쓰기: `--apply` 를 **명시적으로** 붙였을 때만. `conn.autocommit = False` + 명시적 `commit()`.
- 출력에 현재 접속 대상(규칙 1의 게이트 출력)과 영향 행 수를 반드시 찍는다.
- 기존 스크립트에 이 플래그가 없다면 **먼저 추가하고 나서** 실행한다. 예외 없다.

### 5. 어디가 대조 베이스라인 50.2% — 떨어지면 즉시 롤백

환산 엔진 관련 변경은 반드시 **어디가 대조를 재실행**해서 검증한다.

- 현재 베이스라인: **일치 + 근사 50.2%** (화이트리스트 대학 기준).
- 변경 후 이 수치보다 **올라가야 정상**이다. 떨어지면 **즉시 롤백**한다.
- 나머지 절반은 엔진을 켜면 틀린 환산점수를 노출하므로 **화이트리스트 대학만** 엔진을 적용한다.
- 배율이 큰 대학(가톨릭대 10배)·하향 조정 대학(건국대)은 자동 수치만 믿지 말고 **개별 육안 확인**한다.


---

## 🔒 T_Medi 고유 규칙

### 배포는 `firebase deploy --only hosting:medical-front` — `--only hosting` 단독 금지

- `firebase.json` 의 hosting 블록은 **하나뿐이고 `"site": "medical-front"`** 가 박혀 있다. **블록을 늘리거나 `site` 키를 지우지 말 것.**
- `.firebaserc` 에는 `projects.default = ts-front-479305` 만 있고 `targets` 매핑이 없다 → `hosting:` 뒤에는 **site 이름 `medical-front`** 를 그대로 쓴다.
- target 없는 배포는 2026-05-16 에 `www.tskool.kr`(Hub) 을 위성앱 빌드로 덮은 사고의 형태다. Firebase site ↔ 앱은 1:1 고정이다.

### ⚠️ CI 워크플로가 없다 — 배포는 전부 수동

`.github/` 디렉터리 자체가 없다(2026-09-03 확인). 형제 앱 `Kwakiwon`·`Sakwan` 에는 main push 자동 배포가 있다.
→ **`main` 에 머지해도 프로덕션은 갱신되지 않는다.** 반드시 로컬에서 `pnpm build` 후 위 명령으로 직접 배포하고, 배포 사실을 남길 것.

### 정적 내보내기(`output: 'export'`) — 서버 기능이 아예 없다

- **Route Handler(`app/api/**`)·Server Action·미들웨어(`middleware.ts`)·ISR/`revalidate`·`cookies()`/`headers()` 사용 불가.**
- 동적 라우트를 새로 만들면 **`generateStaticParams()` 필수**. 현재 이 리포에는 동적 라우트가 **하나도 없다.**
- `images.unoptimized: true` — `next/image` 최적화 없음.
- `out/` 이 산출물이며 `.gitignore` 대상이다. 커밋 금지.

### `firebase.json` 의 SPA 리라이트 — 404 가 뜨지 않는다

이 앱에만 있는 설정이다(형제 앱에는 없다):

```json
"redirects": [{ "source": "/promo", "destination": "/", "type": 301 }],
"rewrites":  [{ "source": "**",     "destination": "/index.html" }]
```

`**` → `/index.html` 리라이트 때문에 **존재하지 않는 경로가 404 대신 홈 페이지를 반환**한다. Next 가 생성한 `out/404.html` 은 사실상 쓰이지 않는다.
→ 오타 링크가 조용히 홈으로 흡수되므로 **링크 오류가 눈에 띄지 않는다.** 라우트를 추가·삭제할 때 링크를 직접 확인할 것.
또한 `/promo` 는 301 로 `/` 에 흡수된다. 루트가 곧 promo 홈이기 때문이다.

### `components/navigation.tsx` 는 죽은 코드이고 링크가 전부 깨져 있다

2026-09-03 확인:

- **어디에서도 import 되지 않는다.** `app/layout.tsx` 는 `{children}` 만 렌더하고, `app/page.tsx` 와 `app/promo/layout.tsx` 는 `app/promo/_chrome.tsx` 의 `PromoChrome` 을 쓴다.
- 이 파일이 가리키는 `/medicine` `/dentistry` `/korean-medicine` `/pharmacy` `/veterinary` `/susi-strategy` `/jonghap-strategy` `/jungsi-strategy` `/nontong` `/consulting` `/success-cases` 라우트는 **하나도 존재하지 않는다.**
- 표기도 다르다 — 이 파일만 "TS 메디컬", 실제 사이트는 "T Medi / T메디".

→ **이 파일을 살려 쓰지 말 것.** 네비게이션은 `app/promo/_chrome.tsx` 의 `NAV_ITEMS` 하나가 SSOT 다. 삭제 여부는 소유자 판단이 필요하다(**확인 필요**).

### 네비게이션 SSOT 는 `app/promo/_chrome.tsx`

- `PromoChrome` 이 상단 네비 + 풋터를 담당하고, **루트(`app/page.tsx`)와 `/promo/*`(`app/promo/layout.tsx`) 양쪽이 같은 크롬을 쓴다.**
- `NAV_ITEMS` 가 사이트맵이다. **promo 페이지를 추가하면 여기에도 등록**해야 한다(풋터 링크는 `NAV_ITEMS` 에서 홈만 뺀 목록을 그대로 쓴다).
- 상담 CTA 앵커는 `CONTACT_ANCHOR = "#contact"` — 풋터 연락처 블록으로 스크롤한다. 모든 promo 페이지가 같은 크롬을 쓰므로 어디서든 동작한다.

### 인증은 Hub에 위임 — 자체 로그인 금지

- `lib/auth.ts` → `HUB_URL`(기본 `https://tskool.kr`)의 `/auth/login?redirect=` 로 보내고, `?sso_code=` 를 `HUB_API_URL`(기본 `https://ts-back-nest-479305.du.r.appspot.com`)의 **`POST /auth/sso/verify-code`** (`serviceId: "medical"`) → **`GET /auth/me`** 로 교환한다.
- 토큰은 `localStorage` 의 **`medical_token` / `medical_user`**. 형제 앱과 키가 다르다.
- **이 둘이 이 앱이 호출하는 서버 API의 전부다**(2026-09-03 실측). 자체 DB·자체 로그인·자체 API를 만들지 말 것.
- 단, `useAuth()` 를 실제로 쓰는 곳은 죽은 `components/navigation.tsx` 뿐이다 → **현재 화면에는 로그인 UI 가 노출되지 않는다.** 로그인 기능을 살리려면 `PromoChrome` 에 붙여야 한다.

### 빌드에 타입·린트 게이트가 없다

`next.config.mjs` 에 `typescript.ignoreBuildErrors: true` / `eslint.ignoreDuringBuilds: true` 가 켜져 있다.
**타입 에러가 있어도 빌드는 성공한다.** 검증은 `npx tsc --noEmit` 로 따로 한다.

### 형제 앱 대비 미도입 항목 — 복사해 오기 전에 확인할 것

| 항목 | Kwakiwon | Sakwan | T_Medi |
|---|---|---|---|
| `geobuk-shared`(공유 `EcosystemHeader`) | ✅ | ✅ | **❌ 미도입** |
| `.npmrc`(GitHub Packages 레지스트리) | ✅ | ✅ | **❌ 없음** |
| CI 자동 배포 | ✅ | ✅ | **❌ 없음** |
| hydration mismatch 수정(`getLoginUrl(_, forceServer)`) | ❌ | ✅ | **❌** |
| `dev` 스크립트에 포트 인자 | ❌ | ✅ | **❌** |

`geobuk-shared` 를 도입한다면 `.npmrc`(`@withjoono:registry=https://npm.pkg.github.com`)와 토큰 설정도 함께 필요하다 — **없으면 `pnpm install` 이 401 로 깨진다.**

### 브랜드 자산은 Hub `brand/` 가 SSOT, **메타데이터는 여기서 수동 관리**

Vite 앱과 다르다. Next 앱에는 마커 블록이 있는 `index.html` 이 없다.

- `brand/sync_brand.py` 는 **자산 파일(`public/logo.png`·`favicon.ico`·`og-image.png`)만 복사**한다.
- **title·description·OG·twitter 는 `app/layout.tsx` 의 `export const metadata` 에서 손으로 관리**한다. `app/page.tsx` 도 **자체 `metadata` 를 따로 export** 하므로(루트 레이아웃 값을 덮는다) 문구를 바꿀 때 **두 파일을 함께** 봐야 한다.
- 자산 교체는 Hub `brand/apps.json` 수정 → `python brand/sync_brand.py medi`. `public/` 을 직접 갈아끼우지 말 것. 캐시 무효화 `?v=2` 쿼리를 함께 올리고 카카오/페이스북 OG 캐시를 초기화한다.

### 개발 포트 3023 — `pnpm dev` 만으로는 안 붙는다

`package.json` 의 `"dev": "next dev"` 에 **포트 인자가 빠져 있어 3000(Hub 개발 포트)로 뜬다.**
→ 실행할 때 **반드시 `-p 3023`** 을 준다. 포트는 생태계 전역 레지스트리이며 **변경 금지**.

---

## 📇 파일 색인 — `docs/context/`

| 파일 | 언제 읽나 |
|---|---|
| `static-export-and-deploy.md` | 빌드·수동 배포·Firebase 리라이트 설정, 서버 기능을 추가하려 할 때 |
| `site-structure.md` | 페이지 추가·네비게이션 수정, 죽은 `navigation.tsx` 를 만났을 때 |
| `sibling-apps-drift.md` | 형제 앱(Kwakiwon·Sakwan)과 공유하는 코드를 고칠 때 |

---

## 명령어

```bash
pnpm install
pnpm dev -- -p 3023      # :3023  ← 포트 인자 필수 (package.json 에 없음)
pnpm build               # next build → out/ (타입/린트 게이트 없음)
npx tsc --noEmit         # 타입 검사는 따로

# 배포 — CI 가 없으므로 수동. target 을 반드시 명시, `--only hosting` 단독 금지.
npx firebase-tools deploy --only hosting:medical-front --project ts-front-479305
```

**포트는 생태계 전역 레지스트리다.** Medi 3023 고정 — 변경 금지.
