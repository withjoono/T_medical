# 면접 영역 정보구조 재설계 (2026-09-26)

## 0. 확정된 결정

| 항목 | 결정 |
|---|---|
| `/mmi` ↔ `/interview/mmi` | **완전 통합** — `/mmi` 를 없애고 `/interview/mmi` 한 페이지로 |
| 수업 소개·가격 블록 | **짧은 CTA만 남기고 상세는 `/interview` 한 곳** |
| 우선 목표 | **정보로 들어와 전환으로 내려가는 2층 동선** |

---

## 1. 지금 무엇이 문제인가 (실측)

면접 관련 라우트가 6개인데 서로 물려 있습니다.

| 경로 | 현재 섹션 |
|---|---|
| `/interview` | TYPES · COMMON · PROCESS · **CLASS(수업+가격)** · NO INTERVIEW · MORE |
| `/interview/mmi` | FORMAT · UNIVERSITIES · PREPARATION · PITFALLS · **CLASS(수업+가격)** · CONTACT · MORE |
| `/interview/injeokseong` | 〃 (+ 배점표 · 하한표) |
| `/interview/jesimun` | 〃 (+ 병행형표) |
| `/interview/chuseok` | 시즌 특강 |
| `/mmi` | AT A GLANCE · WHAT MATTERS · WHY 1:1 · TRADE-OFF · UNIVERSITIES · ALSO · INSTRUCTORS · **TUITION** · WAITLIST |
| `/mmi/[slug]` | 대학별 일정 · 예약 (15개교) |
| `/univ/[slug]` | ADMISSION · INTERVIEW · **CLASS(→ /mmi/[slug] 링크아웃)** · MORE |

### 문제 네 가지

1. **같은 상품 설명이 5곳에 반복된다.** `CLASS_FLOW` · `CLASS_INCLUDES` · 38만원 가격 카드가 `/interview`, 유형 3페이지, `/mmi`(TUITION)에 각각 들어 있습니다. 어느 페이지를 열어도 절반이 같은 내용이라 "정돈 안 된 느낌"의 주범입니다.

2. **MMI 설명이 두 페이지로 쪼개져 있다.** `/interview/mmi` 가 방식·훈련을, `/mmi` 가 최저점 관리·1:1 비교를 담고 있는데 둘 다 "MMI를 어떻게 준비하나"입니다. 검색엔진 입장에서도 같은 주제로 두 URL이 경쟁합니다(카니발라이제이션).

3. **대학 목록이 세 벌이다.** 유형 페이지의 `TypeUnivTable`, `/mmi` 의 `UnivCards`, `/univ` 의 권역 색인. 같은 대학이 세 군데에서 서로 다른 모양으로 나옵니다.

4. **진입점이 유형으로 되어 있다.** 실제 방문자는 자기 면접이 무슨 유형인지 모릅니다. **아는 것은 지원 대학 이름**입니다. 그런데 1차 진입 경로가 전부 유형별로 설계돼 있습니다. 네비에서도 `/mmi` 가 "대학별 안내"와 "면접 수업" 양쪽에 중복으로 걸려 있고, "면접 수업" 하위에 5개가 평면 나열돼 있습니다.

---

## 2. 설계 원칙 셋

1. **한 사실은 한 페이지에.** 유형 설명은 유형 페이지, 대학 사실은 대학 페이지, 상품 설명은 허브. 중복이 필요하면 링크로 대신합니다.
2. **진입은 대학으로, 이해는 유형으로, 전환은 일정으로.** 방문자가 아는 것(대학 이름)에서 출발해 모르는 것(유형)을 알려주고, 마지막에 구체적 자리(일정·잔여)로 내립니다.
3. **모든 페이지는 고유 정보를 가진다.** 복붙 블록은 CTA 한 줄로 줄이고, 그 자리를 그 페이지에만 있는 내용으로 채웁니다.

---

## 3. 새 라우트 구조

| 경로 | 한 줄 정체성 | 그 페이지에만 있는 것 |
|---|---|---|
| `/interview` | 면접 영역 관문 **+ 수업 상품 상세(유일)** | 대학으로 유형 찾기, 공통 사실 6, 수업 절차·포함사항·가격, 강사 소개 |
| `/interview/mmi` | MMI에 관한 전부 | 방식 · 최저점 3축 · 1:1 vs 학원 · 실시 대학 · 2027 수업 가능 일정 · 대기 예약 |
| `/interview/injeokseong` | 인·적성에 관한 전부 | 배점 공개표 · 하한 규정표 · 훈련 6 |
| `/interview/jesimun` | 제시문에 관한 전부 | 병행형 대학표 · 숙지 10분 뼈대 |
| `/interview/chuseok` | 시즌 특강 | 기간 한정 편성 |
| `/univ` | 대학 색인 | 권역별 전체 목록 |
| `/univ/[slug]` | 그 대학에 관한 전부 | 전형 · 면접 방식 · 훈련 포인트 · **그 대학 수업 일정 · 예약 현황** |
| ~~`/mmi`~~ | 삭제 → 301 `/interview/mmi` | |
| ~~`/mmi/[slug]`~~ | 삭제 → 301 `/univ/[slug]` | |

