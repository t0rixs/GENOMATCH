# Best Match - Genetic Matching App Mockup

このプロジェクトは、遺伝的適合性に基づいたマッチングアプリのプロトタイプです。
React, TypeScript, Vite, Tailwind CSS, Framer Motionを使用して構築されています。

## 機能概要

- **スワイプUI**: Tinder風のカードスワイプインターフェース（右でLike、左でPass）。
- **詳細ビュー**: カードをタップすると詳細情報が表示されます。
- **レーダーチャート**: 「遺伝的適合性 (Genetic Compatibility)」を可視化。
- **未来的なデザイン**: ダークモードを基調とした、ガラスモーフィズムと鮮やかなグラデーション。

## 始め方

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## ファイル構成

- `src/App.tsx`: メインアプリケーションロジック。
- `src/components/Card.tsx`: スワイプ可能なカードコンポーネント。
- `src/components/DetailView.tsx`: 詳細画面とレーダーチャート。
- `src/components/Header.tsx`: アプリヘッダー。
- `src/data/profiles.json`: モックデータ。

## デザインのポイント

- **Tailwind CSS**: ユーティリティファーストなスタイリング。
- **Framer Motion**: スムーズなアニメーションとジェスチャー操作。
- **Recharts**: レーダーチャートの実装。
