import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AIツール通信 | 最新AIツールのレビュー・比較・ニュース',
    template: '%s | AIツール通信',
  },
  description: '毎日更新のAIツール情報メディア。最新のAIサービス、ツールのレビュー、比較、使い方を網羅。ChatGPT、Claude、画像生成AIなど。',
  keywords: 'AIツール,ChatGPT,AI,人工知能,画像生成,ChatGPT使い方,AI比較,AIレビュー',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'AIツール通信',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.85)',
        }}>
          <div className="container-wide" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}>
            <a href="/" style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '-0.03em',
            }}>
              <span style={{
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>AI</span>
              ツール通信
            </a>
            <nav style={{
              display: 'flex',
              gap: '1.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              <a href="/">ホーム</a>
              <a href="/category/review">レビュー</a>
              <a href="/category/news">ニュース</a>
              <a href="/category/compare">比較</a>
              <a href="/category/tutorial">チュートリアル</a>
              <a href="/mcp" style={{ color: 'var(--accent-pink)', fontWeight: 600 }}>MCP</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer style={{
          background: 'var(--accent)',
          color: 'rgba(255,255,255,0.7)',
          padding: '3rem 0',
          marginTop: '4rem',
        }}>
          <div className="container-wide" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            flexWrap: 'wrap',
            gap: '2rem',
          }}>
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{
                  background: 'var(--accent-pink)',
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>AI</span>
                ツール通信
              </div>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', lineHeight: 1.6 }}>
                最新のAIツール・サービスを毎日レビュー・比較。あなたに最適なAIツールを見つけるメディア。
              </p>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem' }}>カテゴリ</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <a href="/category/review" style={{ color: 'inherit' }}>レビュー</a>
                  <a href="/category/news" style={{ color: 'inherit' }}>ニュース</a>
                  <a href="/category/compare" style={{ color: 'inherit' }}>比較</a>
                  <a href="/category/tutorial" style={{ color: 'inherit' }}>チュートリアル</a>
                </div>
              </div>
            </div>
          </div>
          <div className="container-wide" style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <span>© 2026 AIツール通信</span>
            <span>毎日更新</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
