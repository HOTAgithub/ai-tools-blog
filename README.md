# AIツール通信

毎日更新のAIツール情報サイト。最新のAIサービス、ツールのレビュー、比較、使い方を網羅。

## 概要

- **フレームワーク**: Next.js 15 (App Router, TypeScript, Tailwind CSS 4)
- **記事データ**: JSONファイルベース (`data/articles.json`)
- **自動化**: Hermes cronjobで毎日9時に記事を自動生成・投稿
- **SEO**: 動的sitemap, robots.txt, OGP対応
- **広告**: AdSense枠設置済み（広告コード差し替えで有効化）

## ローカル開発

```bash
cd ai-tools-blog
npm install
npm run dev
```

http://localhost:3000 で確認

## 記事の追加

### 手動追加
`data/articles.json` にJSONを追加してビルドし直す。

### API経由
```
POST /api/post
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "title": "記事タイトル",
  "content": "Markdown本文",
  "category": "news",
  "tags": ["tag1", "tag2"],
  "description": "記事概要"
}
```

### 自動生成
cronjobが毎日9時に最新AIニュースを検索して記事を自動投稿します。

## デプロイ

### Vercel (推奨)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t ai-tools-blog .
docker run -p 3000:3000 ai-tools-blog
```

## 収益化

- Google AdSense: 広告スロット (`ad-slot` class) にAdSenseコードを設置
- Amazonアフィリエイト: 記事内にリンク挿入
