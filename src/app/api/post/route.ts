import { NextRequest, NextResponse } from 'next/server'
import { saveArticle } from '@/lib/articles'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'title, content, category are required' },
        { status: 400 }
      )
    }

    const validCategories = ['review', 'news', 'compare', 'tutorial']
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // API key check (simple auth)
    const apiKey = request.headers.get('x-api-key')
    const validKey = process.env.POST_API_KEY
    if (validKey && apiKey !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const article = saveArticle({
      title: body.title,
      slug: body.slug,
      description: body.description || body.title,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      publishedAt: body.publishedAt,
      updatedAt: body.updatedAt,
    })

    return NextResponse.json({ success: true, article }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
