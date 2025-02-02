import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const limit = 15
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('midora')

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { uploadTime: { $regex: search, $options: 'i' } }
          ]
        }
      : {}

    const [posts, total] = await Promise.all([
      db.collection('forum_posts')
        .find(query)
        .sort({ uploadTime: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('forum_posts').countDocuments(query)
    ])

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    console.error('Forum posts fetch error:', error)
    return NextResponse.json(
      { error: 'Forum gönderileri yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}
