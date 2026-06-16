#!/usr/bin/env node
// 記事URLからニュース用サムネイル画像URLを決定するクロスプラットフォーム・スクリプト。
// Windows(ローカル) でも Linux(クラウドの定期ルーティン) でも同じく動くよう、依存パッケージなし。
//
// HTTP取得は二段構え:
//   1. グローバル fetch（Node 18+）が使えればそれを使う
//   2. 使えない／失敗した場合は `curl` コマンドにフォールバック（古いNodeやサンドボックス環境向け）
//
// 画像の決定ロジック（上から順に試し、最初に成功したものを採用）:
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
//   PEXELS_API_KEY="xxx" node tools/fetch-image.mjs input.json

import { readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const pExecFile = promisify(execFile);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const PEXELS_KEY = process.env.PEXELS_API_KEY || "";
const TIMEOUT_MS = 20000;
const TIMEOUT_S = 20;
const OGP_RETRIES = 2; // 一時的な失敗に備えて記事ページ取得をリトライ
const MAX_BUFFER = 64 * 1024 * 1024;

function readInput() {
  const fileArg = process.argv[2];
  const raw = fileArg ? readFileSync(fileArg, "utf8") : readFileSync(0, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error("入力はJSON配列である必要があります");
  return data;
}

// curl で本文テキストを取得（失敗時 null）
async function curlText(url, extraHeaders = {}) {
  const args = ["-sL", "--max-time", String(TIMEOUT_S), "-A", UA];
  for (const [k, v] of Object.entries(extraHeaders)) args.push("-H", `${k}: ${v}`);
  args.push(url);
  try {
    const { stdout } = await pExecFile("curl", args, { encoding: "utf8", maxBuffer: MAX_BUFFER });
    return stdout && stdout.length ? stdout : null;
  } catch {
    return null;
  }
}

// fetch優先・curlフォールバックで本文テキストを取得（失敗時 null）
async function getText(url, extraHeaders = {}) {
  if (typeof fetch === "function") {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const resp = await fetch(url, {
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": UA, "Accept-Language": "ja,en;q=0.8", ...extraHeaders },
      });
      if (resp.ok) return await resp.text();
      // 4xx/5xx はcurlで二度目を試す
    } catch {
      // タイムアウト/ネットワーク不可 -> curlへ
    } finally {
      clearTimeout(t);
    }
  }
  return curlText(url, { "Accept-Language": "ja,en;q=0.8", ...extraHeaders });
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
      let img = m[1].trim().replace(/&amp;/g, "&");
      if (img.startsWith("//")) img = "https:" + img;
      if (/^https?:\/\//i.test(img)) return img;
    }
  }
  return null;
}

async function getOgImage(url) {
  for (let attempt = 0; attempt <= OGP_RETRIES; attempt++) {
    const html = await getText(url);
    if (html) {
      const img = extractOgImage(html);
      if (img) return img;
      return null; // ページは取れたが og:image 無し
    }
    // 取得失敗 -> リトライ
  }
  return null;
}

async function getPexelsImage(keywords) {
  if (!PEXELS_KEY || !keywords) return null;
  const q = encodeURIComponent(keywords);
  const api = `https://api.pexels.com/v1/search?query=${q}&per_page=1&orientation=landscape`;
  const body = await getText(api, { Authorization: PEXELS_KEY });
  if (!body) return null;
  try {
    const data = JSON.parse(body);
    if (data.photos && data.photos.length > 0) return data.photos[0].src.large;
  } catch {
    // JSONでない（エラーページ等） -> null
  }
  return null;
}

export async function resolveOne(item) {
  const url = item.url;
  const keywords = item.keywords || "";

  let image = await getOgImage(url);
  if (image) return { url, image, source: "ogp" };

  image = await getPexelsImage(keywords);
  if (image) return { url, image, source: "pexels" };

  return { url, image: null, source: null };
}

async function main() {
  // 環境診断（stdout のJSONには影響しない）
  process.stderr.write(
    `fetch-image: node ${process.version}, fetch=${typeof fetch}, pexels_key=${PEXELS_KEY ? "set" : "none"}\n`
  );
  const items = readInput();
  const results = await Promise.all(items.map(resolveOne));
  process.stdout.write(JSON.stringify(results, null, 2) + "\n");
}

// CLIとして直接実行されたときのみ main() を走らせる（他スクリプトからの import 時は走らせない）
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    process.stderr.write("fetch-image.mjs エラー: " + (e && e.message) + "\n");
    process.exit(1);
  });
}
