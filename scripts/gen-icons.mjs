// 의존성 없이 PWA 아이콘 PNG를 생성한다 (Node 내장 zlib 사용).
// 디자인: 인디고 배경 + 중앙에 흰색 "슬라이드" 사각형 + 재생 삼각형.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/icons');
mkdirSync(outDir, { recursive: true });

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BG = [79, 70, 229]; // indigo-600
const WHITE = [255, 255, 255];

function draw(size, { safe = 0.0 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const pad = Math.round(size * (0.18 + safe)); // 슬라이드 카드 여백
  const cardR = Math.round(size * 0.06);
  const triCx = size * 0.5;
  const triCy = size * 0.5;
  const triH = size * 0.22;
  const triW = size * 0.2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let col = BG;
      // 흰색 둥근 사각형(슬라이드)
      const inX = x >= pad && x <= size - pad;
      const inY = y >= pad && y <= size - pad;
      if (inX && inY) {
        // 둥근 모서리 처리
        const dx = Math.min(x - pad, size - pad - x);
        const dy = Math.min(y - pad, size - pad - y);
        const corner = dx < cardR && dy < cardR;
        const inside = !corner || (cardR - dx) ** 2 + (cardR - dy) ** 2 <= cardR ** 2;
        if (inside) col = WHITE;
      }
      // 중앙 재생 삼각형(인디고)
      if (
        x > triCx - triW * 0.35 &&
        x < triCx + triW * 0.65 &&
        Math.abs(y - triCy) < (triH / 2) * (1 - (x - (triCx - triW * 0.35)) / triW)
      ) {
        col = BG;
      }
      const i = (y * size + x) * 4;
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  }
  return encodePng(size, size, buf);
}

writeFileSync(resolve(outDir, 'icon-192.png'), draw(192));
writeFileSync(resolve(outDir, 'icon-512.png'), draw(512));
writeFileSync(resolve(outDir, 'icon-512-maskable.png'), draw(512, { safe: 0.08 }));
writeFileSync(resolve(outDir, 'apple-touch-icon.png'), draw(180));
console.log('icons generated in', outDir);
