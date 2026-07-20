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
  updated: "2026-07-20",
  threads: [
    {
      id: "compute",
      title: "コンピュート軍拡",
      tagline: "計算資源の確保競争",
      question: "誰が・どこから・どれだけ計算資源を確保しているか",
      color: "#2d5d8e",
      updated: "2026-07-20",
      status: [
        "OpenAIは調達した1,220億ドル超の大半を計算資源に投下。Microsoft独占を解消し（26/4）、Oracle・AMD・Broadcom・Cerebras・AWS（Trainium約2GW）・SB Energyへ分散発注する「マルチクラウド軍拡」に移行した。",
        "AnthropicはAzure 300億ドル・Google TPU複数GW・AWS Trainium最大5GW・Broadcom共同開発に加え、TeraWulfと20年190億ドル（401MW）の専用DCリース、SpaceX経由で月12.5億ドル規模のGPU確保（報道）と三正面を超える調達網を築いた。",
        "供給側の台風の目はNebius（Meta 5年270億ドル・Reflection 10億ドル超・NVIDIA 20億ドル出資）。Meta Compute（余剰算力の外販）も始動し、ネオクラウドとハイパースケーラーの境界が曖昧になり始めている。"
      ],
      week: "Anthropic×TeraWulf 190億ドルDC契約／Meta Compute始動／NoetraがRubin 2.75万基を独占確保"
    },
    {
      id: "labs",
      title: "フロンティアラボの資金・勢力図",
      tagline: "マネーゲームと合従連衡",
      question: "どのラボに誰の資金が入り、勢力図はどう動いているか",
      color: "#3a7a4e",
      updated: "2026-07-20",
      status: [
        "OpenAIは26年2月に1,220億ドル調達を完了（NVIDIA 300・Amazon 500・SoftBank累計700など）。Microsoft持分は約27%で、独占提携から「複数の巨人が相乗りする構図」へ変わった。機密S-1提出済みでIPO準備中。",
        "Anthropicは評価額9,650億ドルのシリーズH（650億ドル）を実施。Google（最大400）・Amazon（累計最大330）・Microsoft・NVIDIAに加え、Samsung・SK hynix・Micron・MGXが戦略投資家として参加し、全ハイパースケーラー＋半導体勢から資金を集める全方位戦略が完成した。",
        "xAIはSpaceXに吸収合併されIPO（評価額最大1.75兆ドル規模）。UAEのMGXはファンドIを490億ドルでクローズし、OpenAI・Anthropic・xAIの3社すべてに出資するなど中東国家資本の存在感が急拡大している。"
      ],
      week: "Anthropic Series HにSamsung・SK hynix・Micronが戦略参加していたことが製造契約報道で再確認"
    },
    {
      id: "china",
      title: "中国オープンウェイト勢の追撃",
      tagline: "DeepSeek・Kimi・Qwen",
      question: "中国勢は米フロンティアにどこまで迫っているか",
      color: "#c8762a",
      updated: "2026-07-20",
      status: [
        "Moonshot AIが2.8兆パラメータのMoE「Kimi K3」を発表（26/7/16）。オープンウェイトで米フロンティア級を主張し「第2のDeepSeekショック」と報道。先立つKimi K2.7 CodeはGitHub Copilotに採用され、米大手開発ツールに中国オープンウェイトが乗った。",
        "DeepSeekはTencent主導・CATL参加で初の外部調達74億ドル（評価額最大590億ドル）。「低コストで西側に肉薄する」中国勢のパターンが資本面でも本格化した。",
        "国家側は2,950億ドルのAIデータセンター網でNvidia排除・国産チップ80%（Huawei等）を掲げ、CACは擬人化AI規制でDoubao・Qwenのコンパニオン機能を停止。モデル性能・資本・インフラ・規制が同時に動いている。"
      ],
      week: "Kimi K3発表＋Kimi K2.7がGitHub Copilot採用──西側開発ツールへの浸透が加速"
    },
    {
      id: "japan",
      title: "日本の国産AI",
      tagline: "Noetra・Rapidus・Sakana",
      question: "日本は世界のAI供給網のどこに立とうとしているか",
      color: "#cf3b25",
      updated: "2026-07-20",
      status: [
        "ソフトバンク・ソニーG・NEC・ホンダを中核とする44社連合が国産AI基盤「Noetra」を設立（26/7/16）。経産省が5年最大1兆円を支援し、NVIDIA Rubin約2.75万基を独占導入して2028年6月稼働を目指す。狙いはロボット・自動運転などのフィジカルAI。",
        "計算基盤はNVIDIA依存のままという構造矛盾を抱えつつ、半導体側ではRapidus×IBMの2nm提携と、Micron広島の1.5兆円拡張（経産省最大5,360億円支援）が並走。ロジックとメモリの両輪で「供給網の結節点」を狙う。",
        "Sakana AIは評価額約4,000億円（シリーズB）に達し、SB OAI Japan（OpenAI×ソフトバンク）も企業向け展開中。国・通信・研究・製造の四方向が同時に動いている。"
      ],
      week: "Noetra発足（44社・経産省1兆円）＋Micron広島1.5兆円着工──国産AIとメモリ増産が同時進行"
    },
    {
      id: "semi",
      title: "半導体サプライチェーン再編",
      tagline: "ファウンドリ・HBM・カスタムチップ",
      question: "AIチップの設計・製造・供給網はどう組み変わっているか",
      color: "#3d7a80",
      updated: "2026-07-20",
      status: [
        "TSMC一強に風穴が開き始めた。GoogleがIntel FoundryにTPU 300万個超を発注（報道）、AnthropicはSamsung 2nmでカスタム推論チップ製造を決定。IntelはASML High-NA EUVで18Aの業界初量産出荷を達成した。",
        "カスタムチップ開発も加速。OpenAI×Broadcom（Jalapeño・TSMC製造）・Anthropic×Broadcom／Samsung、Amazon Trainium（Anthropic 5GW・OpenAI 2GW）が進み、QualcommはHBCでMeta・Azureを早期顧客に、Tenstorrentは80〜100億ドル買収交渉中（未確定）。",
        "HBMではNVIDIA×SK hynixが次世代共同開発、Micronは広島で増産、SK hynixはNasdaq ADR上場（最大280億ドル）。一方Meta Compute発表を契機にAI半導体株が急落し、「需要は無限」前提が揺らいだ。"
      ],
      week: "Anthropic×Samsung 2nm製造契約／Intel High-NA量産／TSMCアリゾナ追加1,000億ドル"
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
      week: "AppleがOpenAIを営業秘密で提訴（Tang Tan問題）──人材流動が法廷闘争に発展"
    }
  ]
};
