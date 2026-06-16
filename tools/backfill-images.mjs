#!/usr/bin/env node
// GitHub Actions（フルネットワーク環境）で実行する画像バックフィル。
// ai_news_data.js の中で image が loremflickr のキーワード画像になっているエントリを対象に、
// 記事固有の og:image（取れれば）→ Pexels（PEXELS_API_KEY があれば）の順で「より実体に近い画像」に差し替える。
// どちらも取れなければ loremflickr のまま残す（必ず何かしら表示される状態を維持）。
//
// クラウドの定期ルーティンはネットワーク制限で記事画像を取れないため image=loremflickr を入れる。
// このスクリプトはネットワークの使える GitHub Actions 上で後追い実行し、可能な範囲で実画像へ昇格させる。
//
// 使い方: node tools/backfill-images.mjs
//   - 環境変数 PEXELS_API_KEY があれば og:image が無い記事に Pexels 画像を使う（任意）
//   - ファイル整形は壊さず、対象の image: 行だけを置換する

import { readFileSync, writeFileSync } from "node:fs";
import { resolveOne } from "./fetch-image.mjs";

const FILE = process.argv[2] || "ai_news_data.js";

const original = readFileSync(FILE, "utf8");
const lines = original.split("\n");

// loremflickr 画像エントリを収集（直近の url: 行とペアにする）
let lastUrl = null;
const targets = [];
for (let i = 0; i < lines.length; i++) {
  const u = lines[i].match(/^\s*url:\s*"([^"]+)"/);
  if (u) lastUrl = u[1];
  const img = lines[i].match(/^(\s*image:\s*)"(https:\/\/loremflickr\.com\/[^"]+)"(,?)\s*$/);
  if (img && lastUrl) {
    const kw = img[2].match(/loremflickr\.com\/\d+\/\d+\/([^/?]+)/);
    const keywords = kw ? decodeURIComponent(kw[1]).replace(/,/g, " ") : "";
    targets.push({ lineIdx: i, prefix: img[1], trailing: img[3], url: lastUrl, keywords });
  }
}

process.stderr.write(`backfill: ${targets.length} 件の loremflickr 画像を対象に実画像を試行\n`);

let replaced = 0;
// 直列処理（GitHub Actions では十分。サイトへの負荷も抑える）
for (const t of targets) {
  let r;
  try {
    r = await resolveOne({ url: t.url, keywords: t.keywords });
  } catch {
    r = null;
  }
  // og:image または Pexels が取れたら差し替え（取れなければ loremflickr 維持）
  if (r && r.image && (r.source === "ogp" || r.source === "pexels")) {
    lines[t.lineIdx] = `${t.prefix}"${r.image}"${t.trailing}`;
    replaced++;
    process.stderr.write(`  ${t.source || r.source}: ${t.url}\n`);
  }
}

const updated = lines.join("\n");
if (replaced > 0 && updated !== original) {
  writeFileSync(FILE, updated);
  process.stderr.write(`backfill: ${replaced} 件を実画像に差し替え\n`);
} else {
  process.stderr.write("backfill: 差し替え対象なし（変更なし）\n");
}
