/* =====================================================================
   ドル金額の円換算吹き出し（B-021 で採用：A「吹き出し」＝円換算とレートだけ）
   記事ページの本文から米ドルの金額を見つけて点線の下線を付け、触れる（スマホはタップ）と
   記事の日付（e.date）時点の USD/JPY で、円換算とレートを吹き出しで出す。
   - レート: fx_usdjpy.js（GitHub Actions が自動更新）。記事の日付以前で最も近い営業日の値
   - 対象外: 豪ドル・台湾ドル・香港ドル・カナダドル・NT$ など米ドル以外
   - 対象外: すでに円換算が隣にある箇所（「150億ドル(約2.3兆円)」「1兆円(約63億ドル)」）
   使い方: UsdHover.apply(記事ページの要素, 記事データ)
   ===================================================================== */
(function(){
"use strict";
const FX = window.FX_USDJPY || {rates:{}};
const DATES = Object.keys(FX.rates).sort();

/* ---------- 為替: 記事の日付以前で最も近い営業日の値 ---------- */
function rateOn(iso){
  let lo = 0, hi = DATES.length - 1, ans = -1;
  while(lo <= hi){ const m = (lo + hi) >> 1; if(DATES[m] <= iso){ ans = m; lo = m + 1; } else hi = m - 1; }
  if(ans < 0) ans = 0;                       // 記事がデータより古い場合は最古の値
  const d = DATES[ans];
  return d ? {date: d, rate: FX.rates[d]} : null;
}

/* ---------- 金額の検出 ---------- */
const N = String.raw`\d[\d,]*(?:\.\d+)?`;
const U4 = String.raw`${N}\s*万(?:${N})?`;
const U8 = String.raw`${N}\s*億(?:\s*${U4})?`;
const U12 = String.raw`${N}\s*兆(?:\s*${U8})?`;
const JA = String.raw`(?:${U12}|${U8}|${U4}|${N})`;
const DOLLAR = String.raw`\s*(?:米)?ドル`;           // 「豪ドル」「台湾ドル」は 豪/台湾 が挟まるので一致しない
const RE = new RegExp(
  String.raw`(?<range>(?<ra>${JA})\s*[〜~～\-–－]\s*(?<rb>${JA})${DOLLAR})` +
  String.raw`|(?<vague>(?<vq>数十|数百|数千|十数|数)(?<vu>兆|億|万)${DOLLAR})` +
  String.raw`|(?<ja>(?<jn>${JA})${DOLLAR})` +
  String.raw`|(?<sign>(?<![A-Za-z])\$\s?(?<sn>${N})(?:\s*(?<su>兆|億|万)|\s?(?<sw>billion|million|trillion|bn)\b|(?<sl>[BMK])(?![A-Za-z]))?)`,
  "g");
const UNIT = {"兆":1e12, "億":1e8, "万":1e4};
const WORD = {billion:1e9, bn:1e9, million:1e6, trillion:1e12, b:1e9, m:1e6, k:1e3};
const VAGUE = {"数":[2,9], "十数":[11,19], "数十":[10,99], "数百":[100,999], "数千":[1000,9999]};

function parseJa(s){                       // "1兆2,000億" → 1.2e12
  let total = 0, any = false, m;
  const re = /(\d[\d,]*(?:\.\d+)?)\s*(兆|億|万)?/g;
  while((m = re.exec(s))){ any = true; total += parseFloat(m[1].replace(/,/g, "")) * (m[2] ? UNIT[m[2]] : 1); }
  return any ? total : null;
}
const topUnit = s => (s.match(/兆|億|万/) || [""])[0];

/* 隣に円換算がすでにある → 対象外 */
const YEN_AFTER = /^\s*[（(][^（()）]{0,24}円/;
const YEN_BEFORE = /円\s*[）)]?\s*[（(][^（()）]{0,8}$/;

function findAmounts(text){
  const out = [];
  RE.lastIndex = 0;
  let m;
  while((m = RE.exec(text))){
    const g = m.groups, start = m.index, end = start + m[0].length;
    if(YEN_AFTER.test(text.slice(end, end + 30)) || YEN_BEFORE.test(text.slice(Math.max(0, start - 12), start))) continue;
    let lo, hi = null, unit = "";
    if(g.range){
      unit = topUnit(g.rb);
      const a = topUnit(g.ra) ? g.ra : g.ra + unit;           // 「50〜100億ドル」の 50 に 億 を補う
      lo = parseJa(a); hi = parseJa(g.rb);
    } else if(g.vague){
      unit = g.vu; const [x, y] = VAGUE[g.vq];
      lo = x * UNIT[g.vu]; hi = y * UNIT[g.vu];
    } else if(g.ja){
      unit = topUnit(g.jn); lo = parseJa(g.jn);
    } else if(g.sign){
      const n = parseFloat(g.sn.replace(/,/g, ""));
      if(g.su){ unit = g.su; lo = n * UNIT[g.su]; }
      else if(g.sw || g.sl){ lo = n * WORD[(g.sw || g.sl).toLowerCase()]; }
      else lo = n;
    }
    if(lo == null || !isFinite(lo)) continue;
    out.push({start, end, raw: m[0], lo, hi, unit, vague: !!g.vague});
  }
  return out;
}

/* ---------- 円の書き方 ---------- */
function round2(v){                         // 有効数字2桁（1万円未満は3桁: API料金などの小さい額）
  if(v < 100) return Math.round(v);
  const p = Math.pow(10, Math.floor(Math.log10(v)) - (v < 1e4 ? 2 : 1));
  return Math.round(v / p) * p;
}
const num = (v, d) => v.toLocaleString("ja-JP", {maximumFractionDigits: d});
function yenText(v){                        // 約◯兆円／◯億円／◯万円／◯円
  const r = round2(v);
  if(r >= 1e12) return num(r / 1e12, r < 1e13 ? 1 : 0) + "兆円";
  if(r >= 1e8)  return num(r / 1e8,  r < 1e9  ? 1 : 0) + "億円";
  if(r >= 1e4)  return num(r / 1e4,  r < 1e5  ? 1 : 0) + "万円";
  return num(r, 0) + "円";
}
function yenRange(a){
  if(a.hi == null) return yenText(a.lo * a.rate);
  // 両端の単位が同じなら前側を省く（「280兆円〜320兆円」→「280〜320兆円」）
  const x = yenText(a.lo * a.rate), y = yenText(a.hi * a.rate);
  const unitOf = s => s.match(/[兆億万]?円$/)[0];
  return (unitOf(x) === unitOf(y) ? x.slice(0, -unitOf(x).length) : x) + "〜" + y;
}
const jpDate = iso => { const [y, m, d] = iso.split("-"); return `${y}年${+m}月${+d}日`; };
const wd = iso => "日月火水木金土"[new Date(iso + "T00:00:00").getDay()];
const rateNote = (fx, articleDate) =>
  `1ドル＝${num(fx.rate, 2)}円・${jpDate(fx.date)}（${wd(fx.date)}）${fx.date === articleDate ? "" : "の値"}`;

/* ---------- DOM へ差し込む ---------- */
const TARGETS = ".art-h, .art-lead, .art-points, .art-body";
function wrapIn(root, fx, note){
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.parentElement.closest(".usd, script, style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
  const nodes = []; let n, count = 0;
  while((n = walker.nextNode())) nodes.push(n);
  for(const node of nodes){
    const text = node.nodeValue, hits = findAmounts(text);
    if(!hits.length) continue;
    const frag = document.createDocumentFragment();
    let pos = 0;
    for(const h of hits){
      h.rate = fx.rate;
      frag.append(text.slice(pos, h.start));
      const s = document.createElement("span");
      s.className = "usd";
      s.textContent = text.slice(h.start, h.end);
      s.tabIndex = 0;
      s.dataset.yen = yenRange(h);
      s.dataset.note = note;
      frag.append(s);
      pos = h.end; count++;
    }
    frag.append(text.slice(pos));
    node.replaceWith(frag);
  }
  return count;
}

/* ---------- 吹き出し ---------- */
let tip = null, pinned = null;
function ensureTip(){
  if(tip) return tip;
  tip = document.createElement("div");
  tip.className = "usd-tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true;
  document.body.append(tip);
  return tip;
}
function hideTip(){ pinned = null; if(tip) tip.hidden = true; }
function showTip(el){
  if(!el.isConnected || !el.offsetParent){ hideTip(); return; }   // 記事を閉じた・切り替えた後
  const t = ensureTip();
  t.innerHTML = `<b>≈ ${el.dataset.yen}</b><small>${el.dataset.note}</small>`;
  t.hidden = false;
  const r = el.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight;
  let x = r.left + r.width / 2 - w / 2;
  x = Math.max(8, Math.min(x, document.documentElement.clientWidth - w - 8));
  let y = r.top - h - 8, below = false;
  if(y < 8){ y = r.bottom + 8; below = true; }
  t.style.left = (x + scrollX) + "px"; t.style.top = (y + scrollY) + "px";
  t.classList.toggle("below", below);
  t.style.setProperty("--ax", (r.left + r.width / 2 - x) + "px");
}
function apply(pv, e){
  hideTip();
  const fx = e && e.date ? rateOn(e.date) : null;
  if(!fx) return 0;
  const note = rateNote(fx, e.date);
  let count = 0;
  pv.querySelectorAll(TARGETS).forEach(root => { count += wrapIn(root, fx, note); });
  return count;
}

/* マウス: 合わせると出る／外すと消える。キーボード: フォーカスで出る */
document.addEventListener("mouseover", ev => { const u = ev.target.closest(".usd"); if(u && !pinned) showTip(u); });
document.addEventListener("mouseout", ev => {
  const u = ev.target.closest(".usd");
  if(u && !pinned && !u.contains(ev.relatedTarget) && tip) tip.hidden = true;
});
document.addEventListener("focusin", ev => { const u = ev.target.closest(".usd"); if(u) showTip(u); });
document.addEventListener("focusout", ev => { if(ev.target.closest(".usd") && !pinned && tip) tip.hidden = true; });
/* タップ（スマホ）: 金額をタップで固定表示、もう一度かほかをタップで閉じる */
document.addEventListener("click", ev => {
  const u = ev.target.closest(".usd");
  if(u){ if(pinned === u) hideTip(); else { showTip(u); pinned = u; } return; }
  if(pinned && !ev.target.closest(".usd-tip")) hideTip();
});
document.addEventListener("keydown", ev => { if(ev.key === "Escape") hideTip(); });
addEventListener("popstate", hideTip);
addEventListener("scroll", () => { if(pinned) showTip(pinned); else if(tip) tip.hidden = true; }, {passive: true});

/* ---------- 見た目（サイトの紙面の色に合わせる） ---------- */
const css = `
.usd{cursor:help;border-radius:1px;transition:background .12s;
  text-decoration:underline dotted var(--accent,#b3321c);text-decoration-thickness:1.5px;text-underline-offset:3px}
.usd:hover,.usd:focus{background:rgba(179,50,28,.10);outline:none}
.usd-tip{position:absolute;z-index:100;max-width:min(340px,calc(100vw - 16px));background:var(--ink,#141210);color:var(--paper,#f5f2ea);
  padding:8px 12px 9px;font-family:var(--sans,sans-serif);line-height:1.5;box-shadow:0 6px 18px rgba(0,0,0,.18);pointer-events:none}
.usd-tip::after{content:"";position:absolute;left:var(--ax,50%);bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:var(--ink,#141210)}
.usd-tip.below::after{bottom:auto;top:-6px;border-top:0;border-bottom:6px solid var(--ink,#141210)}
.usd-tip b{display:block;font-family:var(--serif,serif);font-size:17px;font-weight:700;letter-spacing:.01em}
.usd-tip small{display:block;font-size:11px;opacity:.72;margin-top:2px}
`;
const st = document.createElement("style"); st.textContent = css; document.head.append(st);

window.UsdHover = {apply, findAmounts, rateOn, yenText};
})();
