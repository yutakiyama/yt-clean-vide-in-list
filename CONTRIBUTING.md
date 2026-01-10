# コントリビューションガイド

このプロジェクトへのコントリビューションを歓迎します！

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yutakiyama/yt-clean-vide-in-list.git
cd yt-clean-vide-in-list

# 依存関係をインストール
npm install

# ビルド
npm run build

# テスト
npm run test
```

## コードスタイル

- ESLint と Prettier を使用しています
- コミット前に以下を実行してください：
  ```bash
  npm run lint
  npm run format
  ```

## プルリクエストの手順

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## Issue の報告

バグや機能リクエストは [Issues](https://github.com/yutakiyama/yt-clean-vide-in-list/issues) から報告してください。

### バグ報告の際に含めてほしい情報

- Chrome のバージョン
- 拡張機能のバージョン
- 問題の再現手順
- 期待する動作と実際の動作

## ライセンス

コントリビューションは MIT License の下で提供されます。
