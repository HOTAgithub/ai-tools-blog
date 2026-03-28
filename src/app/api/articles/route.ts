import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

export async function GET(request: NextRequest) {
  const articles = getAllArticles()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  let filtered = category ? articles.filter(a => a.category === category) : articles
  filtered = filtered.slice(0, limit)
  
  return NextResponse.json({ articles: filtered, total: articles.length })
}
