#!/usr/bin/env node
// GitHub Actions（フルネットワーク環境）で実行する為替レート更新（B-021）。
// 記事のドル金額を円に換算するための USD/JPY 日次値を、Frankfurter API（欧州中央銀行の参考値）
// から取得して fx_usdjpy.js に書く。backfill-images.yml の1手順として、ニュース追記のたびに動く。
//
// - 毎回 START〜今日をまとめて取り直し、手元の値と合わせて書き直す（欠けた日があっても自然に埋まる）
// - 取得失敗・値が不自然なときは何も書かずに終了コード0で抜ける（同じワークフローの画像補完を止めない）
// - 値が変わらなければファイルに触らない（無駄なコミットを作らない）
//
// 使い方: node tools/update-fx.mjs [出力ファイル]

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = process.argv[2] || "fx_usdjpy.js";
const START = "2026-02-27";                 // 最古の記事（2026-03-15）より前の営業日
const today = new Date().toISOString().slice(0, 10);
const URL = `https://api.frankfurter.dev/v1/${START}..${today}?base=USD&symbols=JPY`;
const SANE = r => typeof r === "number" && r > 80 && r < 250;   // USD/JPY として明らかにおかしい値を弾く

function readExisting() {
  if (!existsSync(FILE)) return {};
  const out = {};
  for (const m of readFileSync(FILE, "utf8").matchAll(/"(\d{4}-\d{2}-\d{2})":\s*([\d.]+)/g)) out[m[1]] = +m[2];
  return out;
}

function render(rates) {
  const rows = Object.keys(rates).sort().map(d => `    "${d}": ${rates[d]}`).join(",\n");
  return `// =====================================================================
// USD/JPY 日次レート（記事のドル金額を円に換算する吹き出しで使う。B-021）
// 欧州中央銀行の参考値（Frankfurter API 経由）。土日・祝日の行は無い。
// 記事の日付以前で最も近い営業日の値を使う（usd-hover.js）。
// GitHub Actions（backfill-images.yml）が tools/update-fx.mjs で自動更新する。手で編集しない。
// =====================================================================
window.FX_USDJPY = {
  source: "欧州中央銀行の参考値（Frankfurter API）",
  rates: {
${rows}
  }
};
`;
}

async function main() {
  const existing = readExisting();
  let fetched;
  try {
    const res = await fetch(URL, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    fetched = Object.fromEntries(Object.entries(json.rates || {}).map(([d, v]) => [d, v.JPY]));
  } catch (e) {
    console.log(`為替の取得に失敗したため更新しない: ${e.message}`);
    return;
  }
  const bad = Object.entries(fetched).filter(([, r]) => !SANE(r));
  if (!Object.keys(fetched).length || bad.length) {
    console.log(`取得した値が不自然なため更新しない（${Object.keys(fetched).length}件中 不正${bad.length}件）`);
    return;
  }
  const merged = { ...existing, ...fetched };
  const changed = Object.keys(merged).filter(d => existing[d] !== merged[d]);
  if (!changed.length) {
    console.log(`変更なし（${Object.keys(merged).length}日分、最新 ${Object.keys(merged).sort().pop()}）`);
    return;
  }
  writeFileSync(FILE, render(merged));
  console.log(`更新: ${changed.length}日分を追加・修正（計${Object.keys(merged).length}日分、最新 ${Object.keys(merged).sort().pop()}）`);
}

main();
