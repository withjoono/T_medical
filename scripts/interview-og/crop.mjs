import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/** PNG 를 위에서부터 height 픽셀만 남기고 잘라낸다. 의존성 없이 동작한다.
 *
 *  왜 필요한가 — 헤드리스 Chrome 은 뷰포트보다 아래를 칠하지 않는데
 *  출력 PNG 의 크기는 --window-size 를 그대로 따른다. 그래서 카드보다 큰
 *  창으로 찍어 전부 칠한 뒤, 여기서 카드 높이로 잘라낸다. */

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const crc32 =
  zlib.crc32 ??
  (() => {
    const T = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      T[n] = c;
    }
    return (buf) => {
      let c = -1;
      for (let i = 0; i < buf.length; i++) c = T[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
      return (c ^ -1) >>> 0;
    };
  })();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

export function cropPngTop(file, keepHeight) {
  const buf = fs.readFileSync(file);
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error(`PNG 아님: ${file}`);

  let off = 8;
  let ihdr = null;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") ihdr = data;
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (!ihdr) throw new Error("IHDR 없음");

  const w = ihdr.readUInt32BE(0);
  const h = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const color = ihdr[9];
  if (depth !== 8 || (color !== 2 && color !== 6)) {
    throw new Error(`지원하지 않는 PNG 형식 (depth ${depth}, color ${color})`);
  }
  if (h <= keepHeight) return false;

  const bpp = color === 6 ? 4 : 3;
  const stride = w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));

  // 필터 해제 — 자를 지점까지만 풀면 된다
  const out = Buffer.alloc(keepHeight * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < keepHeight; y++) {
    const ft = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      const x = line[i];
      cur[i] =
        ft === 0 ? x
        : ft === 1 ? (x + a) & 0xff
        : ft === 2 ? (x + b) & 0xff
        : ft === 3 ? (x + ((a + b) >> 1)) & 0xff
        : (x + paeth(a, b, c)) & 0xff;
    }
    prev = cur;
  }

  // 필터 0 으로 다시 싼다
  const refil = Buffer.alloc(keepHeight * (stride + 1));
  for (let y = 0; y < keepHeight; y++) {
    refil[y * (stride + 1)] = 0;
    out.copy(refil, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const nh = Buffer.from(ihdr);
  nh.writeUInt32BE(keepHeight, 4);
  fs.writeFileSync(
    file,
    Buffer.concat([
      SIG,
      chunk("IHDR", nh),
      chunk("IDAT", zlib.deflateSync(refil, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
  const root = path.join(REPO, "public", "og", "interview");
  let n = 0;
  for (const d of fs.readdirSync(root)) {
    for (const f of fs.readdirSync(path.join(root, d))) {
      if (f.endsWith(".png") && cropPngTop(path.join(root, d, f), 630)) n++;
    }
  }
  console.log("cropped", n);
}
