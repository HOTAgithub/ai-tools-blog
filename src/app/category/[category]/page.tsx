import { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles, getArticlesByCategory } from '@/lib/articles'
import { notFound } from 'next/navigation'

const CATEGORY_CONFIG: Record<string, { label: string; class: string; description: string }> = {
  review: { label: 'レビュー', class: 'cat-review', description: '最新のAIツールを実際に使ってレビュー' },
  news: { label: 'ニュース', class: 'cat-news', description: 'AI業界の最新ニュース・リリース情報' },
  compare: { label: '比較', class: 'cat-compare', description: '人気AIツールの徹底比較' },
  tutorial: { label: 'チュートリアル', class: 'cat-tutorial', description: 'AIツールの使い方・活用術' },
}

export async function generateStaticParams() {
  return ['review', 'news', 'compare', 'tutorial'].map(cat => ({ category: cat }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const config = CATEGORY_CONFIG[category]
  return {
    title: `${config?.label || category}記事一覧 | AIツール通信`,
    description: config?.description || `AIツールの${category}記事一覧`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  if (!CATEGORY_CONFIG[category]) notFound()

  const articles = getArticlesByCategory(category)
  const config = CATEGORY_CONFIG[category]

  return (
    <div>
      {/* Category Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '2rem 0',
      }}>
        <div className="container-wide" style={{ padding: '0 1.25rem' }}>
          <nav style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>ホーム</Link>
            <span style={{ margin: '0 0.4rem', opacity: 0.4 }}>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{config.label}</span>
          </nav>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            {config.label}記事一覧
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {config.description}
          </p>
        </div>
      </div>

      <div className="container-wide" style={{ padding: '2rem 1.25rem' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>記事がまだありません</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>毎日更新されているので、また来てください</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {articles.map(article => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <article className="card" style={{ padding: '1.5rem', display: 'block', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className={`tag ${config.class}`}>{config.label}</span>
                    <time style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                  <h2 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                  }}>
                    {article.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {article.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
