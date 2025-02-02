import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { ForumEntry } from '@/types/forum';

export async function DELETE(
  request: Request,
  { params }: { params: { entry_id: string; comment_id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      username: string
    }

    const client = await clientPromise
    const db = client.db('midora')

    const result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
      {
        _id: params.entry_id,
        'comments._id': new ObjectId(params.comment_id),
        'comments.author': decoded.username
      },
      {
        $pull: {
          comments: {
            _id: params.comment_id
          }
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Comment not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Comment deleted' })

  } catch (error) {
    console.error('Delete comment error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
