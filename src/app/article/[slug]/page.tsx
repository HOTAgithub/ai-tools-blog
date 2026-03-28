import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'

export async function generateStaticParams() {
  return getAllArticles().map(article => ({ slug: article.slug }))
}

export const dynamicParams = true
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  }
}

const CATEGORY_CONFIG: Record<string, { label: string; class: string }> = {
  review: { label: 'レビュー', class: 'cat-review' },
  news: { label: 'ニュース', class: 'cat-news' },
  compare: { label: '比較', class: 'cat-compare' },
  tutorial: { label: 'チュートリアル', class: 'cat-tutorial' },
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const allArticles = getAllArticles()
  const currentIndex = allArticles.findIndex(a => a.slug === slug)
  const prevArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null
  const nextArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '0.75rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>ホーム</Link>
          <span style={{ margin: '0 0.4rem', opacity: 0.4 }}>›</span>
          <Link href={`/category/${article.category}`} style={{ color: 'var(--text-muted)' }}>
            {CATEGORY_CONFIG[article.category]?.label || article.category}
          </Link>
          <span style={{ margin: '0 0.4rem', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>{article.title.slice(0, 25)}...</span>
        </div>
      </div>

      <article>
        {/* Article Header */}
        <header style={{
          background: 'white',
          padding: '2.5rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="container" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span className={`tag ${CATEGORY_CONFIG[article.category]?.class || ''}`} style={{ fontSize: '0.8rem' }}>
                {CATEGORY_CONFIG[article.category]?.label || article.category}
              </span>
              <time style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {new Date(article.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}>
              {article.title}
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              marginBottom: '1.25rem',
            }}>
              {article.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {article.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="container" style={{ maxWidth: '720px' }}>
          {/* Ad */}
          <div className="ad-slot" style={{ marginTop: '1.5rem' }}>広告スペース</div>

          {/* Content */}
          <div
            className="prose"
            style={{
              background: 'white',
              borderRadius: 'var(--radius)',
              padding: '2.5rem 2rem',
              border: '1px solid var(--border)',
              margin: '1.5rem 0',
            }}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
          />

          {/* Ad */}
          <div className="ad-slot">広告スペース</div>

          {/* Share */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              この記事をシェア
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-tools-tsuushin.com'}/article/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.8rem' }}
            >
              𝕏 でシェア
            </a>
          </div>

          {/* Nav */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1.5rem',
            marginBottom: '2rem',
          }}>
            {prevArticle && (
              <Link href={`/article/${prevArticle.slug}`}>
                <div className="card" style={{ padding: '1rem', display: 'block' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>← 前の記事</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {prevArticle.title}
                  </p>
                </div>
              </Link>
            )}
            {nextArticle && (
              <Link href={`/article/${nextArticle.slug}`}>
                <div className="card" style={{ padding: '1rem', display: 'block', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>次の記事 →</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {nextArticle.title}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

function markdownToHtml(md: string): string {
  let html = md
    // Code blocks (must be first to prevent inner processing)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Inline styles
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // Unordered list: wrap consecutive <li> in <ul>
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Table support: simple | table | syntax
    .replace(/^\|(.+)\|$/gm, (match, content: string) => {
      const cells = content.split('|').map((c: string) => c.trim())
      if (cells.every((c: string) => /^[-:]+$/.test(c))) return '' // skip separator row
      const tag = 'td'
      const row = cells.map((c: string) => `<${tag}>${c}</${tag}>`).join('')
      return `<tr>${row}</tr>`
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
    // Paragraphs: wrap non-tag lines in <p> (skip empty, tag-starting lines)
    .replace(/^(?!<|$|\s*$)(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '')
  return html
}
