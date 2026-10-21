#!/usr/bin/env node
// IndexNow 로 네이버·Bing 에 "이 URL 이 바뀌었다"고 알린다 (2026-10-21 추가).
//
//   node scripts/indexnow.mjs                      # 라이브 sitemap.xml 의 URL 전부
//   node scripts/indexnow.mjs /univ/snu /univ/cau  # 지정한 경로만
//
// ⚠️ 배포가 끝난 뒤에 돌린다 — 키 파일(https://tmedi.kr/<KEY>.txt)이 라이브에 있어야 검증된다.
// ⚠️ CI 에 넣지 않았다. 바뀌지 않은 URL 을 배포마다 반복 제출하면 스팸으로 볼 수 있어,
//    페이지를 실제로 고쳤을 때 그 경로만 넘기는 게 원칙이다.
// 키를 바꾸면 public/<새 키>.txt 도 같이 만들고 옛 파일은 지운다.

const HOST = "tmedi.kr";
const KEY = "99dce77559695b4cd3c7d9d0652827e5";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINTS = [
  "https://searchadvisor.naver.com/indexnow", // 네이버
  "https://api.indexnow.org/indexnow", // Bing·Yandex 등 공용
];

async function sitemapUrls() {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? "" : "/"}${p}`))
  : await sitemapUrls();

if (urlList.length === 0) {
  console.error("제출할 URL 이 없습니다.");
  process.exit(1);
}

const keyRes = await fetch(KEY_LOCATION);
const keyText = keyRes.ok ? (await keyRes.text()).trim() : "";
if (keyText !== KEY) {
  console.error(`키 파일 확인 실패: ${KEY_LOCATION} (HTTP ${keyRes.status}). 배포 후 다시 실행하세요.`);
  process.exit(1);
}

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
let failed = 0;
for (const ep of ENDPOINTS) {
  try {
    const res = await fetch(ep, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    // 200·202 = 접수. 4xx 면 본문에 이유가 온다.
    const text = res.ok ? "" : ` ${(await res.text()).slice(0, 200)}`;
    console.log(`${ep} → HTTP ${res.status}${text}`);
    if (!res.ok) failed++;
  } catch (e) {
    console.log(`${ep} → 실패 ${e.message}`);
    failed++;
  }
}
console.log(`URL ${urlList.length}개 제출`);
process.exit(failed === ENDPOINTS.length ? 1 : 0);
