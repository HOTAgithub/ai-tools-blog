import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from '@/lib/articles'

// MCP Tool Definitions
const TOOLS = [
  {
    name: 'search_articles',
    description: 'AIツール通信の記事をキーワードで検索。最新のAIツール情報・レビュー・比較記事を探す。日本語と英語両方のキーワードで検索可能。',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索キーワード（例: "ChatGPT", "画像生成", "Claude Code"）',
        },
        category: {
          type: 'string',
          enum: ['review', 'news', 'compare', 'tutorial'],
          description: 'カテゴリで絞り込み（省略可）',
        },
        limit: {
          type: 'number',
          description: '最大取得件数（デフォルト: 5）',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_article',
    description: '指定した記事の全文を取得する。',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: '記事のスラグ（例: "best-free-ai-tools-2026-guide"）',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_articles',
    description: 'AIツール通信の最新記事一覧を取得。カテゴリで絞り込み可能。',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['review', 'news', 'compare', 'tutorial'],
          description: 'カテゴリで絞り込み（省略可）',
        },
        limit: {
          type: 'number',
          description: '最大取得件数（デフォルト: 10）',
        },
      },
    },
  },
  {
    name: 'get_categories',
    description: '利用可能なカテゴリ一覧とそれぞれの説明を取得する。',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
]

const CATEGORY_INFO: Record<string, { label: string; description: string }> = {
  review: { label: 'レビュー', description: 'AIツールの詳細レビュー・使い方解説' },
  news: { label: 'ニュース', description: 'AI業界の最新ニュース・リリース情報' },
  compare: { label: '比較', description: '人気AIツールの徹底比較記事' },
  tutorial: { label: 'チュートリアル', description: 'AIツールの具体的な使い方・活用術' },
}

function searchArticles(query: string, category?: string, limit: number = 5) {
  let articles = getAllArticles()
  
  if (category) {
    articles = articles.filter(a => a.category === category)
  }

  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(/\s+/)
  
  const scored = articles.map(article => {
    let score = 0
    const searchFields = [
      article.title.toLowerCase(),
      article.description.toLowerCase(),
      article.content.toLowerCase(),
      ...article.tags.map(t => t.toLowerCase()),
    ].join(' ')

    keywords.forEach(kw => {
      if (article.title.toLowerCase().includes(kw)) score += 10
      if (article.description.toLowerCase().includes(kw)) score += 5
      if (article.tags.some(t => t.toLowerCase().includes(kw))) score += 8
      if (searchFields.includes(kw)) score += 3
    })

    // 新しい記事を少し優遇
    const daysSince = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 5 - daysSince * 0.1)

    return { article, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => ({
      title: s.article.title,
      slug: s.article.slug,
      description: s.article.description,
      category: s.article.category,
      tags: s.article.tags,
      publishedAt: s.article.publishedAt,
      url: `https://ai-tools-tsuushin.com/article/${s.article.slug}`,
    }))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle MCP initialization
    if (body.method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || 1,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'ai-tools-tsuushin',
            version: '1.0.0',
          },
        },
      })
    }

    // Handle tool listing
    if (body.method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || 1,
        result: { tools: TOOLS },
      })
    }

    // Handle tool calls
    if (body.method === 'tools/call') {
      const toolName = body.params?.name
      const args = body.params?.arguments || {}

      let result: any

      switch (toolName) {
        case 'search_articles': {
          const articles = searchArticles(args.query, args.category, args.limit || 5)
          result = {
            content: [{
              type: 'text',
              text: articles.length > 0
                ? `${articles.length}件見つかりました:\n\n${articles.map((a, i) => `### ${i + 1}. ${a.title}\n- カテゴリ: ${CATEGORY_INFO[a.category]?.label || a.category}\n- ${a.description}\n- タグ: ${a.tags.map(t => '#' + t).join(' ')}\n- URL: ${a.url}\n`).join('\n')}`
                : '条件に一致する記事が見つかりませんでした。',
            }],
          }
          break
        }

        case 'get_article': {
          const article = getArticleBySlug(args.slug)
          if (!article) {
            result = {
              content: [{ type: 'text', text: `記事 "${args.slug}" が見つかりませんでした。` }],
              isError: true,
            }
          } else {
            result = {
              content: [{
                type: 'text',
                text: `# ${article.title}\n\n**カテゴリ**: ${CATEGORY_INFO[article.category]?.label || article.category}\n**投稿日**: ${new Date(article.publishedAt).toLocaleDateString('ja-JP')}\n**タグ**: ${article.tags.join(', ')}\n\n---\n\n${article.content}`,
              }],
            }
          }
          break
        }

        case 'list_articles': {
          let articles = getAllArticles()
          if (args.category) {
            articles = articles.filter(a => a.category === args.category)
          }
          articles = articles.slice(0, args.limit || 10)
          result = {
            content: [{
              type: 'text',
              text: `最新${articles.length}件の記事:\n\n${articles.map((a, i) => `${i + 1}. **${a.title}**\n   - カテゴリ: ${CATEGORY_INFO[a.category]?.label}\n   - ${a.description}\n   - URL: https://ai-tools-tsuushin.com/article/${a.slug}`).join('\n\n')}`,
            }],
          }
          break
        }

        case 'get_categories': {
          result = {
            content: [{
              type: 'text',
              text: Object.entries(CATEGORY_INFO).map(([key, val]) => `- **${val.label}** (${key}): ${val.description}`).join('\n'),
            }],
          }
          break
        }

        default:
          result = {
            content: [{ type: 'text', text: `不明なツール: ${toolName}` }],
            isError: true,
          }
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || 1,
        result,
      })
    }

    // Handle notifications (ping, etc.)
    if (body.method === 'ping') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || 1,
        result: {},
      })
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id || 1,
      error: { code: -32601, message: 'Method not found' },
    })
  } catch (error) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32603, message: 'Internal error', data: String(error) },
    })
  }
}

// Also support GET for discovery
export async function GET() {
  return NextResponse.json({
    name: 'AIツール通信 MCP Server',
    version: '1.0.0',
    description: '日本のAIツール情報メディア「AIツール通信」の記事を検索・取得できるMCPサーバー。',
    endpoint: '/api/mcp',
    transport: 'HTTP POST (JSON-RPC 2.0)',
    tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
    usage: {
      claude: {
        claude_desktop_config: {
          mcpServers: {
            'ai-tools-tsuushin': {
              url: 'https://ai-tools-tsuushin.com/api/mcp',
            },
          },
        },
      },
      openai: 'OpenAI Custom GPT or agent tool calling with this endpoint.',
    },
  })
}
