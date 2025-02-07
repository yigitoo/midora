import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('midora')

    // Build search query
    const query: any = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const totalEntries = await db.collection('forum_posts').countDocuments(query)
    const totalPages = Math.ceil(totalEntries / limit)

    // Get posts with pagination
    const posts = await db.collection('forum_posts')
      .find(query)
      .sort({ uploadTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      posts,
      currentPage: page,
      totalPages,
      totalEntries
    })

  } catch (error) {
    console.error('Forum fetch error:', error)
    return NextResponse.json(
      { error: 'İçerik yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
