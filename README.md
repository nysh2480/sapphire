# SAPPHIRE ⬡ [EXPERIMENTAL]

**Scriptable Asset Processing Platform for Hybrid Integrated Runtime Environment**

> ⚠️ **注意: 本プロジェクトは実験的（EXPERIMENTAL）な段階にあります。**  
> アーキテクチャ、API、およびDSLの仕様は、開発の進展に伴い予告なく変更される可能性があります。

SAPPHIREは、ブラウザを「高度なメディア処理OS」へと変貌させることを目的とした、AIネイティブな軽量IDEおよび実行プラットフォームの実験的実装です。

WebCodecs, WebGPU, WASMといった現代のWebテクノロジーを最大限に引き出し、音響・映像・計算リソースを一つの論理的な環境に統合する新しい開発パラダイムを提案します。

## ⬡ コンセプト：AIと共に、思考の速度で構築する

SAPPHIREは、AIに膨大なコードを生成させるための場所ではありません。
AIが各拡張機能（EXT）に内蔵された仕様（DOC）を直接参照し、それらを軽量なDSL（Domain Specific Language）で「結線」することで、数分でプロフェッショナルなアプリケーションを組み上げるための**オーケストレーション環境**です。

## ⬡ ABCDストラクチャ：バッティングのない統合

システム全体を4つの役割に明確に分離することで、リソースの衝突を防ぎ、資産の再利用性を極大化します。

- **[A] Action (実行層)**: ユーザーが操作するUIや具体的な機能（DAW, Video Editor, etc.）
- **[B] Base (基盤層)**: 物理リソースの提供（SharedArrayBuffer, WASM, WebWorker, AudioContext）
- **[C] Control (管理層)**: 司令塔。入出力のルーティング、メモリ番地の割当、横断検索（FIND）
- **[D] Definition (定義層)**: システムの憲法。文法定義（BNF）、API仕様（DOC）、環境設定

## ⬡ 主な特徴

- **AI-Native Design**: 各EXTに内蔵された`sph/doc`（JSON）をAIが理解。ゼロショットでも極めて精度の高いコード生成とシステム構築が可能。
- **Scriptable Assets**: 音色、映像、ロジックを単なるコード片にせず、常に検索・再利用可能な「資産」として管理。
- **Zero-Copy Processing**: `CONNECT_EXT`によるメモリ番地管理により、巨大な映像フレームや音声バッファもコピーなしで高速処理。
- **Instant Deployment**: 開発したシステムは、必要なEXTとLIBをパッキングした「1枚のHTML（APP形式）」として即座に書き出し可能。
- **Unified MEDIA_MML**: 音楽（DAWMML）と映像（VIDEO_MML）を共通のタイムラインと文法で記述し、ミリ秒単位で同期。

## ⬡ 統合メディアワークステーションとして

SAPPHIREは、ライブ配信スタジオ、音声合成エンジン、映像編集ツール、インタラクティブ・アプリケーションといった境界を自由に飛び越えます。ブラウザを開くだけで、そこはあなたのパーソナル放送局であり、高度な開発室になります。

---

## ⬡ クイックスタート

1. `sapphire_ide.html` をブラウザで開く。
2. `MML_EXT` を使用して、1行のDAWMMLでトラックや映像レイヤーを生成。
3. AIに `sph/doc` を読み込ませ、新しいロジックやエフェクトをDSLで実装。
4. 「Export APP」を実行し、スタンドアロンのウェブアプリケーションとして配布。

---

**SAPPHIRE: 創造を、再び個人の手に。**
