import { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'AIツール通信 | 最新AIツールのレビュー・比較・ニュース',
  description: '毎日更新のAIツール情報メディア。ChatGPT、Claude、画像生成AIなど最新のAIサービスをレビュー・比較。',
}

const CATEGORY_CONFIG: Record<string, { label: string; class: string }> = {
  review: { label: 'レビュー', class: 'cat-review' },
  news: { label: 'ニュース', class: 'cat-news' },
  compare: { label: '比較', class: 'cat-compare' },
  tutorial: { label: 'チュートリアル', class: 'cat-tutorial' },
}

export default function Home() {
  const articles = getAllArticles()
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--accent)',
        padding: '4rem 0 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--accent-pink)',
          opacity: 0.15,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '30%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'var(--accent-pink)',
          opacity: 0.1,
        }} />

        <div className="container-wide" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '0.3rem 0.8rem',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              毎日更新
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'white',
              marginBottom: '1rem',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
            }}>
              AIツール通信
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              最新のAIツール・サービスを毎日レビュー・比較。<br />
              あなたに最適なAIツールが見つかります。
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/category/news" className="btn-pink">最新ニュース</Link>
              <Link href="/category/compare" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>比較記事</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-wide" style={{ padding: '2.5rem 1.25rem' }}>
        {/* Featured Article */}
        {featured && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="divider" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>最新記事</span>
            </div>
            <Link href={`/article/${featured.slug}`}>
              <article className="card" style={{ padding: '2rem', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className={`tag ${CATEGORY_CONFIG[featured.category]?.class || ''}`}>
                    {CATEGORY_CONFIG[featured.category]?.label || featured.category}
                  </span>
                  <time style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(featured.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  lineHeight: 1.35,
                }}>
                  {featured.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {featured.description}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {featured.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Ad */}
        <div className="ad-slot">広告スペース</div>

        {/* Article Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="divider" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>記事一覧</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {rest.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
                <article className="card" style={{ padding: '1.5rem', display: 'block', height: '100%', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className={`tag ${CATEGORY_CONFIG[article.category]?.class || ''}`}>
                      {CATEGORY_CONFIG[article.category]?.label || article.category}
                    </span>
                    <time style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {article.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}>
                    {article.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>記事を準備中...</p>
          </div>
        )}
      </div>
    </div>
  )
}
