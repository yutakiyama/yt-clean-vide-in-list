# yt-clean-video-in-list

YouTubeのプレイリスト内の動画を一括削除するChrome拡張機能

> ⚠️ **注意**: この拡張機能は現在 **日本語版YouTube** でのみ動作します。

## 機能

- YouTubeのプレイリスト画面で、すべての動画を一括削除
- 「後で見る」リストにも対応
- 確認ダイアログで誤操作を防止
- 削除の進捗状況をリアルタイム表示

## スクリーンショット

![popup](./docs/screenshot.png)

## インストール

### Chrome Web Store（準備中）

<!-- Chrome Web Storeに公開後、リンクを追加 -->

### 手動インストール

1. このリポジトリをクローン
   ```bash
   git clone https://github.com/yutakiyama/yt-clean-vide-in-list.git
   cd yt-clean-vide-in-list
   ```

2. 依存関係をインストールしてビルド
   ```bash
   npm install
   npm run build
   ```

3. Chromeで拡張機能を読み込み
   - `chrome://extensions/` を開く
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist/` フォルダを選択

## 使い方

1. YouTubeのプレイリスト画面にアクセス
   - 例: `https://www.youtube.com/playlist?list=WL`（後で見る）
2. 拡張機能アイコンをクリック
3. 「すべての動画を削除」ボタンをクリック
4. 確認ダイアログで「OK」を選択
5. 動画が順次削除されます

## 開発

### 必要な環境

- Node.js 18以上
- npm

### コマンド

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# テスト実行
npm run test

# リント
npm run lint

# フォーマット
npm run format
```

### プロジェクト構成

```
├── src/
│   ├── manifest.json      # Chrome拡張設定（Manifest V3）
│   ├── popup/             # ポップアップUI
│   ├── content/           # Content Script
│   ├── utils/             # ユーティリティ関数
│   └── types/             # TypeScript型定義
├── tests/                 # テストファイル
├── icons/                 # アイコン画像
└── dist/                  # ビルド出力
```

## 技術スタック

- TypeScript
- esbuild
- Vitest
- ESLint + Prettier

## ライセンス

[MIT License](./LICENSE)

## コントリビューション

コントリビューションを歓迎します！詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

## 作者

[@yutakiyama](https://github.com/yutakiyama)