`/mmi/[slug]` 를 `/univ/[slug]` 로 접는 근거: `lib/univ.ts` 가 이미 세 SSOT(`ipkyul` · `mmi-schedule` · `univ-interview`)를 슬러그 하나로 합치고 있고, `/univ/[slug]` 에는 이미 INTERVIEW · CLASS 섹션이 있으며 그 자리에서 `/mmi/[slug]` 로 링크아웃하고 있습니다. 링크아웃 카드를 실제 일정·예약 블록으로 바꾸면 클릭 한 번이 사라지고 대학별 페이지가 한 벌로 통일됩니다.

---

## 4. 동선 — 정보에서 전환까지 2층

```
검색 "가톨릭대 의대 면접"   → /univ/catholic      → 면접 방식 → 일정·잔여 → 문의
검색 "의대 MMI 면접"        → /interview/mmi      → 실시 대학 표 → /univ/[slug] → 문의
검색 "의대 면접 학원"       → /interview          → 대학/유형 찾기 → 유형 or 대학 → 문의
```

각 층의 역할이 하나씩입니다.

- **1층(정보)** — `/interview/*` · `/univ/*`. 검색으로 들어오는 자리. 요강 실측만 싣고 판매 문구를 최소화합니다.
- **2층(전환)** — 일정·잔여·대기 예약. 1층 어디에서든 한 번의 클릭으로 닿습니다.
- **상품 상세** — `/interview` 한 곳. 가격·절차·포함사항을 알고 싶은 사람만 옵니다.

---

## 5. 페이지별 개편 내용

### 5.1 `/interview` — 관문 + 상품 상세

```
1. HERO
2. FIND    — 내 대학은 어떤 면접인가          ← 신설, 첫 섹션
3. TYPES   — 유형 3카드 (실시 대학 수 포함)
4. COMMON  — 모든 의대 면접에 공통인 것 6
5. PROCESS — 준비 순서
6. CLASS   — 수업 절차 · 포함사항 · 가격       ← 사이트 내 유일
7. INSTRUCTORS — 박은우 · 강정규               ← /mmi 에서 이동
8. NO INTERVIEW — 면접 없는 대학
9. MORE
```

**FIND 섹션이 이번 개편의 핵심입니다.** 권역별 대학 칩을 깔고, 누르면 그 대학의 `/univ/[slug]` 로 보냅니다. 각 칩에 유형 배지(MMI / 인·적성 / 제시문)를 붙이면 "내 대학이 무슨 유형인지"가 목록만 봐도 해결됩니다. 데이터는 `lib/interview-types.ts` 의 `ASSIGN` 과 `lib/univ.ts` 의 `UNIV_PAGES` 로 이미 전부 있습니다.

### 5.2 `/interview/mmi` — `/mmi` 흡수

| `/mmi` 의 섹션 | 이동처 |
|---|---|
| AT A GLANCE (요약표) | `/interview/mmi` FORMAT 위 |
| WHAT MATTERS (최저점 3축) | `/interview/mmi` PREPARATION 에 병합 |
| WHY 1:1 ONLINE + TRADE-OFF | `/interview/mmi` 새 섹션 — **MMI 페이지에만** |
| UNIVERSITIES + ALSO | 기존 `TypeUnivTable` 에 병합, 잔여 자리 칼럼 추가 |
| INSTRUCTORS | `/interview` 로 이동 |
| TUITION | `/interview` 로 이동, 여기엔 짧은 CTA |
| WAITLIST (1차 불합격 누수) | `/interview/mmi` 유지 — MMI 특강 고유 |
| 집계 캘린더 · 타임테이블 | `/interview/mmi` "2027 수업 가능 일정" 한 섹션 |

인·적성과 제시문 페이지에도 "왜 1:1인가"를 넣되 **각도를 다르게** 합니다(9/26 분석 기준).
- 인·적성 — 교재가 학생마다 다르다(자기 생기부). 단체수업에서는 성립 자체가 어렵다.
- 제시문 — 단체도 성립하지만, 대학별 조건 재현(숙지 10분·면접 5분 vs 10분)과 꼬리질문 밀도가 갈린다.

### 5.3 `/univ/[slug]` — `/mmi/[slug]` 흡수

현재 CLASS 섹션의 "특강 일정 보기" 링크아웃 카드를 다음으로 교체합니다(`hasClassPage` 인 15개교만).

```
ScheduleCalendar → Timetable → BookingBoard → LeakageNotice
+ 짧은 CTA (1:1 줌 2시간 30분 · 38만원 · 문의) + /interview 링크
```

`hasClassPage` 플래그의 의미가 "`/mmi/[slug]` 페이지가 있다" 에서 "이 대학의 일정·예약 블록을 렌더한다" 로 바뀌므로 `lib/univ.ts` 주석을 갱신합니다.

