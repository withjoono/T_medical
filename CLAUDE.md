# CLAUDE.md — T_Medi (T메디, https://tmedi.kr)

Claude Code 는 이 파일을 자동으로 읽는다. 아래 두 파일을 함께 불러온다.

@AGENTS.md
@docs/context/README.md

- **`AGENTS.md` = 규칙.** 생태계 공통 규칙 5개와 T메디 고유 규칙. 읽지 않고 작업 금지.
- **`docs/context/README.md` = 결정·배경 색인.** 가격·정책·데이터 원칙·사고 교훈·범위 경계. 필요한 파일만 연다.
- 둘이 충돌하면 규칙(AGENTS.md)이, 문서와 코드가 충돌하면 **코드(SSOT 파일)** 가 맞다. 색인의 "낡은 내용" 절을 먼저 본다.

## 작업 방식

- 답변·보고·커밋 메시지 본문은 **한국어**.
- 숫자(가격·시간·날짜·정원)는 페이지에 하드코딩하지 않고 SSOT 파일만 고친다 — `lib/mmi-schedule.ts`(가격·수업 시간), `lib/teachers.ts`(강사), `lib/*-interview.ts`·`lib/ipkyul/*`(입시 데이터).
- 입시 데이터는 **실측만**. 추정으로 빈칸을 채우지 않는다(`docs/context/data-rules.md`).
- 새로 확정된 결정·사고 교훈은 `docs/context/` 해당 파일에 적고, 새 파일이면 `docs/context/README.md` 색인에 추가한다.

## 🚀 커밋·푸시 — 작업이 끝나면 `main` 에 바로

기본 브랜치는 **`main`** 이다(`master` 없음). `.github/workflows/deploy.yml` 이 `main` push 를 받아 **프로덕션(tmedi.kr)까지 자동 배포**한다.

1. 작업이 끝나면 **`main` 에 바로 커밋하고 푸시**한다. 별도 브랜치·PR 을 만들지 않는다.
2. 코드를 바꿨다면 푸시 전에 `pnpm exec tsc --noEmit` 를 통과시키고, 가능하면 `pnpm build` 까지 본다
   (`next.config.mjs` 가 타입 에러를 무시하므로 CI 의 tsc 게이트에서 막히면 배포도 막힌다).
3. **바꾼 파일만 지정해서 `git add`** 한다. 루트에 검증 증거 파일(`tmedi-*.png/json/csv/dom.txt`, `.verification-evidence/`, `.firebase/` 캐시)이 많다 — `git add -A`·`git add .` 금지.
4. 문서만 바꾼 커밋(`**/*.md`, `docs/**`)은 배포를 돌리지 않는다. 코드가 섞이면 배포된다.
5. 푸시 후 GitHub Actions 결과를 확인한다. `NODE_AUTH_TOKEN`·`FIREBASE_TOKEN` Secret 이 없으면 배포 단계가 실패한다 —
   실패하면 사용자에게 알리고, 수동 배포는 `firebase deploy --only hosting:medical-front --project ts-front-479305` (target 필수, `--only hosting` 단독 금지).
6. 클라우드 세션(웹·핸드폰)에서 `main` 푸시가 거부되면 작업 브랜치로 푸시하고 그 사실을 알린다.

## 클라우드 세션(웹·핸드폰)에서의 한계

- `E:\Dev\_work\...` 원천 CSV·요강, 형제 리포(Hub·Music_College·Interview·Susi)는 클론에 없다.
  → 데이터 재추출·사이트맵 재생성(Hub)·`public/ai-interview/` 갱신은 PC 에서 한다.
- `@tskool/satellite-header` 는 GitHub Packages(`@withjoono/satellite-header`) 비공개 패키지라
  `NODE_AUTH_TOKEN`(read:packages) 환경변수가 없으면 `pnpm install` 이 깨진다.

## 넣지 말 것

비밀번호·API 키·토큰·Secret 값·학생 개인정보(생기부·연락처·상담 내용)는 리포에도 문서에도 넣지 않는다. `.env*` 는 gitignore 대상이다.
