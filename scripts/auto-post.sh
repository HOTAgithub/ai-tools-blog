#!/bin/bash
# AIツール自動記事生成スクリプト
# 毎日実行して、最新AIニュースに基づいて記事を自動投稿する
# 使い方: bash scripts/auto-post.sh

SITE_URL="${SITE_URL:-http://localhost:3099}"
API_KEY="${POST_API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "POST_API_KEY が設定されていません"
  exit 1
fi

# 実際の記事生成はHermesのcronjobが行う
# このスクリプトはAPI経由の投稿テスト用

echo "記事自動投稿スクリプト"
echo "SITE_URL: $SITE_URL"
echo "日時: $(date '+%Y-%m-%d %H:%M:%S')"
