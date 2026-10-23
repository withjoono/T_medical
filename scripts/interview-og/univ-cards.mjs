import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { cropPngTop } from "./crop.mjs";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const CHROME =
  process.env.CHROME ??
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const TMP = path.join(REPO, ".cache", "univ-lib");
const OUT = path.join(REPO, "public", "og", "univ");
const HTML = path.join(REPO, ".cache", "univ-html");
fs.rmSync(HTML, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const { UNIV_PAGES } = await import(pathToFileURL(path.join(TMP, "univ.mjs")).href);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const koDate = (iso) => { const [, m, d] = iso.split("-"); return `${Number(m)}월 ${Number(d)}일`; };
const TONE = {
  mmi:   { bg: "#eef6f4", bd: "#a8d5cc", fg: "#0a5649" },
  jesimun: { bg: "#eef6f4", bd: "#a8d5cc", fg: "#0a5649" },
  none:  { bg: "#f5f3ee", bd: "#e3ded3", fg: "#75786c" },
  _:     { bg: "#f7f2e6", bd: "#e8dcc0", fg: "#927741" },
};

function card(u) {
  const iv = u.interview;
  const none = u.hasInterview === false;
  const t = none ? TONE.none : (TONE[iv?.style] ?? TONE._);
  const tracks = iv?.tracks ?? [];
  const dates = [...new Set(tracks.map((x) => x.interview).filter(Boolean))].sort();
  const anns  = [...new Set(tracks.map((x) => x.announce).filter(Boolean))].sort();
  const dateLabel = none ? "미실시"
    : dates.length === 0 ? "미공지"
    : dates.length === 1 ? koDate(dates[0])
    : dates[0].slice(0,7) === dates[1].slice(0,7)
      ? `${koDate(dates[0])} · ${Number(dates[1].slice(8))}일${dates.length>2?` 외 ${dates.length-2}`:""}`
      : `${koDate(dates[0])} 외 ${dates.length-1}일`;
  const conf = { high: "요강 확인됨", medium: "일부 미확인", low: "입학처 확인 필요" }[u.confidence] ?? "—";
  const facts = [
    [none ? "면접" : "면접일", dateLabel, true],
    ["면접 전형", none ? "없음" : `${tracks.length}개`, false],
    ["1단계 발표", anns.length ? koDate(anns[0]) : (none ? "—" : "미공지"), false],
    ["요강 확인", conf, false],
  ];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:"Noto Sans CJK KR","Noto Sans CJK JP",sans-serif;background:#f8f6f0}
  .stage{position:relative;width:1200px;height:630px;background:#f8f6f0}
  .bar{position:absolute;left:0;top:0;width:10px;height:630px;background:#a8894c}
  .hdr{position:absolute;left:74px;top:52px;right:64px}
  .eyebrow{font-size:18px;font-weight:700;letter-spacing:.15em;color:#927741}
  h1{font-family:"Noto Serif CJK KR","Noto Serif CJK JP",serif;font-weight:700;font-size:68px;
     line-height:1.12;color:#272a27;margin-top:16px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden}
  .head{font-size:25px;font-weight:300;line-height:1.5;color:#5c6056;margin-top:18px;max-width:1000px;
        display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .chip{display:inline-block;margin-top:20px;padding:8px 16px;font-size:20px;font-weight:700;
        background:${t.bg};border:2px solid ${t.bd};color:${t.fg}}
  .grid{position:absolute;left:74px;right:64px;bottom:98px;display:grid;grid-template-columns:repeat(4,1fr);
        gap:1px;background:#e3ded3;border:1px solid #e3ded3}
  .cell{background:#fdfcfa;padding:17px 20px;height:120px;overflow:hidden}
  .k{font-size:16px;color:#75786c}
  .v{font-size:22px;font-weight:700;color:#272a27;margin-top:9px;line-height:1.32;
     display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .v.big{font-size:26px;color:#0a5649}
  .foot{position:absolute;left:74px;right:64px;bottom:44px;height:32px}
  .brand{font-family:"Noto Serif CJK KR",serif;font-size:23px;font-weight:700;color:#272a27}
  .url{float:right;font-size:18px;font-weight:300;line-height:1.5;color:#75786c}
  </style></head><body><div class="stage"><div class="bar"></div>
  <div class="hdr"><div class="eyebrow">2027학년도 의대 면접 · 요강 기준</div>
  <h1>${esc(u.short)} 의예과</h1>
  <div class="head">${esc(iv?.headline ?? "2027학년도 수시 전형과 면접 안내")}</div>
  <span class="chip">${esc(none ? "면접 미실시" : (iv?.styleLabel ?? "면접 실시"))}</span></div>
  <div class="grid">${facts.map(([k,v,b])=>`<div class="cell"><div class="k">${esc(k)}</div><div class="v${b?" big":""}">${esc(v)}</div></div>`).join("")}</div>
  <div class="foot"><span class="url">tmedi.kr/interview/uidae/${esc(u.slug)}</span><span class="brand">T메디 · 의치한약수 입시</span></div>
  </div></body></html>`;
}

let n = 0;
for (const u of UNIV_PAGES) {
  const hp = path.join(HTML, `${u.slug}.html`);
  fs.writeFileSync(hp, card(u));
  const out = path.join(OUT, `${u.slug}.png`);
  execFileSync(CHROME, ["--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",
    "--force-device-scale-factor=1","--window-size=1200,900",`--screenshot=${out}`,`file://${hp}`], { stdio: "ignore" });
  cropPngTop(out, 630);
  n++;
}
console.log("rendered", n);
