import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import type { ForumEntry } from '@/types/forum'

interface Comment {
  _id: string
  content: string
  author: string
  uploadTime: string
  likes: number
  replies: Comment[]
  parentId?: string
  depth: number
}

export async function POST(
  request: Request,
  { params }: { params: { entry_id: string } }
) {
  try {
    const { content, parentCommentId } = await request.json()
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token || !content?.trim() || !ObjectId.isValid(params.entry_id)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      username: string
    }

    const client = await clientPromise
    const db = client.db('midora')

    const commentId = new ObjectId()
    const newComment: Comment = {
      _id: commentId.toString(),
      content: content.trim(),
      author: decoded.username,
      uploadTime: new Date().toISOString(),
      likes: 0,
      replies: [],
      depth: parentCommentId ? 1 : 0
    }

    if (parentCommentId) {
      newComment.parentId = parentCommentId
    }

    const result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
      parentCommentId
        ? {
            _id: new ObjectId(params.entry_id).toString(),
            'comments._id': parentCommentId,
            'comments.depth': { $lt: 3 } // Limit nesting depth
          }
        : { _id: new ObjectId(params.entry_id).toString() },
      parentCommentId
        ? {
            $push: {
              'comments.$.replies': newComment
            }
          }
        : {
            $push: {
              comments: newComment
            }
          },
      {
        returnDocument: 'after'
      }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Entry or parent comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(newComment)

  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { entry_id: string } }
) {
  try {
    const { commentId, parentId } = await request.json()
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token || !ObjectId.isValid(params.entry_id)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      username: string
    }

    const client = await clientPromise
    const db = client.db('midora')

    const result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
      parentId
        ? {
            _id: new ObjectId(params.entry_id).toString(),
            'comments._id': parentId,
            'comments.replies._id': commentId,
            'comments.replies.author': decoded.username
          }
        : {
            _id: new ObjectId(params.entry_id).toString(),
            'comments._id': commentId,
            'comments.author': decoded.username
          },
      parentId
        ? {
            $pull: {
              'comments.$.replies': {
                _id: commentId
              }
            }
          }
        : {
            $pull: {
              comments: {
                _id: new ObjectId(commentId).toString()
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
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