### 5.4 유형 3페이지 — CLASS 축소

`PriceCard` + `StepList(CLASS_FLOW)` 전체를 다음 한 줄짜리 CTA 밴드로 교체합니다.

```
1:1 줌 · 1회 2시간 30분 · 38만원   [수업 자세히 보기 → /interview]   [문의하기 → #contact]
```

`CLASS_INCLUDES` · `CLASS_FLOW` · `CLASS_PRICE` 는 `lib/interview-types.ts` 에 그대로 두고 `/interview` 에서만 소비합니다.

### 5.5 네비게이션

```
현재                                   변경 후
─────────────────────────────────      ─────────────────────────────────
대학별 안내 /univ                      대학별 안내 /univ
  ├ 대학별 MMI 특강 /mmi      ← 중복      └ 의예과 입결 /ipkyul/uiye
  └ 의예과 입결
면접 수업 /interview                   면접 /interview
  ├ 추석 연휴 면접반                     ├ MMI 면접
  ├ MMI 면접                             ├ 인·적성 면접
  ├ 인·적성 면접                         ├ 제시문 면접
  ├ 제시문 면접                          └ 추석 연휴 면접반
  └ 대학별 MMI 특강 /mmi      ← 중복
```

라벨을 "면접 수업" → **"면접"** 으로 바꿉니다. 상품명이 아니라 주제명이어야 정보 검색 유입이 붙고, 하위에 정보성 페이지가 걸리는 것도 자연스러워집니다. 시즌 항목(추석)은 맨 아래로 내립니다.

---

## 6. 리다이렉트

`firebase.json` 에 두 줄을 추가합니다. `/promo` → `/` 이관 때와 같은 형태입니다.

```json
{ "source": "/mmi", "destination": "/interview/mmi", "type": 301 },
{ "source": "/mmi/:slug", "destination": "/univ/:slug", "type": 301 }
```

응답 우선순위가 `리다이렉트 → 정적 파일 → rewrite` 이므로 리다이렉트가 항상 이깁니다. 다만 혼동을 막기 위해 `app/mmi/` 디렉터리 자체를 삭제합니다.

---

## 7. 작업 순서

1. `/interview/mmi` 에 `/mmi` 본문 흡수 — `lib/interview-types.ts` 확장 + `_type-page.tsx`
2. `/univ/[slug]` 에 일정·예약 블록 이식
3. `/interview` 재구성 — FIND 섹션 신설, CLASS 를 유일 상세로, INSTRUCTORS 이관
4. 유형 3페이지의 `PriceCard`·`StepList` → 짧은 CTA 밴드로 축소
5. `app/mmi/` 삭제
6. `firebase.json` 301 두 줄
7. `NAV_ITEMS` 정리 (`app/_site/chrome.tsx`)
8. `Hub/brand/apps.json` pages 갱신 + `python brand/sync_brand.py medi`
   — `docs/sitemap-handoff.md` 의 미등록 89개 건과 함께 처리
9. `npx tsc --noEmit` · `pnpm build` · 내부 링크 점검(`/mmi` 하드코딩 잔재 검색)

1~2가 가장 크고, 3~7은 붙어 있는 작업입니다. 8은 독립적이라 나중에 따로 해도 됩니다.

---

## 8. 리스크와 확인할 것

| 항목 | 내용 |
|---|---|
| 검색 인덱스 | `/mmi` + `/mmi/[slug]` 16개 URL 이 sitemap 에 등록돼 있습니다. 301 을 유지하면서 sitemap 에서는 제거해야 합니다. |
| 내부 링크 잔재 | `/mmi` 를 가리키는 하드코딩이 `app/_site/chrome.tsx` · `app/_site/medi-header.tsx`(허브 그룹 메뉴) · `app/univ/[slug]/page.tsx` · `app/interview/_type-page.tsx` 에 있습니다. 전수 검색 필요. |
| 페이지 길이 | `/interview/mmi` 가 통합 후 상당히 길어집니다. 목차(앵커 내비)를 넣을지 판단이 필요합니다. |
| `/interview/chuseok` | 시즌 종료 후 처리 방침이 아직 없습니다 — 삭제할지, 상시 페이지로 바꿀지. |
| 외부 공유 링크 | 카톡 상담 등에서 `/mmi/{대학}` 링크를 이미 뿌렸다면 301 로 살아 있지만, 도착지가 `/univ/{대학}` 로 바뀌어 화면이 달라 보입니다. |

---

## 9. 개편 후 기대 상태

- 수업 상품 설명 **5곳 → 1곳**
- MMI 주제 URL **2개 → 1개** (카니발라이제이션 해소)
- 대학 목록 **3벌 → 2벌** (유형별 표 + 권역 색인, 대학 상세는 `/univ/[slug]` 하나)
- 면접 관련 라우트 **6 → 5**, 대학 상세 라우트 **2벌 → 1벌**
- 네비 중복 항목 **2개 → 0**
- 방문자가 대학 이름만 알아도 자기 유형과 일정에 도달
