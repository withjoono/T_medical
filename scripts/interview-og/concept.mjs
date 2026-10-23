import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { cropPngTop } from "./crop.mjs";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const CHROME =
  process.env.CHROME ??
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.join(REPO, "public", "og", "concept");
const HTML = path.join(REPO, ".cache", "concept-html");
fs.rmSync(HTML, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const base = (body, dark) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;
     font-family:"Noto Sans CJK KR","Noto Sans CJK JP",sans-serif;
     background:${dark ? "#272a27" : "#f8f6f0"}}
.stage{position:relative;width:1200px;height:630px;background:${dark ? "#272a27" : "#f8f6f0"}}
.bar{position:absolute;left:0;top:0;width:10px;height:630px;background:#a8894c}
.hdr{position:absolute;left:74px;top:54px;right:64px}
.eyebrow{font-size:18px;font-weight:700;letter-spacing:.15em;color:${dark ? "#dbc48a" : "#927741"}}
h1{font-family:"Noto Serif CJK KR","Noto Serif CJK JP",serif;font-weight:700;
   font-size:60px;line-height:1.15;color:${dark ? "#f8f6f0" : "#272a27"};margin-top:18px;letter-spacing:-.02em}
h1 em{font-style:normal;color:${dark ? "#dbc48a" : "#0a5649"}}
.sub{font-size:23px;font-weight:300;line-height:1.5;margin-top:18px;max-width:1010px;
     color:${dark ? "rgba(248,246,240,.72)" : "#5c6056"}}
.grid{position:absolute;left:74px;right:64px;bottom:98px;
      display:grid;grid-template-columns:repeat(3,1fr);gap:1px;
      background:${dark ? "rgba(248,246,240,.18)" : "#e3ded3"};
      border:1px solid ${dark ? "rgba(248,246,240,.18)" : "#e3ded3"}}
.cell{background:${dark ? "#272a27" : "#fdfcfa"};padding:20px 22px;height:148px;overflow:hidden}
.k{font-size:16px;color:${dark ? "rgba(248,246,240,.55)" : "#75786c"};letter-spacing:.02em}
.v{font-size:27px;font-weight:700;color:${dark ? "#f8f6f0" : "#272a27"};margin-top:8px;line-height:1.3}
.v.hi{color:${dark ? "#dbc48a" : "#0a5649"}}
.d{font-size:15px;font-weight:300;margin-top:9px;line-height:1.5;
   color:${dark ? "rgba(248,246,240,.6)" : "#5c6056"}}
.foot{position:absolute;left:74px;right:64px;bottom:44px;height:32px}
.brand{font-family:"Noto Serif CJK KR",serif;font-size:23px;font-weight:700;
       color:${dark ? "#f8f6f0" : "#272a27"}}
.url{float:right;font-size:18px;font-weight:300;line-height:1.5;
     color:${dark ? "rgba(248,246,240,.55)" : "#75786c"}}
</style></head><body><div class="stage"><div class="bar"></div>${body}
<div class="foot"><span class="url">tmedi.kr/interview</span><span class="brand">T메디 · 의치한약수 입시</span></div>
</div></body></html>`;

const cells = (items) =>
  `<div class="grid">${items
    .map(
      (c) =>
        `<div class="cell"><div class="k">${c.k}</div><div class="v${c.hi ? " hi" : ""}">${c.v}</div><div class="d">${c.d}</div></div>`,
    )
    .join("")}</div>`;

const CARDS = {
  concept: {
    dark: true,
    html:
      `<div class="hdr"><div class="eyebrow">의약학 면접 대비 · 2027</div>
       <h1>면접은 공부가 아니라 <em>훈련</em>입니다</h1>
       <div class="sub">아는 것을 늘려서 되는 일이 아닙니다. 그래서 반복과 판단을 갈라 놓았습니다.</div></div>` +
      cells([
        { k: "01", v: "반복은 AI 가", d: "무제한 모의면접으로 훈련의 임계량을 채웁니다", hi: true },
        { k: "02", v: "판단은 선생님이", d: "소재를 고르고 대학 평가축에 맞춰 설계합니다" },
        { k: "03", v: "그래서 2회로", d: "1회차 진단·설계, 2회차 실전 점검" },
      ]),
  },
  pricing: {
    dark: false,
    html:
      `<div class="hdr"><div class="eyebrow">의약학 면접 수업 비용 · 2027</div>
       <h1>선생님 1회 + AI 무제한 <em>38만원</em></h1>
       <div class="sub">반복을 선생님 시간으로 사지 않으면 회차가 줄고 비용이 내려갑니다.</div></div>` +
      cells([
        { k: "반복 훈련", v: "AI 모의면접", d: "말하기·태도 연습 무제한 · 현재 전부 무료" },
        { k: "판단과 설계", v: "35만원", d: "선생님 1:1 100분 · 줌 온라인 1회" },
        { k: "함께 쓰면", v: "38만원", d: "선생님 1회 + AI 시즌 무제한", hi: true },
      ]),
  },
  compare: {
    dark: true,
    html:
      `<div class="hdr"><div class="eyebrow">의약학 면접 수업 비교 · 2027</div>
       <h1>학생이 누구보다 <em>잘 판단합니다</em></h1>
       <div class="sub">1회씩 결제해서 직접 비교해 보십시오. 저희는 묶음도 선납도 없습니다.</div></div>` +
      cells([
        { k: "대형 학원 1:1", v: "240만원", d: "12시간 묶음 결제 · 2026년 언론 보도 기준" },
        { k: "T메디", v: "38만원", d: "선생님 100분 1회 + AI 모의면접 무제한", hi: true },
        { k: "비교하는 법", v: "1회만", d: "해 보고 아니면 그만두시면 됩니다" },
      ]),
  },
};

for (const [key, c] of Object.entries(CARDS)) {
  const hp = path.join(HTML, `${key}.html`);
  fs.writeFileSync(hp, base(c.html, c.dark));
  const out = path.join(OUT, `${key}.png`);
  execFileSync(CHROME, ["--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",
    "--force-device-scale-factor=1","--window-size=1200,900",`--screenshot=${out}`,`file://${hp}`],
    { stdio: "ignore" });
  cropPngTop(out, 630);
  console.log("rendered", key);
}
