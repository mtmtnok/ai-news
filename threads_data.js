// AI業界 ストーリースレッド定義
// threads.html が描画する。B-002（2026-07-18 判断済: 1A 2A 3A）で導入。
//
// 各スレッド = 業界を動かす大きな物語。網羅はしない。「この6本を追えば業界の現況が分かる」が編集方針。
//
// threads: { id, title, tagline, question, color, updated, status: [...], week? }
//   id:       ニュース（ai_news_data.js の threads タグ）と関係エッジ（relations_data.js の threads タグ）が参照するキー
//   title:    スレッド名
//   tagline:  一言説明（タブの補助表示）
//   question: このスレッドが答える問い
//   color:    スレッドのテーマ色
//   updated:  現在地を最後に書き直した日（毎週土曜に更新）
//   status:   「現在地」— 今どうなっているかを3〜5行で。毎週土曜に全文書き直してよい（追記ではなく上書き）
//   week:     今週の動き1行（該当がない週は null）。index.html のトップに表示される
//
// スレッドの増設ルール: 既存スレッドに入らない ★★★ ニュースが3件溜まったときだけ新設する（無限増殖の防止）
window.THREADS = {
  updated: "2026-09-26",
  threads: [
    {
      id: "compute",
      title: "コンピュート軍拡",
      tagline: "計算資源の確保競争",
      question: "誰が・どこから・どれだけ計算資源を確保しているか",
      color: "#2d5d8e",
      updated: "2026-09-26",
      status: [
        "計算資源の制約が「電力」という上流工程に移りつつある。NVIDIA・Google・Emerald AIは電力網接続を迅速化する新連合「AEMA」を発足させ、100ギガワット規模のデータセンター向け電力確保を目標に掲げた。",
        "資金調達手法の多様化も続く。AIインフラ企業Crusoeは39億ドルのシリーズFを完了し評価額309億ドルに到達、カタール投資庁やNVIDIAも出資し契約総額は1400億ドル超に達している。",
        "メモリの供給制約も一段と深刻化。Samsung・SK hynix・Micronの2027年分DRAM・HBM生産能力は業界全体で「完売」状態に入り、SK hynixはNVIDIA「Vera Rubin」向け16層HBM4の量産出荷でも先陣を切った(本サイト既報)。",
        "OpenAIが9月上旬に明らかにしたNVIDIA10GW・AMD6GW・Broadcom10GWの増強計画や、米国防総省とFluidstackの50億ドル融資協議など、計算資源そのものを巡る大型契約も引き続き積み上がっている。"
      ],
      week: "NVIDIA・Google・Emerald AIが電力連合「AEMA」発足、100GW確保目標／Crusoeが39億ドル調達で評価額309億ドルに／SK hynixがVera Rubin向け16層HBM4で量産先行"
    },
    {
      id: "labs",
      title: "フロンティアラボの資金・勢力図",
      tagline: "マネーゲームと合従連衡",
      question: "どのラボに誰の資金が入り、勢力図はどう動いているか",
      color: "#3a7a4e",
      updated: "2026-09-26",
      status: [
        "「開発ペース減速」論争は制度実装の段階に入った。AnthropicはAccentureと提携し、モデルを社内から検証する「組み込み型評価者」体制を新設。両社は5年間で各10億ドルを投資する計画で、アモデイ氏が提唱した減速提案を具体的な仕組みとして動かし始めた。",
        "一方で「減速」は実際の製品競争を鈍らせていない。9月22日にはAnthropicの「Claude Opus 5.5」とOpenAIの「GPT-6 Sol/Luna」が数時間差で投入され、いずれも大幅値下げを伴う開発競争が続く。",
        "Anthropic・OpenAI・xAI・Googleは「AI開発ペースを結託して減速させた」として集団訴訟を提起されており、アモデイ氏のエッセイへの賛同発言が引き金になったとされる。業界協調が独禁法上のリスクにもなり得る構図が浮き彫りに。",
        "Anthropicは自社AI研究開発の26%をClaudeが主導していると公表(半年前は1%未満)し「再帰的自己改善」の進捗を初めて指標化。学習データを供給するSnorkel AIが評価額を3倍の35億ドルに伸ばすなど、周辺エコシステムへの資金流入も加速している。"
      ],
      week: "Anthropic・Accentureが「組み込み型評価者」創設で提携、5年で各10億ドル投資／Claude Opus 5.5とGPT-6 Sol/Lunaが同日投入／開発ペース結託を巡り集団訴訟提起"
    },
    {
      id: "china",
      title: "中国オープンウェイト勢の追撃",
      tagline: "DeepSeek・Kimi・Qwen",
      question: "中国勢は米フロンティアにどこまで迫っているか",
      color: "#c8762a",
      updated: "2026-09-26",
      status: [
        "米中は「AI・貿易休戦」の延長へ向けて調整を進めている。9月24日にはトランプ・習近平会談が予定され、AIインシデントの通知枠組みなども協議されている。",
        "一方で中国当局は、AnthropicがClaude経由の不正蒸留と指摘したDeepSeek・Moonshot AIの調査に乗り出した。公安・軍事関連データの越境移転懸念も浮上し、関連の中国AI企業の株価にも動揺が広がった。",
        "モデル開発競争は緩まない。中国StepFunは600Bパラメータの新フラッグシップ「Step 5 Preview」を発表し重みを10月15日に公開予定、AlibabaはQwen新モデル「Qwen3.8-Omni-Flash」を公開し音声入力コストを98%削減した。",
        "資金調達も活発で、中国Naive AIはテンセント主導で4億ドルを調達(評価額14.2億ドル)、AIエージェント企業Manusも評価額40億ドルで5億ドル調達に動くなど、フロンティア追撃勢の裾野が広がっている。"
      ],
      week: "中国当局がDeepSeek・Moonshotを不正蒸留疑惑で調査／米中がAI・貿易「休戦」延長へ24日に首脳会談／StepFunが600Bパラメータ「Step 5 Preview」発表"
    },
    {
      id: "japan",
      title: "日本の国産AI",
      tagline: "Noetra・Rapidus・Sakana",
      question: "日本は世界のAI供給網のどこに立とうとしているか",
      color: "#cf3b25",
      updated: "2026-09-26",
      status: [
        "材料探索分野で国産AIの実用化が進む。日本発の材料探索AI「Matlantis」はNVIDIAの「ALCHEMI」と連携し、ENEOSが触媒候補1億件をAIで評価、実験検証の優先候補を絞り込む取り組みを始めた。",
        "中堅企業レベルでも生成AI活用の裾野が広がる。ガイアックスは米AI広告プラットフォーム「Omneky」に出資し、SNSマーケティング・クリエイター支援事業への生成AI技術の取り込みを進める。",
        "前週判明した三菱重工業によるPreferred Networksへの100億円出資(防衛・宇宙向けAI開発)や、富士通のPalantir協業拡大なども引き続き、大企業主導の国産AI・AI導入の土台として進行中。"
      ],
      week: "Matlantisが NVIDIA「ALCHEMI」と連携、ENEOSが触媒候補1億件を評価／ガイアックスが米AI広告Omnekyへ出資"
    },
    {
      id: "semi",
      title: "半導体サプライチェーン再編",
      tagline: "ファウンドリ・HBM・カスタムチップ",
      question: "AIチップの設計・製造・供給網はどう組み変わっているか",
      color: "#3d7a80",
      updated: "2026-09-26",
      status: [
        "HBM4を巡る次世代競争が本格化した。SK hynixはNVIDIA「Vera Rubin」向け16層・48ギガバイトのHBM4を業界に先駆けて量産出荷する体制に入り、NVIDIAのHBM4調達の7割を確保したとされる。SamsungはHBM3E 12層品がNVIDIA認証を通過し歩留まりも60%未満から80%近くまで改善したが、16層品は商用化を見送る方針を示した。",
        "メモリの需給逼迫は一段と深刻化しており、Samsung・SK hynix・Micronの2027年分DRAM・HBM生産能力は業界全体で「完売」状態に入っている。Samsungは6兆ウォンを投じ「Onyang」HBM専用パッケージング新工場の建設にも着手した。",
        "AI需要への期待から半導体株の急騰も続く。MetaのAIエージェント「Muse」の急速な人気を追い風に、AMDの時価総額が初めて1兆ドルを突破するなど、AI関連銘柄への資金流入は勢いを増している。",
        "前週判明したHuaweiの「Ascend 960DT」前倒し投入や韓国の改正スパイ防止法施行など、供給網の自立化・防衛色を強める動きも並行して進む。"
      ],
      week: "SK hynixがVera Rubin向け16層HBM4で量産先行、NVIDIA調達の7割確保／Samsungが「Onyang」HBMパッケージング新工場着工・歩留まり80%近くまで改善／AMD時価総額が初の1兆ドル超"
    },
    {
      id: "talent",
      title: "人材とラボの興亡",
      tagline: "移籍・買収・新ラボ",
      question: "トップ研究者と技術資産はどこへ動いているか",
      color: "#6b4f9e",
      updated: "2026-09-26",
      status: [
        "研究者個人による新ラボ設立が続く。元Meta研究者のYossi Adi氏はイスラエルでAIラボ「Aire」を設立し、数百万ドル規模の資金調達を完了、数億ドル規模の追加調達も計画している。",
        "AI自身が研究開発を担う比重も急速に高まっている。Anthropicは自社のAI研究開発の26%をClaudeが主導していると公表し、半年前の1%未満から急上昇、「再帰的自己改善」への進捗を初めて指標として開示した。人材の代わりにAIモデル自身が研究を担う領域が広がりつつある。",
        "前週判明したNVIDIAによるHugging Face買収(129億3000万ドル、従業員引き留め株式に最大10億ドル)は、人材・技術基盤ごと取り込む大型買収として引き続き余波が続いている。"
      ],
      week: "元Meta研究者Yossi Adi氏がイスラエルでAIラボ「Aire」設立／AnthropicがClaudeによる自社AI研究開発主導率26%を公表"
    }
  ]
};
