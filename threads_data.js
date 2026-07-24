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
  updated: "2026-07-25",
  threads: [
    {
      id: "compute",
      title: "コンピュート軍拡",
      tagline: "計算資源の確保競争",
      question: "誰が・どこから・どれだけ計算資源を確保しているか",
      color: "#2d5d8e",
      updated: "2026-07-25",
      status: [
        "OpenAIは2030年までの計算投資見通しを7,500億ドルへ上方修正(26/7/24)。ジョージア州に200億ドルの新データセンター「Project Camellia」も表明したが、自社CFOが支払い能力への懸念を口にするなど、投資規模と資金繰りのギャップが焦点になっている。",
        "Anthropicは既存のAzure・Google TPU・AWS Trainium・TeraWulf・SpaceX網に加え、AMDと最大50億ドル・Instinct MI450最大2GWの調達＋出資契約を締結(26/7/22)。Nvidia一極依存からの脱却をさらに進めた。",
        "供給側ではNVIDIAがNebiusへの出資比率を9.3%（評価額約50億ドル相当）に拡大(26/7/21開示)。Meta・Reflection AIに続き、資本と供給契約の両輪でネオクラウドとの結びつきを深めている。"
      ],
      week: "AMD×Anthropic最大50億ドル・MI450 2GW契約／NVIDIAがNebius出資比率9.3%に拡大／OpenAI計算投資予測7,500億ドルへ上方修正"
    },
    {
      id: "labs",
      title: "フロンティアラボの資金・勢力図",
      tagline: "マネーゲームと合従連衡",
      question: "どのラボに誰の資金が入り、勢力図はどう動いているか",
      color: "#3a7a4e",
      updated: "2026-07-25",
      status: [
        "Anthropicは新モデル「Claude Opus 5」を投入(26/7/24)。最上位モデル「Fable 5」の半額の価格で複数ベンチマークを上回る性能を示し、IPO準備を進める中でコストパフォーマンスを前面に出す戦略を明確にした。",
        "AMDがAnthropicへ導入実績連動で最大50億ドルを投資(26/7/22)。Google・Amazon・Microsoft・NVIDIAに加えSamsung・SK hynix・Micron・MGXが参加したシリーズHに続き、半導体大手からの資金流入がさらに広がっている。",
        "xAIはSpaceXに吸収合併されIPO準備中、UAEのMGXは3ラボ全てに出資する構図が継続。一方で米政府は中国Moonshotが「Kimi K3」開発でAnthropicの「Fable」を大規模蒸留したと非難(26/7/22)しており、専門家の疑義も相次ぐ中で米中摩擦の新たな火種となっている。"
      ],
      week: "AMD、Anthropicへ最大50億ドル出資／Claude Opus 5投入／米政府がMoonshotのFable蒸留を非難"
    },
    {
      id: "china",
      title: "中国オープンウェイト勢の追撃",
      tagline: "DeepSeek・Kimi・Qwen",
      question: "中国勢は米フロンティアにどこまで迫っているか",
      color: "#c8762a",
      updated: "2026-07-25",
      status: [
        "Moonshot AIは「Kimi K3」の完全なモデルウェイトを7/27にHugging Faceで公開すると表明（26/7/24）。需要急増によるGPU逼迫を理由とした新規契約の一時停止（26/7/22）と並行しており、需要吸収の狙いも指摘される。米政府はKimi K3の開発でAnthropicの「Fable」を大規模蒸留したと非難（26/7/22）したが、専門家からは疑義の声も相次ぐ。",
        "AlibabaはQwen3.8-Max（2.4兆パラメータ）のプレビューを公開しオープンウェイト化を予告（26/7/21）、DeepSeekは独自の推論用AIチップ開発に着手していることも判明（26/7/23）。フロンティア級性能の追求と自国産シリコンへの転換を同時に進めている。",
        "身体性AI（エンボディドAI）でも中国勢の資金流入が加速。上海PsiBotは自動車大手CheryとLens Technologyの出資で評価額14.8億ドルに到達（26/7/23）、中国の身体性AI分野は2026年上半期だけで約155億ドルを調達し前年比5倍に拡大した。"
      ],
      week: "Kimi K3フルウェイト7/27公開へ／DeepSeekが独自推論チップ開発中と判明／PsiBotが評価額14.8億ドルに到達"
    },
    {
      id: "japan",
      title: "日本の国産AI",
      tagline: "Noetra・Rapidus・Sakana",
      question: "日本は世界のAI供給網のどこに立とうとしているか",
      color: "#cf3b25",
      updated: "2026-07-25",
      status: [
        "ソフトバンク・ソニーG・NEC・ホンダを中核とする44社連合が国産AI基盤「Noetra」を設立（26/7/16）。経産省が5年最大1兆円を支援し、NVIDIA Rubin約2.75万基を独占導入して2028年6月稼働を目指す。狙いはロボット・自動運転などのフィジカルAI。",
        "Rapidusは2nm半導体をTSMC並みかそれ以下の価格（1枚3万〜3.5万ドル）で提供する戦略価格を打ち出し（26/7/21）、60社超と商談中と説明。2027年後半の量産開始に向け価格競争力の訴求を強めている。",
        "ソフトバンクはコンテンツ権利保護とAI学習データへの対価還元を両立するデータ基盤「GaranAI」のベータ提供を開始（26/7/23）、共同通信・産経新聞などメディア各社が参画。NVIDIAとトヨタもフィジカルAI・モビリティ分野での協業を拡大（26/7/21）しており、計算基盤はNVIDIA依存のままという構造は変わっていない。"
      ],
      week: "Rapidusが2nm戦略価格を発表／ソフトバンクGaranAIベータ開始／NVIDIA×トヨタがフィジカルAI協業拡大"
    },
    {
      id: "semi",
      title: "半導体サプライチェーン再編",
      tagline: "ファウンドリ・HBM・カスタムチップ",
      question: "AIチップの設計・製造・供給網はどう組み変わっているか",
      color: "#3d7a80",
      updated: "2026-07-25",
      status: [
        "AMDは年次イベント「Advancing AI 2026」でTSMC 2nm量産のEPYC「Venice」とHBM4 31TB搭載「Instinct MI455X」を発表（26/7/22）、Meta・Microsoft・Oracle・OpenAIが採用を表明した。推論専用ASICのEtchedもSequoia主導で3億ドルを調達し評価額103億ドルに倍増（26/7/23）、SK hynixも新規投資家として参加した。",
        "パッケージング（後工程）の囲い込みも本格化。NVIDIAはAmkorに15億ドルを投資し米国内の先端パッケージング能力を拡張（26/7/23）、TSMC依存の低減と地政学リスクへの備えを進めている。",
        "NVIDIAのH200が対中輸出を開始した（26/7/22、認可枠10億ドル超）一方、DeepSeekは独自の推論用AIチップ開発に着手（26/7/23）していることも判明。SK hynixはHBM4よりDDR5を優先する生産シフト（26/7/20）を進めるなど、需要動向を巡る駆け引きも続いている。"
      ],
      week: "Etchedが評価額103億ドルに倍増／NVIDIA×Amkorが15億ドルのパッケージング投資／AMD Advancing AIでMI455X発表"
    },
    {
      id: "talent",
      title: "人材とラボの興亡",
      tagline: "移籍・買収・新ラボ",
      question: "トップ研究者と技術資産はどこへ動いているか",
      color: "#6b4f9e",
      updated: "2026-07-20",
      status: [
        "Google DeepMindからの頭脳流出が止まらない。ノーベル賞受賞者John JumperがAnthropicへ、『Attention Is All You Need』共著者Noam ShazeerがOpenAIへ。DeepMind卒業生のReflection AIは評価額80億ドルに成長し、計算資源をNebius・SpaceXで囲い込んだ。",
        "Yann LeCunはMetaを離れAMI Labsを創業（シード10.3億ドル）。MetaはScale AI創業者Alexandr Wangを143億ドルのディールで迎え超知能ラボを設立。「人材獲得＝企業買収」が常態化した。",
        "開発ツールとハードの買収合戦も進行。SpaceXがCursorを600億ドルで買収、AnthropicはStainless・Coefficient Bioを、OpenAIはAstralとio Products（Jony Ive）を取得。後者を巡りAppleがTang Tan氏の移籍問題でOpenAIを提訴した。"
      ],
      week: null
    }
  ]
};
