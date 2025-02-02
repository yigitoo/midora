import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import type { Comment, ForumEntry } from '@/types/forum'

import 'dotenv/config';

export async function GET(
  request: Request,
  { params }: { params: { entry_id: string } }
) {
  try {
    if (!ObjectId.isValid(params.entry_id)) {
      return NextResponse.json(
        { error: 'Invalid entry ID format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('midora')

    const entry = await db.collection<ForumEntry>('forum_posts').findOne(
      { _id: params.entry_id }
    )

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Convert ObjectId to string for JSON serialization
    const serializedEntry = {
      ...entry,
      _id: entry._id.toString(),
      comments: entry.comments?.map(comment => ({
        ...comment,
        _id: comment._id.toString(),
        replies: comment.replies?.map(reply => ({
          ...reply,
          _id: reply._id.toString()
        }))
      })) || []
    }

    return NextResponse.json(serializedEntry)

  } catch (error) {
    console.error('Get entry error:', error)
    if (error instanceof Error && error.name === 'BSONTypeError') {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { entry_id: string } }
) {
  try {
    const { content, parentId, depth = 0 } = await request.json()
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token || depth > 3) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string, username: string
    }

    const client = await clientPromise
    const db = client.db('midora')

    const newComment: Comment = {
      _id: new ObjectId().toString(),
      content: content.trim(),
      author: decoded.username,
      uploadTime: new Date().toISOString(),
      likes: 0,
      replies: [],
      parentId,
      depth
    }

    let result

    if (parentId) {
      // Add reply to existing comment
      result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
        {
          _id: params.entry_id,
          'comments._id': parentId
        },
        {
          $push: {
            'comments.$.replies': newComment
          }
        },
        { returnDocument: 'after' }
      )
    } else {
      // Add new top-level comment
      result = await db.collection<ForumEntry>('forum_posts').findOneAndUpdate(
        { _id: params.entry_id },
        { $push: { comments: newComment } },
        { returnDocument: 'after' }
      )
    }

    if (!result) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json(newComment)

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
