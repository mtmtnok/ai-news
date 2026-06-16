#!/usr/bin/env node
// 記事URLからニュース用サムネイル画像URLを決定するクロスプラットフォーム・スクリプト。
// Windows(ローカル) でも Linux(クラウドの定期ルーティン) でも同じく動くよう、
// Node.js 標準の fetch のみで実装（依存パッケージなし）。
//
// 取得ロジック（上から順に試し、最初に成功したものを採用）:
//   1. 記事ページの og:image / twitter:image（＝記事固有の画像）  -> source: "ogp"
//   2. Pexels API でニュース内容に沿った写真を検索（要 PEXELS_API_KEY） -> source: "pexels"
//   3. どちらも不可                                                  -> image: null, source: null
//
// 入力: JSON 配列 [{ "url": "...", "keywords": "english search words" }, ...]
//   - 標準入力から渡すか、第1引数にファイルパスを渡す
// 出力: JSON 配列 [{ "url", "image", "source" }, ...]（入力と同じ順序）
//
// Pexels APIキー: 環境変数 PEXELS_API_KEY から読む。未設定ならステップ2をスキップ。
//
// 使い方:
//   echo '[{"url":"https://example.com","keywords":"AI robot"}]' | node tools/fetch-image.mjs
//   node tools/fetch-image.mjs input.json

import { readFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const PEXELS_KEY = process.env.PEXELS_API_KEY || "";
const TIMEOUT_MS = 20000;
const OGP_RETRIES = 2; // 一時的な失敗に備えて記事ページ取得をリトライ

function readInput() {
  const fileArg = process.argv[2];
  const raw = fileArg ? readFileSync(fileArg, "utf8") : readFileSync(0, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error("入力はJSON配列である必要があります");
  return data;
}

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept-Language": "ja,en;q=0.8", ...(opts.headers || {}) },
      ...opts,
    });
  } finally {
    clearTimeout(t);
  }
}

// 記事ページHTMLから og:image / twitter:image を抽出
function extractOgImage(html) {
  const patterns = [
    /<meta[^>]*property\s*=\s*["']og:image["'][^>]*content\s*=\s*["']([^"']+)["']/i,
    /<meta[^>]*content\s*=\s*["']([^"']+)["'][^>]*property\s*=\s*["']og:image["']/i,
    /<meta[^>]*name\s*=\s*["']twitter:image["'][^>]*content\s*=\s*["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      let img = m[1].trim();
      if (img.startsWith("//")) img = "https:" + img;
      if (/^https?:\/\//i.test(img)) return img;
    }
  }
  return null;
}

async function getOgImage(url) {
  for (let attempt = 0; attempt <= OGP_RETRIES; attempt++) {
    try {
      const resp = await fetchWithTimeout(url);
      if (!resp.ok) continue;
      const html = await resp.text();
      const img = extractOgImage(html);
      if (img) return img;
      return null; // ページは取れたが og:image 無し
    } catch {
      // タイムアウト等 -> リトライ
    }
  }
  return null;
}

async function getPexelsImage(keywords) {
  if (!PEXELS_KEY || !keywords) return null;
  try {
    const q = encodeURIComponent(keywords);
    const api = `https://api.pexels.com/v1/search?query=${q}&per_page=1&orientation=landscape`;
    const resp = await fetchWithTimeout(api, { headers: { Authorization: PEXELS_KEY } });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large;
    }
  } catch {
    // ネットワーク/レート制限等 -> null
  }
  return null;
}

async function resolveOne(item) {
  const url = item.url;
  const keywords = item.keywords || "";

  let image = await getOgImage(url);
  if (image) return { url, image, source: "ogp" };

  image = await getPexelsImage(keywords);
  if (image) return { url, image, source: "pexels" };

  return { url, image: null, source: null };
}

async function main() {
  const items = readInput();
  const results = await Promise.all(items.map(resolveOne));
  process.stdout.write(JSON.stringify(results, null, 2) + "\n");
}

main().catch((e) => {
  process.stderr.write("fetch-image.mjs エラー: " + (e && e.message) + "\n");
  process.exit(1);
});
