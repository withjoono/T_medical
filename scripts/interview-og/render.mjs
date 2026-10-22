import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { cropPngTop } from "./crop.mjs";

/** 대학별 면접 카드 이미지(1200x630) 생성기.
 *
 *  네이버가 이미지 중심으로 노출하기 때문에, 대학 페이지마다 요약 카드를 둔다.
 *  카드는 flex 가 아니라 절대배치로 짠다 — 고정 캔버스에서 flex-shrink 가
 *  걸리면 아래쪽 요소(푸터)가 소리 없이 찌그러져 사라진다. 실제로 그랬다. */

const CHROME =
  process.env.CHROME ??
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const cards = JSON.parse(fs.readFileSync(path.join(REPO, ".cache", "og-cards.json"), "utf8"));
const OUT = path.join(REPO, "public", "og", "interview");
const HTML = path.join(REPO, ".cache", "og-html");
fs.rmSync(OUT, { recursive: true, force: true });
fs.rmSync(HTML, { recursive: true, force: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const koDate = (iso) => {
  const [, m, d] = iso.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
};

const TONE = {
  jesimun: { bg: "#eef6f4", bd: "#a8d5cc", fg: "#0a5649" },
  injeokseong: { bg: "#f7f2e6", bd: "#e8dcc0", fg: "#927741" },
  none: { bg: "#f5f3ee", bd: "#e3ded3", fg: "#75786c" },
};

function cardHtml(c) {
  const t = TONE[c.style];
  const ds = c.dates ?? [];
  const dateLabel =
    c.style === "none"
      ? "미실시"
      : ds.length === 0
        ? "미공지"
        : ds.length === 1
          ? koDate(ds[0])
          : ds.length === 2
            ? // 같은 달이면 뒤쪽 '○월' 을 떼어 한 줄에 들어가게 한다
              ds[0].slice(0, 7) === ds[1].slice(0, 7)
              ? `${koDate(ds[0])} · ${Number(ds[1].slice(8))}일`
              : `${koDate(ds[0])} · ${koDate(ds[1])}`
            : `${koDate(ds[0])} 외 ${ds.length - 1}일`;

  const facts = [
    [c.style === "none" ? "면접" : "면접일", dateLabel, true],
    ["면접 전형", c.style === "none" ? "없음" : `${c.tracks}개`, false],
    ["질문 출처", c.source ?? "—", false],
    ["평가 배점", c.scoring ?? "—", false],
  ];

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;
       font-family:"Noto Sans CJK KR","Noto Sans CJK JP",sans-serif;background:#f8f6f0}
  .stage{position:relative;width:1200px;height:630px;background:#f8f6f0}
  .bar{position:absolute;left:0;top:0;width:10px;height:630px;background:#a8894c}
  .hdr{position:absolute;left:74px;top:52px;right:64px}
  .eyebrow{font-size:18px;font-weight:700;letter-spacing:.15em;color:#927741}
  h1{font-family:"Noto Serif CJK KR","Noto Serif CJK JP",serif;font-weight:700;
     font-size:68px;line-height:1.12;color:#272a27;margin-top:16px;letter-spacing:-.02em;
     white-space:nowrap;overflow:hidden}
  .head{font-size:25px;font-weight:300;line-height:1.5;color:#5c6056;margin-top:18px;
        max-width:1000px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .chip{display:inline-block;margin-top:20px;padding:8px 16px;font-size:20px;font-weight:700;
        background:${t.bg};border:2px solid ${t.bd};color:${t.fg}}
  .grid{position:absolute;left:74px;right:64px;bottom:98px;
        display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#e3ded3;border:1px solid #e3ded3}
  .cell{background:#fdfcfa;padding:17px 20px;height:120px;overflow:hidden}
  .k{font-size:16px;color:#75786c;letter-spacing:.02em}
  .v{font-size:22px;font-weight:700;color:#272a27;margin-top:9px;line-height:1.32;
     display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .v.big{font-size:26px;color:#0a5649}
  .foot{position:absolute;left:74px;right:64px;bottom:44px;height:32px}
  .brand{font-family:"Noto Serif CJK KR","Noto Serif CJK JP",serif;font-size:23px;font-weight:700;color:#272a27}
  .url{float:right;font-size:18px;font-weight:300;color:#75786c;line-height:1.5}
  </style></head><body><div class="stage">
    <div class="bar"></div>
    <div class="hdr">
      <div class="eyebrow">2027학년도 ${esc(c.fieldShort)} 면접 · 요강 기준</div>
      <h1>${esc(c.short)} ${esc(c.unitLabel)}</h1>
      <div class="head">${esc(c.headline)}</div>
      <span class="chip">${esc(c.styleLabel)}</span>
    </div>
    <div class="grid">${facts
      .map(
        ([k, v, big]) =>
          `<div class="cell"><div class="k">${esc(k)}</div><div class="v${big ? " big" : ""}">${esc(v)}</div></div>`,
      )
      .join("")}</div>
    <div class="foot"><span class="url">tmedi.kr${esc(c.base)}/${esc(c.slug)}</span><span class="brand">T메디 · 의치한약수 입시</span></div>
  </div></body></html>`;
}

let n = 0;
for (const c of cards) {
  const dir = path.join(HTML, c.field);
  const odir = path.join(OUT, c.field);
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(odir, { recursive: true });
  const hp = path.join(dir, `${c.slug}.html`);
  fs.writeFileSync(hp, cardHtml(c));
  execFileSync(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    // 뷰포트가 카드 높이보다 작으면 아래쪽이 '칠해지지 않은 배경' 으로 남는다.
    // 넉넉한 높이로 찍고 뒤에서 630 으로 잘라낸다.
    "--force-device-scale-factor=1", "--window-size=1200,900",
    `--screenshot=${path.join(odir, `${c.slug}.png`)}`, `file://${hp}`,
  ], { stdio: "ignore" });
  // 창을 카드보다 크게 잡아 전부 칠한 뒤 카드 높이로 잘라낸다. (crop.mjs 주석 참고)
  cropPngTop(path.join(odir, `${c.slug}.png`), 630);
  n++;
}
console.log(`rendered ${n} cards (1200x630) → ${OUT}`);
