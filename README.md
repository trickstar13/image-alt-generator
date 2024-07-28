# 私の alt 生成ちゃん

このプロジェクトは、画像の Alt（代替）テキストを自動生成するウェブアプリケーションです。Anthropic 社の Claude API を使用して、アップロードされた画像の内容を分析し、適切な Alt テキストを日本語で生成します。

## 主な機能

- 画像のアップロードとプレビュー表示
- Alt テキストの自動生成
- 生成された Alt テキストのコピー機能
- API リクエストにかかったコストの表示

## 技術スタック

- フロントエンド: Astro / React.js
- スタイリング: Tailwind CSS
- 画像処理: sharp
- API: Anthropic Claude API

## セットアップ

リポジトリをクローンします。
必要な依存関係をインストールします：

```sh
npm i
```

.env ファイルを作成し、Anthropic API キーを設定します：

```text
ANTHROPIC_API_KEY=your_api_key_here
```

アプリケーションを起動します：

```sh
npm run dev
```

Vercel にデプロイする場合は、環境変数として `ANTHROPIC_API_KEY` を設定してください。

## 使用方法

「ファイルを選択」ボタンをクリックして画像をアップロードします。
「alt を生成」ボタンをクリックして Alt テキストを生成します。
生成された Alt テキストが表示されます。
「コピー」ボタンをクリックして Alt テキストをクリップボードにコピーできます。
生成にかかったコストも表示されます。

## ファイル構成

src/pages/api/generate-alt.js: Alt テキスト生成のための API エンドポイント
src/components/ImageUpload.jsx: 画像アップロードと Alt テキスト生成のための React コンポーネント

## 注意事項

このアプリケーションは、Anthropic 社の Claude API を使用しています。API の利用には料金が発生する場合があります。
生成された Alt テキストは自動生成されたものであり、必要に応じて手動で調整することをお勧めします。
