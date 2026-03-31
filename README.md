# SAPPHIRE ⬡

**Scriptable Asset Processing Platform for Hybrid Integrated Runtime Environment**

SAPPHIREは、ブラウザを「次世代のメディア処理OS」へと変貌させる、AIネイティブな軽量IDEおよび実行プラットフォームです。

かつてのホビーPC（MSX）の自由さと、HyperCardの直感的な創造性を、現代のWeb技術（WebCodecs, WebGPU, WASM）とAIの知能によって再構築しました。

## ⬡ コンセプト：AIと共に、思考の速度で創る

SAPPHIREは、AIに数千行のコードを書かせる場所ではありません。
AIが拡張機能（EXT）の仕様（DOC）を理解し、それらをDSL（Domain Specific Language）で「結線」することで、数分でプロ級のアプリケーションを組み上げるための**オーケストレーション環境**です。

## ⬡ ABCDストラクチャ：バッティングのない統合

システム全体を4つの役割に明確に分離することで、リソースの衝突を防ぎ、資産の再利用性を極大化します。

- **[A] Action (実行層)**: ユーザーが操作するUIや具体的な機能（DAW, Video Editor, etc.）
- **[B] Base (基盤層)**: 物理リソースの提供（SharedArrayBuffer, WASM, WebWorker, AudioContext）
- **[C] Control (管理層)**: 司令塔。入出力のルーティング、メモリ番地の割当、横断検索（FIND）
- **[D] Definition (定義層)**: システムの憲法。文法定義（BNF）、API仕様（DOC）、環境設定

## ⬡ 主な特徴

- **AI-Native Design**: 各EXTに内蔵された`sph/doc`（JSON）をAIが参照。ゼロショットでも極めて精度の高いコード生成が可能。
- **Scriptable Assets**: 音色、映像、ロジックを「死蔵コード」にせず、常に検索・再利用可能な「資産」として管理。
- **Zero-Copy Processing**: `CONNECT_EXT`によるメモリ番地管理により、巨大な映像・音声データもコピーなしで高速処理。
- **Instant Deployment**: 作成したアプリは、必要なEXTとLIBをパッキングした「1枚のHTML（APP形式）」として即座に書き出し可能。
- **Unified MEDIA_MML**: 音楽（DAWMML）と映像（VIDEO_MML）を共通のタイムラインと文法で記述・同期。

## ⬡ 21世紀のMSXとして

SAPPHIREは、ゲーム開発、ライブ配信スタジオ、音声合成、映像編集といった境界を飛び越えます。ブラウザを開くだけで、そこはあなたのパーソナル放送局であり、開発室になります。

---

## ⬡ クイックスタート

1. `sapphire_ide.html` をブラウザで開く。
2. `MML_EXT` で1行のDAWMMLを入力し、トラックを生成。
3. AIに `sph/doc` を読み込ませ、新しい機能をDSLで実装。
4. 「Export APP」で自分だけのスタンドアロンアプリを配布。

---

**SAPPHIRE: 創造を、再び個人の手に。**
