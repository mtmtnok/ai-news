// 半導体 工程別シェアデータ
// map.html の「半導体シェア」タブが描画する。
// シェアは調査会社レポート・各社決算に基づく概算（%）。出典は各セグメントの source を参照。
// 更新は手動（四半期目安）。2026-07-17 に Sonnet 5 サブエージェント2体のWeb調査で構築。
// items の jp: true は日本企業（図では日の丸印）。
window.SEMI_SHARE = {
  updated: "2026-07-17",
  stages: [
    {
      id: "design", name: "設計（ファブレス・EDA・IP）",
      segments: [
        {
          name: "データセンターAI GPU", asOf: "2025年（通年推定）",
          sourceName: "TrendForce・複数アナリスト推定", sourceUrl: "https://www.trendforce.com/presscenter/news/20251030-12762.html",
          note: "汎用GPU市場のシェア。Google TPU・AWS Trainium等のカスタムASICを含む「AIアクセラレータ全体」ではNVIDIAは75〜87%程度に下がり、ASIC比率は2026年に約28%へ拡大する見込み。",
          items: [
            { company: "NVIDIA", share: 90 },
            { company: "AMD", share: 8 },
            { company: "Intel", share: 1 },
            { company: "その他", share: 1 }
          ]
        },
        {
          name: "EDA（設計ツール）", asOf: "2024年",
          sourceName: "業界推定の統合", sourceUrl: "https://www.intellectualmarketinsights.com/blogs/leading-companies-in-the-global-electronic-design-automation-market-2025",
          note: "大手3社で市場の7〜8割超を占める寡占構造。SynopsysはAnsys買収（2025年完了）で実質シェアがさらに大きい可能性。",
          items: [
            { company: "Synopsys", share: 31 },
            { company: "Cadence", share: 30 },
            { company: "Siemens EDA", share: 13 },
            { company: "その他", share: 26 }
          ]
        },
        {
          name: "半導体IP（設計IP）", asOf: "2025年（推定）",
          sourceName: "MarketsandMarkets", sourceUrl: "https://www.marketsandmarkets.com/ResearchInsight/semiconductor-silicon-intellectual-property-ip-market.asp",
          note: "市場定義により数値のばらつきが大きいが、Armが最大手で上位数社の寡占である点は各調査で共通。その他にはAlphawave・Rambus・SiFive等。",
          items: [
            { company: "Arm", share: 41 },
            { company: "Synopsys", share: 13 },
            { company: "Cadence", share: 5 },
            { company: "その他", share: 41 }
          ]
        }
      ]
    },
    {
      id: "equipment", name: "製造装置",
      segments: [
        {
          name: "前工程装置（売上ベース推定）", asOf: "2025年度",
          sourceName: "各社決算＋SEMI市場規模から算出", sourceUrl: "https://drrobertcastellano.substack.com/p/asml-maintains-1-semiconductor-equipment",
          note: "各社の2025年度売上をSEMI推計の装置市場規模（約1,255億ドル）で除した概算（決算期のずれあり）。EUVリソグラフィ装置に限ればASMLがほぼ100%独占。その他にはSCREEN・Kokusai・Disco等。",
          items: [
            { company: "ASML", share: 28.4 },
            { company: "Applied Materials", share: 22.6 },
            { company: "Lam Research", share: 14.7 },
            { company: "東京エレクトロン", share: 13.1, jp: true },
            { company: "KLA", share: 9.7 },
            { company: "その他", share: 11.5 }
          ]
        },
        {
          name: "テスト装置（テスタ）", asOf: "2026年3月期",
          sourceName: "アドバンテスト決算・報道", sourceUrl: "http://building-pc.cocolog-nifty.com/helicopter/2026/04/post-de0be4.html",
          note: "アドバンテストのシェア65%は前年から7pt上昇（AI向けテスタ需要が追い風）。Teradyne分は残差からの推定で、集計範囲により数値は変動する。",
          items: [
            { company: "アドバンテスト", share: 65, jp: true },
            { company: "Teradyne", share: 30 },
            { company: "その他", share: 5 }
          ]
        },
        {
          name: "EUVマスク検査装置", asOf: "2025年時点",
          sourceName: "レーザーテックIR・業界分析", sourceUrl: "https://www.lasertec.co.jp/ir/individuals/euv.html",
          note: "EUVマスクの実波長（アクティニック）検査装置を商用提供する唯一の企業で、実質独占。顧客はTSMC・Samsung・Intelの3社で売上の7割超。",
          items: [
            { company: "レーザーテック", share: 100, jp: true }
          ]
        }
      ]
    },
    {
      id: "materials", name: "素材",
      segments: [
        {
          name: "シリコンウェハ", asOf: "2024〜25年（業界推定）",
          sourceName: "業界推定値", sourceUrl: "https://www.crex-data.com/industry/machinery/semiconductor-equipment/silicon-wafer",
          note: "信越化学・SUMCOの日本2社で世界の約6割を占める寡占構造。両社とも2nm/3nm向け超平坦ウェハの増産投資を進行中。",
          items: [
            { company: "信越化学", share: 42, jp: true },
            { company: "SUMCO", share: 18, jp: true },
            { company: "GlobalWafers", share: 12 },
            { company: "SK Siltron", share: 10 },
            { company: "Siltronic", share: 9 },
            { company: "その他", share: 9 }
          ]
        }
      ]
    },
    {
      id: "foundry", name: "前工程製造（ファウンドリ）",
      segments: [
        {
          name: "ファウンドリ売上シェア", asOf: "2025年通年",
          sourceName: "TrendForce", sourceUrl: "https://www.trendforce.com/presscenter/news/20260312-12965.html",
          note: "TSMCの一強がさらに進行（Q4単体では70.4%）。日本のRapidusは2027年度後半の2nm量産開始を目指す段階でシェアはまだ無い。その他はHuaHong・Tower・PSMC等。",
          items: [
            { company: "TSMC", share: 69.9 },
            { company: "Samsung", share: 7.2 },
            { company: "SMIC", share: 5.3 },
            { company: "UMC", share: 4.4 },
            { company: "GlobalFoundries", share: 3.9 },
            { company: "その他", share: 9.3 }
          ]
        }
      ]
    },
    {
      id: "memory", name: "メモリ",
      segments: [
        {
          name: "HBM（広帯域メモリ・AI向け）", asOf: "2026年Q1",
          sourceName: "IDC（SK hynix SEC提出書類引用）", sourceUrl: "https://siliconanalysts.com/market/hbm-supply-shortage-persists-as-sk-hynix-commands-56-4-market-share-micron-commi-2026-07-10",
          note: "AIブームの主戦場。2025年通年ではSK hynix約63%との報道もあり、Micronが急拡大・Samsungが回復途上でシェアは流動的。",
          items: [
            { company: "SK hynix", share: 56.4 },
            { company: "Samsung", share: 21.8 },
            { company: "Micron", share: 21.8 }
          ]
        },
        {
          name: "DRAM", asOf: "2025年Q4",
          sourceName: "TrendForce", sourceUrl: "https://www.trendforce.com/presscenter/news/20260226-12937.html",
          note: "Q4 2025にSamsungが首位を奪還。業界全体の売上は536億ドル（前四半期比+29.4%）とAI需要で急拡大。",
          items: [
            { company: "Samsung", share: 36.0 },
            { company: "SK hynix", share: 32.1 },
            { company: "Micron", share: 22.4 },
            { company: "その他", share: 9.5 }
          ]
        },
        {
          name: "NAND型フラッシュ", asOf: "2025年Q4",
          sourceName: "TrendForce（一部推定）", sourceUrl: "https://www.trendforce.com/presscenter/news/20260303-12943.html",
          note: "キオクシア以下のシェアは各社売上と市場規模からの推定。その他はYMTC等。",
          items: [
            { company: "Samsung", share: 28.0 },
            { company: "SK hynix", share: 22.1 },
            { company: "キオクシア", share: 14.0, jp: true },
            { company: "Micron", share: 12.9 },
            { company: "SanDisk", share: 12.9 },
            { company: "その他", share: 10.1 }
          ]
        }
      ]
    },
    {
      id: "backend", name: "後工程（組立・パッケージング）",
      note: "AI GPU向けの先端パッケージング（CoWoS）はTSMCがほぼ独占的に供給しているとされるが、信頼できる会社別シェアの一次統計は確認できなかったため棒グラフ化していない。",
      segments: [
        {
          name: "OSAT（組立テスト受託）", asOf: "2024年通年",
          sourceName: "TrendForce", sourceUrl: "https://www.trendforce.com/presscenter/news/20250513-12577.html",
          note: "世界上位10社の合計売上（415.6億ドル）に占める比率。中国系OSAT（JCET・Huatian等）が二桁成長で拡大中。",
          items: [
            { company: "ASE", share: 44.6 },
            { company: "Amkor", share: 15.2 },
            { company: "JCET", share: 12.0 },
            { company: "その他", share: 28.2 }
          ]
        }
      ]
    }
  ]
};
