import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCPサーバー | AIツール通信をClaudeやChatGPTから検索',
  description: 'AIツール通信の記事をMCP（Model Context Protocol）サーバーとして公開。Claude Desktop、ChatGPT、その他AIアシスタントから記事を検索・取得できます。',
}

export default function McpPage() {
  const claudeConfig = JSON.stringify({
    mcpServers: {
      "ai-tools-tsuushin": {
        url: "https://ai-tools-tsuushin.com/api/mcp"
      }
    }
  }, null, 2)

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'var(--accent)',
        padding: '3rem 0',
      }}>
        <div className="container-wide" style={{ padding: '0 1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-pink)',
            borderRadius: '6px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'white',
            marginBottom: '1rem',
          }}>
            MCP Server
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            AIツール通信 MCPサーバー
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.05rem',
            maxWidth: '600px',
            lineHeight: 1.7,
          }}>
            Claude Desktop、ChatGPTなどのAIアシスタントから<br />
            AIツール通信の記事をリアルタイムで検索・取得できます。
          </p>
        </div>
      </div>

      <div className="container-wide" style={{ padding: '2.5rem 1.25rem' }}>
        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}>
          {[
            { icon: '🔍', title: 'search_articles', desc: 'キーワードで記事を検索。カテゴリ絞り込み対応。' },
            { icon: '📄', title: 'get_article', desc: '指定した記事の全文を取得。' },
            { icon: '📋', title: 'list_articles', desc: '最新記事一覧を取得。カテゴリ絞り込み対応。' },
            { icon: '📁', title: 'get_categories', desc: 'カテゴリ一覧と説明を取得。' },
          ].map(tool => (
            <div key={tool.title} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{tool.icon}</div>
              <h3 style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '0.95rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'var(--accent-pink)',
              }}>{tool.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {tool.desc}
              </p>
            </div>
          ))}
        </div>

        {/* How to use */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="divider" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>使い方</span>
          </div>

          {/* Claude Desktop */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Claude Desktopに追加
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Claude Desktopの設定ファイルに以下を追加してください。
            </p>
            <div style={{
              background: 'var(--accent)',
              color: '#E4E4E7',
              padding: '1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              lineHeight: 1.6,
              overflowX: 'auto',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{claudeConfig}</pre>
            </div>
          </div>

          {/* OpenAI */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              OpenAI / その他のAI
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              エンドポイントに対してJSON-RPC 2.0でリクエストを送信してください。
            </p>
            <div style={{
              background: 'var(--accent)',
              color: '#E4E4E7',
              padding: '1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              lineHeight: 1.6,
              overflowX: 'auto',
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`POST /api/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_articles",
    "arguments": {
      "query": "画像生成AI",
      "limit": 3
    }
  }
}`}</pre>
            </div>
          </div>

          {/* API Discovery */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              API仕様（GET /api/mcp）
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              利用可能なツール一覧と接続情報を取得できます。
            </p>
            <div style={{
              background: 'var(--accent)',
              color: '#E4E4E7',
              padding: '1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              lineHeight: 1.6,
              overflowX: 'auto',
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`GET /api/mcp
→ ツール一覧・接続情報を返す

POST /api/mcp
→ JSON-RPC 2.0 でツール呼び出し
  - initialize
  - tools/list
  - tools/call
  - ping`}</pre>
            </div>
          </div>
        </section>

        {/* Example */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="divider" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>使用例</span>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
              Claude Desktopでの使用例:
            </p>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              lineHeight: 1.8,
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>User:</strong> 最新のAIコーディングツールを教えて
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                <strong style={{ color: 'var(--accent-pink)' }}>Claude:</strong> AIツール通信を検索します...
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                → <code style={{
                  background: 'white',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                }}>search_articles(query="コーディングツール AI", category="compare")</code>
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                → 記事「2026年版AIコーディングツール比較：Cursor vs Claude Code vs Windsurf vs GitHub Copilot」を取得し、要約して回答。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
