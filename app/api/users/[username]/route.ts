import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('midora')

    // Get user profile
    const user = await db.collection('users').findOne(
      { username: params.username },
      { projection: { password: 0 } }  // Exclude password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Get user's forum posts
    const posts = await db.collection('forum_posts')
      .find({ author: params.username })
      .sort({ uploadTime: -1 })
      .limit(10)
      .toArray()

    // Format response
    const response = {
      name: user.name,
      email: user.email,
      username: user.username,
      joinDate: user.joinDate,
      bio: user.bio || '',
      avatar: user.avatar,
      postCount: user.postCount,
      posts: posts.map(post => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        uploadTime: post.uploadTime,
        likes: post.likes || 0,
        comments: post.comments?.length || 0
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı bilgileri alınamadı' },
      { status: 500 }
    )
  }
}
