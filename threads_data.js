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
  updated: "2026-07-18",
  threads: [
    {
      id: "compute",
      title: "コンピュート軍拡",
      tagline: "計算資源の確保競争",
      question: "誰が・どこから・どれだけ計算資源を確保しているか",
      color: "#2d5d8e",
      updated: "2026-07-18",
      status: [
        "OpenAIは調達した1,220億ドル超の大半を計算資源に投下。Microsoftとの独占関係を解消し（26/4）、Oracle・AMD・Broadcom・Cerebras・AWS・SB Energyへ分散発注する「マルチクラウド軍拡」に移行した。",
        "AnthropicもAzure 300億ドル購入・Google TPU複数GW・Broadcom共同開発の三正面で確保を進め、フロンティア2社の計算資源調達は合計で数千億ドル規模に達している。",
        "供給側の台風の目はNebius。Meta（5年270億ドル）・Reflection AI（10億ドル超）・NVIDIA（20億ドル出資）と相次いで大型契約を締結し、ネオクラウドが既存ハイパースケーラーの寡占を崩し始めた。"
      ],
      week: "国産AI「Noetra」がNVIDIA Rubin 2.75万基を独占確保──国家規模の計算資源争奪戦に日本が参戦"
    },
    {
      id: "labs",
      title: "フロンティアラボの資金・勢力図",
      tagline: "マネーゲームと合従連衡",
      question: "どのラボに誰の資金が入り、勢力図はどう動いているか",
      color: "#3a7a4e",
      updated: "2026-07-18",
      status: [
        "OpenAIは26年2月に1,220億ドルという史上最大級の調達を完了（NVIDIA 300億・Amazon 500億・SoftBank 300億など）。Microsoftの持分は約27%となり、独占提携から「複数の巨人が相乗りする構図」へ変わった。",
        "Anthropicは評価額9,650億ドルのシリーズH（650億ドル）を実施し、Google（最大400億）・Amazon（累計最大330億）・Microsoft・NVIDIAと全ハイパースケーラーから資金を集める全方位戦略を確立した。",
        "xAIはSpaceXに吸収合併され（合併後評価額1.25兆ドル・26/6にIPO）、UAEのMGXがOpenAI・Anthropic・xAIの3社すべてに出資するなど、中東国家資本の存在感が急拡大している。"
      ],
      week: null
    },
    {
      id: "china",
      title: "中国オープンウェイト勢の追撃",
      tagline: "DeepSeek・Kimi・Qwen",
      question: "中国勢は米フロンティアにどこまで迫っているか",
      color: "#c8762a",
      updated: "2026-07-18",
      status: [
        "Moonshot AIが2.8兆パラメータのMoEモデル「Kimi K3」を発表（26/7/16）。オープンウェイトで米フロンティア級の性能を主張し、米メディアは「第2のDeepSeekショック」と報道。AIインフラ関連株が下落した。",
        "DeepSeekはTencent主導で初の外部調達74億ドルを完了（評価額最大590億ドル）。「低コストで西側フロンティアに肉薄する」中国勢のパターンが資本面でも本格化した。",
        "焦点は7/27までに予告されたKimi K3のフルウェイト公開。実性能が確認されれば、巨額投資を続ける米国ラボの優位性への懸念が再燃する。"
      ],
      week: "Kimi K3発表で「第2のDeepSeekショック」──7/27のウェイト公開が次の焦点"
    },
    {
      id: "japan",
      title: "日本の国産AI",
      tagline: "Noetra・Rapidus・Sakana",
      question: "日本は世界のAI供給網のどこに立とうとしているか",
      color: "#cf3b25",
      updated: "2026-07-18",
      status: [
        "ソフトバンク・ソニー・NEC・ホンダを中核とする44社連合が国産AI基盤モデル会社「Noetra」を設立（26/7/16）。経産省が5年で最大1兆円を支援し、NVIDIA Rubin約2.75万基を独占導入して2028年6月の稼働を目指す。",
        "狙いはロボット・自動運転などのフィジカルAI。製造業の強みを生かした国産マルチモーダル基盤モデルで「脱・米国依存」を掲げるが、計算基盤はNVIDIA依存のままという構造矛盾を抱える。",
        "半導体側はRapidusがIBMと2nmで提携し量産を準備中。Sakana AIは評価額約4,000億円（シリーズB）に達し、SB OAI Japan（OpenAI×ソフトバンク合弁）も企業向け展開を開始。国・通信・研究の三方向が同時に動いている。"
      ],
      week: "44社連合の国産AI「Noetra」発足──経産省5年1兆円・2028年稼働へ"
    },
    {
      id: "semi",
      title: "半導体サプライチェーン再編",
      tagline: "ファウンドリ・HBM・カスタムチップ",
      question: "AIチップの設計・製造・供給網はどう組み変わっているか",
      color: "#3d7a80",
      updated: "2026-07-18",
      status: [
        "TSMC一強に風穴が開き始めた。GoogleがIntel FoundryにTPU 300万個超を発注（報道・2028年納入目標）、AnthropicはSamsung 2nm（SF2）でカスタム推論チップの製造委託を決定。ファウンドリの選択肢が初めて実質的に分散した。",
        "NVIDIA依存からの脱却を狙うカスタムチップ開発も加速。OpenAI×Broadcom（10GW規模）・Anthropic×Broadcomが進行し、QualcommはTenstorrentを80〜100億ドルで買収交渉中（未確定）。",
        "TSMCはAI需要で過去最高決算を続けアリゾナに追加1,000億ドルを投資。HBMではNVIDIA×SK hynixが次世代共同開発の複数年提携を結び、メモリが競争の主戦場になっている。"
      ],
      week: "TSMCがQ2過去最高決算──AI需要でアリゾナ追加1,000億ドル投資"
    },
    {
      id: "talent",
      title: "人材とラボの興亡",
      tagline: "移籍・買収・新ラボ",
      question: "トップ研究者と技術資産はどこへ動いているか",
      color: "#6b4f9e",
      updated: "2026-07-18",
      status: [
        "Google DeepMindからの頭脳流出が止まらない。ノーベル賞受賞者John JumperがAnthropicへ、『Attention Is All You Need』共著者Noam ShazeerがOpenAIへ移籍（27億ドルで呼び戻されてから22か月）。",
        "Yann LeCunはMetaを離れAMI Labsを創業（シード10.3億ドル・欧州最大）。MetaはScale AI創業者Alexandr Wangを143億ドルのディールで迎え超知能ラボを設立するなど、「人材獲得＝企業買収」の時代に入った。",
        "開発ツールの買収合戦も進行中。SpaceXがCursor開発元を600億ドルで買収（VC支援スタートアップ史上最大）、AnthropicはStainless・Coefficient Bioを、OpenAIはAstral（uv/ruff）・io Products（Jony Ive、Appleが提訴中）を取得した。"
      ],
      week: null
    }
  ]
};
