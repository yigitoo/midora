import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/database'
import jwt from 'jsonwebtoken'
import type { ForumEntry } from '@/types/forum'

import 'dotenv/config';

export async function POST(
  request: Request,
  { params }: { params: { entry_id: string } }
) {
  try {
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

    // Decode token manually since getToken is causing issues
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      username: string
    }

    if (!decoded.userId) {
      return NextResponse.json(
        { error: 'Geçersiz token içeriği' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db('midora')

    const result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
      {
        _id: params.entry_id,
        likedBy: { $ne: decoded.username }
      },
      {
        $inc: { likes: 1 },
        $push: { likedBy: decoded.username }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Gönderi bulunamadı veya zaten beğenilmiş' },
        { status: 400 }
      )
    }

    return NextResponse.json({ likes: result.likes })

  } catch (error) {
    console.error('Like error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Token doğrulanamadı' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
