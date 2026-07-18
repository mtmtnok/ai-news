#!/usr/bin/env node
// GitHub Actions（フルネットワーク環境）で実行する画像バックフィル。
// ai_news_data.js の中で画像が未取得のエントリ（image: null もしくは loremflickr の
// キーワード画像）を対象に、記事固有の og:image（取れれば）→ Pexels（PEXELS_API_KEY が
// あれば）の順で「より実体に近い画像」に差し替える。
// どちらも取れなければ元の値（null / loremflickr）のまま残す。
//
// クラウドの定期ルーティンはネットワーク制限で記事画像を取れないため image=null で追記する。
// このスクリプトはネットワークの使える GitHub Actions 上で後追い実行し、実画像へ昇格させる。
//
// 使い方: node tools/backfill-images.mjs
//   - 環境変数 PEXELS_API_KEY があれば og:image が無い記事に Pexels 画像を使う（任意）
//   - ファイル整形は壊さず、対象の image: 行だけを置換する

import { readFileSync, writeFileSync } from "node:fs";
import { resolveOne } from "./fetch-image.mjs";

const FILE = process.argv[2] || "ai_news_data.js";

// image: null のエントリは検索キーワードを持たないため、カテゴリから Pexels 用の
// 英語キーワードを補う（og:image が取れなかった場合のフォールバック）。
const CATEGORY_KEYWORDS = {
  "新モデル": "artificial intelligence model",
  "その他": "artificial intelligence technology",
  "規制": "law regulation government",
  "資金調達": "business finance investment",
  "ツール": "software application technology",
  "研究": "science research laboratory",
  "半導体": "semiconductor chip",
};

const original = readFileSync(FILE, "utf8");
const lines = original.split("\n");

// 画像未取得エントリを収集（直近の url: / category: 行とペアにする）
let lastUrl = null;
let lastCategory = null;
const targets = [];
for (let i = 0; i < lines.length; i++) {
  const c = lines[i].match(/^\s*category:\s*"([^"]+)"/);
  if (c) lastCategory = c[1];
  const u = lines[i].match(/^\s*url:\s*"([^"]+)"/);
  if (u) lastUrl = u[1];

  // 1) loremflickr のキーワード画像（URL 内にキーワードが埋まっている）
  const imgL = lines[i].match(/^(\s*image:\s*)"(https:\/\/loremflickr\.com\/[^"]+)"(,?)\s*$/);
  if (imgL && lastUrl) {
    const kw = imgL[2].match(/loremflickr\.com\/\d+\/\d+\/([^/?]+)/);
    const keywords = kw ? decodeURIComponent(kw[1]).replace(/,/g, " ") : "";
    targets.push({ lineIdx: i, prefix: imgL[1], trailing: imgL[3], url: lastUrl, keywords });
    continue;
  }

  // 2) image: null（クラウドの定期ルーティンが入れた未取得状態）
  const imgN = lines[i].match(/^(\s*image:\s*)null(,?)\s*$/);
  if (imgN && lastUrl) {
    const keywords = CATEGORY_KEYWORDS[lastCategory] || "artificial intelligence technology";
    targets.push({ lineIdx: i, prefix: imgN[1], trailing: imgN[2], url: lastUrl, keywords });
  }
}

process.stderr.write(`backfill: ${targets.length} 件の未取得画像を対象に実画像を試行\n`);

// 並列度を制限して処理する。対象が多い（履歴の image:null を含む）ため直列だと
// 取得失敗（リトライ×タイムアウト）が積み重なって長時間化するのを防ぐ。
const CONCURRENCY = 6;

let replaced = 0;
let cursor = 0;
async function worker() {
  while (cursor < targets.length) {
    const t = targets[cursor++];
    let r;
    try {
      r = await resolveOne({ url: t.url, keywords: t.keywords });
    } catch {
      r = null;
    }
    // og:image または Pexels が取れたら差し替え（取れなければ元の値を維持）
    if (r && r.image && (r.source === "ogp" || r.source === "pexels")) {
      lines[t.lineIdx] = `${t.prefix}"${r.image}"${t.trailing}`;
      replaced++;
      process.stderr.write(`  ${r.source}: ${t.url}\n`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));

const updated = lines.join("\n");
if (replaced > 0 && updated !== original) {
  writeFileSync(FILE, updated);
  process.stderr.write(`backfill: ${replaced} 件を実画像に差し替え\n`);
} else {
  process.stderr.write("backfill: 差し替え対象なし（変更なし）\n");
}
