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
  updated: "2026-08-08",
  threads: [
    {
      id: "compute",
      title: "コンピュート軍拡",
      tagline: "計算資源の確保競争",
      question: "誰が・どこから・どれだけ計算資源を確保しているか",
      color: "#2d5d8e",
      updated: "2026-08-08",
      status: [
        "NVIDIAが計算資源争奪戦の中心であり続ける。イリヤ・サツケバー氏率いるSSIに50億ドルを出資しVera Rubin基盤へのアクセスを付与(26/7)、新興ネオクラウドVoltaの3億ドル調達にも参加(26/8)、SpaceXは自社計算資源をNVIDIAへ全面一本化し2027年末までに10GW確保を表明(26/8)した。",
        "データセンター投資は地理的に急拡大している。豪州Firmusは20億ドルを追加調達し評価額105億ドルに倍増(26/8)、秋田市では建設費2兆円規模・日本最大級のAIデータセンター計画にUAEが投資検討中(26/8)、Voltaはノルウェーに133MWの水力発電データセンターを構築中。",
        "Anthropicの計算資源網はTeraWulf・SpaceX・Volta(報道)などマルチベンダー化が続く一方、SK GroupとNVIDIAは韓国に2GW級「AIクラウド」を構築する5,000億ドル超の提携を推進中。コンピュート軍拡は米国一極から豪州・北欧・日本・韓国へと地理的に拡散している。"
      ],
      week: "SSIに50億ドル出資／SpaceXが計算資源をNVIDIAへ一本化／Volta・Firmusが大型調達／秋田に2兆円規模AIデータセンター計画"
    },
    {
      id: "labs",
      title: "フロンティアラボの資金・勢力図",
      tagline: "マネーゲームと合従連衡",
      question: "どのラボに誰の資金が入り、勢力図はどう動いているか",
      color: "#3a7a4e",
      updated: "2026-08-08",
      status: [
        "Google DeepMindはハサビス氏がCEOを退きDeepMind会長兼アルファベット首席科学者へ転身(26/8)。コーディング統括ボルジョー氏・前CTOカヴクチュオール氏が相次いでロンドンから米本社へ移籍し、2023年のBrain・DeepMind統合以来の「二大陸体制」に終止符が打たれた。人材流出とジェミニ開発遅延への対応が急務。",
        "Anthropicは政府対応を強化し初代Chief Global Affairs Officerにティノ・クエヤール氏を起用(26/8)。「サプライチェーンリスク」指定差し止め訴訟には勝利した一方、対米ロビー活動費はNVIDIAを上回る水準に達するなど、政府との緊張関係は継続中。",
        "Metaは初のAIコーディングエージェント「Muse Code」を投入(26/8)しClaude Code・Codexに対抗。イリヤ・サツケバー氏のSSIにはNVIDIAが50億ドルを出資(26/7)するなど、フロンティアラボ間の資金・人材・製品を巡る競争は多方面で激化している。"
      ],
      week: "Google DeepMindが拠点をカリフォルニアへ集約／AnthropicがCuéllar氏を起用／MetaがMuse Codeを投入"
    },
    {
      id: "china",
      title: "中国オープンウェイト勢の追撃",
      tagline: "DeepSeek・Kimi・Qwen",
      question: "中国勢は米フロンティアにどこまで迫っているか",
      color: "#c8762a",
      updated: "2026-08-08",
      status: [
        "Moonshot AIは香港上場を視野に評価額500億ドルを目指すプレIPOラウンドを進行中(26/8)。Kimi K3効果でARRが急伸する一方、開発元Kimi K2.6は日本のSakana AIが日本語特化API「Sakana Namazu」の追加学習ベースに採用(26/8)するなど、中国オープンウェイトモデルの国際展開も進む。",
        "DeepSeekは新ラウンドの資金調達を一時停止するなど不透明感が残る一方、Alibabaの「Qwen3.8-Max」は2.4兆パラメータで正式発表されFable 5に匹敵する性能を主張。中国勢は性能競争に加え、長文処理・エージェント能力・低コストを軸にした実用面での差別化を強めている。",
        "米政府はMoonshotによるAnthropic「Fable」の蒸留疑惑を追及中で財務省が制裁を検討しているが、専門家からは疑義の声も根強い。米中間のAI技術・政策摩擦は資金調達やモデル配信の両面で続いている。"
      ],
      week: "Moonshot AIが評価額500億ドル目指しプレIPO開始／Kimi K2.6ベースにSakana Namazu提供開始"
    },
    {
      id: "japan",
      title: "日本の国産AI",
      tagline: "Noetra・Rapidus・Sakana",
      question: "日本は世界のAI供給網のどこに立とうとしているか",
      color: "#cf3b25",
      updated: "2026-08-08",
      status: [
        "秋田市に建設費2兆円規模・日本最大級となるAIデータセンター計画が浮上、UAEが投資する方向で協議中(26/8)。500メガワット級で洋上風力発電を電力源とする計画で、北海道・石狩のデータセンター連合に続き地方拠点での「コンピュート軍拡」参戦が相次ぐ。",
        "デジタル庁は政府AI「源内」でNTTデータ・富士通・PFNの国産LLM3種をさくらのクラウド上で試用開始(26/8)。Sakana AIは中国MoonshotのKimi K2.6を土台に日本語特化API「Sakana Namazu」を提供開始(26/8)するなど、「適応特化」型の国産AI戦略も広がる。",
        "経産省はAI・ロボット政策を一元化する新組織を設置(26/8)、Noetra(44社連合)を軸にしたフィジカルAI推進の司令塔機能を強化。実務レベルではワークマンが画像生成AI「NanoBanana」を商品訴求コンテンツ制作に導入(26/8)するなど、生成AIの現場浸透も着実に進んでいる。"
      ],
      week: "秋田に2兆円規模AIデータセンター計画／デジタル庁が国産LLM3種を試用開始／Sakana Namazu提供開始"
    },
    {
      id: "semi",
      title: "半導体サプライチェーン再編",
      tagline: "ファウンドリ・HBM・カスタムチップ",
      question: "AIチップの設計・製造・供給網はどう組み変わっているか",
      color: "#3d7a80",
      updated: "2026-08-08",
      status: [
        "SK GroupとNVIDIAは韓国に2GW級「AIクラウド」を構築する5,000億ドル超の提携拡大を推進中で、SK hynix製HBM4を搭載したVera Rubinを2027年に稼働させる計画。Micron・SK hynixのHBM4供給は2026年通期で完売状態が続いている。",
        "英国発の半導体新興OLIXが光を用いたAI推論チップ「DX-1」向けに3.12億ドルを調達(評価額33億ドル、26/8)、欧州の半導体スタートアップとして過去最大の資金調達となった。NVIDIA一強の推論チップ市場に光学コンピューティングという新たな選択肢が加わっている。",
        "パッケージング・製造装置を巡る囲い込みも継続。NVIDIAはAmkorへ15億ドルを投資、TSMCはアリゾナへの追加投資を進める一方、Rapidusは2nm半導体をTSMC並みの戦略価格で提供する交渉を60社超と継続中。"
      ],
      week: "OLIXが3.12億ドル調達／SK×NVIDIA提携拡大が進行／HBM4供給逼迫続く"
    },
    {
      id: "talent",
      title: "人材とラボの興亡",
      tagline: "移籍・買収・新ラボ",
      question: "トップ研究者と技術資産はどこへ動いているか",
      color: "#6b4f9e",
      updated: "2026-08-08",
      status: [
        "Google Brain共同創業者で27年在籍したジェフ・ディーン氏がGoogleを退社し、独立系公益法人「Discovery Loop」を設立(26/8)。GoogleのシニアフェローSanjay Ghemawat氏、DeepMind副社長Oriol Vinyals氏、Google Brain共同創業者Quoc Le氏も参加し、Google生え抜き重鎮の一斉離脱となった。",
        "AlphaFoldでノーベル賞受賞に貢献したJohn Jumper氏のAnthropic移籍後、AlphaFold専属チームは解体され著者の4分の1が退職(26/8)。Google DeepMindはコーディング統括ボルジョー氏もロンドンから米本社へ移籍するなど、拠点集約と人材流出が同時進行している。",
        "AnthropicはCarnegie Endowment前理事長のティノ・クエヤール氏を初代Chief Global Affairs Officerに起用(26/8)するなど、フロンティアラボ各社は政策・渉外の専門人材の獲得競争も強めている。「人材獲得＝企業買収」の動きは続き、開発ツール・ハード領域の買収合戦も継続中。"
      ],
      week: "Jeff Dean氏がGoogleを退社しDiscovery Loop設立／AlphaFold専属チーム解体、著者の4分の1退職／AnthropicがCuéllar氏を起用"
    }
  ]
};
