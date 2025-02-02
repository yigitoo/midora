import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/database'
import { getToken } from '@/lib/auth'
import type { ForumEntry } from '@/types/forum'

export async function POST(
  request: NextRequest,
  { params }: { params: { entry_id: string } }
) {
  try {
    // Get authorization token from headers
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { content, parentId, depth } = await request.json()
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    const client = await clientPromise
    const db = client.db('midora')

    const comment = {
      _id: new ObjectId().toString(),
      content: content,
      author: decodedToken.username,
      uploadTime: new Date().toISOString(),
      likes: 0,
      replies: [],
      depth: depth || 0,
      likedBy: []
    }

    const result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
      { _id: params.entry_id },
      parentId
        ? {
            $push: {
              'comments.$[comment].replies': comment
            }
          }
        : {
            $push: { comments: comment }
          },
      parentId
        ? {
            arrayFilters: [{ 'comment._id': parentId }],
            returnDocument: 'after'
          }
        : { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Gönderi bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(comment)

  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
