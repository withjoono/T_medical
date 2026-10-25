/** =========================================================================
 *  전형안내 카드 이미지 생성기 — public/og/ipkyul/<계열키>/<slug>.png (1200×630)
 *
 *  왜 면접 카드(og/interview, og/univ)와 따로 만드나 — 같은 대학이라도 두 페이지가
 *  답하는 질문이 다르다. 면접 카드는 면접일·평가축, 이 카드는 모집인원·전형 수·
 *  전형 구성·공시 입결이다. 숫자가 겹치지 않으므로 네이버 이미지 검색에서
 *  중복으로 접히지 않고, 노출 면적이 두 배가 된다.
 *
 *  ⚠️ 카드에만 있는 값은 만들지 않는다. 네 칸 모두 해당 전형 페이지 본문
 *     (UnivStatRow · ProgramTables)에 그대로 찍히는 값이다.
 *     수능최저 '적용 n개' 같은 파생 수치는 일부러 넣지 않았다 — minimum 이
 *     undefined 인 행을 미적용으로 셀 수 없고, 그러면 카드가 요강보다 앞서 간다.
 *
 *  돌리는 법 (render.mjs 와 같은 함정 두 개를 공유한다 — README 참고)
 *    node scripts/interview-og/ipkyul-cards.mjs
 *    CHROME=/path/to/chrome 로 실행 파일 지정 가능.
 *  ========================================================================= */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { cropPngTop } from "./crop.mjs";
import { IPKYUL } from "./ipkyul-manifest.mjs";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const CHROME = process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.join(REPO, "public", "og", "ipkyul");
const HTML = path.join(REPO, ".cache", "ipkyul-html");

/** 입결 계열키 → 전형 페이지 경로. 의예과만 /univ/<대학>, 나머지는 /univ/<계열>/<대학>. */
const ROUTE = {
  uiye: (slug) => `tmedi.kr/univ/${slug}`,
  chiuiye: (slug) => `tmedi.kr/univ/chidae/${slug}`,
  hanuiye: (slug) => `tmedi.kr/univ/hanuidae/${slug}`,
  yakhak: (slug) => `tmedi.kr/univ/yakdae/${slug}`,
  suuiye: (slug) => `tmedi.kr/univ/suuidae/${slug}`,
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function card(field, u) {
  const groups = IPKYUL.byType(u.units);
  const composition =
    groups.length > 0 ? groups.map((g) => `${g.type} ${g.units.length}`).join(" · ") : "—";
  const facts = [
    ["수시 모집", u.quota > 0 ? `${u.quota}명` : "요강 확인 필요", true],
    ["전형 수", `${u.units.length}개`, false],
    ["전형 구성", composition, false],
    ["공시 입결", u.measured > 0 ? `실측 ${u.measured}건` : "공시 없음", false],
  ];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:"Noto Sans CJK KR","Noto Sans CJK JP",sans-serif;background:#f8f6f0}
  .stage{position:relative;width:1200px;height:630px;background:#f8f6f0}
  .bar{position:absolute;left:0;top:0;width:10px;height:630px;background:#0a5649}
  .hdr{position:absolute;left:74px;top:52px;right:64px}
  .eyebrow{font-size:18px;font-weight:700;letter-spacing:.15em;color:#0a5649}
  h1{font-family:"Noto Serif CJK KR","Noto Serif CJK JP",serif;font-weight:700;font-size:66px;
     line-height:1.12;color:#272a27;margin-top:16px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden}
  .head{font-size:25px;font-weight:300;line-height:1.5;color:#5c6056;margin-top:18px;max-width:1000px;
        display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .chip{display:inline-block;margin-top:20px;padding:8px 16px;font-size:20px;font-weight:700;
        background:#eef6f4;border:2px solid #a8d5cc;color:#0a5649}
  .grid{position:absolute;left:74px;right:64px;bottom:98px;display:grid;grid-template-columns:repeat(4,1fr);
        gap:1px;background:#e3ded3;border:1px solid #e3ded3}
  .cell{background:#fdfcfa;padding:17px 20px;height:120px;overflow:hidden}
  .k{font-size:16px;color:#75786c}
  .v{font-size:22px;font-weight:700;color:#272a27;margin-top:9px;line-height:1.32;
     display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .v.big{font-size:30px;color:#0a5649}
  .foot{position:absolute;left:74px;right:64px;bottom:44px;height:32px}
  .brand{font-family:"Noto Serif CJK KR",serif;font-size:23px;font-weight:700;color:#272a27}
  .url{float:right;font-size:18px;font-weight:300;line-height:1.5;color:#75786c}
  </style></head><body><div class="stage"><div class="bar"></div>
  <div class="hdr"><div class="eyebrow">2027학년도 수시 전형 · 요강 기준</div>
  <h1>${esc(u.name)} ${esc(field.label)}</h1>
  <div class="head">전형별 모집인원 · 수능최저 · 선발모형과 공시 입결을 한 표에서 비교합니다.</div>
  <span class="chip">${esc(field.college)}${u.region ? ` · ${esc(u.region)}` : ""}</span></div>
  <div class="grid">${facts
    .map(([k, v, b]) => `<div class="cell"><div class="k">${esc(k)}</div><div class="v${b ? " big" : ""}">${esc(v)}</div></div>`)
    .join("")}</div>
  <div class="foot"><span class="url">${esc(ROUTE[field.key](u.slug))}</span><span class="brand">T메디 · 의치한약수 입시</span></div>
  </div></body></html>`;
}

fs.rmSync(HTML, { recursive: true, force: true });
fs.mkdirSync(HTML, { recursive: true });

let n = 0;
for (const field of IPKYUL.FIELDS) {
  const outDir = path.join(OUT, field.key);
  fs.mkdirSync(outDir, { recursive: true });
  for (const u of field.univs) {
    const hp = path.join(HTML, `${field.key}-${u.slug}.html`);
    fs.writeFileSync(hp, card(field, u));
    const out = path.join(outDir, `${u.slug}.png`);
    // 함정 1: 뷰포트가 카드보다 작으면 아래쪽이 안 칠해진다 → 900 으로 찍고 630 으로 자른다
    execFileSync(
      CHROME,
      ["--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",
       "--force-device-scale-factor=1","--window-size=1200,900",`--screenshot=${out}`,`file://${hp}`],
      { stdio: "ignore" },
    );
    cropPngTop(out, 630);
    n++;
  }
}
console.log("rendered", n);
