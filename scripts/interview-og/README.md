# 대학별 면접 카드 이미지 생성기

`public/og/interview/<계열>/<slug>.png` 50장을 만든다. 1200×630.

## 왜 있나

네이버는 검색 결과를 이미지 중심으로 보여 준다. 대학 페이지마다 요약 카드를
두고 **본문에 실제로 띄운다**(OG 태그로만 두면 이미지 검색에 잡히지 않는다).
카드 내용은 `lib/*-interview.ts` 의 요강 실측값에서 그대로 나온다 — 카드에만
있는 값은 없다.

## 다시 만들어야 할 때

요강 데이터(`lib/{chidae,hanuidae,yakdae,suuidae}-interview.ts`)의
`short` · `unitLabel` · `headline` · `styleLabel` · `source` · `scoring` ·
면접일이 바뀌면 다시 돌린다. 안 돌리면 페이지 본문과 카드가 어긋난다.

```bash
node scripts/interview-og/manifest.mjs           # lib → .cache/og-cards.json
CHROME=/path/to/chrome node scripts/interview-og/render.mjs
```

- `manifest.mjs` 는 레포에 이미 있는 `typescript` 로 lib 를 트랜스파일해 읽는다.
  새 의존성을 넣지 않기 위한 방식이다.
- `render.mjs` 는 헤드리스 Chrome 의 `--screenshot` 만 쓴다. Playwright 같은
  추가 패키지가 필요 없다. `CHROME` 환경변수로 실행 파일을 지정한다
  (Windows 예: `set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe`).

## 함정 두 개 (고치느라 시간 쓴 것들)

1. **뷰포트가 카드보다 작으면 아래쪽이 안 칠해진다.** `--window-size` 높이를
   카드보다 크게(900) 주고 630 으로 잘라낸다. 630 으로 찍으면 푸터가 통째로
   사라진 PNG 가 나온다. 에러도 안 난다.
2. **고정 높이 캔버스에서 flex 를 쓰지 않는다.** 내용이 넘치면 flex-shrink 가
   아래 요소부터 눌러 버린다(푸터가 3px 로 찌그러졌다). 절대배치로 짠다.
