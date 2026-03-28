export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: 'review' | 'news' | 'compare' | 'tutorial';
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  thumbnail?: string;
}

import fs from 'fs'
import path from 'path'

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json')

function ensureDataDir() {
  const dir = path.dirname(ARTICLES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, '[]', 'utf-8');
  }
}

export function getAllArticles(): Article[] {
  ensureDataDir();
  const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
  const articles: Article[] = JSON.parse(data);
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find(a => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category);
}

export function saveArticle(article: Omit<Article, 'id'> & { id?: string }): Article {
  ensureDataDir();
  const articles = getAllArticles();
  const existing = article.id ? articles.findIndex(a => a.id === article.id) : -1;
  
  const newArticle: Article = {
    id: article.id || `art_${Date.now()}`,
    title: article.title,
    slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-').replace(/^-|-$/g, ''),
    description: article.description,
    content: article.content,
    category: article.category,
    tags: article.tags,
    publishedAt: article.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnail: article.thumbnail,
  };

  if (existing >= 0) {
    articles[existing] = newArticle;
  } else {
    articles.unshift(newArticle);
  }

  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
  return newArticle;
}

export function getSlugs(): string[] {
  return getAllArticles().map(a => a.slug);
}
